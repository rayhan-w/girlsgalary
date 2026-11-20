import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        subCategory: true,
        brand: true,
        variants: {
          orderBy: { createdAt: 'asc' }
        },
        reviews: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Increment view count asynchronously
    prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } }
    }).catch(() => {});

    // Related products in same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isPublished: true
      },
      take: 4,
      select: {
        id: true,
        name: true,
        nameBn: true,
        slug: true,
        coverImage: true,
        regularPrice: true,
        offerPrice: true,
        discountPercent: true,
        totalStock: true
      }
    });

    return NextResponse.json({
      product,
      relatedProducts
    });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
