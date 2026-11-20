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
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/lib/utils';
import { BANGLADESH_DISTRICTS, getZoneForDistrict } from '@/lib/districts';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, clearCart } = useCart();
  const { language, t } = useLanguage();

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
        setCouponError(data.error || (language === 'bn' ? 'কুপনটি সঠিক নয়।' : 'Invalid coupon code.'));
      } else {
        setAppliedCoupon(data.coupon);
      }
    } catch (err) {
      setCouponError(language === 'bn' ? 'কুপন যাচাইয়ে সমস্যা হয়েছে।' : 'Error validating coupon.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim() || !phone.trim() || !address.trim() || !district) {
      setFormError(language === 'bn' ? 'অনুগ্রহ করে নাম, ফোন নম্বর, জেলা ও ঠিকানা প্রদান করুন।' : 'Please provide your full name, phone number, district, and delivery address.');
      return;
    }

    // BD Phone validation
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 11 || (!cleanPhone.startsWith('01') && !cleanPhone.startsWith('8801'))) {
      setFormError(language === 'bn' ? 'অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর দিন।' : 'Please enter a valid 11-digit Bangladeshi mobile number.');
      return;
    }

    if (paymentMethod !== 'COD' && (!senderPhone.trim() || !transactionId.trim())) {
      setFormError(language === 'bn' ? 'অনুগ্রহ করে প্রেরক নম্বর ও TrxID প্রদান করুন।' : 'Please enter sender phone number and Transaction ID.');
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
        setFormError(data.error || (language === 'bn' ? 'অর্ডার সম্পন্ন হতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।' : 'Failed to complete order. Please try again.'));
        setIsSubmitting(false);
      } else {
        clearCart();
        router.push(`/order-success/${data.orderNumber}`);
      }
    } catch (err) {
      setFormError(language === 'bn' ? 'নেটওয়ার্ক সমস্যা। পুনরায় চেষ্টা করুন।' : 'Network error. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <StorefrontLayout>
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <ShoppingBag size={54} className="text-zinc-300 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-zinc-900">
            {t('আপনার কার্ট খালি', 'Your Cart is Empty')}
          </h1>
          <p className="text-xs text-zinc-500 mt-2">
            {t(
              'অর্ডার করার পূর্বে অনুগ্রহ করে আপনার পছন্দের পণ্য কার্টে যোগ করুন।',
              'Please add items to your cart before proceeding to checkout.'
            )}
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-bold text-xs rounded-xl shadow hover:bg-[#b89528]"
          >
            <span>{t('পণ্য দেখুন ও শপিং শুরু করুন', 'Browse Products & Start Shopping')}</span>
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
          {t('চেকআউট ও সহজ অর্ডার', 'Fast & Easy Checkout')}
        </h1>
        <p className="text-xs text-zinc-500 mb-8">
          {t(
            'অর্ডার সম্পন্ন করতে নিচের তথ্যগুলো পূরণ করুন। কোনো একাউন্ট খোলার প্রয়োজন নেই।',
            'Fill out the form below to place your order. No account registration needed (Guest Checkout).'
          )}
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
                <span>{t('ডেলিভারির তথ্য', 'Delivery Information')}</span>
              </h2>

              {/* Field 1: Full Name */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                  {t('১. আপনার সম্পূর্ণ নাম', '1. Full Name')} <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t('যেমন: নুসরাত জাহান', 'e.g. Nusrat Jahan')}
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-[#D4AF37] focus:bg-white rounded-xl p-3 text-xs sm:text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400"
                />
              </div>

              {/* Field 2: Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                  {t('২. মোবাইল নম্বর', '2. Mobile Phone Number')} <span className="text-rose-600">*</span>
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
                  {t(
                    '* ডেলিভারি ম্যানের সাথে যোগাযোগের জন্য সক্রিয় মোবাইল নম্বর দিন।',
                    '* Please provide an active mobile number for delivery confirmation.'
                  )}
                </p>
              </div>

              {/* District Dropdown */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                  {t('জেলা নির্বাচন করুন', 'Select District')} <span className="text-rose-600">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-[#D4AF37] focus:bg-white rounded-xl p-3 text-xs sm:text-sm text-zinc-900 outline-none transition-all cursor-pointer"
                >
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {language === 'bn' ? d.bn : d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 3: Full Address */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                  {t('৩. সম্পূর্ণ ঠিকানা', '3. Delivery Address')} <span className="text-rose-600">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t('বাসা নং, রোড নং, এলাকা / থানা...', 'House no, Road no, Area, Thana...')}
                  className="w-full bg-zinc-50 border border-zinc-300 focus:border-[#D4AF37] focus:bg-white rounded-xl p-3 text-xs sm:text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400"
                />
              </div>

              {/* Optional Order Note */}
              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1">
                  {t('অর্ডার সংক্রান্ত বিশেষ নোট (ঐচ্ছিক)', 'Order Notes (Optional)')}
                </label>
                <input
                  type="text"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder={t('যেমন: বিকেলে ডেলিভারি দিলে ভালো হয়...', 'e.g. Please deliver after 3 PM...')}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-800 outline-none focus:border-zinc-400"
                />
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-zinc-200/90 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2 border-b pb-3">
                <span className="w-6 h-6 rounded-full bg-[#111] text-[#D4AF37] flex items-center justify-center text-xs font-bold">2</span>
                <span>{t('পেমেন্ট পদ্ধতি নির্বাচন করুন', 'Payment Method')}</span>
              </h2>

              <div className="space-y-3">
                {/* Cash On Delivery */}
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
                        {t('ক্যাশ অন ডেলিভারি', 'Cash on Delivery')}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {t('জনপ্রিয়', 'Popular')}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {t(
                        'পণ্য হাতে পেয়ে দেখে ডেলিভারি ম্যানের কাছে মূল্য পরিশোধ করুন।',
                        'Pay with cash when your parcel is delivered to your doorstep.'
                      )}
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
                      <span>{t('বিকাশ সেন্ড মানি', 'bKash Send Money')}</span>
                    </span>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {t('বিকাশ নম্বর: ', 'bKash Number: ')}<span className="font-mono font-bold text-black">{settings?.bkashNumber || '01712-345678'}</span> (Personal)
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
                      <span>{t('নগদ সেন্ড মানি', 'Nagad Send Money')}</span>
                    </span>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {t('নগদ নম্বর: ', 'Nagad Number: ')}<span className="font-mono font-bold text-black">{settings?.nagadNumber || '01712-345678'}</span> (Personal)
                    </p>
                  </div>
                </label>
              </div>

              {/* bKash/Nagad Inputs when selected */}
              {paymentMethod !== 'COD' && (
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3 mt-3 animate-in fade-in duration-200">
                  <p className="text-xs text-zinc-700 font-medium">
                    {paymentMethod === 'BKASH_MANUAL'
                      ? (settings?.bkashInstructions || t('বিকাশ নম্বরে টাকা পাঠিয়ে নিচে প্রেরক নম্বর ও TrxID প্রদান করুন।', 'Send money to the bKash number and enter sender phone & TrxID below.'))
                      : (settings?.nagadInstructions || t('নগদ নম্বরে টাকা পাঠিয়ে নিচে প্রেরক নম্বর ও TrxID প্রদান করুন।', 'Send money to the Nagad number and enter sender phone & TrxID below.'))}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                        {t('প্রেরক মোবাইল নম্বর', 'Sender Mobile Number')}
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
                        {t('ট্রানজ্যাকশন আইডি (TrxID)', 'Transaction ID (TrxID)')}
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

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-zinc-50 p-5 sm:p-6 rounded-2xl border border-zinc-200/90 shadow-sm sticky top-24 space-y-5">
              <h2 className="text-base font-bold text-zinc-900 border-b pb-3 flex items-center justify-between">
                <span>{t('অর্ডারের সারসংক্ষেপ', 'Order Summary')}</span>
                <span className="text-xs text-zinc-500 font-normal">
                  {cart.length} {t('টি আইটেম', 'items')}
                </span>
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

              {/* Delivery Zone Selector inside Order Summary */}
              <div className="pt-3 border-t border-zinc-200">
                <label className="block text-xs font-bold text-zinc-900 mb-2">
                  {t('ডেলিভারি এলাকা:', 'Delivery Area:')}
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
                      <span>{t('ঢাকা সিটি', 'Inside Dhaka City')}</span>
                    </div>
                    <span>{isFreeDelivery ? t('ফ্রি', 'Free') : formatPrice(chargeInside)}</span>
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
                      <span>{t('ঢাকা সাব-এরিয়া / পার্শ্ববর্তী', 'Near Dhaka Sub-area')}</span>
                    </div>
                    <span>{isFreeDelivery ? t('ফ্রি', 'Free') : formatPrice(chargeNear)}</span>
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
                      <span>{t('ঢাকার বাইরে সারা বাংলাদেশ', 'Outside Dhaka (Nationwide)')}</span>
                    </div>
                    <span>{isFreeDelivery ? t('ফ্রি', 'Free') : formatPrice(chargeOutside)}</span>
                  </label>
                </div>
              </div>

              {/* Coupon Code Box */}
              <div className="pt-3 border-t border-zinc-200">
                <label className="block text-xs font-bold text-zinc-900 mb-1.5 flex items-center gap-1.5">
                  <Tag size={13} className="text-[#b89528]" />
                  <span>{t('কুপন কোড', 'Discount Coupon')}</span>
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
                      {t('রিমুভ', 'Remove')}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                      className="px-4 py-2 bg-black text-[#D4AF37] text-xs font-bold rounded-lg hover:bg-zinc-800 disabled:opacity-50"
                    >
                      {isApplyingCoupon ? t('যাচাই হচ্ছে...', 'Checking...') : t('প্রয়োগ করুন', 'Apply')}
                    </button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                    <CheckCircle2 size={13} /> {t(`কুপন "${appliedCoupon.code}" সফলভাবে যুক্ত হয়েছে!`, `Coupon "${appliedCoupon.code}" applied successfully!`)}
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
                  <span>{t('মোট পণ্যমূল্য', 'Subtotal')}</span>
                  <span className="font-semibold text-zinc-900">{formatPrice(cartSubtotal)}</span>
                </div>

                <div className="flex justify-between text-zinc-600">
                  <span>{t('ডেলিভারি চার্জ', 'Delivery Charge')}</span>
                  <span className="font-semibold text-zinc-900">
                    {isFreeDelivery ? (
                      <span className="text-emerald-700 font-bold">{t('ফ্রি (৳০)', 'Free (৳0)')}</span>
                    ) : (
                      formatPrice(finalDeliveryCharge)
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>{t('কুপন ডিসকাউন্ট', 'Coupon Discount')}</span>
                    <span>- {formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm sm:text-base font-extrabold text-zinc-900 pt-2 border-t border-zinc-300">
                  <span>{t('সর্বমোট প্রদেয় বিল', 'Total Payable')}</span>
                  <span className="text-[#b89528] text-lg">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Confirm Order Button with Total on the button! */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#D4AF37] hover:bg-[#b89528] text-black font-extrabold py-4 px-6 rounded-xl shadow-xl text-sm sm:text-base flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
              >
                <span>
                  {isSubmitting
                    ? t('অর্ডার প্রসেস হচ্ছে...', 'Processing Order...')
                    : (language === 'bn' ? `অর্ডার নিশ্চিত করুন (${formatPrice(grandTotal)})` : `Confirm Order (${formatPrice(grandTotal)})`)}
                </span>
                <ArrowRight size={18} />
              </button>

              <div className="text-center">
                <p className="text-[11px] text-zinc-500 flex items-center justify-center gap-1">
                  <ShieldCheck size={14} className="text-[#b89528]" />
                  <span>{t('শতভাগ নিরাপদ ও ঝামেলামুক্ত শপিং নিশ্চয়তা', '100% Safe & Hassle-free Shopping Guarantee')}</span>
                </p>
              </div>

            </div>
          </div>

        </form>
      </div>
    </StorefrontLayout>
  );
}
