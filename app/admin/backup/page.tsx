'use client';

import React from 'react';
import { Database, Download, ShieldCheck } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';

export default function AdminBackupPage() {
  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
            ডাটাবেস ব্যাকআপ ও নিরাপত্তা (Database Backup)
          </h1>
          <p className="text-xs text-zinc-500">
            এক ক্লিকে সকল পণ্য, ক্যাটাগরি, গ্রাহক ও অর্ডার তথ্যের সম্পূর্ণ ব্যাকআপ ডাউনলোড করুন
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-5 text-xs">
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-start gap-3">
            <ShieldCheck size={20} className="text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-900 text-sm">স্বয়ংক্রিয় ব্যাকআপ সুরক্ষা</h4>
              <p className="text-emerald-700 mt-0.5">
                সকল তথ্য রিয়েল রিলেশনাল ডাটাবেসে সংরক্ষিত। কোনো অর্ডার বা পণ্যের তথ্য কখনো হারিয়ে যাবে না।
              </p>
            </div>
          </div>

          <a
            href="/api/admin/backup"
            download
            className="w-full py-4 bg-[#D4AF37] hover:bg-[#b89528] text-black font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm"
          >
            <Download size={18} />
            <span>১-ক্লিকে সম্পূর্ণ ডাটাবেস ব্যাকআপ ডাউনলোড করুন</span>
          </a>
        </div>
      </div>
    </AdminLayout>
  );
}
