'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface BannerItem {
  id: string;
  title: string;
  titleEn: string;
  imageUrl: string;
  mobileImageUrl: string;
  linkUrl: string;
}

export const HeroSlider: React.FC = () => {
  const { language } = useLanguage();
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Official AMIRÁ-Style Authentic Landscape Web Banners & Mobile Banners
    // Desktop: 1920x650 / 1900x600 (High-res uncropped luxury fashion banners)
    // Mobile: 420x480 (Custom responsive portrait mobile banners)
    const curatedBanners: BannerItem[] = [
      {
        id: '1',
        title: 'এক্সক্লুসিভ ফ্যাশন ও ঈদ কালেকশন',
        titleEn: 'Exclusive Fashion & Eid Collection',
        imageUrl: 'https://amirabd.com/wp-content/uploads/2026/01/Web-banner-intermix-25.jpg',
        mobileImageUrl: 'https://amirabd.com/wp-content/uploads/2026/01/MOBILE-banner-intermix-25-420-x-480-px.jpg',
        linkUrl: '/category/saree'
      },
      {
        id: '2',
        title: 'নিউ অ্যারাইভাল থ্রি পিস ও লন কালেকশন',
        titleEn: 'New Arrival Three Piece & Lawn Collection',
        imageUrl: 'https://amirabd.com/wp-content/uploads/2026/01/Web-banner-durga-puja-25.jpg',
        mobileImageUrl: 'https://amirabd.com/wp-content/uploads/2026/01/mobile-banner-durga-puja-25.jpg',
        linkUrl: '/category/three-piece'
      },
      {
        id: '3',
        title: 'লাক্সারি বুটিক ও ঈদ স্পেশাল কালেকশন',
        titleEn: 'Luxury Boutique & Eid Special Collection',
        imageUrl: 'https://amirabd.com/wp-content/uploads/2025/07/Web-banner-eidul-adha-EDIT-25.jpg',
        mobileImageUrl: 'https://amirabd.com/wp-content/uploads/2026/05/2.1.jpg',
        linkUrl: '/category/kurti'
      },
      {
        id: '4',
        title: 'প্রিমিয়াম অথেনটিক কসমেটিকস ও ফ্যাশন',
        titleEn: 'Premium Authentic Cosmetics & Fashion',
        imageUrl: 'https://amirabd.com/wp-content/uploads/2026/05/2.jpg',
        mobileImageUrl: 'https://amirabd.com/wp-content/uploads/2026/07/MOBILE.webp',
        linkUrl: '/category/cosmetics'
      }
    ];

    setBanners(curatedBanners);
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

  return (
    <section 
      className="relative w-full overflow-hidden bg-white select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 
        Full Uncropped Responsive Banner Slider (AMIRÁ Exact Ratio)
        Desktop: aspect-[1920/650] (matches 1920x650 banner dimensions exactly with 0% cropping)
        Mobile: aspect-[420/480] (matches 420x480 mobile banner dimensions with 0% cropping)
      */}
      <div className="relative w-full aspect-[420/480] sm:aspect-[1920/650] max-h-[650px] overflow-hidden bg-zinc-100">
        {banners.map((item, index) => {
          const isActive = index === currentIndex;
          const bannerTitle = language === 'bn' ? item.title : item.titleEn;

          return (
            <div
              key={item.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Link
                href={item.linkUrl}
                className="relative block w-full h-full"
                title={bannerTitle}
              >
                {/* Desktop/Tablet Image: 100% Full Uncropped Picture */}
                <img
                  src={item.imageUrl}
                  alt={bannerTitle}
                  className="hidden sm:block w-full h-full object-cover object-center"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />

                {/* Mobile Image: 100% Full Uncropped Mobile Banner */}
                <img
                  src={item.mobileImageUrl || item.imageUrl}
                  alt={bannerTitle}
                  className="block sm:hidden w-full h-full object-cover object-center"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </Link>
            </div>
          );
        })}

        {/* Sleek Minimalist Chevrons (Appear on hover) */}
        {banners.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-9 sm:w-11 h-9 sm:h-11 rounded-full bg-white/85 hover:bg-white text-zinc-900 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 z-20 active:scale-95"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setCurrentIndex((prev) => (prev + 1) % banners.length);
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-9 sm:w-11 h-9 sm:h-11 rounded-full bg-white/85 hover:bg-white text-zinc-900 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 z-20 active:scale-95"
              aria-label="Next Slide"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Delicate AMIRÁ-Style Bottom Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 inset-x-0 z-20 flex items-center justify-center gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-7 bg-zinc-900 shadow-sm'
                    : 'w-2 bg-zinc-400/60 hover:bg-zinc-700'
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
