'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Zap, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/lib/utils';

export interface ProductCardProps {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  coverImage: string;
  regularPrice: number;
  offerPrice: number;
  discountPercent?: number;
  totalStock?: number;
  averageRating?: number;
  reviewCount?: number;
  categoryName?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  nameBn,
  slug,
  coverImage,
  regularPrice,
  offerPrice,
  discountPercent,
  totalStock = 1,
  averageRating = 0,
  reviewCount = 0,
  categoryName
}) => {
  const { addToCart, buyNow, toggleWishlist, isInWishlist } = useCart();
  const { language, t } = useLanguage();
  const inWishlist = isInWishlist(id);
  const isOutOfStock = totalStock <= 0;

  const displayName = language === 'bn' && nameBn ? nameBn : name;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart({
      productId: id,
      name,
      slug,
      image: coverImage,
      price: offerPrice,
      regularPrice,
      quantity: 1,
      maxStock: totalStock
    });
  };

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    buyNow({
      productId: id,
      name,
      slug,
      image: coverImage,
      price: offerPrice,
      regularPrice,
      quantity: 1,
      maxStock: totalStock
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  const discount = discountPercent || Math.round(((regularPrice - offerPrice) / regularPrice) * 100);

  return (
    <div className="group relative bg-white border border-zinc-200/80 rounded-xl overflow-hidden hover:border-zinc-400 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between">
      
      {/* Product Image & Badges (AMIRÁ Clean Portrait Frame) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-50">
        <Link href={`/product/${slug}`} className="block w-full h-full">
          <img
            src={coverImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Minimalist Discount Badge */}
        {discount > 0 && !isOutOfStock && (
          <span className="absolute top-2.5 left-2.5 bg-black text-[#D4AF37] text-[10px] font-black px-2 py-0.5 rounded tracking-wider shadow-sm uppercase">
            -{discount}%
          </span>
        )}

        {/* Out of stock badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-2">
            <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              {t('স্টক শেষ', 'Sold Out')}
            </span>
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow-xs transition-all ${
            inWishlist 
              ? 'bg-rose-50 text-rose-600' 
              : 'bg-white/90 text-zinc-500 hover:text-rose-600 hover:bg-white'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart size={15} className={inWishlist ? 'fill-rose-600 text-rose-600' : ''} />
        </button>
      </div>

      {/* Product Info & Pricing */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {categoryName && (
            <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-400 font-semibold block mb-1">
              {categoryName}
            </span>
          )}

          <Link href={`/product/${slug}`} className="block group-hover:text-[#b89528] transition-colors">
            <h3 className="text-xs sm:text-sm font-medium text-zinc-900 line-clamp-2 leading-snug">
              {displayName}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-extrabold text-zinc-900">
              {formatPrice(offerPrice)}
            </span>
            {regularPrice > offerPrice && (
              <span className="text-xs text-zinc-400 line-through">
                {formatPrice(regularPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Add to Cart & Fast Order */}
        <div className="mt-3 grid grid-cols-2 gap-1.5 sm:gap-2 pt-2.5 border-t border-zinc-100">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex items-center justify-center gap-1 py-2 px-1 text-[11px] sm:text-xs font-semibold rounded-lg border border-zinc-300 text-zinc-800 hover:border-black hover:bg-zinc-50 active:scale-95 transition-all disabled:opacity-40"
          >
            <ShoppingBag size={13} />
            <span className="truncate">{t('কার্ট', 'Cart')}</span>
          </button>

          <button
            onClick={handleOrderNow}
            disabled={isOutOfStock}
            className="flex items-center justify-center gap-1 py-2 px-1 text-[11px] sm:text-xs font-black rounded-lg bg-black hover:bg-zinc-800 text-[#D4AF37] active:scale-95 transition-all shadow-xs disabled:opacity-40"
          >
            <Zap size={13} className="fill-[#D4AF37]" />
            <span className="truncate">{t('অর্ডার করুন', 'Order Now')}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
