'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { StorefrontLayout } from '@/components/StorefrontLayout';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const { language, t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wishlist.length) {
      setProducts([]);
      setLoading(false);
      return;
    }

    fetch('/api/products?limit=50')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          const filtered = data.products.filter((p: any) => wishlist.includes(p.id));
          setProducts(filtered);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [wishlist]);

  return (
    <StorefrontLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between pb-4 border-b mb-6">
          <div className="flex items-center gap-2">
            <Heart size={24} className="fill-rose-600 text-rose-600" />
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
              {t('পছন্দের তালিকা', 'My Wishlist')}
            </h1>
          </div>
          <span className="text-xs text-zinc-500 font-medium">
            {wishlist.length} {t('টি পণ্য সংরক্ষিত', 'items saved')}
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div className="py-16 text-center bg-zinc-50 rounded-2xl border border-zinc-200">
            <Heart size={48} className="text-zinc-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-zinc-800">
              {t('আপনার পছন্দের তালিকা খালি', 'Your Wishlist is Empty')}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {t(
                'যেকোনো পণ্যের ওপর হার্ট আইকনে ট্যাপ করে এখানে সংরক্ষণ করতে পারেন',
                'Tap the heart icon on any product to save it here for later'
              )}
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-bold text-xs rounded-xl hover:bg-[#b89528]"
            >
              <span>{t('শপিং শুরু করুন', 'Start Shopping')}</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {products.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] bg-zinc-100">
                  <Link href={`/product/${item.slug}`}>
                    <img src={item.coverImage} alt={item.name} className="w-full h-full object-cover" />
                  </Link>
                  <button
                    onClick={() => toggleWishlist(item.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-rose-600 flex items-center justify-center shadow"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="p-3 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-900 line-clamp-1">
                      {language === 'bn' && item.nameBn ? item.nameBn : item.name}
                    </h3>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-sm font-extrabold text-[#b89528]">{formatPrice(item.offerPrice)}</span>
                      {item.regularPrice > item.offerPrice && (
                        <span className="text-xs text-zinc-400 line-through">{formatPrice(item.regularPrice)}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      addToCart({
                        productId: item.id,
                        name: item.name,
                        slug: item.slug,
                        image: item.coverImage,
                        price: item.offerPrice,
                        regularPrice: item.regularPrice,
                        quantity: 1,
                        maxStock: item.totalStock || 10
                      })
                    }
                    className="mt-3 w-full py-2 bg-black text-[#D4AF37] font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 hover:bg-zinc-800"
                  >
                    <ShoppingBag size={13} />
                    <span>{t('ব্যাগে যোগ করুন', 'Add to Bag')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
