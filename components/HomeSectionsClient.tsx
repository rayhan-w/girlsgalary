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
      
      {/* 1. Category Tiles */}
      <section className="my-8 sm:my-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-zinc-900">
              {t('ক্যাটাগরি সমূহ', 'Shop By Category')}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {t('আপনার পছন্দের ক্যাটাগরি বেছে নিন', 'Explore our handcrafted collections')}
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs sm:text-sm font-semibold text-[#b89528] hover:underline flex items-center gap-1"
          >
            <span>{t('সব দেখুন', 'View All')}</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#D4AF37]/40 group-hover:border-[#D4AF37] shadow-md transition-all group-hover:scale-105 bg-zinc-100 p-0.5">
                <img
                  src={cat.photo || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              </div>
              <span className="mt-2 text-xs font-semibold text-zinc-800 group-hover:text-[#b89528] transition-colors truncate max-w-[80px] sm:max-w-[100px]">
                {language === 'bn' && cat.nameBn ? cat.nameBn : cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="my-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#fbf6e6] rounded-lg text-[#b89528]">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-serif font-bold text-zinc-900">
                  {t('নতুন কালেকশন', 'New Arrivals')}
                </h2>
                <p className="text-xs text-zinc-500">
                  {t('সদ্য যুক্ত হওয়া ট্রেন্ডি ও এক্সক্লুসিভ আইটেমস', 'Freshly curated royal styles and exclusive pieces')}
                </p>
              </div>
            </div>
            <Link
              href="/shop?sort=newest"
              className="text-xs sm:text-sm font-semibold text-[#b89528] hover:underline flex items-center gap-1"
            >
              <span>{t('সব দেখুন', 'View All')} ({newArrivals.length}+)</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {newArrivals.map((prod) => (
              <ProductCard key={prod.id} {...formatCard(prod)} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Best Selling Section */}
      {bestSellers.length > 0 && (
        <section className="my-12">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600">
                <TrendingUp size={20} />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-serif font-bold text-zinc-900">
                  {t('সেরা বিক্রিত পণ্য', 'Best Selling')}
                </h2>
                <p className="text-xs text-zinc-500">
                  {t('গ্রাহকদের সর্বাধিক পছন্দের জনপ্রিয় ফ্যাশন আইটেম', 'Most loved and highly rated fashion favorites')}
                </p>
              </div>
            </div>
            <Link
              href="/shop?sort=best_selling"
              className="text-xs sm:text-sm font-semibold text-[#b89528] hover:underline flex items-center gap-1"
            >
              <span>{t('সব দেখুন', 'View All')}</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {bestSellers.map((prod) => (
              <ProductCard key={prod.id} {...formatCard(prod)} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Featured Category Promo Banner (Cosmetics & Jewellery) */}
      <div className="my-12 rounded-2xl overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-900 to-black text-white p-6 sm:p-10 border border-[#D4AF37]/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-lg text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            <Sparkles size={14} />
            <span>{t('১০০% অরিজিনাল কসমেটিকস', '100% Authentic Cosmetics')}</span>
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            {t('আন্তর্জাতিক ব্র্যান্ডের আসল মেকআপ ও স্কিনকেয়ার', 'International Branded Makeup & Skincare')}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300">
            {t(
              'ম্যাক, মেবিলিন ও লরিয়েল এর ১০০% আসল পণ্য ক্যাশ অন ডেলিভারিতে অর্ডার করুন।',
              'Order 100% authentic MAC, Maybelline, and LOreal products with nationwide cash on delivery.'
            )}
          </p>
          <div className="pt-2">
            <Link
              href="/category/cosmetics"
              className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b89528] text-black font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-transform active:scale-95"
            >
              <span>{t('কসমেটিকস কালেকশন দেখুন', 'Explore Cosmetics Collection')}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="w-full md:w-80 aspect-video md:aspect-square rounded-xl overflow-hidden border border-white/20 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
            alt="Cosmetics"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 5. Special Offers / Discount Products */}
      {offerProducts.length > 0 && (
        <section className="my-12">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                <Flame size={20} />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-serif font-bold text-zinc-900">
                  {t('ধামাকা অফার', 'Special Offers')}
                </h2>
                <p className="text-xs text-zinc-500">
                  {t('সীমিত সময়ের জন্য বিশেষ মূল্যছাড় উপভোগ করুন', 'Grab limited-time exclusive discounts')}
                </p>
              </div>
            </div>
            <Link
              href="/shop"
              className="text-xs sm:text-sm font-semibold text-[#b89528] hover:underline flex items-center gap-1"
            >
              <span>{t('সব অফার', 'All Offers')}</span>
              <ArrowRight size={14} />
            </Link>
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
