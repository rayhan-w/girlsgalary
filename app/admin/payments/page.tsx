'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchPaymentOrders = () => {
    setLoading(true);
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        const filtered = (data.orders || []).filter(
          (o: any) => o.paymentMethod !== 'COD' && o.transactionId
        );
        setOrders(filtered);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPaymentOrders();
  }, []);

  const handleVerifyPayment = async (orderNumber: string) => {
    try {
      const res = await fetch(`/api/orders/${orderNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'VERIFIED', note: 'Payment verified via admin 1-click queue' })
      });
      if (res.ok) {
        setMsg(`অর্ডার ${orderNumber} এর পেমেন্ট ভেরিফাইড হিসেবে মার্ক করা হয়েছে!`);
        fetchPaymentOrders();
      }
    } catch (e) {
      setMsg('সমস্যা হয়েছে।');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
            বিকাশ ও নগদ পেমেন্ট ভেরিফিকেশন (Payment Queue)
          </h1>
          <p className="text-xs text-zinc-500">
            অগ্রিম প্রদানকৃত TrxID ও প্রেরক নম্বর মিলিয়ে ১-ক্লিকে নিশ্চিত করুন
          </p>
        </div>

        {msg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold">
            {msg}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden text-xs">
          {orders.length === 0 && !loading ? (
            <div className="py-16 text-center text-zinc-500 italic">
              বর্তমানে কোনো ম্যানুয়াল পেমেন্ট যাচাইয়ের অপেক্ষায় নেই।
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-50 text-zinc-600 border-b">
                  <tr>
                    <th className="p-3 font-bold">অর্ডার নম্বর</th>
                    <th className="p-3 font-bold">গ্রাহকের নাম ও ফোন</th>
                    <th className="p-3 font-bold">পেমেন্ট মেথড</th>
                    <th className="p-3 font-bold">প্রেরক নম্বর</th>
                    <th className="p-3 font-bold">TrxID</th>
                    <th className="p-3 font-bold">অ্যামাউন্ট</th>
                    <th className="p-3 font-bold">পেমেন্ট স্ট্যাটাস</th>
                    <th className="p-3 font-bold text-right">যাচাই অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-zinc-50">
                      <td className="p-3 font-mono font-bold text-zinc-900">{ord.orderNumber}</td>
                      <td className="p-3">
                        <span className="font-semibold block">{ord.customerName}</span>
                        <span className="font-mono text-zinc-500">{ord.customerPhone}</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] text-white ${
                          ord.paymentMethod === 'BKASH_MANUAL' ? 'bg-[#E2136E]' : 'bg-[#F7941D]'
                        }`}>
                          {ord.paymentMethod === 'BKASH_MANUAL' ? 'bKash' : 'Nagad'}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold">{ord.senderPhone || '-'}</td>
                      <td className="p-3 font-mono font-bold text-[#b89528]">{ord.transactionId}</td>
                      <td className="p-3 font-bold text-zinc-900">{formatPrice(ord.grandTotal)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          ord.paymentStatus === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {ord.paymentStatus !== 'VERIFIED' ? (
                          <button
                            onClick={() => handleVerifyPayment(ord.orderNumber)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                          >
                            ✓ ভেরিফাই করুন
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold">যাচাইকৃত</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
