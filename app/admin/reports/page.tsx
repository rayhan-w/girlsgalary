'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Download, TrendingUp, DollarSign } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { formatPrice } from '@/lib/utils';

export default function AdminReportsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  const handleExportCSV = () => {
    if (!stats) return;
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      encodeURIComponent(
        `Metric,Count,Sales (BDT)\n` +
          `Today,${stats.today?.count || 0},${stats.today?.sales || 0}\n` +
          `This Week,${stats.week?.count || 0},${stats.week?.sales || 0}\n` +
          `This Month,${stats.month?.count || 0},${stats.month?.sales || 0}\n` +
          `All Time,${stats.allTime?.count || 0},${stats.allTime?.sales || 0}\n`
      );
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `girlsgalary-sales-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
              বিক্রয় ও আর্থিক রিপোর্ট (Sales & Financial Reports)
            </h1>
            <p className="text-xs text-zinc-500">
              দৈনিক, সাপ্তাহিক ও মাসিক রাজস্ব বিশ্লেষণ এবং সিএসভি এক্সপোর্ট
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-black hover:bg-zinc-800 text-[#D4AF37] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow"
          >
            <Download size={14} />
            <span>CSV রিপোর্ট ডাউনলোড</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
            <span className="text-[11px] font-bold text-zinc-500 block">আজকের মোট বিক্রয়</span>
            <span className="text-2xl font-black text-zinc-900 mt-1 block">
              {formatPrice(stats?.today?.sales || 0)}
            </span>
            <span className="text-xs text-emerald-700 font-semibold mt-1 block">
              {stats?.today?.count || 0} টি সম্পন্ন অর্ডার
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
            <span className="text-[11px] font-bold text-zinc-500 block">এই মাসের মোট বিক্রয়</span>
            <span className="text-2xl font-black text-zinc-900 mt-1 block">
              {formatPrice(stats?.month?.sales || 0)}
            </span>
            <span className="text-xs text-zinc-600 font-semibold mt-1 block">
              {stats?.month?.count || 0} টি মোট অর্ডার
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
            <span className="text-[11px] font-bold text-zinc-500 block">সর্বমোট রাজস্ব</span>
            <span className="text-2xl font-black text-[#b89528] mt-1 block">
              {formatPrice(stats?.allTime?.sales || 0)}
            </span>
            <span className="text-xs text-zinc-600 font-semibold mt-1 block">
              {stats?.allTime?.count || 0} টি সর্বমোট অর্ডার
            </span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
