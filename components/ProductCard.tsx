'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Zap, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
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
  const inWishlist = isInWishlist(id);
  const isOutOfStock = totalStock <= 0;

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
    <div className="group relative bg-white border border-zinc-200/90 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
      
      {/* Product Image & Badges */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100">
        <Link href={`/product/${slug}`} className="block w-full h-full">
          <img
            src={coverImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Discount Badge */}
        {discount > 0 && !isOutOfStock && (
          <span className="absolute top-2 left-2 bg-[#D4AF37] text-black text-[10px] sm:text-xs font-black px-2 py-0.5 rounded shadow-sm">
            {discount}% ছাড়
          </span>
        )}

        {/* Out of stock badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-2">
            <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              স্টক শেষ (Sold Out)
            </span>
          </div>
        )}

        {/* Wishlist Heart */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow transition-all ${
            inWishlist ? 'bg-rose-50 text-rose-600' : 'bg-white/90 text-zinc-600 hover:text-rose-600'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart size={16} className={inWishlist ? 'fill-rose-600 text-rose-600' : ''} />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {categoryName && (
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
              {categoryName}
            </span>
          )}

          <Link href={`/product/${slug}`} className="block mt-0.5 group-hover:text-[#b89528] transition-colors">
            <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 line-clamp-2 leading-snug">
              {nameBn || name}
            </h3>
          </Link>

          {/* Rating Stars - shown only when reviews exist */}
          {reviewCount > 0 ? (
            <div className="flex items-center gap-1 mt-1 text-amber-500 text-[11px]">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="font-bold text-zinc-800">{averageRating}</span>
              <span className="text-zinc-400">({reviewCount})</span>
            </div>
          ) : (
            <div className="h-4 mt-1" /> // Spacer for card height consistency
          )}

          {/* Prices Side-by-Side */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-extrabold text-[#b89528]">
              {formatPrice(offerPrice)}
            </span>
            {regularPrice > offerPrice && (
              <span className="text-xs text-zinc-400 line-through">
                {formatPrice(regularPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Add to Cart and Order Now */}
        <div className="mt-3 grid grid-cols-2 gap-1.5 sm:gap-2 pt-2 border-t border-zinc-100">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex items-center justify-center gap-1 py-2 px-1 text-[11px] sm:text-xs font-semibold rounded-lg border border-zinc-300 text-zinc-800 hover:border-black hover:bg-zinc-50 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={13} />
            <span className="truncate">কার্ট</span>
          </button>

          <button
            onClick={handleOrderNow}
            disabled={isOutOfStock}
            className="flex items-center justify-center gap-1 py-2 px-1 text-[11px] sm:text-xs font-bold rounded-lg bg-[#D4AF37] hover:bg-[#b89528] text-black active:scale-95 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Zap size={13} className="fill-black" />
            <span className="truncate">অর্ডার করুন</span>
          </button>
        </div>

      </div>

    </div>
  );
};
