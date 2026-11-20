'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ShoppingBag, CheckCircle, AlertCircle } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { BANGLADESH_DISTRICTS } from '@/lib/districts';
import { formatPrice } from '@/lib/utils';

export default function AdminManualOrderPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);

  // Customer info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [orderNote, setOrderNote] = useState('Created manually from Phone/Messenger');

  // Items selection
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [deliveryCharge, setDeliveryCharge] = useState(70);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetch('/api/products?limit=50')
      .then((res) => res.json())
      .then((data) => {
        if (data.products?.length) {
          setProducts(data.products);
          setSelectedProductId(data.products[0].id);
        }
      });
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address || !selectedProductId) {
      setError('গ্রাহকের নাম, ফোন, ঠিকানা এবং পণ্য নির্বাচন করুন');
      return;
    }

    setLoading(true);
    setError('');

    const chosenProduct = products.find((p) => p.id === selectedProductId);
    if (!chosenProduct) return;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          address,
          district,
          deliveryZone: district === 'Dhaka' ? 'inside_dhaka' : 'outside_dhaka',
          paymentMethod: 'COD',
          orderNote,
          items: [
            {
              productId: chosenProduct.id,
              name: chosenProduct.name,
              price: chosenProduct.offerPrice,
              regularPrice: chosenProduct.regularPrice,
              image: chosenProduct.coverImage,
              quantity,
              maxStock: chosenProduct.totalStock
            }
          ]
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'অর্ডার তৈরি ব্যর্থ হয়েছে');
      } else {
        setSuccessMsg(`অর্ডার সফলভাবে তৈরি হয়েছে! অর্ডার নম্বর: ${data.orderNumber}`);
        setTimeout(() => {
          router.push('/admin/orders');
        }, 1500);
      }
    } catch (err) {
      setError('সার্ভারে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
            ম্যানুয়াল অর্ডার এন্ট্রি (POS / Messenger Sales)
          </h1>
          <p className="text-xs text-zinc-500">
            ফেসবুক পেজ মেসেঞ্জার ও ফোন কলের মাধ্যমে আসা অর্ডারের স্টক সরাসরি সমন্বয় করুন
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleCreateOrder} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4 text-xs">
          <div>
            <label className="block font-bold text-zinc-800 mb-1">গ্রাহকের নাম *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. সাদিয়া ইসলাম"
              className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-zinc-800 mb-1">মোবাইল নম্বর *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg font-mono outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-800 mb-1">জেলা *</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg outline-none"
              >
                {BANGLADESH_DISTRICTS.map((d) => (
                  <option key={d.name} value={d.name}>{d.bn} ({d.name})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-zinc-800 mb-1">সম্পূর্ণ ঠিকানা *</label>
            <textarea
              required
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="বাসা নং, রোড, থানা..."
              className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg outline-none"
            />
          </div>

          <div className="border-t pt-3 space-y-3">
            <h3 className="font-bold text-zinc-900">পণ্য নির্বাচন</h3>
            <div>
              <label className="block font-medium text-zinc-700 mb-1">পণ্য সিলেক্ট করুন *</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg outline-none"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {formatPrice(p.offerPrice)} (স্টক: {p.totalStock})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">পরিমাণ (Quantity)</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">ডেলিভারি চার্জ (৳)</label>
                <input
                  type="number"
                  value={deliveryCharge}
                  onChange={(e) => setDeliveryCharge(Number(e.target.value))}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg font-bold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">নোট</label>
            <input
              type="text"
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              className="w-full p-2 bg-zinc-50 border rounded text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#D4AF37] hover:bg-[#b89528] text-black font-extrabold rounded-xl shadow mt-2"
          >
            {loading ? 'অর্ডার তৈরি হচ্ছে...' : 'অর্ডার সংরক্ষণ করুন'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
