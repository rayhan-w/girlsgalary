import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      allOrders,
      todayOrders,
      weekOrders,
      monthOrders,
      pendingOrders,
      lowStockProducts,
      topProducts,
      recentOrders
    ] = await Promise.all([
      prisma.order.findMany({ select: { grandTotal: true, status: true } }),
      prisma.order.findMany({
        where: { createdAt: { gte: todayStart } },
        select: { grandTotal: true, status: true }
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: weekStart } },
        select: { grandTotal: true, status: true }
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: monthStart } },
        select: { grandTotal: true, status: true }
      }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.product.findMany({
        where: { totalStock: { lte: 5 } },
        select: { id: true, name: true, sku: true, totalStock: true, coverImage: true }
      }),
      prisma.product.findMany({
        where: { isBestSelling: true },
        take: 5,
        select: { id: true, name: true, regularPrice: true, offerPrice: true, coverImage: true, totalStock: true }
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { items: true }
      })
    ]);

    const calcSales = (ordersList: any[]) =>
      ordersList
        .filter((o) => o.status !== 'CANCELLED')
        .reduce((sum, o) => sum + o.grandTotal, 0);

    return NextResponse.json({
      today: {
        count: todayOrders.length,
        sales: calcSales(todayOrders)
      },
      week: {
        count: weekOrders.length,
        sales: calcSales(weekOrders)
      },
      month: {
        count: monthOrders.length,
        sales: calcSales(monthOrders)
      },
      allTime: {
        count: allOrders.length,
        sales: calcSales(allOrders)
      },
      pendingCount: pendingOrders,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      topProducts,
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
