'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';

export default function AdminNewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);

  // Product fields
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [sku, setSku] = useState(`GG-${Math.floor(1000 + Math.random() * 9000)}`);
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [regularPrice, setRegularPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [description, setDescription] = useState('');
  const [fabric, setFabric] = useState('');
  const [careInstructions, setCareInstructions] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80');
  const [image2, setImage2] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);

  // Dynamic Variants (Sizes, Real Colour Names, Colour Hex, Stock, Price Diff)
  const [variants, setVariants] = useState<any[]>([
    { size: 'Free Size', colorName: 'Maroon', colorHex: '#800000', stock: 10, priceDiff: 0 },
    { size: 'Free Size', colorName: 'Bottle Green', colorHex: '#006A4E', stock: 15, priceDiff: 0 }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          setCategoryId(data[0].id);
        }
      });
  }, []);

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { size: 'M', colorName: 'Black', colorHex: '#000000', stock: 5, priceDiff: 0 }
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    setVariants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !regularPrice || !offerPrice || !categoryId) {
      setError('অনুগ্রহ করে পণ্যের নাম, ক্যাটাগরি ও মূল্য প্রদান করুন');
      return;
    }

    setLoading(true);
    setError('');

    const imagesList = [coverImage];
    if (image2) imagesList.push(image2);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          nameBn,
          sku,
          categoryId,
          subCategoryId: subCategoryId || undefined,
          regularPrice: Number(regularPrice),
          offerPrice: Number(offerPrice),
          description,
          fabric,
          careInstructions,
          coverImage,
          images: imagesList,
          isFeatured,
          isNewArrival,
          variants
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'পণ্য সংরক্ষণ করতে সমস্যা হয়েছে');
      } else {
        router.push('/admin/products');
      }
    } catch (err) {
      setError('সার্ভারে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategoryObj = categories.find((c) => c.id === categoryId);

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white rounded-xl border border-zinc-200 text-zinc-600 hover:text-black"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
              নতুন পণ্য যোগ করুন (Add Product)
            </h1>
            <p className="text-xs text-zinc-500">
              বাস্তব সাইজ, কালার নাম ও ভ্যারিয়েন্ট স্টক সহ নতুন পণ্য তৈরি করুন
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          {/* Card 1: Basic Info */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-zinc-900 border-b pb-2">
              সাধারণ বিবরণ (Basic Details)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-zinc-800 mb-1">পণ্যের নাম (English) *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Traditional Dhakai Jamdani Saree"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">পণ্যের নাম (বাংলা) *</label>
                <input
                  type="text"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="যেমন: ঐতিহ্যবাহী ঢাকাই জামদানি শাড়ি"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-zinc-800 mb-1">SKU কোড</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg font-mono outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">ক্যাটাগরি *</label>
                <select
                  value={categoryId}
                  onChange={(e) => { setCategoryId(e.target.value); setSubCategoryId(''); }}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.nameBn || c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">সাব-ক্যাটাগরি</label>
                <select
                  value={subCategoryId}
                  onChange={(e) => setSubCategoryId(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg outline-none cursor-pointer"
                >
                  <option value="">নির্বাচন করুন (ঐচ্ছিক)</option>
                  {selectedCategoryObj?.subCategories?.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.nameBn || s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-zinc-800 mb-1">নিয়মিত মূল্য (Regular Price ৳) *</label>
                <input
                  type="number"
                  required
                  value={regularPrice}
                  onChange={(e) => setRegularPrice(e.target.value)}
                  placeholder="3500"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg font-mono outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">অফার মূল্য (Offer Price ৳) *</label>
                <input
                  type="number"
                  required
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  placeholder="2950"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg font-mono outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-zinc-800 mb-1">বর্ণনা (Description)</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="পণ্যের বিস্তারিত বিবরণ..."
                className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-zinc-800 mb-1">ফেব্রিক / উপাদান (Fabric / Material)</label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  placeholder="যেমন: Pure Georgette / Cotton"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">ধোয়ার যত্ন (Care Note)</label>
                <input
                  type="text"
                  value={careInstructions}
                  onChange={(e) => setCareInstructions(e.target.value)}
                  placeholder="যেমন: Dry Clean Only"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg outline-none"
                />
              </div>
            </div>

            {/* Photo links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-zinc-800 mb-1">মূল কভার ছবি (Cover Photo URL) *</label>
                <input
                  type="url"
                  required
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">অতিরিক্ত ছবি (Photo 2 URL)</label>
                <input
                  type="url"
                  value={image2}
                  onChange={(e) => setImage2(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Variants Generator (Real Sizes, Real Colour Names, Swatches & Stock) */}
          {/* Page 4 & Page 8 Rule:
              - Real size list: S, M, L, XL or Free size
              - Real colour names: Maroon, Bottle Green, Baby Pink with colour swatch
              - Each size-colour carries its own stock
          */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h2 className="text-sm font-bold text-zinc-900">
                  সাইজ, কালার ও ভ্যারিয়েন্ট স্টক (Sizes & Colors)
                </h2>
                <p className="text-[11px] text-zinc-500">
                  প্রতিটি সাইজ ও কালার কম্বিনেশনের আলাদা স্টক নির্ধারণ করুন
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddVariant}
                className="px-3 py-1.5 bg-black text-[#D4AF37] font-bold rounded-lg flex items-center gap-1"
              >
                <Plus size={14} />
                <span>+ ভ্যারিয়েন্ট যোগ</span>
              </button>
            </div>

            <div className="space-y-3">
              {variants.map((v, idx) => (
                <div key={idx} className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-600 mb-0.5">সাইজ (Size)</label>
                    <input
                      type="text"
                      value={v.size}
                      onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                      placeholder="e.g. Free Size, S, M, 38"
                      className="w-full p-2 bg-white border border-zinc-300 rounded font-medium outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-600 mb-0.5">কালার নাম (Real Color)</label>
                    <input
                      type="text"
                      value={v.colorName}
                      onChange={(e) => handleVariantChange(idx, 'colorName', e.target.value)}
                      placeholder="e.g. Maroon, Bottle Green"
                      className="w-full p-2 bg-white border border-zinc-300 rounded font-medium outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-600 mb-0.5">কালার সোয়াচ (Hex)</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={v.colorHex || '#000000'}
                        onChange={(e) => handleVariantChange(idx, 'colorHex', e.target.value)}
                        className="w-7 h-7 p-0.5 rounded border border-zinc-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={v.colorHex || '#000000'}
                        onChange={(e) => handleVariantChange(idx, 'colorHex', e.target.value)}
                        className="w-full p-2 bg-white border border-zinc-300 rounded font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-600 mb-0.5">স্টক পরিমাণ (Stock)</label>
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => handleVariantChange(idx, 'stock', Number(e.target.value))}
                      className="w-full p-2 bg-white border border-zinc-300 rounded font-bold font-mono outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-3 sm:pt-0">
                    <button
                      type="button"
                      disabled={variants.length <= 1}
                      onClick={() => handleRemoveVariant(idx)}
                      className="p-2 text-zinc-400 hover:text-rose-600 rounded border hover:bg-white disabled:opacity-30"
                      title="মুছুন"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 bg-zinc-200 text-zinc-800 font-bold rounded-xl"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#b89528] text-black font-extrabold rounded-xl shadow-lg disabled:opacity-50"
            >
              {loading ? 'সংরক্ষণ হচ্ছে...' : 'পণ্য প্রকাশ করুন (Save & Publish)'}
            </button>
          </div>

        </form>

      </div>
    </AdminLayout>
  );
}
