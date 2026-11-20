'use client';

import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface TopBarProps {
  hotline?: string;
  whatsappNumber?: string;
  topBarOffer?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  hotline = '01712-345678',
  whatsappNumber = '8801712345678',
  topBarOffer = '🎉 সারা বাংলাদেশে ফ্রি হোম ডেলিভারি ২,০০০ টাকার বেশি অর্ডারে!'
}) => {
  const { language, setLanguage, t } = useLanguage();

  const offerText = language === 'bn' 
    ? '🎉 সারা বাংলাদেশে ফ্রি হোম ডেলিভারি ২,০০০ টাকার বেশি অর্ডারে!' 
    : '🎉 Free nationwide home delivery on orders over ৳2,000!';

  return (
    <div className="bg-[#080808] text-zinc-300 text-xs py-2 px-4 border-b border-[#D4AF37]/30 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        
        {/* Offer announcement */}
        <div className="font-medium text-[#F3E5AB] tracking-wide flex items-center justify-center gap-2">
          <span>{offerText}</span>
        </div>

        {/* Right side: Hotline, WhatsApp, and Language Switcher */}
        <div className="flex items-center gap-3 sm:gap-4 text-zinc-300 text-[11px] sm:text-xs">
          <a
            href={`tel:${hotline}`}
            className="flex items-center gap-1 hover:text-[#D4AF37] transition-colors"
          >
            <Phone size={12} className="text-[#D4AF37]" />
            <span>{t(`হটলাইন: ${hotline}`, `Hotline: ${hotline}`)}</span>
          </a>

          <span className="text-zinc-700">|</span>

          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-[#25D366] transition-colors"
          >
            <MessageCircle size={12} className="text-[#25D366]" />
            <span>WhatsApp</span>
          </a>

          <span className="text-zinc-700">|</span>

          {/* Bangla / English Language Toggle Button */}
          <div className="inline-flex items-center gap-1 bg-[#161616] border border-[#D4AF37]/50 rounded-full p-0.5">
            <button
              type="button"
              onClick={() => setLanguage('bn')}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                language === 'bn'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B89528] text-black shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              বাংলা
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                language === 'en'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B89528] text-black shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ENGLISH
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
