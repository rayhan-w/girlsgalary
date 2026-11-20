'use client';

import React from 'react';
import { ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface TrustStripProps {
  codText?: string;
  deliveryText?: string;
  exchangeText?: string;
}

export const TrustStrip: React.FC<TrustStripProps> = ({
  codText = 'ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে মূল্য দিন)',
  deliveryText = 'সারা বাংলাদেশে দ্রুত হোম ডেলিভারি',
  exchangeText = 'সহজ ৩ দিনের এক্সচেঞ্জ সুবিধা'
}) => {
  const { t } = useLanguage();

  return (
    <section className="bg-gradient-to-r from-zinc-50 via-[#fdfbf6] to-zinc-50 border-y border-[#D4AF37]/30 py-8 my-10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 p-3 rounded-2xl bg-white/70 border border-[#D4AF37]/20 shadow-xs">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#fbf6e6] to-[#f3e5ab] border border-[#D4AF37]/60 flex items-center justify-center text-[#937016] flex-shrink-0 shadow-sm p-3">
              <ShieldCheck size={26} />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900">
                {t('ক্যাশ অন ডেলিভারি', 'Cash on Delivery')}
              </h4>
              <p className="text-[11px] sm:text-xs text-zinc-600 mt-0.5 font-medium">
                {t(codText, 'Pay with cash upon nationwide door-to-door delivery')}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 p-3 rounded-2xl bg-white/70 border border-[#D4AF37]/20 shadow-xs">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#fbf6e6] to-[#f3e5ab] border border-[#D4AF37]/60 flex items-center justify-center text-[#937016] flex-shrink-0 shadow-sm p-3">
              <Truck size={26} />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900">
                {t('দেশব্যাপী হোম ডেলিভারি', 'Nationwide Home Delivery')}
              </h4>
              <p className="text-[11px] sm:text-xs text-zinc-600 mt-0.5 font-medium">
                {t(deliveryText, 'Fast and safe home delivery all over 64 districts')}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 p-3 rounded-2xl bg-white/70 border border-[#D4AF37]/20 shadow-xs">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#fbf6e6] to-[#f3e5ab] border border-[#D4AF37]/60 flex items-center justify-center text-[#937016] flex-shrink-0 shadow-sm p-3">
              <RefreshCw size={26} />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-xs sm:text-sm font-bold text-zinc-900">
                {t('সহজ এক্সচেঞ্জ পলিসি', 'Easy 3-Day Exchange')}
              </h4>
              <p className="text-[11px] sm:text-xs text-zinc-600 mt-0.5 font-medium">
                {t(exchangeText, 'Hassle-free size and color exchange guarantee')}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
