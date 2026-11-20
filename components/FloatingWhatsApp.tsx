'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  whatsappNumber?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  whatsappNumber = '8801712345678'
}) => {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <a
      href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent('Hello Girlsgalary, I want to know more about your collection.')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 sm:bottom-8 right-4 z-30 flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={24} className="fill-white text-[#25D366]" />
      <span className="hidden sm:inline text-xs font-bold tracking-wide">
        WhatsApp এ কথা বলুন
      </span>
    </a>
  );
};
