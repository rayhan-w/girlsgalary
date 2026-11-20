'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 bg-black hover:bg-zinc-800 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow"
    >
      <Printer size={14} />
      <span>প্রিন্ট করুন (Print Invoice)</span>
    </button>
  );
}
