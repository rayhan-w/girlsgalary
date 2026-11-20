'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Zap,
  Heart,
  Share2,
  Check,
  Truck,
  ShieldCheck,
  RefreshCw,
  Ruler,
  Star,
  Plus,
  Minus,
  MessageCircle,
  Copy,
  ChevronRight
} from 'lucide-react';

const FacebookIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { ProductCard } from '@/components/ProductCard';

interface ProductDetailClientProps {
  product: any;
  relatedProducts: any[];
  settings: any;
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  settings
}: ProductDetailClientProps) {
  const { addToCart, buyNow, toggleWishlist, isInWishlist } = useCart();

  // Parse images
  const images: string[] = useMemo(() => {
    try {
      const parsed = JSON.parse(product.images || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
    return [product.coverImage];
  }, [product]);

  const [activeImage, setActiveImage] = useState<string>(product.coverImage || images[0]);
  const [quantity, setQuantity] = useState(1);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewPhone, setReviewPhone] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Variants grouping: unique sizes & unique colors
  const variants = product.variants || [];
  const uniqueSizes = useMemo(() => {
    const set = new Set<string>();
    variants.forEach((v: any) => v.size && set.add(v.size));
    return Array.from(set);
  }, [variants]);

  const uniqueColors = useMemo(() => {
    const map = new Map<string, { name: string; hex: string; image?: string }>();
    variants.forEach((v: any) => {
      if (v.colorName && !map.has(v.colorName)) {
        map.set(v.colorName, {
          name: v.colorName,
          hex: v.colorHex || '#000000',
          image: v.image
        });
      }
    });
    return Array.from(map.values());
  }, [variants]);

  // Selected variant state
  const [selectedColor, setSelectedColor] = useState<string>(
    uniqueColors[0]?.name || ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    uniqueSizes[0] || ''
  );

  // Handle color change: changes photo too!
  const handleColorSelect = (colorObj: { name: string; hex: string; image?: string }) => {
    setSelectedColor(colorObj.name);
    if (colorObj.image) {
      setActiveImage(colorObj.image);
    }
  };

  // Find exact active variant
  const activeVariant = useMemo(() => {
    if (!variants.length) return null;
    return (
      variants.find(
        (v: any) =>
          (!selectedColor || v.colorName === selectedColor) &&
          (!selectedSize || v.size === selectedSize)
      ) || variants[0]
    );
  }, [variants, selectedColor, selectedSize]);

  // Variant stock checking
  const currentStock = activeVariant ? activeVariant.stock : product.totalStock;
  const isOutOfStock = currentStock <= 0;
  const currentPrice = (product.offerPrice || 0) + (activeVariant?.priceDiff || 0);
  const regularPrice = (product.regularPrice || 0) + (activeVariant?.priceDiff || 0);
  const savings = Math.max(0, regularPrice - currentPrice);

  // Size chart data parsing
  const sizeChart = useMemo(() => {
    if (!product.category?.sizeChartData) return null;
    try {
      return JSON.parse(product.category.sizeChartData);
    } catch (e) {
      return null;
    }
  }, [product.category]);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart({
      productId: product.id,
      variantId: activeVariant?.id,
      name: product.name,
      slug: product.slug,
      image: activeImage,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      price: currentPrice,
      regularPrice,
      quantity,
      maxStock: currentStock
    });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    buyNow({
      productId: product.id,
      variantId: activeVariant?.id,
      name: product.name,
      slug: product.slug,
      image: activeImage,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      price: currentPrice,
      regularPrice,
      quantity,
      maxStock: currentStock
    });
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: reviewName,
          customerPhone: reviewPhone,
          rating: reviewRating,
          comment: reviewComment
        })
      });
      if (res.ok) {
        setReviewSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-zinc-500 mb-6 overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/" className="hover:text-zinc-900">হোম</Link>
        <ChevronRight size={12} />
        {product.category && (
          <>
            <Link href={`/category/${product.category.slug}`} className="hover:text-zinc-900">
              {product.category.nameBn || product.category.name}
            </Link>
            <ChevronRight size={12} />
          </>
        )}
        <span className="text-zinc-900 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Grid: Gallery & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Photo Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Photo */}
          <div className="relative aspect-[3/4] w-full bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200 shadow-sm group">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-[#D4AF37] text-black text-xs font-black px-2.5 py-1 rounded shadow">
                {product.discountPercent}% ছাড়
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${
                inWishlist ? 'bg-rose-50 text-rose-600' : 'bg-white/90 text-zinc-600 hover:text-rose-600'
              }`}
              aria-label="Wishlist"
            >
              <Heart size={20} className={inWishlist ? 'fill-rose-600' : ''} />
            </button>
          </div>

          {/* Thumbnails row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImage === img ? 'border-[#D4AF37] scale-105 shadow' : 'border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Buy Controls (7 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Title & SKU */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#b89528] uppercase tracking-wider">
                  {product.category?.nameBn || product.category?.name}
                </span>
                <span className="text-xs text-zinc-400">SKU: {product.sku}</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-serif font-bold text-zinc-900 mt-1">
                {product.name}
              </h1>
              {product.nameBn && (
                <p className="text-sm font-medium text-zinc-600 mt-0.5">{product.nameBn}</p>
              )}
            </div>

            {/* Rating Stars & View count */}
            <div className="flex items-center gap-4 text-xs text-zinc-500 pb-2 border-b border-zinc-100">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={i < 5 ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}
                  />
                ))}
                <span className="font-bold text-zinc-800 ml-1">
                  {product.reviews?.length ? '5.0' : 'New'}
                </span>
                <span className="text-zinc-400">({product.reviews?.length || 0} রিভিউ)</span>
              </div>
              <span>•</span>
              <span className="text-zinc-600">👀 {product.viewCount + 14} বার দেখা হয়েছে</span>
            </div>

            {/* Price Block (Offer Price, Regular Strike-through, Savings) */}
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200/80">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-[#b89528]">
                  {formatPrice(currentPrice)}
                </span>
                {regularPrice > currentPrice && (
                  <span className="text-base text-zinc-400 line-through">
                    {formatPrice(regularPrice)}
                  </span>
                )}
                {savings > 0 && (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded">
                    আপনার সাশ্রয় {formatPrice(savings)}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 mt-1.5 flex items-center gap-1.5">
                <Truck size={14} className="text-[#b89528]" />
                <span>
                  ডেলিভারি চার্জ: ঢাকা ৳৭০ | ঢাকার বাইরে ৳১৩০ | ২,০০০ টাকার অর্ডারে <strong>ফ্রি ডেলিভারি</strong>
                </span>
              </p>
            </div>

            {/* Colors Selection with Swatches */}
            {uniqueColors.length > 0 && (
              <div>
                <label className="text-xs font-bold text-zinc-900 block mb-2">
                  কালার (Select Colour): <span className="text-[#b89528]">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {uniqueColors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handleColorSelect(c)}
                      type="button"
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                        selectedColor === c.name
                          ? 'border-[#D4AF37] bg-[#fbf6e6] text-black shadow-sm ring-1 ring-[#D4AF37]'
                          : 'border-zinc-300 hover:border-zinc-500 text-zinc-800'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Selection with Out-of-Stock Disabled logic */}
            {uniqueSizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-zinc-900">
                    সাইজ (Select Size): <span className="text-[#b89528]">{selectedSize}</span>
                  </label>
                  {sizeChart && (
                    <button
                      onClick={() => setShowSizeChart(true)}
                      type="button"
                      className="text-xs font-semibold text-[#b89528] hover:underline flex items-center gap-1"
                    >
                      <Ruler size={13} />
                      <span>সাইজ চার্ট (Size Chart)</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {uniqueSizes.map((sz) => {
                    // Check stock for this size in selectedColor
                    const variantForSize = variants.find(
                      (v: any) => v.size === sz && (!selectedColor || v.colorName === selectedColor)
                    );
                    const sizeStock = variantForSize ? variantForSize.stock : 1;
                    const isSizeDisabled = sizeStock <= 0;

                    return (
                      <button
                        key={sz}
                        disabled={isSizeDisabled}
                        onClick={() => setSelectedSize(sz)}
                        type="button"
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all relative ${
                          isSizeDisabled
                            ? 'bg-zinc-100 text-zinc-400 border border-zinc-200 line-through cursor-not-allowed'
                            : selectedSize === sz
                            ? 'bg-black text-[#D4AF37] border-2 border-[#D4AF37] shadow-sm'
                            : 'bg-white border border-zinc-300 text-zinc-800 hover:border-black'
                        }`}
                      >
                        {sz}
                        {isSizeDisabled && (
                          <span className="block text-[9px] font-normal text-rose-500 -mt-0.5">
                            স্টক শেষ
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock per variant warning */}
            <div className="text-xs font-medium">
              {isOutOfStock ? (
                <span className="text-rose-600 font-bold">⚠️ এই সাইজ/কালারটি বর্তমানে স্টকে নেই</span>
              ) : currentStock <= 5 ? (
                <span className="text-amber-600 font-bold">⚡ আর মাত্র {currentStock} টি স্টকে রয়েছে! দ্রুত অর্ডার করুন।</span>
              ) : (
                <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                  <Check size={14} /> স্টকে এভেইলেবল রয়েছে (In Stock)
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs font-bold text-zinc-900">পরিমাণ:</span>
              <div className="flex items-center border border-zinc-300 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-zinc-600 hover:bg-zinc-100"
                  aria-label="Decrease"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 text-sm font-bold text-zinc-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(currentStock || 99, q + 1))}
                  className="px-3 py-2 text-zinc-600 hover:bg-zinc-100"
                  aria-label="Increase"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Buy Actions: Add to Cart and Order Now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl border-2 border-black text-black font-bold text-sm hover:bg-zinc-100 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={18} />
                <span>ব্যাগে রাখুন (Add To Cart)</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#D4AF37] hover:bg-[#b89528] text-black font-extrabold text-sm shadow-lg active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Zap size={18} className="fill-black" />
                <span>অর্ডার করুন (Order Now)</span>
              </button>
            </div>

            {/* Trust Policy Box */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-2 text-xs text-zinc-700">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#b89528] flex-shrink-0" />
                <span>১০০% আসল ও প্রিমিয়াম কোয়ালিটি পণ্য</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-[#b89528] flex-shrink-0" />
                <span>ক্যাশ অন ডেলিভারি (পণ্য চেক করে টাকা দেওয়ার সুবিধা)</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw size={16} className="text-[#b89528] flex-shrink-0" />
                <span>সহজ ৩ দিনের এক্সচেঞ্জ গ্যারান্টি</span>
              </div>
            </div>

            {/* Share buttons */}
            <div className="flex items-center gap-3 pt-2 text-xs text-zinc-500">
              <span className="font-semibold text-zinc-700">শেয়ার করুন:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-zinc-100 hover:bg-[#1877F2] hover:text-white transition-colors"
                aria-label="Share on Facebook"
              >
                <FacebookIcon size={15} />
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check this out: ${product.name} at Girlsgalary!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-zinc-100 hover:bg-[#25D366] hover:text-white transition-colors"
                aria-label="Share on WhatsApp"
              >
                <MessageCircle size={15} />
              </a>
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-1"
                aria-label="Copy Link"
              >
                {copiedLink ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                {copiedLink && <span className="text-[10px] text-emerald-600 font-bold">কপি হয়েছে</span>}
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Product Information, Fabric & Description */}
      <div className="mt-12 pt-8 border-t border-zinc-200">
        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-4">
          পণ্যের বিস্তারিত বিবরণ (Product Description)
        </h2>
        <div className="prose max-w-none text-sm text-zinc-700 space-y-3 leading-relaxed">
          <p>{product.description}</p>
          {product.descriptionBn && <p className="font-medium text-zinc-800">{product.descriptionBn}</p>}
        </div>

        {/* Specification Table */}
        <div className="mt-6 max-w-xl">
          <table className="w-full text-xs text-left border border-zinc-200 rounded-lg overflow-hidden">
            <tbody className="divide-y divide-zinc-200">
              {product.fabric && (
                <tr className="bg-zinc-50">
                  <td className="py-2.5 px-4 font-bold text-zinc-800 w-1/3">ফেব্রিক / উপাদান</td>
                  <td className="py-2.5 px-4 text-zinc-600">{product.fabric}</td>
                </tr>
              )}
              {product.careInstructions && (
                <tr>
                  <td className="py-2.5 px-4 font-bold text-zinc-800">যত্ন ও ধোয়া (Care)</td>
                  <td className="py-2.5 px-4 text-zinc-600">{product.careInstructions}</td>
                </tr>
              )}
              <tr className="bg-zinc-50">
                <td className="py-2.5 px-4 font-bold text-zinc-800">উৎপত্তি</td>
                <td className="py-2.5 px-4 text-zinc-600">১০০% অথেনটিক কালেকশন</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Reviews & Submit Form */}
      <div className="mt-12 pt-8 border-t border-zinc-200">
        <h2 className="text-xl font-serif font-bold text-zinc-900 mb-6">
          গ্রাহকদের রিভিউ (Customer Reviews & Ratings)
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Review List */}
          <div className="lg:col-span-7 space-y-4">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev: any) => (
                <div key={rev.id} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-zinc-900">{rev.customerName}</span>
                    <div className="flex items-center text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-700">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500 italic">
                এখনো কোনো রিভিউ দেওয়া হয়নি। আপনি প্রথম রিভিউ দিন!
              </p>
            )}
          </div>

          {/* Submit Review */}
          <div className="lg:col-span-5 bg-zinc-50 p-5 rounded-2xl border border-zinc-200">
            <h3 className="font-bold text-sm text-zinc-900 mb-3">একটি রিভিউ লিখুন</h3>
            {reviewSubmitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-lg font-medium">
                ✅ ধন্যবাদ! আপনার মূল্যবান রিভিউটি জমা হয়েছে। এডমিন অনুমোদনের পর তা প্রদর্শিত হবে।
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">রেটিং</label>
                  <div className="flex gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          size={18}
                          className={star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">আপনার নাম</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="যেমন: নুসরাত জাহান"
                    className="w-full bg-white border border-zinc-300 rounded-lg p-2.5 outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">মোবাইল নম্বর (অপশনাল)</label>
                  <input
                    type="tel"
                    value={reviewPhone}
                    onChange={(e) => setReviewPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-white border border-zinc-300 rounded-lg p-2.5 outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">মন্তব্য</label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="পণ্যটির মান ও অভিজ্ঞতা সম্পর্কে লিখুন..."
                    className="w-full bg-white border border-zinc-300 rounded-lg p-2.5 outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full bg-black text-[#D4AF37] font-bold py-2.5 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  {isSubmittingReview ? 'জমা হচ্ছে...' : 'রিভিউ সাবমিট করুন'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-8 border-t border-zinc-200">
          <h2 className="text-xl font-serif font-bold text-zinc-900 mb-6">
            সম্পর্কিত পণ্যসমূহ (You May Also Like)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((rel: any) => (
              <ProductCard
                key={rel.id}
                id={rel.id}
                name={rel.name}
                nameBn={rel.nameBn}
                slug={rel.slug}
                coverImage={rel.coverImage}
                regularPrice={rel.regularPrice}
                offerPrice={rel.offerPrice}
                discountPercent={rel.discountPercent}
                totalStock={rel.totalStock}
                categoryName={rel.category?.nameBn || rel.category?.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Chart Modal */}
      {showSizeChart && sizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <h3 className="font-serif font-bold text-base text-zinc-900 flex items-center gap-2">
                <Ruler size={18} className="text-[#b89528]" />
                <span>সাইজ চার্ট (Size Chart in Inches)</span>
              </h3>
              <button
                onClick={() => setShowSizeChart(false)}
                className="text-zinc-400 hover:text-zinc-800 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-zinc-100 border-b text-zinc-800">
                    {Object.keys(sizeChart[0] || {}).map((col) => (
                      <th key={col} className="p-2.5 font-bold uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {sizeChart.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-zinc-50">
                      {Object.values(row).map((val: any, j: number) => (
                        <td key={j} className="p-2.5 font-medium text-zinc-700">
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-zinc-500 mt-4 italic text-center">
              * সকল মাপ ইঞ্চি (Inches) হিসেবে প্রদত্ত। শরীরের সাথে সঠিক মাপ মিলিয়ে নিন।
            </p>
          </div>
        </div>
      )}

      {/* Sticky Buy Bar on Mobile */}
      {/* Page 2 & 4 Requirement: Sticky Buy Bar on mobile without covering prices or form */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-white border-t border-zinc-200 p-2.5 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <div className="text-xs text-zinc-500 font-medium leading-none">মোট মূল্য:</div>
          <div className="text-base font-extrabold text-[#b89528] leading-tight">
            {formatPrice(currentPrice)}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-[240px]">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 py-2.5 px-2 bg-zinc-900 text-white font-bold text-xs rounded-lg active:scale-95 disabled:opacity-40"
          >
            ব্যাগে রাখুন
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="flex-1 py-2.5 px-2 bg-[#D4AF37] text-black font-extrabold text-xs rounded-lg shadow active:scale-95 disabled:opacity-40"
          >
            অর্ডার করুন
          </button>
        </div>
      </div>

    </div>
  );
}
