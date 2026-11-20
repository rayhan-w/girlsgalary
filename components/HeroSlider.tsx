'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface BannerItem {
  id: string;
  title: string;
  titleEn?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl: string;
}

export const HeroSlider: React.FC = () => {
  const { language } = useLanguage();
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Curated high-resolution fashion slider banners (AMIRÁ Edge-to-Edge Style)
    const defaultBanners: BannerItem[] = [
      {
        id: '1',
        title: 'এক্সক্লুসিভ কালেকশন ২০২৬',
        titleEn: 'Exclusive Collection 2026',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1920&q=80',
        mobileImageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
        linkUrl: '/category/saree'
      },
      {
        id: '2',
        title: 'নিউ অ্যারাইভাল থ্রি পিস ও লন',
        titleEn: 'New Arrival Three Piece & Lawn',
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1920&q=80',
        mobileImageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80',
        linkUrl: '/category/three-piece'
      },
      {
        id: '3',
        title: 'শতভাগ অথেনটিক কসমেটিকস ও কুন্দন জুয়েলারি',
        titleEn: '100% Authentic Cosmetics & Kundan Jewellery',
        imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1920&q=80',
        mobileImageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80',
        linkUrl: '/category/cosmetics'
      }
    ];

    setBanners(defaultBanners);
  }, []);

  // Autoplay every 5 seconds (pauses on hover)
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [banners.length, isPaused]);

  if (!banners.length) return null;

  const current = banners[currentIndex];
  const title = language === 'bn' ? current.title : (current.titleEn || current.title);

  return (
    <section 
      className="relative w-full overflow-hidden bg-zinc-950 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* AMIRÁ Style Clean Edge-to-Edge Responsive Banner Slider */}
      <div className="relative w-full aspect-[21/9] sm:aspect-[16/7] md:aspect-[2.4/1] max-h-[560px] flex items-center justify-center overflow-hidden">
        
        {/* Soft Ambient Glow in background matching the photo */}
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-20 scale-105 pointer-events-none transition-all duration-1000"
          style={{ backgroundImage: `url(${current.imageUrl})` }}
        />

        {/* Clickable Full Banner (Entire image links to destination) */}
        <Link 
          href={current.linkUrl}
          className="relative w-full h-full block"
          title={title}
        >
          {/* Desktop/Tablet Image: Clean, Crisp, Full Picture */}
          <img
            src={current.imageUrl}
            alt={title}
            className="hidden sm:block w-full h-full object-cover object-center transition-all duration-700 ease-out"
          />

          {/* Mobile Image: Framed cleanly for mobile screens */}
          <img
            src={current.mobileImageUrl || current.imageUrl}
            alt={title}
            className="sm:hidden w-full h-full object-cover object-top transition-all duration-700 ease-out"
          />

          {/* Subtle Bottom Vignette for sleek look */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </Link>

        {/* Sleek Floating Chevrons (Appear on hover like AMIRÁ) */}
        {banners.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-9 sm:w-11 h-9 sm:h-11 rounded-full bg-white/80 hover:bg-white text-zinc-900 flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 z-20 active:scale-95"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setCurrentIndex((prev) => (prev + 1) % banners.length);
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-9 sm:w-11 h-9 sm:h-11 rounded-full bg-white/80 hover:bg-white text-zinc-900 flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 z-20 active:scale-95"
              aria-label="Next Slide"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Delicate Bottom Indicator Pills */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-5 inset-x-0 z-20 flex items-center justify-center gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentIndex(idx);
                }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-8 bg-[#D4AF37] shadow-sm'
                    : 'w-2 bg-white/50 hover:bg-white/80'
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
