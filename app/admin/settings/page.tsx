'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, ShieldCheck, Truck, Phone } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setSettings(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setMsg('সব সেটিংস সফলভাবে সংরক্ষিত ও শপে আপডেট হয়েছে!');
      }
    } catch (e) {
      setMsg('সংরক্ষণে সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><div className="py-20 text-center text-xs">লোড হচ্ছে...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
            শপ সেটিংস ও কন্ট্রোল (Shop Settings)
          </h1>
          <p className="text-xs text-zinc-500">
            হটলাইন, হোয়াটসঅ্যাপ নম্বর, ডেলিভারি চার্জ, বিকাশ/নগদ নম্বর ও পলিসি নিয়ন্ত্রণ করুন
          </p>
        </div>

        {msg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{msg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          
          {/* Card 1: General Info */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <h2 className="font-bold text-sm text-zinc-900 border-b pb-2 flex items-center gap-1.5">
              <Phone size={16} className="text-[#b89528]" />
              <span>যোগাযোগ ও সাধারণ তথ্য</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-zinc-800 mb-1">শপের নাম</label>
                <input
                  type="text"
                  value={settings.shopName || ''}
                  onChange={(e) => handleChange('shopName', e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">হটলাইন নম্বর</label>
                <input
                  type="text"
                  value={settings.hotline || ''}
                  onChange={(e) => handleChange('hotline', e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border rounded-lg font-mono outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">WhatsApp নম্বর (country code সহ)</label>
                <input
                  type="text"
                  value={settings.whatsappNumber || ''}
                  onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                  placeholder="88017XXXXXXXX"
                  className="w-full p-2.5 bg-zinc-50 border rounded-lg font-mono outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">সাপোর্ট ইমেইল</label>
                <input
                  type="email"
                  value={settings.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border rounded-lg font-mono outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-zinc-800 mb-1">টপ বার অফার লাইন</label>
              <input
                type="text"
                value={settings.topBarOffer || ''}
                onChange={(e) => handleChange('topBarOffer', e.target.value)}
                className="w-full p-2.5 bg-zinc-50 border rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-800 mb-1">ঠিকানা (Showroom / Office Address)</label>
              <input
                type="text"
                value={settings.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full p-2.5 bg-zinc-50 border rounded-lg outline-none"
              />
            </div>
          </div>

          {/* Card 2: Delivery Charges */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <h2 className="font-bold text-sm text-zinc-900 border-b pb-2 flex items-center gap-1.5">
              <Truck size={16} className="text-[#b89528]" />
              <span>ডেলিভারি চার্জ ও ফ্রি ডেলিভারি থ্রেশহোল্ড</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-bold text-zinc-800 mb-1">ঢাকা সিটি চার্জ (৳)</label>
                <input
                  type="number"
                  value={settings.deliveryChargeInsideDhaka ?? 70}
                  onChange={(e) => handleChange('deliveryChargeInsideDhaka', Number(e.target.value))}
                  className="w-full p-2.5 bg-zinc-50 border rounded-lg font-mono font-bold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">ঢাকা সাব-এরিয়া চার্জ (৳)</label>
                <input
                  type="number"
                  value={settings.deliveryChargeNearDhaka ?? 100}
                  onChange={(e) => handleChange('deliveryChargeNearDhaka', Number(e.target.value))}
                  className="w-full p-2.5 bg-zinc-50 border rounded-lg font-mono font-bold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">ঢাকার বাইরে সারা দেশ (৳)</label>
                <input
                  type="number"
                  value={settings.deliveryChargeOutsideDhaka ?? 130}
                  onChange={(e) => handleChange('deliveryChargeOutsideDhaka', Number(e.target.value))}
                  className="w-full p-2.5 bg-zinc-50 border rounded-lg font-mono font-bold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-800 mb-1">ফ্রি ডেলিভারি সীমা (৳)</label>
                <input
                  type="number"
                  value={settings.freeDeliveryThreshold ?? 2000}
                  onChange={(e) => handleChange('freeDeliveryThreshold', Number(e.target.value))}
                  className="w-full p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg font-mono font-bold outline-none text-emerald-900"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Payments */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <h2 className="font-bold text-sm text-zinc-900 border-b pb-2 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-[#b89528]" />
              <span>পেমেন্ট সেটিংস (Payment Settings)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-zinc-800 mb-1">বিকাশ পার্সোনাল নম্বর</label>
                <input
                  type="text"
                  value={settings.bkashNumber || ''}
                  onChange={(e) => handleChange('bkashNumber', e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border rounded-lg font-mono outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">নগদ পার্সোনাল নম্বর</label>
                <input
                  type="text"
                  value={settings.nagadNumber || ''}
                  onChange={(e) => handleChange('nagadNumber', e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border rounded-lg font-mono outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-[#D4AF37] hover:bg-[#b89528] text-black font-extrabold rounded-xl shadow-lg flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <Save size={16} />
              <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'সেটিংস সেভ করুন (Save Changes)'}</span>
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
}
