import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    const where: any = { orderNumber };
    if (phone) {
      where.customerPhone = phone.trim();
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    const body = await req.json();
    const { status, paymentStatus, note, staffName } = body;

    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      let isRestocked = existingOrder.isRestocked;

      // Restock rule: When order is cancelled, restock exactly once!
      if (status === 'CANCELLED' && !existingOrder.isRestocked) {
        for (const item of existingOrder.items) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } }
            }).catch(() => {});
          }
          await tx.product.update({
            where: { id: item.productId },
            data: { totalStock: { increment: item.quantity } }
          }).catch(() => {});

          await tx.stockHistory.create({
            data: {
              productId: item.productId,
              variantId: item.variantId,
              type: 'ORDER_RESTOCK',
              quantity: item.quantity,
              note: `Restocked on Cancel of order ${orderNumber}`,
              staffName: staffName || 'Admin'
            }
          });
        }
        isRestocked = true;
      }

      const orderUpdate = await tx.order.update({
        where: { orderNumber },
        data: {
          ...(status ? { status } : {}),
          ...(paymentStatus ? { paymentStatus } : {}),
          isRestocked
        },
        include: { items: true }
      });

      if (status || note) {
        await tx.orderStatusHistory.create({
          data: {
            orderId: existingOrder.id,
            status: status || existingOrder.status,
            note: note || `Status changed to ${status}`,
            staffName: staffName || 'Admin'
          }
        });
      }

      return orderUpdate;
    });

    if (status === 'SHIPPED') {
      console.log(`[SMS Gateway Simulated] Sent to ${existingOrder.customerPhone}: Dear ${existingOrder.customerName}, your Girlsgalary order ${orderNumber} has been shipped!`);
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
  }
}
