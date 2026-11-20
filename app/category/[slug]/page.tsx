import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { StorefrontLayout } from '@/components/StorefrontLayout';
import { CatalogClient } from '@/components/CatalogClient';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug }
  });

  if (!category) {
    notFound();
  }

  return (
    <StorefrontLayout>
      <CatalogClient
        initialCategorySlug={category.slug}
        categoryName={category.name}
        categoryNameBn={category.nameBn || undefined}
        categoryBanner={category.banner || undefined}
      />
    </StorefrontLayout>
  );
}
