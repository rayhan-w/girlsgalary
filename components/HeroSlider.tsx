'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface BannerItem {
  id: string;
  title: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl: string;
  buttonText: string;
  buttonTextEn?: string;
}

export const HeroSlider: React.FC = () => {
  const { language } = useLanguage();
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const defaultBanners: BannerItem[] = [
      {
        id: '1',
        title: 'এক্সক্লুসিভ জামদানি ও সিল্ক কালেকশন',
        titleEn: 'Exclusive Jamdani & Pure Silk Collection',
        subtitle: 'ঐতিহ্যবাহী ঢাকাই জামদানি, মসলিন ও ডিজাইনার কাঞ্জিভরম শাড়ি',
        subtitleEn: 'Handcrafted Dhakai Jamdani, Premium Muslin & Bridal Sarees',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
        mobileImageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        linkUrl: '/category/saree',
        buttonText: 'কালেকশন দেখুন',
        buttonTextEn: 'Explore Sarees'
      },
      {
        id: '2',
        title: 'নিউ অ্যারাইভাল থ্রি পিস ও কুর্তি',
        titleEn: 'New Arrival Three Piece & Kurti',
        subtitle: 'আরামদায়ক পিওর সুতি, সুইস লন ও গর্জিয়াস এমব্রয়ডারি থ্রি-পিস',
        subtitleEn: 'Breathable Swiss Lawn, Premium Cotton & Festive Suits',
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
        mobileImageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        linkUrl: '/category/three-piece',
        buttonText: 'অর্ডার করুন এখনই',
        buttonTextEn: 'Shop Three Piece'
      },
      {
        id: '3',
        title: 'শতভাগ অথেনটিক কসমেটিকস ও ব্রাইডাল জুয়েলারি',
        titleEn: '100% Authentic Cosmetics & Bridal Jewellery',
        subtitle: 'সেরা আন্তর্জাতিক ব্র্যান্ডের মেকআপ, স্কিন কেয়ার ও কুন্দন সেট',
        subtitleEn: 'Authentic Branded Makeup, Skincare & Luxury Kundan Sets',
        imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80',
        mobileImageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
        linkUrl: '/category/cosmetics',
        buttonText: 'শপ করুন',
        buttonTextEn: 'Shop Cosmetics'
      }
    ];

    setBanners(defaultBanners);
  }, []);

  // Autoplay every 5 seconds (pauses on hover)
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length, isPaused]);

  if (!banners.length) return null;

  const current = banners[currentIndex];
  const title = language === 'bn' ? current.title : (current.titleEn || current.title);
  const subtitle = language === 'bn' ? current.subtitle : (current.subtitleEn || current.subtitle);
  const buttonText = language === 'bn' ? current.buttonText : (current.buttonTextEn || current.buttonText);

  return (
    <section 
      className="relative w-full overflow-hidden bg-[#0a0a0a] border-b border-[#D4AF37]/30 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Responsive Banner Stage */}
      <div className="relative w-full max-w-7xl mx-auto h-[290px] sm:h-[380px] md:h-[450px] lg:h-[480px] flex items-center justify-center overflow-hidden px-2 sm:px-6 py-2">
        
        {/* Ambient Blurred Background Glow (softly fills borders matching photo colors) */}
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-25 scale-110 pointer-events-none transition-all duration-1000"
          style={{ backgroundImage: `url(${current.imageUrl})` }}
        />

        {/* Clickable Full Banner Layer */}
        <Link 
          href={current.linkUrl}
          className="relative w-full h-full flex items-center justify-center group"
          title={title}
        >
          {/* Main Foreground Image: object-contain ensures the FULL picture is 100% visible with ZERO cropping */}
          <div className="relative w-full h-full flex items-center justify-center sm:justify-end">
            <img
              src={current.imageUrl}
              alt={current.title}
              className="max-h-full max-w-full w-auto h-auto object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)] transition-all duration-700 ease-out group-hover:scale-[1.01]"
            />
          </div>

          {/* Desktop/Tablet Floating Royal Card (positioned neatly on left so it NEVER covers the photo) */}
          <div className="hidden sm:flex absolute left-4 md:left-10 lg:left-14 top-1/2 -translate-y-1/2 z-20 max-w-md lg:max-w-lg flex-col items-start bg-black/75 backdrop-blur-md p-6 lg:p-8 rounded-2xl border border-[#D4AF37]/40 shadow-[0_12px_45px_rgba(0,0,0,0.9)] space-y-3">
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#D4AF37] to-[#B89528] text-black text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
              <Sparkles size={12} />
              <span>Girlsgalary Royal</span>
            </span>

            <h1 className="text-xl sm:text-2xl lg:text-4xl font-serif font-black text-white tracking-tight drop-shadow leading-tight">
              {title}
            </h1>

            {subtitle && (
              <p className="text-xs sm:text-sm text-zinc-300 font-medium line-clamp-2">
                {subtitle}
              </p>
            )}

            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B89528] group-hover:brightness-110 text-black font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.4)] transition-all">
                <span>{buttonText}</span>
                <ArrowRight size={16} />
              </span>
            </div>

            <div className="pt-1 flex items-center gap-4 text-[10px] text-zinc-400 font-medium">
              <span className="inline-flex items-center gap-1">
                <Truck size={12} className="text-[#D4AF37]" />
                <span>{language === 'bn' ? 'সারা দেশে ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck size={12} className="text-[#D4AF37]" />
                <span>{language === 'bn' ? 'সহজ রিটার্ন গ্যারান্টি' : 'Easy Return'}</span>
              </span>
            </div>
          </div>

          {/* Mobile Floating Bottom Bar: Compact so it leaves 85% of mobile screen fully visible for the model/photo */}
          <div className="sm:hidden absolute bottom-2 left-2 right-2 z-20 bg-black/85 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#D4AF37]/40 flex items-center justify-between shadow-xl">
            <div className="pr-2 min-w-0">
              <p className="text-xs font-serif font-bold text-white truncate drop-shadow">
                {title}
              </p>
              <p className="text-[10px] text-[#F3E5AB] font-medium flex items-center gap-1">
                <Sparkles size={10} className="text-[#D4AF37]" />
                <span>{language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}</span>
              </p>
            </div>
            <span className="flex-shrink-0 inline-flex items-center gap-1 bg-gradient-to-r from-[#D4AF37] to-[#B89528] text-black text-[11px] font-black px-3 py-1.5 rounded-full shadow">
              <span>{language === 'bn' ? 'অর্ডার করুন' : 'Shop'}</span>
              <ArrowRight size={12} />
            </span>
          </div>
        </Link>

        {/* Left/Right Navigation Arrows for Desktop */}
        {banners.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
              }}
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/75 hover:bg-black text-[#D4AF37] items-center justify-center border border-[#D4AF37]/50 shadow-lg transition-all z-30 active:scale-95"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setCurrentIndex((prev) => (prev + 1) % banners.length);
              }}
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/75 hover:bg-black text-[#D4AF37] items-center justify-center border border-[#D4AF37]/50 shadow-lg transition-all z-30 active:scale-95"
              aria-label="Next Slide"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Slide Indicator Pills */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 right-4 sm:right-8 z-30 flex items-center gap-1.5">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === idx
                    ? 'w-7 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
