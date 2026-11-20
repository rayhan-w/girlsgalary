import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [products, variants, categories, subCategories, brands, orders, orderItems, coupons, settings, staff] =
      await Promise.all([
        prisma.product.findMany(),
        prisma.productVariant.findMany(),
        prisma.category.findMany(),
        prisma.subCategory.findMany(),
        prisma.brand.findMany(),
        prisma.order.findMany(),
        prisma.orderItem.findMany(),
        prisma.coupon.findMany(),
        prisma.siteSettings.findMany(),
        prisma.staffUser.findMany({ select: { id: true, name: true, username: true, role: true, createdAt: true } })
      ]);

    const backupData = {
      exportTimestamp: new Date().toISOString(),
      shop: 'Girlsgalary',
      counts: {
        products: products.length,
        variants: variants.length,
        categories: categories.length,
        orders: orders.length,
        coupons: coupons.length
      },
      data: {
        products,
        variants,
        categories,
        subCategories,
        brands,
        orders,
        orderItems,
        coupons,
        settings,
        staff
      }
    };

    const jsonString = JSON.stringify(backupData, null, 2);

    return new NextResponse(jsonString, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="girlsgalary-backup-${new Date().toISOString().slice(0, 10)}.json"`
      }
    });
  } catch (error) {
    console.error('Error generating backup:', error);
    return NextResponse.json({ error: 'Failed to generate backup' }, { status: 500 });
  }
}
