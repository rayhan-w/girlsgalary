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
  codText = 'সারা বাংলাদেশে পণ্য হাতে পেয়ে মূল্য পরিশোধ',
  deliveryText = '৬৪ জেলায় দ্রুত ও নিরাপদ হোম ডেলিভারি',
  exchangeText = 'নিশ্চিত ৩ দিনের সহজ এক্সচেঞ্জ সুবিধা'
}) => {
  const { t } = useLanguage();

  return (
    <section className="bg-white border-y border-zinc-200 py-10 my-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-zinc-200">
          
          <div className="flex flex-col items-center justify-center p-2 pt-4 md:pt-2">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 mb-3 shadow-2xs">
              <ShieldCheck size={22} />
            </div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-900">
              {t('ক্যাশ অন ডেলিভারি', 'Cash on Delivery')}
            </h4>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs font-medium">
              {t(codText, 'Pay with cash upon nationwide doorstep delivery')}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-2 pt-6 md:pt-2">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 mb-3 shadow-2xs">
              <Truck size={22} />
            </div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-900">
              {t('সারাদেশে হোম ডেলিভারি', 'Nationwide Delivery')}
            </h4>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs font-medium">
              {t(deliveryText, 'Fast home delivery across all 64 districts in Bangladesh')}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-2 pt-6 md:pt-2">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 mb-3 shadow-2xs">
              <RefreshCw size={22} />
            </div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-900">
              {t('সহজ ৩ দিনের এক্সচেঞ্জ', '3-Day Easy Exchange')}
            </h4>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs font-medium">
              {t(exchangeText, 'Hassle-free size and product exchange guarantee')}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
