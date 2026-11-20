'use client';

import React from 'react';
import { ShieldCheck, Truck, RefreshCw } from 'lucide-react';

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
  return (
    <section className="bg-zinc-50 border-y border-zinc-200 py-6 my-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-3">
            <div className="w-12 h-12 rounded-full bg-[#fbf6e6] border border-[#D4AF37]/40 flex items-center justify-center text-[#b89528] flex-shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-bold text-zinc-900">ক্যাশ অন ডেলিভারি</h4>
              <p className="text-xs text-zinc-600 mt-0.5">{codText}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-3">
            <div className="w-12 h-12 rounded-full bg-[#fbf6e6] border border-[#D4AF37]/40 flex items-center justify-center text-[#b89528] flex-shrink-0">
              <Truck size={24} />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-bold text-zinc-900">দেশব্যাপী হোম ডেলিভারি</h4>
              <p className="text-xs text-zinc-600 mt-0.5">{deliveryText}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-3">
            <div className="w-12 h-12 rounded-full bg-[#fbf6e6] border border-[#D4AF37]/40 flex items-center justify-center text-[#b89528] flex-shrink-0">
              <RefreshCw size={24} />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-bold text-zinc-900">সহজ এক্সচেঞ্জ পলিসি</h4>
              <p className="text-xs text-zinc-600 mt-0.5">{exchangeText}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
