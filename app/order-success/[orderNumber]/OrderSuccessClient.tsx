'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Truck, Package, Home } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/lib/utils';
import { trackPurchase } from '@/lib/fpixel';

interface OrderSuccessClientProps {
  order: any;
  deliveryEstimate: string;
}

export default function OrderSuccessClient({
  order,
  deliveryEstimate
}: OrderSuccessClientProps) {
  const { language, t } = useLanguage();

  useEffect(() => {
    if (order && order.orderNumber) {
      trackPurchase({
        orderNumber: order.orderNumber,
        grandTotal: order.grandTotal,
        items: order.items?.map((item: any) => ({
          productId: item.productId,
          name: item.productName || item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });
    }
  }, [order]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-xl p-6 sm:p-10 text-center">
        
        {/* Animated Success Badge */}
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500 shadow-md">
          <CheckCircle size={44} className="text-emerald-600" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900">
          {t('ধন্যবাদ! আপনার অর্ডারটি গৃহীত হয়েছে', 'Thank You! Your Order has been Placed')}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 mt-2">
          {t('আপনার অর্ডার নম্বর: ', 'Your Order Number: ')}
          <span className="font-mono font-bold text-black bg-[#fbf6e6] px-2 py-0.5 rounded border border-[#D4AF37]/50">
            {order.orderNumber}
          </span>
        </p>

        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 inline-block text-left">
          {language === 'bn' ? (
            <>📱 আপনার মোবাইল নম্বর <strong>{order.customerPhone}</strong>-এ নিশ্চিতকরণ এসএমএস পাঠানো হয়েছে।</>
          ) : (
            <>📱 A confirmation SMS has been sent to <strong>{order.customerPhone}</strong>.</>
          )}
        </div>

        {/* Key Delivery & Payment Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-8 text-left">
          <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
            <span className="text-[11px] text-zinc-500 block">
              {t('প্রত্যাশিত ডেলিভারি সময়', 'Estimated Delivery Time')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-zinc-900 mt-1 block flex items-center gap-1.5">
              <Truck size={16} className="text-[#b89528]" />
              <span>{deliveryEstimate}</span>
            </span>
          </div>

          <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
            <span className="text-[11px] text-zinc-500 block">
              {t('পেমেন্ট মাধ্যম', 'Payment Method')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-zinc-900 mt-1 block">
              {order.paymentMethod === 'COD' 
                ? (language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery') 
                : order.paymentMethod}
            </span>
          </div>

          <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
            <span className="text-[11px] text-zinc-500 block">
              {t('সর্বমোট প্রদেয় বিল', 'Total Amount Payable')}
            </span>
            <span className="text-base font-extrabold text-[#b89528] mt-0.5 block">
              {formatPrice(order.grandTotal)}
            </span>
          </div>
        </div>

        {/* Items Summary */}
        <div className="text-left border border-zinc-200 rounded-xl overflow-hidden mb-8">
          <div className="bg-zinc-100 px-4 py-2.5 font-bold text-xs text-zinc-800">
            {t('অর্ডারের পণ্যসমূহ', 'Ordered Items')} ({order.items.length})
          </div>
          <div className="divide-y divide-zinc-200 p-4">
            {order.items.map((item: any) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-12 h-14 object-cover rounded border"
                  />
                  <div>
                    <p className="font-semibold text-zinc-900">{item.productName}</p>
                    <p className="text-[11px] text-zinc-500">
                      {item.size && <span>{t('সাইজ: ', 'Size: ')}{item.size} </span>}
                      {item.color && <span>• {t('কালার: ', 'Color: ')}{item.color} </span>}
                      <span>• {t('পরিমাণ: ', 'Qty: ')}{item.quantity}</span>
                    </p>
                  </div>
                </div>
                <span className="font-bold text-zinc-900">{formatPrice(item.total)}</span>
              </div>
            ))}
          </div>

          <div className="bg-zinc-50 p-4 border-t border-zinc-200 text-xs space-y-1.5">
            <div className="flex justify-between text-zinc-600">
              <span>{t('সাবটোটাল', 'Subtotal')}</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>{t('ডেলিভারি চার্জ', 'Delivery Charge')}</span>
              <span>{order.deliveryCharge === 0 ? t('ফ্রি', 'Free') : formatPrice(order.deliveryCharge)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>{t('ডিসকাউন্ট', 'Discount')}</span>
                <span>- {formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold text-zinc-900 pt-1.5 border-t">
              <span>{t('সর্বমোট', 'Total')}</span>
              <span className="text-[#b89528]">{formatPrice(order.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="text-left bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-xs mb-8">
          <span className="font-bold text-zinc-900 block mb-1">
            {t('ডেলিভারি ঠিকানা:', 'Delivery Address:')}
          </span>
          <p className="text-zinc-700 font-medium">{order.customerName}</p>
          <p className="text-zinc-600">{order.customerAddress}, {order.district}</p>
          <p className="text-zinc-600 font-mono mt-0.5">{t('মোবাইল: ', 'Mobile: ')}{order.customerPhone}</p>
          {order.orderNote && (
            <p className="text-zinc-500 mt-2 pt-2 border-t text-[11px] italic">
              {t('নোট: ', 'Note: ')}{order.orderNote}
            </p>
          )}
        </div>

        {/* Next Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/track-order?orderNumber=${order.orderNumber}&phone=${order.customerPhone}`}
            className="w-full sm:w-auto px-6 py-3 bg-black hover:bg-zinc-800 text-[#D4AF37] font-bold text-xs rounded-xl flex items-center justify-center gap-2"
          >
            <Package size={16} />
            <span>{t('অর্ডার ট্র্যাক করুন', 'Track Order')}</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-[#D4AF37] hover:bg-[#b89528] text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2"
          >
            <Home size={16} />
            <span>{t('হোমপেজে ফিরে যান', 'Back to Home')}</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
