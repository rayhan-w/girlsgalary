import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getZoneForDistrict } from '@/lib/districts';
import { sendFacebookServerEvent } from '@/lib/facebook-capi';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      phone,
      address,
      district,
      deliveryZone,
      paymentMethod,
      senderPhone,
      transactionId,
      orderNote,
      couponCode,
      items
    } = body;

    // Validate 3 primary fields
    if (!fullName || !fullName.trim()) {
      return NextResponse.json({ error: 'আপনার সম্পূর্ণ নাম লিখুন (Full name is required)' }, { status: 400 });
    }
    if (!phone || !phone.trim() || phone.trim().length < 11) {
      return NextResponse.json({ error: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (Valid 11-digit mobile number required)' }, { status: 400 });
    }
    if (!address || !address.trim()) {
      return NextResponse.json({ error: 'আপনার সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন (Full address is required)' }, { status: 400 });
    }
    if (!items || !items.length) {
      return NextResponse.json({ error: 'আপনার ব্যাগ বা কার্ট খালি (Cart is empty)' }, { status: 400 });
    }

    // Check settings for delivery charges
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
    const zone = deliveryZone || (district ? getZoneForDistrict(district) : 'outside_dhaka');

    let deliveryCharge = settings?.deliveryChargeOutsideDhaka ?? 130;
    if (zone === 'inside_dhaka') deliveryCharge = settings?.deliveryChargeInsideDhaka ?? 70;
    else if (zone === 'near_dhaka') deliveryCharge = settings?.deliveryChargeNearDhaka ?? 100;

    // Calculate subtotal from database prices to prevent client-side tampering
    let subtotal = 0;
    const validatedItems: any[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true }
      });

      if (!product || !product.isPublished) {
        return NextResponse.json({ error: `Product not available: ${item.name}` }, { status: 400 });
      }

      let price = product.offerPrice;
      let variantStock = product.totalStock;

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant) {
          return NextResponse.json({ error: `Selected size/color not found for ${product.name}` }, { status: 400 });
        }
        if (variant.stock < item.quantity) {
          return NextResponse.json({
            error: `দুঃখিত, ${product.name} (${variant.size} - ${variant.colorName}) মাত্র ${variant.stock} টি স্টকে আছে।`
          }, { status: 400 });
        }
        variantStock = variant.stock;
        price += variant.priceDiff;
      } else if (product.totalStock < item.quantity) {
        return NextResponse.json({
          error: `দুঃখিত, ${product.name} মাত্র ${product.totalStock} টি স্টকে আছে।`
        }, { status: 400 });
      }

      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        variantId: item.variantId || null,
        productName: product.name,
        productImage: item.image || product.coverImage,
        size: item.size || null,
        color: item.color || null,
        price,
        quantity: item.quantity,
        total: itemTotal
      });
    }

    // Free delivery threshold check
    const freeDeliveryThreshold = settings?.freeDeliveryThreshold ?? 2000;
    if (subtotal >= freeDeliveryThreshold) {
      deliveryCharge = 0;
    }

    // Validate coupon if provided
    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() }
      });

      if (coupon && coupon.isActive && (!coupon.expiresAt || new Date(coupon.expiresAt) >= new Date())) {
        if (subtotal >= coupon.minOrderAmount) {
          if (coupon.discountType === 'PERCENTAGE') {
            discount = Math.round((subtotal * coupon.discountValue) / 100);
          } else {
            discount = Math.min(coupon.discountValue, subtotal);
          }

          // Increment coupon usage
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } }
          }).catch(() => {});
        }
      }
    }

    const grandTotal = Math.max(0, subtotal + deliveryCharge - discount);

    // Generate readable order number: GG-XXXX
    const orderCount = await prisma.order.count();
    const orderNumber = `GG-${1001 + orderCount}`;

    // Execute order creation and stock decrement in transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName: fullName.trim(),
          customerPhone: phone.trim(),
          customerAddress: address.trim(),
          district: district || 'Dhaka',
          deliveryZone: zone,
          deliveryCharge,
          subtotal,
          discount,
          grandTotal,
          orderNote: orderNote?.trim() || null,
          paymentMethod: paymentMethod || 'COD',
          paymentStatus: paymentMethod === 'COD' ? 'PENDING' : (transactionId ? 'PENDING' : 'PENDING'),
          senderPhone: senderPhone?.trim() || null,
          transactionId: transactionId?.trim() || null,
          status: 'PENDING',
          items: {
            create: validatedItems
          },
          statusHistory: {
            create: {
              status: 'PENDING',
              note: 'Order placed by customer from storefront'
            }
          }
        },
        include: {
          items: true
        }
      });

      // 2. Decrement stock for variants and products
      for (const item of validatedItems) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } }
          });
        }
        await tx.product.update({
          where: { id: item.productId },
          data: { totalStock: { decrement: item.quantity } }
        });

        // Audit in StockHistory
        await tx.stockHistory.create({
          data: {
            productId: item.productId,
            variantId: item.variantId,
            type: 'ORDER_DEDUCT',
            quantity: -item.quantity,
            note: `Order ${orderNumber}`
          }
        });
      }

      return newOrder;
    });

    console.log(`[SMS Gateway Simulated] Sent to ${phone}: Dear ${fullName}, your Girlsgalary order ${orderNumber} for ৳${grandTotal} has been placed successfully!`);

    // Trigger Facebook Conversions API (CAPI) for 100% accurate Purchase tracking
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || undefined;
    const userAgent = req.headers.get('user-agent') || undefined;
    const cookieHeader = req.headers.get('cookie') || '';
    const fbpMatch = cookieHeader.match(/_fbp=([^;]+)/);
    const fbcMatch = cookieHeader.match(/_fbc=([^;]+)/);

    sendFacebookServerEvent({
      eventName: 'Purchase',
      eventId: order.orderNumber,
      eventSourceUrl: 'https://girlsglory.com/checkout',
      userData: {
        phone,
        fullName,
        city: district,
        clientIpAddress: ip,
        clientUserAgent: userAgent,
        fbp: fbpMatch ? fbpMatch[1] : undefined,
        fbc: fbcMatch ? fbcMatch[1] : undefined,
      },
      customData: {
        currency: 'BDT',
        value: order.grandTotal,
        orderId: order.orderNumber,
        contentType: 'product',
        contents: validatedItems.map((item) => ({
          id: item.productId,
          quantity: item.quantity,
          item_price: item.price,
        })),
      },
    }).catch((err) => console.error('[Facebook CAPI Background Error]', err));

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      grandTotal: order.grandTotal
    });
  } catch (error: any) {
    console.error('Error placing order:', error);
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const district = searchParams.get('district');
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.max(1, Number(searchParams.get('limit')) || 20);

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (district && district !== 'ALL') {
      where.district = district;
    }

    if (search) {
      const q = search.trim();
      where.OR = [
        { orderNumber: { contains: q } },
        { customerName: { contains: q } },
        { customerPhone: { contains: q } }
      ];
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
          statusHistory: { orderBy: { createdAt: 'desc' } }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.order.count({ where })
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
