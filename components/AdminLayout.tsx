'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  CreditCard,
  PlusCircle,
  Truck,
  Users,
  Tag,
  Settings,
  Activity,
  FileText,
  BarChart3,
  Database,
  Menu,
  X,
  LogOut,
  ShieldAlert,
  Bell
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  useEffect(() => {
    // Check session
    const storedUser = localStorage.getItem('girlsgalary_admin_user');
    if (!storedUser && pathname !== '/admin/login') {
      router.push('/admin/login');
      return;
    }
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    // Fetch stats for badges
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.pendingCount !== undefined) {
          setPendingOrdersCount(data.pendingCount);
        }
      })
      .catch(() => {});
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('girlsgalary_admin_user');
    router.push('/admin/login');
  };

  const isStaffRole = currentUser?.role === 'STAFF';

  // Navigation Links organized into Part A, B, C
  const navGroups = [
    {
      title: 'মেইন ও ক্যাটালগ (Part A)',
      items: [
        { label: 'ড্যাশবোর্ড (Dashboard)', href: '/admin', icon: LayoutDashboard },
        { label: 'পণ্য তালিকা (Products)', href: '/admin/products', icon: Package },
        { label: 'নতুন পণ্য যোগ (Add Product)', href: '/admin/products/new', icon: PlusCircle },
        { label: 'ক্যাটাগরি ও ব্র্যান্ড (Categories)', href: '/admin/categories', icon: Layers },
        { label: 'ইনভেন্টরি ও স্টক (Inventory)', href: '/admin/inventory', icon: Activity }
      ]
    },
    {
      title: 'অর্ডার ও ডেলিভারি (Part B)',
      items: [
        {
          label: 'অর্ডার ব্যবস্থাপনা (Orders)',
          href: '/admin/orders',
          icon: ShoppingBag,
          badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined
        },
        { label: 'পেমেন্ট ভেরিফিকেশন (bKash/Nagad)', href: '/admin/payments', icon: CreditCard },
        { label: 'ম্যানুয়াল অর্ডার এন্ট্রি (POS)', href: '/admin/manual-order', icon: PlusCircle },
        { label: 'কুরিয়ার হ্যান্ডওভার (Export)', href: '/admin/courier-export', icon: Truck },
        { label: 'কাস্টমার তালিকা (CRM)', href: '/admin/customers', icon: Users }
      ]
    },
    // Part C - Owner/Manager only (Restricted for staff role per Page 10)
    ...(!isStaffRole
      ? [
          {
            title: 'মার্কেটিং ও সেটিংস (Part C)',
            items: [
              { label: 'কুপন কোড (Coupons)', href: '/admin/coupons', icon: Tag },
              { label: 'বিক্রয় রিপোর্ট (Reports)', href: '/admin/reports', icon: BarChart3 },
              { label: 'মার্কেটিং ও ট্র্যাকিং (Pixel/CAPI)', href: '/admin/tracking', icon: Activity },
              { label: 'স্টাফ ও রোলস (Staff Roles)', href: '/admin/staff', icon: ShieldAlert },
              { label: 'শপ সেটিংস (Settings)', href: '/admin/settings', icon: Settings },
              { label: 'কন্টেন্ট পেইজ (Content)', href: '/admin/content', icon: FileText },
              { label: 'ডাটাবেস ব্যাকআপ (Backup)', href: '/admin/backup', icon: Database }
            ]
          }
        ]
      : [])
  ];

  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-zinc-950 font-sans">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col font-sans text-zinc-900">
      
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-[#111] text-white border-b-2 border-[#D4AF37] px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-1.5 text-zinc-400 hover:text-white rounded"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg tracking-wider text-white">
              GIRLS<span className="text-[#D4AF37]">GALARY</span>
            </span>
            <span className="bg-[#D4AF37] text-black text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded">
              এডমিন
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {pendingOrdersCount > 0 && (
            <Link
              href="/admin/orders?status=PENDING"
              className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full text-xs font-bold animate-pulse"
            >
              <Bell size={13} />
              <span>{pendingOrdersCount} টি নতুন অর্ডার</span>
            </Link>
          )}

          {currentUser && (
            <div className="flex items-center gap-2 text-xs">
              <span className="hidden sm:inline text-zinc-300 font-medium">
                {currentUser.name}
              </span>
              <span className="bg-zinc-800 text-[#D4AF37] font-bold px-2 py-0.5 rounded border border-[#D4AF37]/30 text-[10px]">
                {currentUser.role}
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors"
            title="লগআউট"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar (Responsive for Desktop & Mobile Phone Browser) */}
        {/* Page 7 Rule: owner must be able to run the whole shop from a phone browser */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#141414] text-zinc-300 flex flex-col border-r border-[#D4AF37]/30 transition-transform duration-200 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]/70">
                  {group.title}
                </p>
                <div className="space-y-0.5 pt-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-[#D4AF37] text-black font-bold shadow'
                            : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={16} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span className="bg-rose-600 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#0a0a0a] border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-between">
            <Link href="/" target="_blank" className="hover:text-[#D4AF37]">
              ↗ শপ ভিজিট করুন
            </Link>
            <span>v1.0 (Live)</span>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

    </div>
  );
};
