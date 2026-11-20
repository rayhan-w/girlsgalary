'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, X, Layers, Sparkles } from 'lucide-react';

interface CategoryBarProps {
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  isMobileMenuOpen,
  onCloseMobileMenu
}) => {
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
      <nav className="hidden lg:block bg-[#1f1a14] border-b border-[#D4AF37]/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <ul className="flex items-center gap-1 font-medium text-xs text-zinc-200">
            <li>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 py-3 px-3 hover:text-[#D4AF37] hover:bg-black/30 rounded transition-colors"
              >
                <Layers size={14} className="text-[#D4AF37]" />
                <span className="font-semibold text-white">সব ক্যাটাগরি (All)</span>
              </Link>
            </li>

            {categories.map((cat) => (
              <li key={cat.id} className="relative group">
                <Link
                  href={`/category/${cat.slug}`}
                  className="inline-flex items-center gap-1 py-3 px-3.5 hover:text-[#D4AF37] hover:bg-black/30 rounded transition-colors"
                >
                  <span>{cat.nameBn || cat.name}</span>
                  {cat.subCategories?.length > 0 && (
                    <ChevronDown size={12} className="text-zinc-400 group-hover:rotate-180 transition-transform" />
                  )}
                </Link>

                {/* Subcategories Dropdown */}
                {cat.subCategories?.length > 0 && (
                  <div className="absolute top-full left-0 hidden group-hover:block w-52 bg-[#181818] border border-[#D4AF37]/40 shadow-xl rounded-b-lg overflow-hidden z-50">
                    <div className="py-2 divide-y divide-zinc-800">
                      {cat.subCategories.map((sub: any) => (
                        <Link
                          key={sub.id}
                          href={`/category/${cat.slug}?subcategory=${sub.slug}`}
                          className="block px-4 py-2 text-xs text-zinc-300 hover:text-[#D4AF37] hover:bg-zinc-800 transition-colors"
                        >
                          {sub.nameBn || sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] py-2">
            <Sparkles size={14} />
            <span>ঈদ কালেকশন ২০২৬</span>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-in Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobileMenu}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-sm bg-[#141414] text-white h-full shadow-2xl flex flex-col z-50 border-r border-[#D4AF37]/40">
            {/* Header */}
            <div className="p-4 bg-[#0a0a0a] border-b border-[#D4AF37]/40 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-white">
                  GIRLS<span className="text-[#D4AF37]">GALARY</span>
                </h3>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest">ক্যাটাগরি মেনু</p>
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
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/80 p-2">
              <Link
                href="/shop"
                onClick={onCloseMobileMenu}
                className="flex items-center justify-between px-3 py-3 text-sm font-semibold text-[#D4AF37] hover:bg-zinc-900 rounded"
              >
                <span>সব পণ্য দেখুন (View All)</span>
              </Link>

              {categories.map((cat) => (
                <div key={cat.id} className="py-1">
                  <Link
                    href={`/category/${cat.slug}`}
                    onClick={onCloseMobileMenu}
                    className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-zinc-200 hover:text-[#D4AF37] hover:bg-zinc-900 rounded"
                  >
                    <span>{cat.nameBn || cat.name}</span>
                    <span className="text-xs text-zinc-500">
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
                          className="block px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 rounded"
                        >
                          • {sub.nameBn || sub.name}
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
                  📦 অর্ডার ট্র্যাক করুন (Track Order)
                </Link>
                <Link
                  href="/account"
                  onClick={onCloseMobileMenu}
                  className="block py-2 text-zinc-200 font-medium hover:text-[#D4AF37]"
                >
                  👤 আমার অ্যাকাউন্ট (My Account)
                </Link>
              </div>
            </div>

            {/* Bottom info */}
            <div className="p-4 bg-[#0c0c0c] border-t border-zinc-800 text-xs text-zinc-400">
              <p className="font-semibold text-white">সহায়তা প্রয়োজন?</p>
              <p className="text-zinc-400 mt-1">হটলাইন: 01712-345678</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
