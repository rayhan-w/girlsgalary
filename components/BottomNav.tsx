'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface BottomNavProps {
  onOpenCategories?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenCategories }) => {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#121212] border-t border-[#D4AF37]/40 shadow-2xl safe-bottom">
      <div className="grid grid-cols-5 h-14">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            isActive('/') ? 'text-[#D4AF37]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Home size={19} />
          <span className="text-[10px] font-medium leading-none">হোম</span>
        </Link>

        {/* Shop / Categories */}
        <button
          onClick={onOpenCategories}
          type="button"
          className="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-white transition-colors"
        >
          <Grid size={19} />
          <span className="text-[10px] font-medium leading-none">ক্যাটাগরি</span>
        </button>

        {/* Search */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            isActive('/shop') ? 'text-[#D4AF37]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Search size={19} />
          <span className="text-[10px] font-medium leading-none">খুঁজুন</span>
        </Link>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          type="button"
          className="relative flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-white transition-colors"
        >
          <div className="relative">
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#D4AF37] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium leading-none">ব্যাগ</span>
        </button>

        {/* Account */}
        <Link
          href="/account"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            pathname.startsWith('/account') ? 'text-[#D4AF37]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <User size={19} />
          <span className="text-[10px] font-medium leading-none">অ্যাকাউন্ট</span>
        </Link>
      </div>
    </nav>
  );
};
