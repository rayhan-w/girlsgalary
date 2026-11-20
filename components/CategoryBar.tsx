'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, X, Layers, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface CategoryBarProps {
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  isMobileMenuOpen,
  onCloseMobileMenu
}) => {
  const { language, t } = useLanguage();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch((err) => console.error('Error fetching categories in bar', err));
  }, []);

  return (
    <>
      {/* Desktop Gold Category Bar */}
      <nav className="hidden lg:block bg-[#16120e] border-b border-[#D4AF37]/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <ul className="flex items-center gap-1 font-medium text-xs text-zinc-200">
            <li>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 py-3 px-3.5 hover:text-[#D4AF37] hover:bg-black/40 rounded transition-colors"
              >
                <Layers size={14} className="text-[#D4AF37]" />
                <span className="font-bold text-white tracking-wide">
                  {t('সকল ক্যাটাগরি', 'All Categories')}
                </span>
              </Link>
            </li>

            {categories.map((cat) => (
              <li key={cat.id} className="relative group">
                <Link
                  href={`/category/${cat.slug}`}
                  className="inline-flex items-center gap-1 py-3 px-3 hover:text-[#D4AF37] hover:bg-black/40 rounded transition-colors"
                >
                  <span className="font-medium">
                    {language === 'bn' && cat.nameBn ? cat.nameBn : cat.name}
                  </span>
                  {cat.subCategories?.length > 0 && (
                    <ChevronDown size={11} className="text-zinc-400 group-hover:rotate-180 transition-transform" />
                  )}
                </Link>

                {/* Subcategories Dropdown */}
                {cat.subCategories?.length > 0 && (
                  <div className="absolute top-full left-0 hidden group-hover:block w-56 bg-[#161616] border border-[#D4AF37]/50 shadow-2xl rounded-b-xl overflow-hidden z-50">
                    <div className="py-2 divide-y divide-zinc-800">
                      {cat.subCategories.map((sub: any) => (
                        <Link
                          key={sub.id}
                          href={`/category/${cat.slug}?subcategory=${sub.slug}`}
                          className="block px-4 py-2.5 text-xs text-zinc-300 hover:text-[#D4AF37] hover:bg-zinc-900 transition-colors"
                        >
                          {language === 'bn' && sub.nameBn ? sub.nameBn : sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] py-2">
            <Sparkles size={13} className="text-[#F3E5AB]" />
            <span className="tracking-wide">{t('এক্সক্লুসিভ কালেকশন ২০২৬', 'Royal Collection 2026')}</span>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-in Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobileMenu}
          />

          <div className="relative w-4/5 max-w-sm bg-[#121212] text-white h-full shadow-2xl flex flex-col z-50 border-r border-[#D4AF37]/50">
            {/* Header */}
            <div className="p-4 bg-[#0a0a0a] border-b border-[#D4AF37]/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/images/logo.png" alt="Logo" className="w-9 h-9 object-contain" />
                <div>
                  <h3 className="font-serif font-black text-base text-white">
                    GIRLS<span className="text-[#D4AF37]">GALARY</span>
                  </h3>
                  <p className="text-[9px] text-[#F3E5AB] uppercase tracking-widest">
                    {t('ক্যাটাগরি মেনু', 'Categories')}
                  </p>
                </div>
              </div>
              <button
                onClick={onCloseMobileMenu}
                className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800"
                aria-label="Close Menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Category list */}
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/80 p-2 text-xs">
              <Link
                href="/shop"
                onClick={onCloseMobileMenu}
                className="flex items-center justify-between px-3 py-3 text-sm font-bold text-[#D4AF37] hover:bg-zinc-900 rounded"
              >
                <span>{t('সকল পণ্য দেখুন', 'View All Collection')}</span>
              </Link>

              {categories.map((cat) => (
                <div key={cat.id} className="py-1">
                  <Link
                    href={`/category/${cat.slug}`}
                    onClick={onCloseMobileMenu}
                    className="flex items-center justify-between px-3 py-2 text-zinc-200 hover:text-[#D4AF37] hover:bg-zinc-900 rounded font-medium"
                  >
                    <span>{language === 'bn' && cat.nameBn ? cat.nameBn : cat.name}</span>
                    <span className="text-[10px] text-zinc-500">
                      {cat._count?.products ? `(${cat._count.products})` : ''}
                    </span>
                  </Link>

                  {cat.subCategories?.length > 0 && (
                    <div className="pl-4 pr-2 pb-1 space-y-1">
                      {cat.subCategories.map((sub: any) => (
                        <Link
                          key={sub.id}
                          href={`/category/${cat.slug}?subcategory=${sub.slug}`}
                          onClick={onCloseMobileMenu}
                          className="block px-3 py-1 text-[11px] text-zinc-400 hover:text-[#D4AF37] rounded"
                        >
                          • {language === 'bn' && sub.nameBn ? sub.nameBn : sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 px-3 space-y-2 text-xs text-zinc-400">
                <Link
                  href="/track-order"
                  onClick={onCloseMobileMenu}
                  className="block py-2 text-zinc-200 font-medium hover:text-[#D4AF37]"
                >
                  📦 {t('অর্ডার ট্র্যাক করুন', 'Track Order')}
                </Link>
                <Link
                  href="/account"
                  onClick={onCloseMobileMenu}
                  className="block py-2 text-zinc-200 font-medium hover:text-[#D4AF37]"
                >
                  👤 {t('আমার অ্যাকাউন্ট', 'My Account')}
                </Link>
              </div>
            </div>

            <div className="p-4 bg-[#080808] border-t border-zinc-800 text-xs text-zinc-400">
              <p className="font-bold text-white">{t('সহায়তা প্রয়োজন?', 'Need Assistance?')}</p>
              <p className="text-zinc-400 mt-0.5">01712-345678</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
