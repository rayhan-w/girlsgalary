'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const FacebookIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

interface FooterProps {
  hotline?: string;
  whatsappNumber?: string;
  address?: string;
  email?: string;
  facebookUrl?: string;
  footerAbout?: string;
  copyright?: string;
}

export const Footer: React.FC<FooterProps> = ({
  hotline = '01712-345678',
  whatsappNumber = '8801712345678',
  address = 'Shop #42, Level 3, Eastern Plaza / Mirpur-10, Dhaka, Bangladesh',
  email = 'support@girlsgalary.com',
  facebookUrl = 'https://facebook.com/girlsgalary',
  copyright = '© 2026 Girlsgalary. All rights reserved.'
}) => {
  const { language, t } = useLanguage();

  const aboutText = language === 'bn'
    ? 'Girlsgalary হচ্ছে নারীদের আভিজাত্য ও আধুনিক ফ্যাশনের নির্ভরযোগ্য প্রতিষ্ঠান। প্রিমিয়াম শাড়ি, থ্রি-পিস, কুর্তি, জুয়েলারি ও কসমেটিকস এখন ঘরে বসেই ক্যাশ অন ডেলিভারিতে অর্ডার করুন।'
    : 'Girlsgalary is your premier destination for authentic ladies fashion in Bangladesh. Order handcrafted Jamdani sarees, premium three-piece sets, kurtis, cosmetics, and bridal jewellery with nationwide home delivery.';

  return (
    <footer className="bg-[#0a0a0a] text-zinc-300 border-t-2 border-[#D4AF37] pt-12 pb-24 lg:pb-12 mt-12 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Col 1: About & Original Brand Logo */}
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="h-14 w-16 relative flex-shrink-0">
              <img
                src="/images/logo.png"
                alt="Girlsgalary Logo"
                className="h-full w-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
              />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-serif font-black tracking-wider text-white leading-none">
                GIRLS<span className="text-[#D4AF37]">GALARY</span>
              </span>
              <p className="text-[10px] tracking-widest uppercase text-[#F3E5AB]/80 mt-1">
                {t('আভিজাত্য ও বিশ্বস্ততা', 'Royalty & Authenticity')}
              </p>
            </div>
          </Link>

          <p className="text-xs text-zinc-400 leading-relaxed">
            {aboutText}
          </p>

          <div className="flex items-center gap-3 pt-1">
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 shadow-md transition-opacity"
              aria-label="Facebook Page"
            >
              <FacebookIcon size={16} />
            </a>
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 shadow-md transition-opacity"
              aria-label="WhatsApp"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        {/* Col 2: Customer Care Links */}
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-3 pb-1 border-b border-zinc-800 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>{t('গ্রাহক সেবা', 'Customer Care')}</span>
          </h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li>
              <Link href="/track-order" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                <span>📦</span>
                <span>{t('অর্ডার ট্র্যাক করুন', 'Track Your Order')}</span>
              </Link>
            </li>
            <li>
              <Link href="/page/delivery-policy" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                <span>🚚</span>
                <span>{t('ডেলিভারি পলিসি ও চার্জ', 'Delivery Policy & Rates')}</span>
              </Link>
            </li>
            <li>
              <Link href="/page/return-policy" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                <span>🔄</span>
                <span>{t('এক্সচেঞ্জ ও রিটার্ন পলিসি', 'Return & Exchange Policy')}</span>
              </Link>
            </li>
            <li>
              <Link href="/page/faq" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                <span>❓</span>
                <span>{t('সাধারণ প্রশ্নোত্তর', 'Frequently Asked Questions')}</span>
              </Link>
            </li>
            <li>
              <Link href="/page/terms" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                <span>📜</span>
                <span>{t('শর্তাবলী ও নিয়মাবলি', 'Terms & Conditions')}</span>
              </Link>
            </li>
            <li>
              <Link href="/page/privacy-policy" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                <span>🔒</span>
                <span>{t('গোপনীয়তা নীতি', 'Privacy Policy')}</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Popular Categories */}
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-3 pb-1 border-b border-zinc-800 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>{t('জনপ্রিয় কালেকশন', 'Popular Collections')}</span>
          </h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li>
              <Link href="/category/saree" className="hover:text-[#D4AF37] transition-colors">
                {t('শাড়ি কালেকশন', 'Sarees (Jamdani & Silk)')}
              </Link>
            </li>
            <li>
              <Link href="/category/three-piece" className="hover:text-[#D4AF37] transition-colors">
                {t('থ্রি পিস ও লন', 'Three Piece & Lawn')}
              </Link>
            </li>
            <li>
              <Link href="/category/kurti" className="hover:text-[#D4AF37] transition-colors">
                {t('কুর্তি ও টিউনিক', 'Designer Kurtis')}
              </Link>
            </li>
            <li>
              <Link href="/category/cosmetics" className="hover:text-[#D4AF37] transition-colors">
                {t('কসমেটিকস ও মেকআপ', 'Authentic Cosmetics')}
              </Link>
            </li>
            <li>
              <Link href="/category/jewellery" className="hover:text-[#D4AF37] transition-colors">
                {t('জুয়েলারি ও কুন্দন সেট', 'Jewellery & Kundan Sets')}
              </Link>
            </li>
            <li>
              <Link href="/category/hijab" className="hover:text-[#D4AF37] transition-colors">
                {t('হিজাব ও খিমার', 'Hijabs & Khimars')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Payment Methods */}
        <div className="space-y-3">
          <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-3 pb-1 border-b border-zinc-800 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>{t('যোগাযোগ ও পেমেন্ট', 'Contact & Payments')}</span>
          </h4>
          <div className="space-y-2.5 text-xs text-zinc-400">
            <p className="flex items-start gap-2">
              <MapPin size={14} className="text-[#D4AF37] mt-0.5 flex-shrink-0" />
              <span>{address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone size={14} className="text-[#D4AF37] flex-shrink-0" />
              <a href={`tel:${hotline}`} className="hover:text-white font-mono">{hotline}</a>
            </p>
            <p className="flex items-center gap-2">
              <Mail size={14} className="text-[#D4AF37] flex-shrink-0" />
              <span>{email}</span>
            </p>
          </div>

          {/* Payment Marks (COD, bKash, Nagad) */}
          <div className="pt-2">
            <span className="text-[11px] text-zinc-400 block mb-1.5 font-medium">
              {t('গ্রহণযোগ্য পেমেন্ট মাধ্যম:', 'Accepted Payment Methods:')}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-[#181818] px-2.5 py-1 rounded border border-[#D4AF37]/40 text-[11px] font-bold text-[#F3E5AB] flex items-center gap-1 shadow-sm">
                <ShieldCheck size={12} className="text-[#D4AF37]" />
                <span>Cash On Delivery</span>
              </div>
              <div className="bg-[#E2136E] text-white px-2 py-0.5 rounded text-[11px] font-extrabold tracking-tight shadow-sm">
                bKash
              </div>
              <div className="bg-[#F7941D] text-white px-2 py-0.5 rounded text-[11px] font-extrabold tracking-tight shadow-sm">
                Nagad
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar & Copyright */}
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
        <p>{copyright}</p>
        <div className="flex items-center gap-4">
          <Link href="/admin/login" className="hover:text-[#D4AF37] transition-colors">
            Staff Portal
          </Link>
          <span>•</span>
          <Link href="/page/about-us" className="hover:text-white">
            {t('আমাদের সম্পর্কে', 'About Us')}
          </Link>
        </div>
      </div>
    </footer>
  );
};
