import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { StorefrontLayout } from '@/components/StorefrontLayout';
import OrderSuccessClient from './OrderSuccessClient';

export const dynamic = 'force-dynamic';

export default async function OrderSuccessPage({
  params
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true
    }
  });

  if (!order) {
    notFound();
  }

  const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });

  const deliveryEstimate =
    order.deliveryZone === 'inside_dhaka'
      ? settings?.deliveryTimeInsideDhaka || '২৪-৪৮ ঘণ্টার মধ্যে (24-48 Hours)'
      : settings?.deliveryTimeOutsideDhaka || '২-৪ দিনের মধ্যে (2-4 Days)';

  return (
    <StorefrontLayout>
      <OrderSuccessClient
        order={JSON.parse(JSON.stringify(order))}
        deliveryEstimate={deliveryEstimate}
      />
    </StorefrontLayout>
  );
}
