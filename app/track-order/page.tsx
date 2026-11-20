'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Package, Clock, Truck, CheckCircle2, XCircle, AlertCircle, Phone } from 'lucide-react';
import { StorefrontLayout } from '@/components/StorefrontLayout';
import { formatPrice, formatDate } from '@/lib/utils';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get('orderNumber') || '';
  const initialPhone = searchParams.get('phone') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState(initialPhone);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async (orderNum: string, phoneNum: string) => {
    if (!orderNum.trim()) return;
    setLoading(true);
    setError('');
    try {
      const url = `/api/orders/${orderNum.trim()}${phoneNum.trim() ? `?phone=${encodeURIComponent(phoneNum.trim())}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) {
        setError('অর্ডারটি পাওয়া যায়নি। অনুগ্রহ করে সঠিক অর্ডার নম্বর ও মোবাইল নম্বর দিন।');
        setOrder(null);
      } else {
        const data = await res.json();
        setOrder(data);
      }
    } catch (err) {
      setError('ট্র্যাকিং তথ্য সংগ্রহ করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      fetchOrder(initialOrderNumber, initialPhone);
    }
  }, [initialOrderNumber, initialPhone]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderNumber, phone);
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'PENDING': return 1;
      case 'CONFIRMED': return 2;
      case 'PROCESSING': return 3;
      case 'SHIPPED': return 4;
      case 'DELIVERED': return 5;
      case 'CANCELLED': return -1;
      case 'RETURNED': return -2;
      default: return 1;
    }
  };

  const currentStep = order ? getStatusStep(order.status) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900">
          অর্ডার ট্র্যাকিং (Track Your Order)
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          আপনার অর্ডার নম্বর ও মোবাইল নম্বর দিয়ে বর্তমান পার্সেল স্ট্যাটাস জানুন
        </p>
      </div>

      {/* Tracking Input Card */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm mb-8">
        <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              অর্ডার নম্বর (Order Number)
            </label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="যেমন: GG-1001"
              className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg text-xs font-mono uppercase outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="sm:col-span-6">
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              মোবাইল নম্বর (Phone Number)
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX (অপশনাল)"
                className="flex-1 p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg text-xs font-mono outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#b89528] text-black font-bold text-xs rounded-lg flex items-center gap-1.5 shadow"
              >
                <Search size={14} />
                <span>{loading ? '...' : 'ট্র্যাক'}</span>
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Details & Live Timeline Display */}
      {order && (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-md p-6 space-y-6">
          
          {/* Header Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b">
            <div>
              <span className="text-xs text-zinc-400">অর্ডার নম্বর</span>
              <h2 className="text-lg font-bold font-mono text-zinc-900">{order.orderNumber}</h2>
              <p className="text-[11px] text-zinc-500">অর্ডার তারিখ: {formatDate(order.createdAt)}</p>
            </div>
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                order.status === 'DELIVERED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : order.status === 'CANCELLED'
                  ? 'bg-rose-100 text-rose-800'
                  : order.status === 'SHIPPED'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Timeline Progress */}
          {currentStep > 0 && (
            <div className="py-4">
              <div className="grid grid-cols-5 text-center text-xs">
                <div className={`space-y-1 ${currentStep >= 1 ? 'text-[#b89528] font-bold' : 'text-zinc-400'}`}>
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-[#b89528] text-black' : 'bg-zinc-200 text-zinc-500'}`}>
                    1
                  </div>
                  <span>গৃহীত</span>
                </div>
                <div className={`space-y-1 ${currentStep >= 2 ? 'text-[#b89528] font-bold' : 'text-zinc-400'}`}>
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-[#b89528] text-black' : 'bg-zinc-200 text-zinc-500'}`}>
                    2
                  </div>
                  <span>কনফার্মড</span>
                </div>
                <div className={`space-y-1 ${currentStep >= 3 ? 'text-[#b89528] font-bold' : 'text-zinc-400'}`}>
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-[#b89528] text-black' : 'bg-zinc-200 text-zinc-500'}`}>
                    3
                  </div>
                  <span>প্রসেসিং</span>
                </div>
                <div className={`space-y-1 ${currentStep >= 4 ? 'text-[#b89528] font-bold' : 'text-zinc-400'}`}>
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${currentStep >= 4 ? 'bg-[#b89528] text-black' : 'bg-zinc-200 text-zinc-500'}`}>
                    4
                  </div>
                  <span>কুরিয়ারে</span>
                </div>
                <div className={`space-y-1 ${currentStep >= 5 ? 'text-emerald-700 font-bold' : 'text-zinc-400'}`}>
                  <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${currentStep >= 5 ? 'bg-emerald-600 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                    ✓
                  </div>
                  <span>ডেলিভার্ড</span>
                </div>
              </div>
            </div>
          )}

          {order.status === 'CANCELLED' && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
              <XCircle size={18} />
              <span>এই অর্ডারটি বাতিল করা হয়েছে। কোনো জিজ্ঞাসা থাকলে আমাদের হটলাইনে যোগাযোগ করুন।</span>
            </div>
          )}

          {/* Items and Address info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4 border-t">
            <div>
              <span className="font-bold text-zinc-800 block mb-2">গ্রাহক ও ডেলিভারি তথ্য:</span>
              <p className="text-zinc-700 font-medium">{order.customerName}</p>
              <p className="text-zinc-600">{order.customerAddress}</p>
              <p className="text-zinc-600">জেলা: {order.district}</p>
              <p className="text-zinc-600 font-mono">মোবাইল: {order.customerPhone}</p>
            </div>

            <div>
              <span className="font-bold text-zinc-800 block mb-2">পেমেন্ট ও বিল:</span>
              <p className="text-zinc-600">পেমেন্ট মেথড: {order.paymentMethod}</p>
              <p className="text-zinc-600">পেমেন্ট স্ট্যাটাস: {order.paymentStatus}</p>
              <p className="text-sm font-extrabold text-[#b89528] mt-1">
                সর্বমোট: {formatPrice(order.grandTotal)}
              </p>
            </div>
          </div>

          {/* Status History Logs */}
          {order.statusHistory?.length > 0 && (
            <div className="pt-4 border-t">
              <span className="font-bold text-xs text-zinc-800 block mb-2">স্ট্যাটাস ইতিহাস:</span>
              <div className="space-y-2 text-xs">
                {order.statusHistory.map((h: any) => (
                  <div key={h.id} className="p-2.5 bg-zinc-50 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-bold text-zinc-900">{h.status}</span>
                      {h.note && <span className="text-zinc-600 ml-2">- {h.note}</span>}
                    </div>
                    <span className="text-[11px] text-zinc-400">{formatDate(h.createdAt)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <StorefrontLayout>
      <Suspense fallback={<div className="py-20 text-center text-xs">লোড হচ্ছে...</div>}>
        <TrackOrderContent />
      </Suspense>
    </StorefrontLayout>
  );
}
