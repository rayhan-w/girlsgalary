'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, X, Sparkles } from 'lucide-react';
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
      {/* Desktop AMIRÁ Style Clean Category Navigation Bar */}
      <nav className="hidden lg:block bg-white/95 backdrop-blur-sm border-b border-zinc-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center">
          <ul className="flex items-center gap-6 sm:gap-8 font-semibold text-[11px] sm:text-xs text-zinc-800 uppercase tracking-[0.14em]">
            <li>
              <Link
                href="/shop?sort=newest"
                className="inline-block py-3 hover:text-[#b89528] transition-colors relative group"
              >
                <span className="text-[#b89528] font-bold">
                  {t('নতুন কালেকশন', 'NEW IN')}
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#b89528] group-hover:w-full transition-all duration-300" />
              </Link>
            </li>

            {categories.map((cat) => (
              <li key={cat.id} className="relative group">
                <Link
                  href={`/category/${cat.slug}`}
                  className="inline-flex items-center gap-1 py-3 hover:text-[#b89528] transition-colors"
                >
                  <span>
                    {language === 'bn' && cat.nameBn ? cat.nameBn : cat.name}
                  </span>
                  {cat.subCategories?.length > 0 && (
                    <ChevronDown size={11} className="text-zinc-400 group-hover:rotate-180 transition-transform" />
                  )}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#b89528] group-hover:w-full transition-all duration-300" />
                </Link>

                {/* Subcategories Dropdown */}
                {cat.subCategories?.length > 0 && (
                  <div className="absolute top-full left-0 hidden group-hover:block w-56 bg-white border border-zinc-200 shadow-xl rounded-b-xl overflow-hidden z-50">
                    <div className="py-2 divide-y divide-zinc-100">
                      {cat.subCategories.map((sub: any) => (
                        <Link
                          key={sub.id}
                          href={`/category/${cat.slug}?subcategory=${sub.slug}`}
                          className="block px-4 py-2.5 text-xs text-zinc-700 hover:text-[#b89528] hover:bg-zinc-50 transition-colors normal-case font-medium"
                        >
                          {language === 'bn' && sub.nameBn ? sub.nameBn : sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}

            <li>
              <Link
                href="/shop"
                className="inline-block py-3 text-rose-600 hover:text-rose-700 transition-colors font-bold relative group"
              >
                <span>{t('অফার', 'OFFERS')}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-600 group-hover:w-full transition-all duration-300" />
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Slide-in Drawer Menu (AMIRÁ Clean Luxury Style) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobileMenu}
          />

          <div className="relative w-4/5 max-w-sm bg-white text-zinc-900 h-full shadow-2xl flex flex-col z-50 border-r border-zinc-200 animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/images/logo.png" alt="Logo" className="w-9 h-9 object-contain" />
                <div>
                  <h3 className="font-serif font-black text-sm text-zinc-900 uppercase tracking-wider">
                    GIRLS<span className="text-[#b89528]">GALARY</span>
                  </h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                    {t('ক্যাটাগরি মেনু', 'Categories')}
                  </p>
                </div>
              </div>
              <button
                onClick={onCloseMobileMenu}
                className="p-1.5 text-zinc-400 hover:text-black rounded-full hover:bg-zinc-200"
                aria-label="Close Menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Category list */}
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 p-3 text-xs">
              <Link
                href="/shop?sort=newest"
                onClick={onCloseMobileMenu}
                className="flex items-center justify-between px-3 py-3 text-sm font-bold text-[#b89528] hover:bg-zinc-50 rounded"
              >
                <span>✨ {t('নতুন কালেকশন', 'New Arrivals')}</span>
              </Link>

              {categories.map((cat) => (
                <div key={cat.id} className="py-1">
                  <Link
                    href={`/category/${cat.slug}`}
                    onClick={onCloseMobileMenu}
                    className="flex items-center justify-between px-3 py-2.5 text-zinc-800 hover:text-[#b89528] hover:bg-zinc-50 rounded font-semibold"
                  >
                    <span>{language === 'bn' && cat.nameBn ? cat.nameBn : cat.name}</span>
                    <span className="text-[10px] text-zinc-400">
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
                          className="block px-3 py-1.5 text-[11px] text-zinc-600 hover:text-[#b89528] rounded font-medium"
                        >
                          • {language === 'bn' && sub.nameBn ? sub.nameBn : sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link
                href="/shop"
                onClick={onCloseMobileMenu}
                className="flex items-center justify-between px-3 py-3 text-sm font-bold text-rose-600 hover:bg-zinc-50 rounded"
              >
                <span>🔥 {t('সকল অফার', 'Special Offers')}</span>
              </Link>

              <div className="pt-4 px-3 space-y-2 text-xs text-zinc-500">
                <Link
                  href="/track-order"
                  onClick={onCloseMobileMenu}
                  className="block py-2 text-zinc-700 font-medium hover:text-black"
                >
                  📦 {t('অর্ডার ট্র্যাক করুন', 'Track Order')}
                </Link>
                <Link
                  href="/wishlist"
                  onClick={onCloseMobileMenu}
                  className="block py-2 text-zinc-700 font-medium hover:text-black"
                >
                  ❤️ {t('পছন্দের তালিকা', 'My Wishlist')}
                </Link>
                <Link
                  href="/account"
                  onClick={onCloseMobileMenu}
                  className="block py-2 text-zinc-700 font-medium hover:text-black"
                >
                  👤 {t('আমার অ্যাকাউন্ট', 'My Account')}
                </Link>
              </div>
            </div>

            <div className="p-4 bg-zinc-50 border-t border-zinc-200 text-xs text-zinc-500">
              <p className="font-bold text-zinc-900">{t('সহায়তা প্রয়োজন?', 'Need Assistance?')}</p>
              <p className="text-zinc-600 mt-0.5">Hotline: 01712-345678</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
