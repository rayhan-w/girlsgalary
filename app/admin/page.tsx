'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  AlertTriangle,
  ArrowRight,
  Package,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
              এডমিন ওভারভিউ ড্যাশবোর্ড (Dashboard)
            </h1>
            <p className="text-xs text-zinc-500">
              আজকের বিক্রয়, চলমান অর্ডার ও রিয়েল-টাইম ইনভেন্টরি ট্র্যাকিং
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/orders"
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#b89528] text-black font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
            >
              <ShoppingBag size={14} />
              <span>সকল অর্ডার দেখুন</span>
            </Link>
          </div>
        </div>

        {/* Action Alerts (Pending orders & Low stock warnings) */}
        {stats && (stats.pendingCount > 0 || stats.lowStockCount > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.pendingCount > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500 text-white rounded-xl">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">
                      {stats.pendingCount} টি নতুন অর্ডার অপেক্ষমাণ!
                    </h4>
                    <p className="text-[11px] text-amber-700">দ্রুত নিশ্চিতকরণ ও প্রসেসিং প্রয়োজন</p>
                  </div>
                </div>
                <Link
                  href="/admin/orders?status=PENDING"
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-xs"
                >
                  প্রসেস করুন &rarr;
                </Link>
              </div>
            )}

            {stats.lowStockCount > 0 && (
              <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rose-600 text-white rounded-xl">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-rose-900">
                      {stats.lowStockCount} টি পণ্যের স্টক ৫ বা তার কম!
                    </h4>
                    <p className="text-[11px] text-rose-700">স্টক আউট প্রতিরোধে রিস্টক করুন</p>
                  </div>
                </div>
                <Link
                  href="/admin/inventory"
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-xs"
                >
                  স্টক দেখুন &rarr;
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 4 Stat Cards: Today, This Week, This Month, All Time */}
        {/* Page 8 Rule: Today, this week and this month: order count, sales amount */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Today */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
              <Calendar size={13} className="text-[#b89528]" /> আজকের বিক্রয় (Today)
            </span>
            <div className="text-xl sm:text-2xl font-black text-zinc-900">
              {formatPrice(stats?.today?.sales || 0)}
            </div>
            <div className="text-xs font-semibold text-emerald-700">
              {stats?.today?.count || 0} টি সম্পন্ন অর্ডার
            </div>
          </div>

          {/* This Week */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
              <TrendingUp size={13} className="text-indigo-600" /> এই সপ্তাহ (This Week)
            </span>
            <div className="text-xl sm:text-2xl font-black text-zinc-900">
              {formatPrice(stats?.week?.sales || 0)}
            </div>
            <div className="text-xs font-semibold text-zinc-600">
              {stats?.week?.count || 0} টি মোট অর্ডার
            </div>
          </div>

          {/* This Month */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
              <Calendar size={13} className="text-[#b89528]" /> এই মাস (This Month)
            </span>
            <div className="text-xl sm:text-2xl font-black text-zinc-900">
              {formatPrice(stats?.month?.sales || 0)}
            </div>
            <div className="text-xs font-semibold text-zinc-600">
              {stats?.month?.count || 0} টি মোট অর্ডার
            </div>
          </div>

          {/* All Time Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
              <CheckCircle2 size={13} className="text-emerald-600" /> সর্বমোট বিক্রয় (Total)
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#b89528]">
              {formatPrice(stats?.allTime?.sales || 0)}
            </div>
            <div className="text-xs font-semibold text-zinc-600">
              {stats?.allTime?.count || 0} টি আজীবন অর্ডার
            </div>
          </div>

        </div>

        {/* 2 Column Layout: Recent Orders & Top Selling Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Recent Orders (7 cols) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                <ShoppingBag size={16} className="text-[#b89528]" />
                <span>সাম্প্রতিক অর্ডার (Recent Orders)</span>
              </h3>
              <Link href="/admin/orders" className="text-xs text-[#b89528] font-bold hover:underline">
                সব দেখুন &rarr;
              </Link>
            </div>

            {stats?.recentOrders?.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center italic">এখনো কোনো অর্ডার আসেনি</p>
            ) : (
              <div className="divide-y divide-zinc-100 text-xs">
                {stats?.recentOrders?.map((ord: any) => (
                  <div key={ord.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-zinc-900">{ord.orderNumber}</span>
                        <span className="text-zinc-500">• {ord.customerName}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {ord.district} • {formatDate(ord.createdAt)}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-zinc-900 block">{formatPrice(ord.grandTotal)}</span>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                        ord.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'CANCELLED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Selling Products (5 cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                <Package size={16} className="text-[#b89528]" />
                <span>সেরা বিক্রিত পণ্য (Top Products)</span>
              </h3>
              <Link href="/admin/products" className="text-xs text-[#b89528] font-bold hover:underline">
                পণ্য তালিকা &rarr;
              </Link>
            </div>

            <div className="divide-y divide-zinc-100 text-xs">
              {stats?.topProducts?.map((p: any) => (
                <div key={p.id} className="py-2.5 flex items-center gap-3">
                  <img
                    src={p.coverImage}
                    alt={p.name}
                    className="w-12 h-14 object-cover rounded-md border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-zinc-900 truncate">{p.name}</p>
                    <p className="text-xs font-bold text-[#b89528]">{formatPrice(p.offerPrice)}</p>
                    <span className="text-[10px] text-zinc-500">স্টক: {p.totalStock} টি</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
