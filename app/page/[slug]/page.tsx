import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { StorefrontLayout } from '@/components/StorefrontLayout';

export const dynamic = 'force-dynamic';

export default async function ContentPageDynamic({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const page = await prisma.contentPage.findUnique({
    where: { slug }
  });

  if (!page) {
    notFound();
  }

  return (
    <StorefrontLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white p-6 sm:p-12 rounded-3xl border border-zinc-200 shadow-sm">
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-900 border-b pb-4 mb-6">
            {page.title}
          </h1>
          <div className="prose max-w-none text-zinc-700 text-sm leading-relaxed whitespace-pre-line space-y-4">
            {page.content}
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
