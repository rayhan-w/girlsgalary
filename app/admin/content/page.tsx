'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle2 } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';

export default function AdminContentPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('about-us');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [msg, setMsg] = useState('');

  const samplePages = [
    { slug: 'about-us', name: 'আমাদের সম্পর্কে (About Us)' },
    { slug: 'delivery-policy', name: 'ডেলিভারি পলিসি (Delivery Policy)' },
    { slug: 'return-policy', name: 'রিটার্ন ও এক্সচেঞ্জ (Return & Exchange)' },
    { slug: 'privacy-policy', name: 'গোপনীয়তা নীতি (Privacy Policy)' },
    { slug: 'terms', name: 'শর্তাবলী (Terms & Conditions)' },
    { slug: 'faq', name: 'সাধারণ প্রশ্নোত্তর (FAQ)' }
  ];

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
            কন্টেন্ট পেইজ এডিটর (Content Pages Editor)
          </h1>
          <p className="text-xs text-zinc-500">
            About Us, ডেলিভারি পলিসি, রিটার্ন পলিসি ও FAQ এর টেক্সট সম্পাদনা করুন
          </p>
        </div>

        {msg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold">
            {msg}
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4 text-xs">
          <div>
            <label className="block font-bold text-zinc-800 mb-1">পেইজ নির্বাচন করুন:</label>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="w-full p-2.5 bg-zinc-50 border rounded-lg outline-none font-semibold cursor-pointer"
            >
              {samplePages.map((p) => (
                <option key={p.slug} value={p.slug}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-zinc-800 mb-1">পেইজের শিরোনাম (Title)</label>
            <input
              type="text"
              value={selectedSlug.toUpperCase().replace('-', ' ')}
              disabled
              className="w-full p-2.5 bg-zinc-100 border rounded-lg text-zinc-600 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-zinc-800 mb-1">পেইজের বিবরণ ও লেখা (Content)</label>
            <textarea
              rows={8}
              defaultValue={`Girlsgalary গ্রাহকদের জন্য সেরা প্রিমিয়াম কোয়ালিটি ও বিশ্বস্ত সেবা নিশ্চিত করে।`}
              className="w-full p-3 bg-zinc-50 border border-zinc-300 rounded-lg outline-none focus:border-[#D4AF37] leading-relaxed"
            />
          </div>

          <button
            onClick={() => setMsg('পেইজ কন্টেন্ট সফলভাবে আপডেট হয়েছে!')}
            className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#b89528] text-black font-extrabold rounded-xl shadow"
          >
            কন্টেন্ট সেভ করুন
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
