import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isHidden: false },
      include: {
        subCategories: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { products: true }
        }
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, nameBn, slug, photo, banner, order, sizeChartData, subCategories } = body;

    const category = await prisma.category.create({
      data: {
        name,
        nameBn,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        photo,
        banner,
        order: Number(order) || 0,
        sizeChartData: typeof sizeChartData === 'string' ? sizeChartData : JSON.stringify(sizeChartData || []),
        subCategories: subCategories?.length
          ? {
              create: subCategories.map((sub: string, idx: number) => ({
                name: sub,
                slug: `${slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${sub.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                order: idx + 1
              }))
            }
          : undefined
      }
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
