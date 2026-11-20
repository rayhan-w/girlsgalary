'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, Flame } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ProductCard } from '@/components/ProductCard';

interface HomeSectionsClientProps {
  categories: any[];
  newArrivals: any[];
  bestSellers: any[];
  offerProducts: any[];
}

export const HomeSectionsClient: React.FC<HomeSectionsClientProps> = ({
  categories,
  newArrivals,
  bestSellers,
  offerProducts
}) => {
  const { language, t } = useLanguage();

  const formatCard = (p: any) => {
    const ratings = p.reviews || [];
    const avg = ratings.length > 0
      ? Number((ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length).toFixed(1))
      : 0;
    return {
      id: p.id,
      name: p.name,
      nameBn: p.nameBn,
      slug: p.slug,
      coverImage: p.coverImage,
      regularPrice: p.regularPrice,
      offerPrice: p.offerPrice,
      discountPercent: p.discountPercent,
      totalStock: p.totalStock,
      averageRating: avg,
      reviewCount: ratings.length,
      categoryName: language === 'bn' ? (p.category?.nameBn || p.category?.name) : p.category?.name
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* 1. AMIRÁ Signature Circular Story Category Carousel */}
      <section className="my-8 sm:my-12">
        <div className="text-center mb-6">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#b89528] block mb-1">
            {t('আভিজাত্য ও বৈচিত্র্য', 'COLLECTIONS OVER THE YEARS')}
          </span>
          <h2 className="text-xl sm:text-3xl font-serif font-bold text-zinc-900 tracking-tight">
            {t('ক্যাটাগরি সমূহ', 'Shop By Category')}
          </h2>
        </div>

        {/* Scrollable Story Avatars */}
        <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-7 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center text-center flex-shrink-0"
            >
              <div className="w-18 h-18 sm:w-24 sm:h-24 md:w-26 md:h-26 rounded-full overflow-hidden border-2 border-zinc-200 group-hover:border-black p-0.5 shadow-xs transition-all duration-300 group-hover:scale-105 bg-white">
                <img
                  src={cat.photo || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              </div>
              <span className="mt-2.5 text-xs font-medium text-zinc-800 group-hover:text-black transition-colors max-w-[85px] sm:max-w-[100px] truncate">
                {language === 'bn' && cat.nameBn ? cat.nameBn : cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. AMIRÁ Style 3-Column Promo Campaign Grid */}
      <section className="my-10 sm:my-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Promo Card 1: Saree */}
          <Link
            href="/category/saree"
            className="group relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-xs border border-zinc-200 flex flex-col justify-end p-6"
          >
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
              alt="Saree Collection"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="relative z-10 text-white space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#F3E5AB] font-bold block">
                {t('ঐতিহ্যবাহী ঢাকাই জামদানি', 'HANDCRAFTED')}
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                {t('শাড়ি কালেকশন', 'Pure Silk & Jamdani')}
              </h3>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-[#D4AF37] pt-1 transition-colors">
                <span>{t('কালেকশন দেখুন', 'Shop Collection')}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          {/* Promo Card 2: Three Piece */}
          <Link
            href="/category/three-piece"
            className="group relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-xs border border-zinc-200 flex flex-col justify-end p-6"
          >
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
              alt="Three Piece"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="relative z-10 text-white space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#F3E5AB] font-bold block">
                {t('আরামদায়ক সুতি ও লন', 'FESTIVE LAWN')}
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                {t('থ্রি পিস ও কুর্তি', 'Designer Three Piece')}
              </h3>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-[#D4AF37] pt-1 transition-colors">
                <span>{t('অর্ডার করুন এখনই', 'Explore Now')}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          {/* Promo Card 3: Cosmetics & Jewellery */}
          <Link
            href="/category/cosmetics"
            className="group relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-xs border border-zinc-200 flex flex-col justify-end p-6"
          >
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
              alt="Cosmetics & Jewellery"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="relative z-10 text-white space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#F3E5AB] font-bold block">
                {t('১০০% আসল ব্র্যান্ড', '100% AUTHENTIC')}
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                {t('কসমেটিকস ও মেকআপ', 'Cosmetics & Kundan')}
              </h3>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-[#D4AF37] pt-1 transition-colors">
                <span>{t('শপ করুন', 'Discover Now')}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

        </div>
      </section>

      {/* 3. New Arrivals (AMIRÁ Clean Centered Section) */}
      {newArrivals.length > 0 && (
        <section className="my-12 sm:my-16">
          <div className="text-center mb-8">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#b89528] block mb-1">
              {t('সদ্য যুক্ত হওয়া কালেকশন', 'JUST ARRIVED')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 tracking-tight">
              {t('নতুন কালেকশন', 'New In Collection')}
            </h2>
            <div className="mt-2">
              <Link
                href="/shop?sort=newest"
                className="text-xs font-bold uppercase tracking-wider text-zinc-900 hover:text-[#b89528] inline-flex items-center gap-1 border-b border-black pb-0.5"
              >
                <span>{t('সব দেখুন', 'View All')} ({newArrivals.length}+)</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {newArrivals.map((prod) => (
              <ProductCard key={prod.id} {...formatCard(prod)} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Best Selling Section */}
      {bestSellers.length > 0 && (
        <section className="my-12 sm:my-16">
          <div className="text-center mb-8">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-rose-600 block mb-1">
              {t('গ্রাহকদের সর্বাধিক পছন্দের', 'CUSTOMER FAVORITES')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 tracking-tight">
              {t('সেরা বিক্রিত পণ্য', 'Best Selling')}
            </h2>
            <div className="mt-2">
              <Link
                href="/shop?sort=best_selling"
                className="text-xs font-bold uppercase tracking-wider text-zinc-900 hover:text-[#b89528] inline-flex items-center gap-1 border-b border-black pb-0.5"
              >
                <span>{t('সব দেখুন', 'View All')}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {bestSellers.map((prod) => (
              <ProductCard key={prod.id} {...formatCard(prod)} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Special Offers / Discount Products */}
      {offerProducts.length > 0 && (
        <section className="my-12 sm:my-16">
          <div className="text-center mb-8">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-amber-600 block mb-1">
              {t('সীমিত সময়ের জন্য ছাড়', 'LIMITED TIME DEALS')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 tracking-tight">
              {t('ধামাকা অফার', 'Special Offers')}
            </h2>
            <div className="mt-2">
              <Link
                href="/shop"
                className="text-xs font-bold uppercase tracking-wider text-zinc-900 hover:text-[#b89528] inline-flex items-center gap-1 border-b border-black pb-0.5"
              >
                <span>{t('সব অফার', 'All Deals')}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {offerProducts.map((prod) => (
              <ProductCard key={prod.id} {...formatCard(prod)} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
