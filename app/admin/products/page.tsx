'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, Package, CheckCircle2, XCircle } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { formatPrice } from '@/lib/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    fetch(`/api/products?search=${encodeURIComponent(search)}&limit=50`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
              পণ্য সম্ভার ও তালিকা (Product Catalog)
            </h1>
            <p className="text-xs text-zinc-500">
              মোট {products.length} টি সক্রিয় পণ্য রয়েছে
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#b89528] text-black font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>নতুন পণ্য যোগ করুন (Add Product)</span>
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-2">
          <Search size={16} className="text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="পণ্যের নাম বা SKU লিখে খুঁজুন..."
            className="w-full bg-transparent text-xs text-zinc-900 outline-none"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-zinc-400 text-xs">লোড হচ্ছে...</div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 text-xs italic">
              কোনো পণ্য পাওয়া যায়নি।
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 text-zinc-600 border-b border-zinc-200">
                  <tr>
                    <th className="p-3 font-bold">পণ্য</th>
                    <th className="p-3 font-bold">ক্যাটাগরি</th>
                    <th className="p-3 font-bold">মূল্য</th>
                    <th className="p-3 font-bold">স্টক</th>
                    <th className="p-3 font-bold">ভ্যারিয়েন্ট</th>
                    <th className="p-3 font-bold text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-50/80">
                      <td className="p-3 flex items-center gap-3">
                        <img
                          src={p.coverImage}
                          alt={p.name}
                          className="w-12 h-14 object-cover rounded-md border"
                        />
                        <div>
                          <p className="font-bold text-zinc-900">{p.name}</p>
                          <span className="font-mono text-[10px] text-zinc-400">SKU: {p.sku}</span>
                        </div>
                      </td>

                      <td className="p-3 font-medium text-zinc-700">
                        {p.category?.nameBn || p.category?.name}
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-[#b89528] block">{formatPrice(p.offerPrice)}</span>
                        {p.regularPrice > p.offerPrice && (
                          <span className="text-[10px] text-zinc-400 line-through">
                            {formatPrice(p.regularPrice)}
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                          p.totalStock > 5
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.totalStock > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {p.totalStock} টি
                        </span>
                      </td>

                      <td className="p-3 text-zinc-600 font-medium">
                        {p.variantsCount} টি সাইজ/কালার
                      </td>

                      <td className="p-3 text-right space-x-1 whitespace-nowrap">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="p-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg inline-block"
                          title="শপে দেখুন"
                        >
                          <Eye size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
