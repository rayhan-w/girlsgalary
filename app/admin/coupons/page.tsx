'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { formatPrice } from '@/lib/utils';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('1500');
  const [usageLimit, setUsageLimit] = useState('100');
  const [msg, setMsg] = useState('');

  const fetchCoupons = () => {
    setLoading(true);
    fetch('/api/admin/coupons')
      .then((res) => res.json())
      .then((data) => setCoupons(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountValue) return;

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          discountType,
          discountValue: Number(discountValue),
          minOrderAmount: Number(minOrderAmount) || 0,
          usageLimit: Number(usageLimit) || null
        })
      });

      if (res.ok) {
        setCode('');
        setDiscountValue('');
        setMsg('কুপন সফলভাবে তৈরি হয়েছে!');
        fetchCoupons();
      }
    } catch (e) {
      setMsg('সমস্যা হয়েছে।');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত এই কুপনটি ডিলিট করতে চান?')) return;
    try {
      await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
      fetchCoupons();
    } catch (e) {}
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
            কুপন ও ডিসকাউন্ট কোড (Coupons)
          </h1>
          <p className="text-xs text-zinc-500">
            নির্দিষ্ট মেয়াদ ও নূন্যতম অর্ডার পরিমাণের ডিসকাউন্ট কুপন তৈরি ও ব্যবহার মনিটর করুন
          </p>
        </div>

        {msg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold">
            {msg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Create Form */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-3 text-xs">
            <h2 className="font-bold text-sm text-zinc-900 border-b pb-2 flex items-center gap-1.5">
              <Plus size={16} className="text-[#b89528]" />
              <span>নতুন কুপন কোড তৈরি</span>
            </h2>

            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="block font-bold text-zinc-800 mb-1">কুপন কোড (Code) *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. GIRLS10"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg uppercase font-mono font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-zinc-800 mb-1">ডিসকাউন্ট ধরন</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full p-2 bg-zinc-50 border rounded-lg outline-none"
                  >
                    <option value="PERCENTAGE">শতাংশ (%)</option>
                    <option value="FIXED">নির্দিষ্ট টাকা (৳)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 mb-1">পরিমাণ *</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="e.g. 10 or 200"
                    className="w-full p-2 bg-zinc-50 border rounded-lg font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">নূন্যতম অর্ডার (Min Spend ৳)</label>
                <input
                  type="number"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                  className="w-full p-2 bg-zinc-50 border rounded-lg font-mono outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">ব্যবহারের সর্বোচ্চ সীমা (Limit)</label>
                <input
                  type="number"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  className="w-full p-2 bg-zinc-50 border rounded-lg font-mono outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#b89528] text-black font-extrabold rounded-xl shadow mt-2"
              >
                কুপন তৈরি করুন
              </button>
            </form>
          </div>

          {/* List */}
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-3 text-xs">
            <h2 className="font-bold text-sm text-zinc-900 border-b pb-2">সক্রিয় কুপন কোড</h2>
            <div className="divide-y divide-zinc-100">
              {coupons.map((c) => (
                <div key={c.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-sm text-zinc-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                      {c.code}
                    </span>
                    <p className="text-zinc-600 mt-1 font-medium">
                      ছাড়: {c.discountValue}{c.discountType === 'PERCENTAGE' ? '%' : '৳'} • নূন্যতম {formatPrice(c.minOrderAmount)} অর্ডারে
                    </p>
                    <span className="text-[10px] text-zinc-400">
                      মোট ব্যবহৃত: {c.usedCount} বার {c.usageLimit ? `/ ${c.usageLimit} সীমা` : ''}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 rounded border"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
