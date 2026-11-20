'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, Lock, Activity } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';

export default function AdminStaffPage() {
  const staffList = [
    { name: 'Girlsgalary Owner', username: 'admin', role: 'OWNER', access: 'সম্পূর্ণ অ্যাক্সেস (All Access + Settings + Reports)' },
    { name: 'Operations Manager', username: 'manager', role: 'MANAGER', access: 'অর্ডার, প্রোডাক্ট ও ইনভেন্টরি অ্যাক্সেস' },
    { name: 'Order Processing Staff', username: 'staff', role: 'STAFF', access: 'শুধুমাত্র অর্ডার প্রসেসিং (রিপোর্ট ও সেটিংস নিষিদ্ধ)' }
  ];

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
            স্টাফ ও ভূমিকা নিয়ন্ত্রণ (Staff Roles & Permissions)
          </h1>
          <p className="text-xs text-zinc-500">
            ভূমিকাভিত্তিক অ্যাক্সেস কন্ট্রোল (RBAC): স্টাফ শুধুমাত্র অর্ডার প্রসেস করতে পারে, আর্থিক রিপোর্ট দেখতে পারে না
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 text-zinc-600 border-b">
              <tr>
                <th className="p-3.5 font-bold">নাম ও ইউজারনেম</th>
                <th className="p-3.5 font-bold">রোল (Role)</th>
                <th className="p-3.5 font-bold">অনুমোদিত অনুমতি (Access Permission)</th>
                <th className="p-3.5 font-bold text-right">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {staffList.map((s) => (
                <tr key={s.username} className="hover:bg-zinc-50">
                  <td className="p-3.5">
                    <span className="font-bold text-zinc-900 block">{s.name}</span>
                    <span className="font-mono text-zinc-400 text-[11px]">@{s.username}</span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                      s.role === 'OWNER'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : s.role === 'MANAGER'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-zinc-100 text-zinc-800'
                    }`}>
                      {s.role}
                    </span>
                  </td>
                  <td className="p-3.5 text-zinc-700 font-medium">
                    {s.access}
                  </td>
                  <td className="p-3.5 text-right">
                    <span className="text-emerald-700 font-bold flex items-center justify-end gap-1">
                      <ShieldCheck size={14} /> সক্রিয়
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
