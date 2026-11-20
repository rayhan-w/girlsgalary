'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/lib/utils';

interface CartDrawerProps {
  freeDeliveryThreshold?: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ freeDeliveryThreshold = 2000 }) => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity
  } = useCart();
  const { language, t } = useLanguage();

  if (!isCartOpen) return null;

  const diffForFree = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white text-zinc-900 h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 bg-[#141414] text-white flex items-center justify-between border-b border-[#D4AF37]/50">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#D4AF37]" />
            <h2 className="font-semibold text-base">
              {t('আপনার শপিং ব্যাগ', 'Your Shopping Bag')} ({cartCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
            aria-label="Close Cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-amber-50 p-3 border-b border-amber-200">
          {diffForFree > 0 ? (
            <div>
              <p className="text-xs text-amber-900 font-medium">
                {language === 'bn' ? (
                  <>
                    আর মাত্র <span className="font-bold text-amber-700">{formatPrice(diffForFree)}</span> টাকার পণ্য যোগ করলেই পাচ্ছেন <span className="font-bold text-emerald-700">ফ্রি ডেলিভারি</span>!
                  </>
                ) : (
                  <>
                    Add <span className="font-bold text-amber-700">{formatPrice(diffForFree)}</span> more for <span className="font-bold text-emerald-700">Free Nationwide Delivery</span>!
                  </>
                )}
              </p>
              <div className="w-full bg-amber-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-[#D4AF37] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
              {t('🎉 অভিনন্দন! আপনি সারা দেশে ফ্রি ডেলিভারি পাচ্ছেন!', '🎉 Congratulations! You have unlocked Free Delivery!')}
            </p>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-zinc-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
              <ShoppingBag size={48} className="text-zinc-300 mb-3" />
              <p className="text-base font-semibold text-zinc-800">
                {t('আপনার ব্যাগ খালি', 'Your bag is empty')}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {t(
                  'আপনার পছন্দের শাড়ি, থ্রি-পিস বা কুর্তি ব্যাগে যুক্ত করুন',
                  'Add your favorite saree, three piece or kurti to start shopping'
                )}
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-5 px-5 py-2.5 bg-[#D4AF37] text-black font-semibold rounded-lg text-xs hover:bg-[#b89528] transition-colors"
              >
                {t('শপিং শুরু করুন', 'Start Shopping')}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="py-3.5 flex gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-20 object-cover rounded-md border border-zinc-200 flex-shrink-0"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-semibold text-zinc-800 line-clamp-1">{item.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.productId, item.variantId)}
                        className="text-zinc-400 hover:text-rose-600 p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {(item.size || item.color) && (
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500">
                        {item.size && (
                          <span className="bg-zinc-100 px-1.5 py-0.5 rounded">
                            {t('সাইজ: ', 'Size: ')}{item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="bg-zinc-100 px-1.5 py-0.5 rounded">
                            {t('কালার: ', 'Color: ')}{item.color}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-zinc-300 rounded overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                        className="p-1 hover:bg-zinc-100 text-zinc-600"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2.5 text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                        className="p-1 hover:bg-zinc-100 text-zinc-600"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-zinc-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout Button */}
        {cart.length > 0 && (
          <div className="p-4 bg-zinc-50 border-t border-zinc-200">
            <div className="flex items-center justify-between text-sm text-zinc-600 mb-1">
              <span>{t('মোট মূল্য', 'Subtotal')}</span>
              <span className="text-base font-bold text-zinc-900">{formatPrice(cartSubtotal)}</span>
            </div>
            <p className="text-[11px] text-zinc-500 mb-3">
              {t('ডেলিভারি চার্জ চেকআউট পেইজে হিসাব করা হবে', 'Delivery charge will be calculated at checkout')}
            </p>

            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#b89528] text-black font-bold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-98"
            >
              <span>{t('অর্ডার করতে এগিয়ে যান', 'Proceed to Checkout')}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
