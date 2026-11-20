'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Phone, Lock, Package, MapPin, RefreshCw, LogOut, ArrowRight } from 'lucide-react';
import { StorefrontLayout } from '@/components/StorefrontLayout';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [customerName, setCustomerName] = useState('সুমাইয়া আক্তার');
  const [orders, setOrders] = useState<any[]>([]);
  const { addToCart } = useCart();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 11) {
      setIsLoggedIn(true);
      // Fetch sample orders for demonstration
      fetch(`/api/orders?search=${encodeURIComponent(phone)}`)
        .then((res) => res.json())
        .then((data) => setOrders(data.orders || []))
        .catch(() => {});
    }
  };

  const handleReorder = (item: any) => {
    addToCart({
      productId: item.productId,
      variantId: item.variantId,
      name: item.productName,
      slug: item.productId,
      image: item.productImage,
      size: item.size,
      color: item.color,
      price: item.price,
      regularPrice: item.price,
      quantity: 1,
      maxStock: 10
    });
  };

  return (
    <StorefrontLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {!isLoggedIn ? (
          <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-md">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-[#fbf6e6] text-[#b89528] rounded-full flex items-center justify-center mx-auto mb-3">
                <User size={28} />
              </div>
              <h1 className="text-xl font-serif font-bold text-zinc-900">কাস্টমার লগইন (Login)</h1>
              <p className="text-xs text-zinc-500 mt-1">
                আপনার মোবাইল নম্বর দিয়ে লগইন করুন এবং পূর্বের অর্ডার হিস্ট্রি দেখুন
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">মোবাইল নম্বর</label>
                <div className="flex items-center bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-2.5 focus-within:border-[#D4AF37]">
                  <Phone size={14} className="text-zinc-400 mr-2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-transparent outline-none font-mono text-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">পাসওয়ার্ড</label>
                <div className="flex items-center bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-2.5 focus-within:border-[#D4AF37]">
                  <Lock size={14} className="text-zinc-400 mr-2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent outline-none text-zinc-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#b89528] text-black font-bold rounded-xl shadow transition-colors"
              >
                লগইন করুন
              </button>
            </form>

            <div className="mt-6 pt-4 border-t text-center text-xs text-zinc-500">
              <span>লগইন ছাড়াই অর্ডার ট্র্যাক করতে চান? </span>
              <Link href="/track-order" className="text-[#b89528] font-bold hover:underline">
                এখানে ক্লিক করুন &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Account Header */}
            <div className="bg-[#111] text-white p-6 rounded-2xl border-2 border-[#D4AF37] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#D4AF37] text-black font-serif font-bold text-xl flex items-center justify-center">
                  {customerName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold">{customerName}</h2>
                  <p className="text-xs text-zinc-400 font-mono">📱 {phone}</p>
                </div>
              </div>

              <button
                onClick={() => setIsLoggedIn(false)}
                className="self-start sm:self-auto px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <LogOut size={14} />
                <span>লগআউট</span>
              </button>
            </div>

            {/* Orders Section */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <h3 className="font-serif font-bold text-base text-zinc-900 mb-4 flex items-center gap-2">
                <Package size={18} className="text-[#b89528]" />
                <span>আমার পূর্ববর্তী অর্ডারসমূহ (My Orders)</span>
              </h3>

              {orders.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 text-xs">
                  <p>এই নম্বরে কোনো অর্ডার খুঁজে পাওয়া যায়নি।</p>
                  <Link href="/shop" className="mt-3 inline-block font-bold text-[#b89528] hover:underline">
                    শপিং করুন &rarr;
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord: any) => (
                    <div key={ord.id} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 text-xs">
                      <div className="flex items-center justify-between border-b pb-2 mb-3">
                        <div>
                          <span className="font-mono font-bold text-zinc-900">{ord.orderNumber}</span>
                          <span className="text-zinc-500 ml-2">{ord.createdAt.slice(0, 10)}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {ord.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        {ord.items?.map((it: any) => (
                          <div key={it.id} className="flex items-center justify-between">
                            <span>{it.productName} (x{it.quantity})</span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{formatPrice(it.total)}</span>
                              <button
                                onClick={() => handleReorder(it)}
                                className="px-2 py-1 bg-white border border-zinc-300 rounded text-[10px] font-semibold text-zinc-700 hover:border-black flex items-center gap-1"
                              >
                                <RefreshCw size={10} />
                                <span>Reorder</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t font-semibold">
                        <span>সর্বমোট: {formatPrice(ord.grandTotal)}</span>
                        <Link
                          href={`/track-order?orderNumber=${ord.orderNumber}&phone=${ord.customerPhone}`}
                          className="text-[#b89528] hover:underline"
                        >
                          লাইভ ট্র্যাক করুন &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
