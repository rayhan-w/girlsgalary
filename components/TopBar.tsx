'use client';

import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

interface TopBarProps {
  hotline?: string;
  whatsappNumber?: string;
  topBarOffer?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  hotline = '01712-345678',
  whatsappNumber = '8801712345678',
  topBarOffer = '🎉 ফ্রি ডেলিভারি সারা বাংলাদেশে ২,০০০ টাকার বেশি অর্ডারে!'
}) => {
  return (
    <div className="bg-[#0a0a0a] text-zinc-300 text-xs py-2 px-4 border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
        <div className="font-medium text-[#f3e5ab] tracking-wide flex items-center justify-center gap-2">
          <span>{topBarOffer}</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-300">
          <a
            href={`tel:${hotline}`}
            className="flex items-center gap-1 hover:text-[#D4AF37] transition-colors"
          >
            <Phone size={13} className="text-[#D4AF37]" />
            <span>হটলাইন: {hotline}</span>
          </a>
          <span className="text-zinc-600">|</span>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-[#25D366] transition-colors"
          >
            <MessageCircle size={13} className="text-[#25D366]" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
