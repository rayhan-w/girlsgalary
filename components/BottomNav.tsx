'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

interface BottomNavProps {
  onOpenCategories?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenCategories }) => {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();
  const { t } = useLanguage();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] safe-bottom">
      <div className="grid grid-cols-5 h-14">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            isActive('/') ? 'text-black' : 'text-zinc-400 hover:text-black'
          }`}
        >
          <Home size={18} className={isActive('/') ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] font-semibold leading-none">{t('হোম', 'Home')}</span>
        </Link>

        {/* Categories Drawer */}
        <button
          onClick={onOpenCategories}
          type="button"
          className="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-black transition-colors"
        >
          <Grid size={18} />
          <span className="text-[10px] font-semibold leading-none">{t('ক্যাটাগরি', 'Shop')}</span>
        </button>

        {/* Search */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            isActive('/shop') ? 'text-black' : 'text-zinc-400 hover:text-black'
          }`}
        >
          <Search size={18} className={isActive('/shop') ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] font-semibold leading-none">{t('খুঁজুন', 'Search')}</span>
        </Link>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          type="button"
          className="relative flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-black transition-colors"
        >
          <div className="relative">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-black text-[#D4AF37] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold leading-none">{t('ব্যাগ', 'Bag')}</span>
        </button>

        {/* Account */}
        <Link
          href="/account"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            pathname.startsWith('/account') ? 'text-black' : 'text-zinc-400 hover:text-black'
          }`}
        >
          <User size={18} className={pathname.startsWith('/account') ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] font-semibold leading-none">{t('প্রোফাইল', 'Account')}</span>
        </Link>
      </div>
    </nav>
  );
};
