import React from 'react';
import { StorefrontLayout } from '@/components/StorefrontLayout';
import { CatalogClient } from '@/components/CatalogClient';

export default async function ShopPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { search, category } = await searchParams;

  return (
    <StorefrontLayout>
      <CatalogClient
        initialSearch={search}
        initialCategorySlug={category}
        categoryName="All Collections"
        categoryNameBn="সকল কালেকশন"
      />
    </StorefrontLayout>
  );
}
