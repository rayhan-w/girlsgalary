import React from 'react';
import { prisma } from '@/lib/prisma';
import { StorefrontLayout } from '@/components/StorefrontLayout';
import { HeroSlider } from '@/components/HeroSlider';
import { HomeSectionsClient } from '@/components/HomeSectionsClient';
import { TrustStrip } from '@/components/TrustStrip';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [categories, newArrivals, bestSellers, offerProducts, settings] = await Promise.all([
    prisma.category.findMany({
      where: { isHidden: false },
      orderBy: { order: 'asc' },
      take: 8
    }),
    prisma.product.findMany({
      where: { isPublished: true, isNewArrival: true },
      include: {
        category: { select: { name: true, nameBn: true } },
        reviews: { where: { status: 'APPROVED' }, select: { rating: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 8
    }),
    prisma.product.findMany({
      where: { isPublished: true, isBestSelling: true },
      include: {
        category: { select: { name: true, nameBn: true } },
        reviews: { where: { status: 'APPROVED' }, select: { rating: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 8
    }),
    prisma.product.findMany({
      where: { isPublished: true, discountPercent: { gt: 0 } },
      include: {
        category: { select: { name: true, nameBn: true } },
        reviews: { where: { status: 'APPROVED' }, select: { rating: true } }
      },
      orderBy: { discountPercent: 'desc' },
      take: 8
    }),
    prisma.siteSettings.findUnique({ where: { id: 'default' } })
  ]);

  return (
    <StorefrontLayout>
      {/* 1. Hero Banner Slider */}
      <HeroSlider />

      {/* 2. Client-aware Home Content Sections (Supports 100% Bangla / 100% English) */}
      <HomeSectionsClient
        categories={JSON.parse(JSON.stringify(categories))}
        newArrivals={JSON.parse(JSON.stringify(newArrivals))}
        bestSellers={JSON.parse(JSON.stringify(bestSellers))}
        offerProducts={JSON.parse(JSON.stringify(offerProducts))}
      />

      {/* 3. Trust Strip */}
      <TrustStrip
        codText={settings?.trustStripCod}
        deliveryText={settings?.trustStripDelivery}
        exchangeText={settings?.trustStripExchange}
      />
    </StorefrontLayout>
  );
}
