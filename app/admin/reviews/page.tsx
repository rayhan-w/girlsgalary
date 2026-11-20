'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    // Sample review moderation items
    setReviews([
      {
        id: '1',
        customerName: 'নুসরাত জাহান',
        productName: 'Royal Heritage Dhakai Jamdani Saree',
        rating: 5,
        comment: 'শাড়ির কোয়ালিটি ছবির চেয়েও অনেক বেশি সুন্দর! ডেলিভারিও পেয়েছি মাত্র ২ দিনে। ধন্যবাদ গার্লসগ্যালারি!',
        status: 'APPROVED',
        createdAt: '2026-11-18'
      },
      {
        id: '2',
        customerName: 'Samia Afrin',
        productName: 'Luxury Embroidered Lawn Three Piece Suit',
        rating: 5,
        comment: 'Super fast delivery. Fabric is very soft and comfortable for daily wear.',
        status: 'APPROVED',
        createdAt: '2026-11-19'
      }
    ]);
  }, []);

  const handleUpdate = (id: string, newStatus: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
            রিভিউ ও রেটিং মডারেশন (Review Moderation)
          </h1>
          <p className="text-xs text-zinc-500">
            গ্রাহকদের রিভিউ ও রেটিং যাচাই করে অনুমোদন বা বাতিল করুন
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden text-xs divide-y divide-zinc-200">
          {reviews.map((r) => (
            <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-900">{r.customerName}</span>
                  <div className="flex text-amber-500">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="font-semibold text-zinc-700">{r.productName}</p>
                <p className="text-zinc-600 italic">&ldquo;{r.comment}&rdquo;</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdate(r.id, 'APPROVED')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdate(r.id, 'REJECTED')}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
