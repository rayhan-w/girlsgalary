'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl: string;
  buttonText: string;
}

export const HeroSlider: React.FC = () => {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Default fallback banners matching seed
    const defaultBanners: BannerItem[] = [
      {
        id: '1',
        title: 'এক্সক্লুসিভ কালেকশন ২০২৬',
        subtitle: 'প্রিমিয়াম জামদানি, সিল্ক শাড়ি ও ডিজাইনার কুর্তি',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
        mobileImageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        linkUrl: '/category/saree',
        buttonText: 'অর্ডার করুন এখনই'
      },
      {
        id: '2',
        title: 'নিউ অ্যারাইভাল থ্রি পিস',
        subtitle: 'আরামদায়ক পিওর সুতি ও লন থ্রি পিস কালেকশন',
        imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80',
        mobileImageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        linkUrl: '/category/three-piece',
        buttonText: 'কালেকশন দেখুন'
      },
      {
        id: '3',
        title: 'শতভাগ অথেনটিক কসমেটিকস ও জুয়েলারি',
        subtitle: 'সেরা ব্র্যান্ডের আসল লিপস্টিক, স্কিন কেয়ার ও কুন্দন সেট',
        imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80',
        mobileImageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
        linkUrl: '/category/cosmetics',
        buttonText: 'শপ করুন'
      }
    ];

    setBanners(defaultBanners);
  }, []);

  // Autoplay every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners.length) return null;

  const current = banners[currentIndex];

  return (
    <div className="relative w-full overflow-hidden bg-black select-none">
      {/* Slide Container */}
      <div className="relative h-[240px] sm:h-[400px] md:h-[480px] w-full">
        {/* Desktop Image */}
        <div
          className="hidden sm:block absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
          style={{ backgroundImage: `url(${current.imageUrl})` }}
        />
        {/* Mobile Image */}
        <div
          className="sm:hidden absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
          style={{ backgroundImage: `url(${current.mobileImageUrl || current.imageUrl})` }}
        />

        {/* Dark Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent sm:bg-gradient-to-r sm:from-black/85 sm:via-black/50 sm:to-transparent" />

        {/* Content Box */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-end sm:justify-center items-start pb-8 sm:pb-0 z-10 text-white">
          <div className="max-w-xl space-y-2 sm:space-y-4">
            <span className="inline-block bg-[#D4AF37] text-black text-[10px] sm:text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded">
              Girlsgalary Special
            </span>
            <h1 className="text-xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight drop-shadow-md">
              {current.title}
            </h1>
            {current.subtitle && (
              <p className="text-xs sm:text-base text-zinc-200 line-clamp-2 drop-shadow">
                {current.subtitle}
              </p>
            )}
            <div className="pt-1">
              <Link
                href={current.linkUrl}
                className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b89528] text-black font-bold text-xs sm:text-sm px-5 py-2.5 sm:px-7 sm:py-3 rounded-full shadow-lg transition-transform active:scale-95"
              >
                <span>{current.buttonText}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Left/Right Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white items-center justify-center border border-white/20 transition-all z-20"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white items-center justify-center border border-white/20 transition-all z-20"
              aria-label="Next Slide"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 right-6 z-20 flex items-center gap-1.5">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === idx ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-white/50'
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
