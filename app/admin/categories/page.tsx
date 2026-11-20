'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Edit, Check, AlertCircle, Ruler } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New category form
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [photo, setPhoto] = useState('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80');
  const [subCategoriesInput, setSubCategoriesInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchCats = () => {
    setLoading(true);
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setMsg('');
    const subs = subCategoriesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          nameBn: nameBn.trim() || undefined,
          photo,
          order: categories.length + 1,
          subCategories: subs
        })
      });

      if (res.ok) {
        setName('');
        setNameBn('');
        setSubCategoriesInput('');
        setMsg('নতুন ক্যাটাগরি সফলভাবে যুক্ত হয়েছে!');
        fetchCats();
      }
    } catch (err) {
      setMsg('সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
            ক্যাটাগরি ও সাব-ক্যাটাগরি ব্যবস্থাপনা (Categories)
          </h1>
          <p className="text-xs text-zinc-500">
            শপের ৮টি মূল ক্যাটাগরি ও সাব-ক্যাটাগরি নিয়ন্ত্রণ করুন। হোমপেজের ক্রম এখান থেকেই পরিচালিত হয়।
          </p>
        </div>

        {msg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold">
            {msg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Add Category Form (5 cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-4 text-xs">
            <h2 className="font-bold text-sm text-zinc-900 flex items-center gap-1.5 border-b pb-2">
              <Plus size={16} className="text-[#b89528]" />
              <span>নতুন ক্যাটাগরি যোগ করুন</span>
            </h2>

            <form onSubmit={handleAddCategory} className="space-y-3">
              <div>
                <label className="block font-bold text-zinc-800 mb-1">ক্যাটাগরি নাম (English) *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Saree, Kurti, Bag"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">ক্যাটাগরি নাম (বাংলা)</label>
                <input
                  type="text"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="যেমন: শাড়ি, থ্রি-পিস"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">ছবির URL (Photo)</label>
                <input
                  type="url"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg font-mono outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">
                  সাব-ক্যাটাগরি সমূহ (কমা দিয়ে লিখুন)
                </label>
                <input
                  type="text"
                  value={subCategoriesInput}
                  onChange={(e) => setSubCategoriesInput(e.target.value)}
                  placeholder="যেমন: Jamdani, Georgette, Cotton"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-lg outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#b89528] text-black font-extrabold rounded-xl shadow mt-2"
              >
                {isSubmitting ? 'যুক্ত হচ্ছে...' : 'ক্যাটাগরি যোগ করুন'}
              </button>
            </form>
          </div>

          {/* Right: Existing Categories List (7 cols) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <h2 className="font-bold text-sm text-zinc-900 border-b pb-2 flex items-center justify-between">
              <span>সক্রিয় ক্যাটাগরি তালিকা ({categories.length})</span>
              <span className="text-xs text-zinc-400 font-normal">ক্রম অনুসারে সাজানো</span>
            </h2>

            <div className="divide-y divide-zinc-100 text-xs">
              {categories.map((c, idx) => (
                <div key={c.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-5 font-mono font-bold text-zinc-400 text-center">{idx + 1}</span>
                    <img
                      src={c.photo || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=100&q=80'}
                      alt={c.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div>
                      <p className="font-bold text-zinc-900">
                        {c.nameBn || c.name} <span className="text-zinc-400 font-normal">({c.name})</span>
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        সাব-ক্যাটাগরি: {c.subCategories?.map((s: any) => s.name).join(', ') || 'নেই'}
                      </p>
                    </div>
                  </div>

                  <span className="text-zinc-500 font-bold bg-zinc-100 px-2.5 py-1 rounded-full text-[10px]">
                    {c._count?.products || 0} টি পণ্য
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
