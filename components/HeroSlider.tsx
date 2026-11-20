'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
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
  const { language, t } = useLanguage();
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const defaultBanners: BannerItem[] = [
      {
        id: '1',
        title: 'এক্সক্লুসিভ কালেকশন ২০২৬',
        titleEn: 'Exclusive Collection 2026',
        subtitle: 'প্রিমিয়াম জামদানি, সিল্ক শাড়ি ও ডিজাইনার কুর্তি',
        subtitleEn: 'Handcrafted Dhakai Jamdani, Pure Silk & Designer Wear',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
        mobileImageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        linkUrl: '/category/saree',
        buttonText: 'অর্ডার করুন এখনই',
        buttonTextEn: 'Shop Collection'
      },
      {
        id: '2',
        title: 'নিউ অ্যারাইভাল থ্রি পিস',
        titleEn: 'New Arrival Three Piece',
        subtitle: 'আরামদায়ক পিওর সুতি ও লন থ্রি পিস কালেকশন',
        subtitleEn: 'Breathable Swiss Lawn & Premium Embroidered Suits',
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80',
        mobileImageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        linkUrl: '/category/three-piece',
        buttonText: 'কালেকশন দেখুন',
        buttonTextEn: 'Explore Now'
      },
      {
        id: '3',
        title: 'শতভাগ অথেনটিক কসমেটিকস ও জুয়েলারি',
        titleEn: '100% Authentic Cosmetics & Jewellery',
        subtitle: 'সেরা ব্র্যান্ডের আসল লিপস্টিক, স্কিন কেয়ার ও কুন্দন সেট',
        subtitleEn: 'Top International Brands, Bridal Kundan & Fashion Accessories',
        imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80',
        mobileImageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
        linkUrl: '/category/cosmetics',
        buttonText: 'শপ করুন',
        buttonTextEn: 'Shop Cosmetics'
      }
    ];

    setBanners(defaultBanners);
  }, []);

  // Autoplay every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners.length) return null;

  const current = banners[currentIndex];
  const title = language === 'bn' ? current.title : (current.titleEn || current.title);
  const subtitle = language === 'bn' ? current.subtitle : (current.subtitleEn || current.subtitle);
  const buttonText = language === 'bn' ? current.buttonText : (current.buttonTextEn || current.buttonText);

  return (
    <div className="relative w-full overflow-hidden bg-[#0a0a0a] border-b border-[#D4AF37]/30 select-none">
      
      {/* Banner Container: Adjusted so the full photo shows with proper framing and zero weird cropping */}
      <div className="relative w-full max-w-7xl mx-auto h-[260px] sm:h-[380px] md:h-[440px] flex items-center justify-center overflow-hidden">
        
        {/* Soft Ambient Blurred Glow Background matching the photo */}
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-30 scale-110 pointer-events-none"
          style={{ backgroundImage: `url(${current.imageUrl})` }}
        />

        {/* Desktop Image: Centered & Fit so full photo is completely visible without zoom cutoffs */}
        <img
          src={current.imageUrl}
          alt={current.title}
          className="hidden sm:block absolute inset-0 w-full h-full object-cover object-top filter brightness-90 transition-all duration-700 ease-out"
        />

        {/* Mobile Image: Fit so full photo model/dress is visible without cropping out */}
        <img
          src={current.mobileImageUrl || current.imageUrl}
          alt={current.title}
          className="sm:hidden absolute inset-0 w-full h-full object-cover object-top filter brightness-90 transition-all duration-700 ease-out"
        />

        {/* Luxury Gold/Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent sm:bg-gradient-to-r sm:from-black/90 sm:via-black/55 sm:to-transparent" />

        {/* Content Box */}
        <div className="absolute inset-0 px-6 sm:px-12 flex flex-col justify-end sm:justify-center items-start pb-7 sm:pb-0 z-10 text-white">
          <div className="max-w-xl space-y-2 sm:space-y-3.5">
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#D4AF37] to-[#B89528] text-black text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
              <Sparkles size={12} />
              <span>Girlsgalary Royal</span>
            </span>
            <h1 className="text-xl sm:text-3xl md:text-5xl font-serif font-black text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm md:text-base text-zinc-200 line-clamp-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] font-medium">
                {subtitle}
              </p>
            )}
            <div className="pt-1.5">
              <Link
                href={current.linkUrl}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B89528] hover:brightness-110 text-black font-extrabold text-xs sm:text-sm px-6 py-2.5 sm:px-8 sm:py-3 rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.4)] transition-all active:scale-95"
              >
                <span>{buttonText}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Left/Right Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-[#D4AF37] items-center justify-center border border-[#D4AF37]/50 shadow-lg transition-all z-20"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-[#D4AF37] items-center justify-center border border-[#D4AF37]/50 shadow-lg transition-all z-20"
              aria-label="Next Slide"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 right-6 z-20 flex items-center gap-1.5">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
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
    </div>
  );
};
