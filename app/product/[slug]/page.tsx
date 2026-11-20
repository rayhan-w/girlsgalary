import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { StorefrontLayout } from '@/components/StorefrontLayout';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
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
    notFound();
  }

  // Related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isPublished: true
    },
    take: 4,
    include: {
      category: { select: { name: true, nameBn: true } },
      reviews: { where: { status: 'APPROVED' }, select: { rating: true } }
    }
  });

  const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });

  return (
    <StorefrontLayout>
      <ProductDetailClient
        product={JSON.parse(JSON.stringify(product))}
        relatedProducts={JSON.parse(JSON.stringify(relatedProducts))}
        settings={JSON.parse(JSON.stringify(settings))}
      />
    </StorefrontLayout>
  );
}
