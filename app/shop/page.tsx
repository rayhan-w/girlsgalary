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
        categoryName="সকল পণ্য সম্ভার"
        categoryNameBn="সকল কালেকশন (All Collection)"
      />
    </StorefrontLayout>
  );
}
