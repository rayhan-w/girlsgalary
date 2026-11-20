'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, X, ArrowRight } from 'lucide-react';
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
  const [isSearchOpenMobile, setIsSearchOpenMobile] = useState(false);
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
      setIsSearchOpenMobile(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200/90 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-22 flex items-center justify-between gap-4">
        
        {/* Left Side: Mobile Menu Button & Search Trigger */}
        <div className="flex items-center gap-3 lg:w-1/3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 -ml-1 text-zinc-800 hover:text-[#b89528] transition-colors focus:outline-none"
            aria-label="Open Category Menu"
          >
            <Menu size={24} />
          </button>

          {/* Search Bar for Desktop */}
          <div ref={searchRef} className="hidden sm:block relative w-full max-w-xs">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder={t('শাড়ি, থ্রি-পিস, কুর্তি খুঁজুন...', 'Search saree, three piece, kurti...')}
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white text-zinc-900 text-xs rounded-full pl-3.5 pr-9 py-2 outline-none transition-all placeholder:text-zinc-400"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-zinc-900 hover:bg-black text-white flex items-center justify-center transition-colors"
                aria-label="Search"
              >
                <Search size={13} />
              </button>
            </form>

            {/* Live Auto-Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white text-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden z-50">
                <div className="p-2.5 bg-zinc-50 border-b text-[11px] font-semibold text-zinc-500 flex justify-between items-center">
                  <span>{t('পণ্য সাজেশন', 'Product Suggestions')} ({suggestions.length})</span>
                  <span className="text-[10px] text-[#b89528] font-bold">{t('তাৎক্ষণিক ফলাফল', 'Instant Results')}</span>
                </div>
                <div className="divide-y divide-zinc-100 max-h-80 overflow-y-auto">
                  {suggestions.map((item) => (
                    <Link
                      key={item.id}
                      href={`/product/${item.slug}`}
                      onClick={() => setShowSuggestions(false)}
                      className="flex items-center gap-3 p-2.5 hover:bg-zinc-50 transition-colors"
                    >
                      <img
                        src={item.coverImage}
                        alt={item.name}
                        className="w-10 h-12 rounded object-cover border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-zinc-900 truncate">
                          {language === 'bn' && item.nameBn ? item.nameBn : item.name}
                        </p>
                        <span className="text-xs font-bold text-[#b89528]">
                          {formatPrice(item.offerPrice)}
                        </span>
                      </div>
                      <ArrowRight size={14} className="text-zinc-400" />
                    </Link>
                  ))}
                </div>
                <div className="p-2 bg-zinc-50 text-center border-t">
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

          {/* Mobile search icon trigger */}
          <button
            onClick={() => setIsSearchOpenMobile(!isSearchOpenMobile)}
            className="sm:hidden p-2 text-zinc-800 hover:text-[#b89528]"
            aria-label="Open Mobile Search"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Center: Signature AMIRÁ Style Centered Logo */}
        <div className="flex flex-col items-center justify-center text-center lg:w-1/3">
          <Link href="/" className="flex flex-col items-center group">
            <div className="relative h-12 sm:h-14 w-28 sm:w-36 flex-shrink-0 flex items-center justify-center">
              <img
                src="/images/logo.png"
                alt="Girlsgalary"
                className="h-full w-full object-contain filter group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-xs tracking-[0.25em] font-serif font-black text-zinc-900 uppercase -mt-0.5 group-hover:text-[#b89528] transition-colors">
              GIRLS<span className="text-[#b89528]">GALARY</span>
            </span>
          </Link>
        </div>

        {/* Right Side: Language Toggle, Wishlist, Account, Shopping Bag */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-4 lg:w-1/3">
          
          {/* Bangla / English Language Switcher */}
          <div className="inline-flex items-center bg-zinc-100 rounded-full p-0.5 border border-zinc-200">
            <button
              type="button"
              onClick={() => setLanguage('bn')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                language === 'bn'
                  ? 'bg-black text-[#D4AF37] shadow-xs'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              বাংলা
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                language === 'en'
                  ? 'bg-black text-[#D4AF37] shadow-xs'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              ENG
            </button>
          </div>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative p-2 text-zinc-700 hover:text-black transition-colors hidden sm:flex items-center justify-center"
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Account */}
          <Link
            href="/account"
            className="p-2 text-zinc-700 hover:text-black transition-colors hidden sm:flex items-center justify-center"
            aria-label="My Account"
          >
            <User size={20} />
          </Link>

          {/* Shopping Bag (Cart) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-zinc-900 hover:text-[#b89528] transition-colors flex items-center justify-center"
            aria-label="Shopping Bag"
          >
            <ShoppingBag size={21} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-[#D4AF37] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>

        </div>

      </div>

      {/* Mobile Search Input Drawer (expands when search icon tapped) */}
      {isSearchOpenMobile && (
        <div className="sm:hidden px-4 pb-3 border-t border-zinc-100 bg-white">
          <form onSubmit={handleSearchSubmit} className="relative mt-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('শাড়ি, থ্রি-পিস, কুর্তি খুঁজুন...', 'Search saree, three piece, kurti...')}
              className="w-full bg-zinc-50 border border-zinc-300 rounded-full pl-4 pr-10 py-2 text-xs outline-none focus:border-black"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black text-[#D4AF37] flex items-center justify-center"
            >
              <Search size={13} />
            </button>
          </form>
        </div>
      )}
    </header>
  );
};
