'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'লগইন ব্যর্থ হয়েছে');
      } else {
        localStorage.setItem('girlsgalary_admin_user', JSON.stringify(data.user));
        router.push('/admin');
      }
    } catch (err) {
      setError('সার্ভারে যোগাযোগ করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#141414] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Logo and title */}
        <div className="text-center space-y-1">
          <span className="text-2xl sm:text-3xl font-serif font-bold tracking-wider text-white">
            GIRLS<span className="text-[#D4AF37]">GALARY</span>
          </span>
          <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-sans font-semibold">
            এডমিন কন্ট্রোল প্যানেল
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/80 border border-rose-500 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-bold mb-1.5">ব্যবহারকারীর নাম (Username)</label>
            <div className="flex items-center bg-[#1e1e1e] border border-zinc-700 focus-within:border-[#D4AF37] rounded-xl px-3 py-2.5">
              <User size={16} className="text-zinc-500 mr-2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent outline-none text-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-bold mb-1.5">পাসওয়ার্ড (Password)</label>
            <div className="flex items-center bg-[#1e1e1e] border border-zinc-700 focus-within:border-[#D4AF37] rounded-xl px-3 py-2.5">
              <Lock size={16} className="text-zinc-500 mr-2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-white font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#b89528] text-black font-extrabold rounded-xl shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            <span>{loading ? 'যাচাই হচ্ছে...' : 'এডমিনে প্রবেশ করুন'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Role Demo Switchers */}
        <div className="pt-4 border-t border-zinc-800 text-xs space-y-2">
          <span className="text-zinc-400 block font-semibold text-[11px]">ডেমো একাউন্টে দ্রুত লগইন:</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'admin123')}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-center"
            >
              <span className="font-bold text-[#D4AF37] block">Owner</span>
              <span className="text-[10px] text-zinc-400">admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('manager', 'manager123')}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-center"
            >
              <span className="font-bold text-amber-400 block">Manager</span>
              <span className="text-[10px] text-zinc-400">manager</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('staff', 'staff123')}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-center"
            >
              <span className="font-bold text-zinc-300 block">Staff</span>
              <span className="text-[10px] text-zinc-400">staff</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
