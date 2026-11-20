'use client';

import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Save, Eye, EyeOff } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';

export default function AdminTrackingPage() {
  const [pixelId, setPixelId] = useState('');
  const [capiToken, setCapiToken] = useState('');
  const [gtmId, setGtmId] = useState('');
  const [ga4Id, setGa4Id] = useState('');
  const [domainVerification, setDomainVerification] = useState('');
  const [isPixelEnabled, setIsPixelEnabled] = useState(true);
  const [isGtmEnabled, setIsGtmEnabled] = useState(true);
  const [isGa4Enabled, setIsGa4Enabled] = useState(true);
  const [showToken, setShowToken] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setPixelId(data.metaPixelId || '123456789012345');
          setCapiToken('••••••••••••••••••••••••••••••••');
          setGtmId(data.gtmId || 'GTM-GG0001');
          setGa4Id(data.ga4Id || 'G-GG12345678');
          setDomainVerification(data.metaDomainVerification || '');
          setIsPixelEnabled(data.isPixelEnabled ?? true);
          setIsGtmEnabled(data.isGtmEnabled ?? true);
          setIsGa4Enabled(data.isGa4Enabled ?? true);
        }
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metaPixelId: pixelId,
          gtmId,
          ga4Id,
          metaDomainVerification: domainVerification,
          isPixelEnabled,
          isGtmEnabled,
          isGa4Enabled
        })
      });
      setMsg('মার্কেটিং ট্র্যাকিং সেটিংস সংরক্ষিত হয়েছে!');
    } catch (e) {
      setMsg('সমস্যা হয়েছে।');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
            মার্কেটিং ও ই-কমার্স ট্র্যাকিং (Pixel, CAPI, GA4, GTM)
          </h1>
          <p className="text-xs text-zinc-500">
            Facebook Meta Pixel, Server-side Conversions API (CAPI), Google Tag Manager ও GA4 কনফিগারেশন
          </p>
        </div>

        {msg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold">
            {msg}
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-5 text-xs">
          
          {/* Meta Pixel */}
          <div className="space-y-3 pb-4 border-b">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-900 text-sm">Meta (Facebook) Pixel & CAPI</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPixelEnabled}
                  onChange={(e) => setIsPixelEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#D4AF37]"
                />
                <span className="font-semibold text-zinc-700">চালু রাখুন (Enabled)</span>
              </label>
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Meta Pixel ID</label>
              <input
                type="text"
                value={pixelId}
                onChange={(e) => setPixelId(e.target.value)}
                placeholder="e.g. 123456789012345"
                className="w-full p-2.5 bg-zinc-50 border rounded-lg font-mono"
              />
            </div>

            {/* Masked CAPI token */}
            <div>
              <label className="block font-bold text-zinc-700 mb-1">
                Conversions API (CAPI) Access Token (Server-Side Masked)
              </label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={capiToken}
                  onChange={(e) => setCapiToken(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border rounded-lg font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                >
                  {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <p className="text-[10px] text-zinc-400 mt-1">
                * সিকিউরিটি নিয়ম: টোকেন শুধুমাত্র সার্ভার সাইডে সংরক্ষিত এবং কখনো ব্রাউজার পেজ সোর্সে এক্সপোজ হয় না।
              </p>
            </div>
          </div>

          {/* GTM & GA4 */}
          <div className="space-y-3 pb-4 border-b">
            <span className="font-bold text-zinc-900 text-sm block">Google Tag Manager & GA4</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">GTM Container ID</label>
                <input
                  type="text"
                  value={gtmId}
                  onChange={(e) => setGtmId(e.target.value)}
                  placeholder="GTM-XXXXXX"
                  className="w-full p-2.5 bg-zinc-50 border rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">GA4 Measurement ID</label>
                <input
                  type="text"
                  value={ga4Id}
                  onChange={(e) => setGa4Id(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full p-2.5 bg-zinc-50 border rounded-lg font-mono"
                />
              </div>
            </div>
          </div>

          {/* Domain Verification */}
          <div>
            <label className="block font-bold text-zinc-700 mb-1">
              Facebook Domain Verification Meta Tag
            </label>
            <input
              type="text"
              value={domainVerification}
              onChange={(e) => setDomainVerification(e.target.value)}
              placeholder='<meta name="facebook-domain-verification" content="..." />'
              className="w-full p-2.5 bg-zinc-50 border rounded-lg font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#D4AF37] hover:bg-[#b89528] text-black font-extrabold rounded-xl shadow"
          >
            ট্র্যাকিং সেটিংস সেভ করুন
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
