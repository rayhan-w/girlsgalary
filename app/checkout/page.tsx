'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  Tag,
  ArrowRight,
  ShoppingBag,
  Info
} from 'lucide-react';
import { StorefrontLayout } from '@/components/StorefrontLayout';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { BANGLADESH_DISTRICTS, getZoneForDistrict } from '@/lib/districts';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, clearCart } = useCart();

  // Form Fields (Only 3 required fields)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [orderNote, setOrderNote] = useState('');

  // Delivery zone in summary (Inside Dhaka 70, Near Dhaka 100, Outside Dhaka 130)
  const [deliveryZone, setDeliveryZone] = useState<'inside_dhaka' | 'near_dhaka' | 'outside_dhaka'>('inside_dhaka');

  // Payment method (COD by default)
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BKASH_MANUAL' | 'NAGAD_MANUAL'>('COD');
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Site settings state (delivery charges)
  const [settings, setSettings] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => !data.error && setSettings(data))
      .catch((err) => console.error(err));
  }, []);

  // When district changes, update default delivery zone
  const handleDistrictChange = (dName: string) => {
    setDistrict(dName);
    const zone = getZoneForDistrict(dName);
    setDeliveryZone(zone);
  };

  // Calculate delivery charge
  const chargeInside = settings?.deliveryChargeInsideDhaka ?? 70;
  const chargeNear = settings?.deliveryChargeNearDhaka ?? 100;
  const chargeOutside = settings?.deliveryChargeOutsideDhaka ?? 130;
  const freeThreshold = settings?.freeDeliveryThreshold ?? 2000;

  let baseDelivery = chargeOutside;
  if (deliveryZone === 'inside_dhaka') baseDelivery = chargeInside;
  else if (deliveryZone === 'near_dhaka') baseDelivery = chargeNear;

  const isFreeDelivery = cartSubtotal >= freeThreshold;
  const finalDeliveryCharge = isFreeDelivery ? 0 : baseDelivery;

  // Coupon calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
    } else {
      discountAmount = Math.min(appliedCoupon.discountValue, cartSubtotal);
    }
  }

  // Grand total
  const grandTotal = Math.max(0, cartSubtotal + finalDeliveryCharge - discountAmount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), subtotal: cartSubtotal })
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || 'ভুল কুপন কোড');
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(data.coupon);
        setCouponError('');
      }
    } catch (err) {
      setCouponError('কুপন যাচাই করতে সমস্যা হয়েছে');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim()) {
      setFormError('আপনার সম্পূর্ণ নাম লিখুন');
      return;
    }
    if (!phone.trim() || phone.trim().length < 11) {
      setFormError('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)');
      return;
    }
    if (!address.trim()) {
      setFormError('আপনার সম্পূর্ণ ডেলিভারি ঠিকানা দিন');
      return;
    }

    if (cart.length === 0) {
      setFormError('আপনার কার্ট খালি। অর্ডার করতে পণ্য ব্যাগে যোগ করুন।');
      return;
    }

    if (paymentMethod !== 'COD' && (!senderPhone || !transactionId)) {
      setFormError('বিকাশ/নগদ পেমেন্টের জন্য প্রেরক নম্বর ও TrxID প্রদান করুন');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          address,
          district,
          deliveryZone,
          paymentMethod,
          senderPhone: paymentMethod !== 'COD' ? senderPhone : undefined,
          transactionId: paymentMethod !== 'COD' ? transactionId : undefined,
          orderNote,
          couponCode: appliedCoupon?.code,
          items: cart
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'অর্ডার সম্পন্ন হতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।');
        setIsSubmitting(false);
      } else {
        clearCart();
        router.push(`/order-success/${data.orderNumber}`);
      }
    } catch (err) {
      setFormError('নেটওয়ার্ক সমস্যা। পুনরায় চেষ্টা করুন।');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <StorefrontLayout>
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <ShoppingBag size={54} className="text-zinc-300 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-zinc-900">আপনার কার্ট খালি</h1>
          <p className="text-xs text-zinc-500 mt-2">
            অর্ডার করার পূর্বে অনুগ্রহ করে আপনার পছন্দের পণ্য কার্টে যোগ করুন।
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-bold text-xs rounded-xl shadow hover:bg-[#b89528]"
          >
            <span>পণ্য দেখুন ও শপিং শুরু করুন</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-xl sm:text-3xl font-serif font-bold text-zinc-900 mb-2">
          চেকআউট ও দ্রুত অর্ডার (Fast Checkout)
        </h1>
        <p className="text-xs text-zinc-500 mb-8">
          অর্ডার সম্পন্ন করতে নিচের তথ্যগুলো পূরণ করুন। কোনো একাউন্ট খোলার প্রয়োজন নেই (Guest Checkout)।
        </p>

        {formError && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span className="font-semibold">{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: 3 Required Customer Fields & Payment Options (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: 3 Fields Customer Info */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-zinc-200/90 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2 border-b pb-3">
                <span className="w-6 h-6 rounded-full bg-[#111] text-[#D4AF37] flex items-center justify-center text-xs font-bold">1</span>
                <span>ডেলিভারির তথ্য (Customer Details)</span>
              </h2>

              {/* Field 1: Full Name */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                  ১. আপনার সম্পূর্ণ নাম (Full Name) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="যেমন: নুসরাত জাহান"
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-[#D4AF37] focus:bg-white rounded-xl p-3 text-xs sm:text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400"
                />
              </div>

              {/* Field 2: Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                  ২. মোবাইল নম্বর (Mobile Number) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX বা 018XXXXXXXX"
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-[#D4AF37] focus:bg-white rounded-xl p-3 text-xs sm:text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 font-mono"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  * ডেলিভারি ম্যানের সাথে যোগাযোগের জন্য সক্রিয় মোবাইল নম্বর দিন।
                </p>
              </div>

              {/* District Dropdown (Inside Address step without cluttering) */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                  জেলা নির্বাচন করুন (District) <span className="text-rose-600">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-[#D4AF37] focus:bg-white rounded-xl p-3 text-xs sm:text-sm text-zinc-900 outline-none transition-all cursor-pointer"
                >
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.bn} ({d.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 3: Full Address */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                  ৩. সম্পূর্ণ ঠিকানা (Full Address) <span className="text-rose-600">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="বাসা নং, রোড নং, এলাকা / থানা..."
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-[#D4AF37] focus:bg-white rounded-xl p-3 text-xs sm:text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400"
                />
              </div>

              {/* Optional Order Note */}
              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1">
                  অর্ডার সংক্রান্ত বিশেষ কোনো নোট (অপশনাল)
                </label>
                <input
                  type="text"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="যেমন: বিকেলে ডেলিভারি দিলে ভালো হয়..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-800 outline-none focus:border-zinc-400"
                />
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-zinc-200/90 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2 border-b pb-3">
                <span className="w-6 h-6 rounded-full bg-[#111] text-[#D4AF37] flex items-center justify-center text-xs font-bold">2</span>
                <span>পেমেন্ট পদ্ধতি নির্বাচন করুন (Payment Method)</span>
              </h2>

              <div className="space-y-3">
                {/* Cash On Delivery (Pre-selected by default) */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-[#D4AF37] bg-[#fbf6e6]/60 shadow-sm'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mt-1 w-4 h-4 text-[#D4AF37] focus:ring-[#D4AF37]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-zinc-900">
                        ক্যাশ অন ডেলিভারি (Cash on Delivery)
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        জনপ্রিয়
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      পণ্য হাতে পেয়ে দেখে ডেলিভারি ম্যানের কাছে মূল্য পরিশোধ করুন।
                    </p>
                  </div>
                </label>

                {/* bKash Manual Payment */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'BKASH_MANUAL'
                      ? 'border-[#D4AF37] bg-[#fbf6e6]/60 shadow-sm'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BKASH_MANUAL"
                    checked={paymentMethod === 'BKASH_MANUAL'}
                    onChange={() => setPaymentMethod('BKASH_MANUAL')}
                    className="mt-1 w-4 h-4 text-[#D4AF37] focus:ring-[#D4AF37]"
                  />
                  <div className="flex-1">
                    <span className="text-xs sm:text-sm font-bold text-zinc-900 flex items-center gap-2">
                      <span className="bg-[#E2136E] text-white px-2 py-0.5 rounded text-[10px] font-extrabold">bKash</span>
                      <span>বিকাশ সেন্ড মানি (ম্যানুয়াল ভেরিফিকেশন)</span>
                    </span>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      বিকাশ নম্বর: <span className="font-mono font-bold text-black">{settings?.bkashNumber || '01712-345678'}</span> (Personal)
                    </p>
                  </div>
                </label>

                {/* Nagad Manual Payment */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'NAGAD_MANUAL'
                      ? 'border-[#D4AF37] bg-[#fbf6e6]/60 shadow-sm'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="NAGAD_MANUAL"
                    checked={paymentMethod === 'NAGAD_MANUAL'}
                    onChange={() => setPaymentMethod('NAGAD_MANUAL')}
                    className="mt-1 w-4 h-4 text-[#D4AF37] focus:ring-[#D4AF37]"
                  />
                  <div className="flex-1">
                    <span className="text-xs sm:text-sm font-bold text-zinc-900 flex items-center gap-2">
                      <span className="bg-[#F7941D] text-white px-2 py-0.5 rounded text-[10px] font-extrabold">Nagad</span>
                      <span>নগদ সেন্ড মানি (ম্যানুয়াল ভেরিফিকেশন)</span>
                    </span>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      নগদ নম্বর: <span className="font-mono font-bold text-black">{settings?.nagadNumber || '01712-345678'}</span> (Personal)
                    </p>
                  </div>
                </label>
              </div>

              {/* bKash/Nagad Inputs when selected */}
              {paymentMethod !== 'COD' && (
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3 mt-3 animate-in fade-in duration-200">
                  <p className="text-xs text-zinc-700 font-medium">
                    {paymentMethod === 'BKASH_MANUAL'
                      ? settings?.bkashInstructions || 'বিকাশ নম্বরে টাকা পাঠিয়ে নিচে প্রেরক নম্বর ও TrxID প্রদান করুন।'
                      : settings?.nagadInstructions || 'নগদ নম্বরে টাকা পাঠিয়ে নিচে প্রেরক নম্বর ও TrxID প্রদান করুন।'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                        যে নম্বর থেকে পাঠিয়েছেন (Sender Mobile)
                      </label>
                      <input
                        type="tel"
                        required
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full bg-white border border-zinc-300 rounded-lg p-2 text-xs font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                        Transaction ID (TrxID)
                      </label>
                      <input
                        type="text"
                        required
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 9J23KL4M"
                        className="w-full bg-white border border-zinc-300 rounded-lg p-2 text-xs font-mono uppercase outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Side: Order Summary & Live Total Everywhere (5 Cols) */}
          {/* Page 5 Rules:
              - The delivery-area choice (Inside Dhaka / Near Dhaka / Outside Dhaka) sits inside Order Summary
              - Grand total updates immediately
              - Confirm order button itself shows the grand total!
          */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-zinc-50 p-5 sm:p-6 rounded-2xl border border-zinc-200/90 shadow-sm sticky top-24 space-y-5">
              <h2 className="text-base font-bold text-zinc-900 border-b pb-3 flex items-center justify-between">
                <span>অর্ডার সামারি (Order Summary)</span>
                <span className="text-xs text-zinc-500 font-normal">{cart.length} টি আইটেম</span>
              </h2>

              {/* Items in Summary */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-zinc-200/60">
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="pt-2 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-14 object-cover rounded-md border border-zinc-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-zinc-800 truncate">{item.name}</p>
                      <div className="text-[11px] text-zinc-500">
                        {item.size && <span>{item.size} </span>}
                        {item.color && <span>• {item.color} </span>}
                        <span>• Qty: {item.quantity}</span>
                      </div>
                      <p className="text-xs font-bold text-[#b89528] mt-0.5">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Zone Selector inside Order Summary (Per Page 5 Specification) */}
              <div className="pt-3 border-t border-zinc-200">
                <label className="block text-xs font-bold text-zinc-900 mb-2">
                  ডেলিভারি এরিয়া (Delivery Area):
                </label>
                <div className="space-y-1.5 text-xs">
                  <label
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      deliveryZone === 'inside_dhaka'
                        ? 'border-[#D4AF37] bg-white text-zinc-900 font-bold shadow-xs'
                        : 'border-zinc-200 text-zinc-600 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="deliveryZone"
                        checked={deliveryZone === 'inside_dhaka'}
                        onChange={() => setDeliveryZone('inside_dhaka')}
                        className="text-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                      <span>ঢাকা সিটি (Inside Dhaka)</span>
                    </div>
                    <span>{isFreeDelivery ? 'ফ্রি' : formatPrice(chargeInside)}</span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      deliveryZone === 'near_dhaka'
                        ? 'border-[#D4AF37] bg-white text-zinc-900 font-bold shadow-xs'
                        : 'border-zinc-200 text-zinc-600 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="deliveryZone"
                        checked={deliveryZone === 'near_dhaka'}
                        onChange={() => setDeliveryZone('near_dhaka')}
                        className="text-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                      <span>ঢাকা সাব-এরিয়া / পার্শ্ববর্তী (Near Dhaka)</span>
                    </div>
                    <span>{isFreeDelivery ? 'ফ্রি' : formatPrice(chargeNear)}</span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      deliveryZone === 'outside_dhaka'
                        ? 'border-[#D4AF37] bg-white text-zinc-900 font-bold shadow-xs'
                        : 'border-zinc-200 text-zinc-600 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="deliveryZone"
                        checked={deliveryZone === 'outside_dhaka'}
                        onChange={() => setDeliveryZone('outside_dhaka')}
                        className="text-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                      <span>ঢাকার বাইরে সারা বাংলাদেশ (Outside Dhaka)</span>
                    </div>
                    <span>{isFreeDelivery ? 'ফ্রি' : formatPrice(chargeOutside)}</span>
                  </label>
                </div>
              </div>

              {/* Coupon Code Box */}
              <div className="pt-3 border-t border-zinc-200">
                <label className="block text-xs font-bold text-zinc-900 mb-1.5 flex items-center gap-1.5">
                  <Tag size={13} className="text-[#b89528]" />
                  <span>কুপন কোড (Discount Coupon)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. GIRLS10"
                    disabled={!!appliedCoupon}
                    className="flex-1 p-2.5 bg-white border border-zinc-300 rounded-lg text-xs font-mono uppercase outline-none focus:border-[#D4AF37] disabled:bg-zinc-100"
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}
                      className="px-3 py-2 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg border border-rose-200"
                    >
                      রিমুভ
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                      className="px-4 py-2 bg-black text-[#D4AF37] text-xs font-bold rounded-lg hover:bg-zinc-800 disabled:opacity-50"
                    >
                      {isApplyingCoupon ? 'যাচাই হচ্ছে...' : 'প্রয়োগ করুন'}
                    </button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                    <CheckCircle2 size={13} /> কুপন &ldquo;{appliedCoupon.code}&rdquo; সফলভাবে যুক্ত হয়েছে!
                  </p>
                )}
                {couponError && (
                  <p className="text-xs text-rose-600 font-medium mt-1">
                    ⚠️ {couponError}
                  </p>
                )}
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="pt-4 border-t border-zinc-200 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>সাবটোটাল</span>
                  <span className="font-semibold text-zinc-900">{formatPrice(cartSubtotal)}</span>
                </div>

                <div className="flex justify-between text-zinc-600">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="font-semibold text-zinc-900">
                    {isFreeDelivery ? (
                      <span className="text-emerald-700 font-bold">ফ্রি (৳০)</span>
                    ) : (
                      formatPrice(finalDeliveryCharge)
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>কুপন ডিসকাউন্ট</span>
                    <span>- {formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm sm:text-base font-extrabold text-zinc-900 pt-2 border-t border-zinc-300">
                  <span>সর্বমোট প্রদেয় বিল</span>
                  <span className="text-[#b89528] text-lg">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Confirm Order Button with Total on the button! */}
              {/* Page 5 Rule: the button itself shows the total amount */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#D4AF37] hover:bg-[#b89528] text-black font-extrabold py-4 px-6 rounded-xl shadow-xl text-sm sm:text-base flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
              >
                <span>{isSubmitting ? 'অর্ডার প্রসেস হচ্ছে...' : `অর্ডার নিশ্চিত করুন (${formatPrice(grandTotal)})`}</span>
                <ArrowRight size={18} />
              </button>

              <div className="text-center">
                <p className="text-[11px] text-zinc-500 flex items-center justify-center gap-1">
                  <ShieldCheck size={14} className="text-[#b89528]" />
                  <span>শতভাগ নিরাপদ ও ঝামেলামুক্ত শপিং নিশ্চয়তা</span>
                </p>
              </div>

            </div>
          </div>

        </form>
      </div>
    </StorefrontLayout>
  );
}
