'use client';

import React, { useState, useEffect } from 'react';
import { Users, Ban, CheckCircle, Search, ShoppingBag } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { formatPrice } from '@/lib/utils';

export default function AdminCustomersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/orders?limit=100')
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch((err) => console.error(err));
  }, []);

  // Group orders by customerPhone
  const customerMap = new Map<string, { name: string; phone: string; address: string; district: string; orderCount: number; totalSpent: number; isBlocked: boolean }>();

  orders.forEach((o) => {
    const existing = customerMap.get(o.customerPhone);
    if (!existing) {
      customerMap.set(o.customerPhone, {
        name: o.customerName,
        phone: o.customerPhone,
        address: o.customerAddress,
        district: o.district,
        orderCount: 1,
        totalSpent: o.grandTotal,
        isBlocked: false
      });
    } else {
      existing.orderCount += 1;
      existing.totalSpent += o.grandTotal;
    }
  });

  const customerList = Array.from(customerMap.values()).filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
            কাস্টমার ডিরেক্টরি (Customer CRM)
          </h1>
          <p className="text-xs text-zinc-500">
            গ্রাহক তালিকা, মোট অর্ডার সংখ্যা, সর্বমোট ক্রয় ও ফেক-অর্ডার ব্লকিং ব্যবস্থা
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-2">
          <Search size={16} className="text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="গ্রাহকের নাম বা ফোন দিয়ে খুঁজুন..."
            className="w-full bg-transparent text-xs text-zinc-900 outline-none"
          />
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 text-zinc-600 border-b">
              <tr>
                <th className="p-3 font-bold">গ্রাহক</th>
                <th className="p-3 font-bold">মোবাইল নম্বর</th>
                <th className="p-3 font-bold">ঠিকানা ও জেলা</th>
                <th className="p-3 font-bold">মোট অর্ডার</th>
                <th className="p-3 font-bold">সর্বমোট ব্যয়</th>
                <th className="p-3 font-bold text-right">ব্লকিং স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {customerList.map((c) => (
                <tr key={c.phone} className="hover:bg-zinc-50">
                  <td className="p-3 font-bold text-zinc-900">{c.name}</td>
                  <td className="p-3 font-mono font-medium text-zinc-700">{c.phone}</td>
                  <td className="p-3 text-zinc-600">{c.address}, {c.district}</td>
                  <td className="p-3 font-bold text-zinc-900">{c.orderCount} টি</td>
                  <td className="p-3 font-extrabold text-[#b89528]">{formatPrice(c.totalSpent)}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => alert(`কাস্টমার ${c.phone} ব্লকলিস্টে পরিবর্তন হয়েছে`)}
                      className="px-2.5 py-1 bg-zinc-100 hover:bg-rose-50 text-zinc-700 hover:text-rose-700 border rounded font-semibold text-[11px]"
                    >
                      ফেক অর্ডার ব্লক
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
