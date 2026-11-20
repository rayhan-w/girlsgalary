'use client';

import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw, Check } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { formatPrice } from '@/lib/utils';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustType, setAdjustType] = useState<'STOCK_IN' | 'STOCK_OUT'>('STOCK_IN');
  const [adjustNote, setAdjustNote] = useState('');
  const [msg, setMsg] = useState('');

  const fetchInventory = () => {
    setLoading(true);
    fetch('/api/products?limit=50')
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !adjustQty) return;

    // Simulate stock adjustment update
    const delta = adjustType === 'STOCK_IN' ? Number(adjustQty) : -Number(adjustQty);

    setMsg(`পণ্য "${selectedProduct.name}" এর স্টক ${adjustType === 'STOCK_IN' ? '+' : '-'}${adjustQty} আপডেট হয়েছে!`);
    setSelectedProduct(null);
    setAdjustQty('');
    setAdjustNote('');
    fetchInventory();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
            ইনভেন্টরি ও স্টক নিয়ন্ত্রণ (Inventory & Stock Control)
          </h1>
          <p className="text-xs text-zinc-500">
            রিয়েল-টাইম স্টক লেভেল, লো-স্টক সতর্কতা ও স্টক-ইন/আউট ট্র্যাকিং
          </p>
        </div>

        {msg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold">
            {msg}
          </div>
        )}

        {/* Stock List Table */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 text-zinc-600 border-b">
                <tr>
                  <th className="p-3 font-bold">পণ্য</th>
                  <th className="p-3 font-bold">ক্যাটাগরি</th>
                  <th className="p-3 font-bold">বর্তমান স্টক</th>
                  <th className="p-3 font-bold">স্টক স্ট্যাটাস</th>
                  <th className="p-3 font-bold text-right">স্টক অ্যাডজাস্ট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50">
                    <td className="p-3 flex items-center gap-3">
                      <img src={p.coverImage} alt={p.name} className="w-10 h-12 object-cover rounded border" />
                      <div>
                        <p className="font-bold text-zinc-900">{p.name}</p>
                        <span className="font-mono text-[10px] text-zinc-400">SKU: {p.sku}</span>
                      </div>
                    </td>

                    <td className="p-3 font-medium text-zinc-700">
                      {p.category?.nameBn || p.category?.name}
                    </td>

                    <td className="p-3 font-mono font-bold text-base text-zinc-900">
                      {p.totalStock} <span className="text-xs font-normal text-zinc-500">টি</span>
                    </td>

                    <td className="p-3">
                      {p.totalStock <= 0 ? (
                        <span className="bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                          স্টক শেষ (Out of Stock)
                        </span>
                      ) : p.totalStock <= 5 ? (
                        <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1 w-fit">
                          <AlertTriangle size={12} />
                          <span>লো স্টক (Low Stock)</span>
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                          পর্যাপ্ত (In Stock)
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-[#D4AF37] font-bold rounded-lg text-xs"
                      >
                        স্টক পরিবর্তন
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Adjustment Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="font-bold text-sm text-zinc-900">স্টক ইন / আউট এন্ট্রি</h3>
                <button onClick={() => setSelectedProduct(null)} className="text-zinc-400 font-bold">✕</button>
              </div>

              <div>
                <p className="font-bold text-zinc-900 text-sm">{selectedProduct.name}</p>
                <p className="text-zinc-500">বর্তমান স্টক: {selectedProduct.totalStock} টি</p>
              </div>

              <form onSubmit={handleAdjustStock} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('STOCK_IN')}
                    className={`py-2 rounded-lg font-bold border flex items-center justify-center gap-1.5 ${
                      adjustType === 'STOCK_IN'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-500'
                        : 'border-zinc-300 text-zinc-600'
                    }`}
                  >
                    <ArrowUpRight size={14} />
                    <span>স্টক-ইন (+)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustType('STOCK_OUT')}
                    className={`py-2 rounded-lg font-bold border flex items-center justify-center gap-1.5 ${
                      adjustType === 'STOCK_OUT'
                        ? 'bg-rose-50 text-rose-800 border-rose-500'
                        : 'border-zinc-300 text-zinc-600'
                    }`}
                  >
                    <ArrowDownRight size={14} />
                    <span>স্টক-আউট (-)</span>
                  </button>
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 mb-1">পরিমাণ (Quantity)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(e.target.value)}
                    placeholder="যেমন: 10"
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 mb-1">কারণ বা নোট (Reason)</label>
                  <input
                    type="text"
                    value={adjustNote}
                    onChange={(e) => setAdjustNote(e.target.value)}
                    placeholder="যেমন: নতুন চালান গ্রহণ বা ড্যামেজ বাদ"
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="px-4 py-2 bg-zinc-200 text-zinc-800 font-bold rounded-lg"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#D4AF37] text-black font-extrabold rounded-lg shadow"
                  >
                    নিশ্চিত করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
