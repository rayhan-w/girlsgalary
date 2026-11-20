'use client';

import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, ChevronDown, X, Sparkles, Check } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { formatPrice } from '@/lib/utils';

interface CatalogClientProps {
  initialCategorySlug?: string;
  categoryName?: string;
  categoryNameBn?: string;
  categoryBanner?: string;
  initialSearch?: string;
}

export const CatalogClient: React.FC<CatalogClientProps> = ({
  initialCategorySlug,
  categoryName,
  categoryNameBn,
  categoryBanner,
  initialSearch
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug || '');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('newest');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || '');

  // Mobile Bottom Sheet Filter state
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Load categories and brands
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch products with active filters
  const fetchProducts = async (currentPage = 1, append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedSubCategory) params.set('subcategory', selectedSubCategory);
      if (selectedSort) params.set('sort', selectedSort);
      if (inStockOnly) params.set('inStock', 'true');
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (selectedBrand) params.set('brand', selectedBrand);
      if (searchQuery) params.set('search', searchQuery);
      params.set('page', String(currentPage));
      params.set('limit', '12');

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (append) {
          setProducts((prev) => [...prev, ...(data.products || [])]);
        } else {
          setProducts(data.products || []);
        }
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.totalCount || 0);
      }
    } catch (err) {
      console.error('Error fetching catalog products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchProducts(1, false);
  }, [selectedCategory, selectedSubCategory, selectedSort, inStockOnly, minPrice, maxPrice, selectedBrand, searchQuery]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage, true);
    }
  };

  const handleResetFilters = () => {
    setSelectedSubCategory('');
    setInStockOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrand('');
    setSelectedSort('newest');
  };

  // Active subcategories for selected category
  const currentCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const subCategories = currentCategoryObj?.subCategories || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      
      {/* Category Banner if exists */}
      {categoryBanner && (
        <div className="relative h-36 sm:h-56 rounded-2xl overflow-hidden mb-8 border border-zinc-200 shadow-md">
          <img src={categoryBanner} alt={categoryName || 'Category'} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-6 sm:p-10">
            <div>
              <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">কালেকশন</span>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white mt-1">
                {categoryNameBn || categoryName}
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Header and Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
            {searchQuery ? `অনুসন্ধান ফলাফল: "${searchQuery}"` : (categoryNameBn || categoryName || 'সকল পণ্য')}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            মোট <span className="font-bold text-zinc-800">{totalCount}</span> টি পণ্য পাওয়া গেছে
          </p>
        </div>

        {/* Sorting & Mobile Filter Button */}
        <div className="flex items-center gap-2">
          {/* Mobile Filter Sheet Trigger */}
          <button
            onClick={() => setIsFilterSheetOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg text-xs font-semibold"
          >
            <SlidersHorizontal size={14} />
            <span>ফিল্টার</span>
            {(inStockOnly || minPrice || maxPrice || selectedSubCategory) && (
              <span className="w-2 h-2 rounded-full bg-[#b89528]" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-zinc-300 rounded-lg px-2.5 py-1.5 text-xs">
            <span className="text-zinc-500 hidden sm:inline">সর্ট করুন:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-transparent font-medium text-zinc-800 outline-none cursor-pointer"
            >
              <option value="newest">সর্বশেষ যুক্ত (Newest)</option>
              <option value="price_asc">মূল্য: কম থেকে বেশি (Low to High)</option>
              <option value="price_desc">মূল্য: বেশি থেকে কম (High to Low)</option>
              <option value="best_selling">জনপ্রিয় ও বিক্রিত (Best Selling)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout Grid (Desktop Sidebar + Product Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6 bg-zinc-50 p-5 rounded-2xl border border-zinc-200/80 h-fit sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
              <Filter size={16} className="text-[#b89528]" />
              <span>ফিল্টার করুন</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-600 hover:underline font-medium"
            >
              রিসেট
            </button>
          </div>

          {/* Categories Filter */}
          {!initialCategorySlug && (
            <div>
              <label className="text-xs font-bold text-zinc-900 block mb-2">ক্যাটাগরি</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                <button
                  onClick={() => { setSelectedCategory(''); setSelectedSubCategory(''); }}
                  className={`w-full text-left px-2 py-1.5 rounded transition-colors ${
                    !selectedCategory ? 'bg-[#fbf6e6] text-[#b89528] font-bold' : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  সকল ক্যাটাগরি
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCategory(c.slug); setSelectedSubCategory(''); }}
                    className={`w-full text-left px-2 py-1.5 rounded transition-colors ${
                      selectedCategory === c.slug ? 'bg-[#fbf6e6] text-[#b89528] font-bold' : 'text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {c.nameBn || c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subcategories if any */}
          {subCategories.length > 0 && (
            <div>
              <label className="text-xs font-bold text-zinc-900 block mb-2">সাব-ক্যাটাগরি</label>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedSubCategory('')}
                  className={`w-full text-left px-2 py-1 rounded ${
                    !selectedSubCategory ? 'bg-[#fbf6e6] text-[#b89528] font-bold' : 'text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  সব সাব-ক্যাটাগরি
                </button>
                {subCategories.map((sub: any) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubCategory(sub.slug)}
                    className={`w-full text-left px-2 py-1 rounded ${
                      selectedSubCategory === sub.slug ? 'bg-[#fbf6e6] text-[#b89528] font-bold' : 'text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    • {sub.nameBn || sub.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* In Stock Only Toggle */}
          <div className="pt-2 border-t border-zinc-200">
            <label className="flex items-center gap-2 text-xs font-semibold text-zinc-800 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#D4AF37] focus:ring-[#D4AF37]"
              />
              <span>শুধু স্টকে থাকা পণ্য (In Stock Only)</span>
            </label>
          </div>

          {/* Price Range Filter */}
          <div className="pt-2 border-t border-zinc-200">
            <label className="text-xs font-bold text-zinc-900 block mb-2">মূল্য পরিসর (টাকা)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="মিনিমাম"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-1/2 p-2 bg-white border border-zinc-300 rounded text-xs outline-none focus:border-[#D4AF37]"
              />
              <span className="text-zinc-400">-</span>
              <input
                type="number"
                placeholder="ম্যাক্সিমাম"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-1/2 p-2 bg-white border border-zinc-300 rounded text-xs outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </aside>

        {/* Product Grid (3 cols on desktop, 2 cols on mobile) */}
        <main className="lg:col-span-3">
          {products.length === 0 && !loading ? (
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-12 text-center">
              <p className="text-base font-semibold text-zinc-800">কোনো পণ্য পাওয়া যায়নি</p>
              <p className="text-xs text-zinc-500 mt-1">
                অন্য কোনো ফিল্টার বা অনুসন্ধান শব্দ ব্যবহার করে দেখুন
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-[#D4AF37] text-black text-xs font-bold rounded-lg"
              >
                সব ফিল্টার মুছুন
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    nameBn={p.nameBn}
                    slug={p.slug}
                    coverImage={p.coverImage}
                    regularPrice={p.regularPrice}
                    offerPrice={p.offerPrice}
                    discountPercent={p.discountPercent}
                    totalStock={p.totalStock}
                    averageRating={p.averageRating}
                    reviewCount={p.reviewCount}
                    categoryName={p.category?.nameBn || p.category?.name}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {page < totalPages && (
                <div className="mt-10 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="px-8 py-3 bg-white border-2 border-black hover:bg-black hover:text-[#D4AF37] text-black font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm disabled:opacity-50"
                  >
                    {loading ? 'লোড হচ্ছে...' : 'আরও পণ্য দেখুন (Load More)'}
                  </button>
                  <p className="text-[11px] text-zinc-500 mt-2">
                    {products.length} of {totalCount} টি পণ্য প্রদর্শিত হচ্ছে
                  </p>
                </div>
              )}
            </>
          )}
        </main>

      </div>

      {/* Mobile Bottom Sheet Filters Modal */}
      {/* Page 3 Rule: On mobile, filters open as a bottom sheet */}
      {isFilterSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsFilterSheetOpen(false)}
          />

          <div className="relative w-full bg-white rounded-t-2xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto z-50 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <h3 className="font-serif font-bold text-base text-zinc-900 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#b89528]" />
                <span>ফিল্টার সমূহ</span>
              </h3>
              <button
                onClick={() => setIsFilterSheetOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 text-xs">
              {/* In stock toggle */}
              <label className="flex items-center gap-2 font-semibold text-zinc-800">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-[#D4AF37]"
                />
                <span>শুধু স্টকে থাকা পণ্য (In Stock Only)</span>
              </label>

              {/* Price range */}
              <div>
                <label className="font-bold text-zinc-900 block mb-2">মূল্য পরিসর (টাকা)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="মিনিমাম"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-1/2 p-2 border rounded"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="ম্যাক্সিমাম"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-1/2 p-2 border rounded"
                  />
                </div>
              </div>

              {/* Subcategories */}
              {subCategories.length > 0 && (
                <div>
                  <label className="font-bold text-zinc-900 block mb-2">সাব-ক্যাটাগরি</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedSubCategory('')}
                      className={`px-3 py-1.5 rounded-full border ${
                        !selectedSubCategory ? 'bg-black text-[#D4AF37] border-black' : 'border-zinc-300'
                      }`}
                    >
                      সব
                    </button>
                    {subCategories.map((sub: any) => (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedSubCategory(sub.slug)}
                        className={`px-3 py-1.5 rounded-full border ${
                          selectedSubCategory === sub.slug ? 'bg-black text-[#D4AF37] border-black' : 'border-zinc-300'
                        }`}
                      >
                        {sub.nameBn || sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t flex gap-3">
              <button
                onClick={() => { handleResetFilters(); setIsFilterSheetOpen(false); }}
                className="flex-1 py-3 border border-zinc-300 rounded-xl font-bold text-zinc-700"
              >
                রিসেট
              </button>
              <button
                onClick={() => setIsFilterSheetOpen(false)}
                className="flex-1 py-3 bg-[#D4AF37] text-black rounded-xl font-bold"
              >
                প্রয়োগ করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
