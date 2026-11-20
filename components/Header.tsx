'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, X, ArrowRight, Globe } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/lib/utils';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const router = useRouter();
  const { cartCount, setIsCartOpen, wishlist } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Live auto-suggestions debounced
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.products || []);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0d0d0d] border-b-2 border-[#D4AF37] shadow-[0_4px_25px_rgba(0,0,0,0.6)] transition-all">
      <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Left: Mobile Menu Button & Original Girlsgalary Logo */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 text-zinc-300 hover:text-[#D4AF37] transition-colors focus:outline-none"
            aria-label="Open Category Menu"
          >
            <Menu size={24} />
          </button>

          {/* Original Official Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-11 sm:h-14 w-14 sm:w-16 flex-shrink-0">
              <img
                src="/images/logo.png"
                alt="Girlsgalary Logo"
                className="h-full w-full object-contain filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl sm:text-2xl font-serif font-black tracking-wider text-white group-hover:text-[#D4AF37] transition-colors leading-none">
                GIRLS<span className="text-[#D4AF37]">GALARY</span>
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#F3E5AB]/80 font-sans font-medium mt-1">
                {t('আভিজাত্য ও ফ্যাশনের ঠিকানা', 'Premium Ladies Wear')}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Live Search Box */}
        <div ref={searchRef} className="flex-1 max-w-lg hidden sm:block relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder={t('শাড়ি, থ্রি-পিস, কুর্তি, কসমেটিকস খুঁজুন...', 'Search Saree, Three Piece, Kurti, Cosmetics...')}
              className="w-full bg-[#181818] border border-zinc-700/80 focus:border-[#D4AF37] text-white text-xs sm:text-sm rounded-full pl-4 pr-11 py-2 sm:py-2.5 outline-none transition-all placeholder:text-zinc-500 shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B89528] hover:brightness-110 text-black flex items-center justify-center transition-all shadow"
              aria-label="Search"
            >
              <Search size={15} />
            </button>
          </form>

          {/* Live Auto-Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white text-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden z-50">
              <div className="p-2.5 bg-zinc-50 border-b text-xs font-semibold text-zinc-500 flex justify-between items-center">
                <span>{t('পণ্য সাজেশন', 'Product Suggestions')} ({suggestions.length})</span>
                <span className="text-[11px] text-[#b89528] font-bold">{t('তাৎক্ষণিক ফলাফল', 'Instant Results')}</span>
              </div>
              <div className="divide-y divide-zinc-100 max-h-80 overflow-y-auto">
                {suggestions.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.slug}`}
                    onClick={() => setShowSuggestions(false)}
                    className="flex items-center gap-3 p-3 hover:bg-zinc-50 transition-colors"
                  >
                    <img
                      src={item.coverImage}
                      alt={item.name}
                      className="w-12 h-14 rounded-md object-cover border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-zinc-900 truncate">
                        {language === 'bn' && item.nameBn ? item.nameBn : item.name}
                      </p>
                      <p className="text-[11px] text-zinc-500">{item.category?.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs sm:text-sm font-bold text-[#b89528]">
                          {formatPrice(item.offerPrice)}
                        </span>
                        {item.regularPrice > item.offerPrice && (
                          <span className="text-xs text-zinc-400 line-through">
                            {formatPrice(item.regularPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight size={15} className="text-zinc-400" />
                  </Link>
                ))}
              </div>
              <div className="p-2.5 bg-zinc-100 text-center border-t">
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="text-xs font-bold text-[#b89528] hover:underline"
                >
                  {t(`সব ফলাফল দেখুন "${searchQuery}" →`, `View all results for "${searchQuery}" →`)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Language switch + Actions (Wishlist, Account, Cart) */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Mobile search trigger */}
          <Link
            href="/shop"
            className="sm:hidden p-2 text-zinc-300 hover:text-[#D4AF37]"
            aria-label="Search Shop"
          >
            <Search size={20} />
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative p-2 text-zinc-300 hover:text-[#D4AF37] transition-colors"
            aria-label="Wishlist"
          >
            <Heart size={21} />
            {wishlist.length > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Account */}
          <Link
            href="/account"
            className="p-2 text-zinc-300 hover:text-[#D4AF37] transition-colors"
            aria-label="Customer Account"
          >
            <User size={21} />
          </Link>

          {/* Cart Icon with Live Item Count */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B89528] hover:brightness-110 text-black px-3.5 py-2 rounded-full font-medium transition-all shadow-[0_2px_12px_rgba(212,175,55,0.35)] active:scale-95"
            aria-label="View Cart"
          >
            <ShoppingBag size={18} />
            <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">
              {t('ব্যাগ', 'Bag')}
            </span>
            <span className="bg-black text-[#D4AF37] text-xs font-black px-2 py-0.5 rounded-full min-w-[20px] text-center border border-[#D4AF37]/50">
              {cartCount}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
