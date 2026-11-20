'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  Eye,
  Printer,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  RotateCcw,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { formatPrice, formatDate } from '@/lib/utils';
import { BANGLADESH_DISTRICTS } from '@/lib/districts';

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'ALL';

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Selected Order Drawer / Modal state
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (selectedStatus !== 'ALL') params.set('status', selectedStatus);
      if (selectedDistrict !== 'ALL') params.set('district', selectedDistrict);
      params.set('page', String(page));
      params.set('limit', '15');

      const res = await fetch(`/api/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.totalCount || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, selectedStatus, selectedDistrict, page]);

  // Update order status with cancel and restock safety
  const handleUpdateStatus = async (orderNumber: string, newStatus: string, note?: string) => {
    setActionLoading(true);
    setStatusMessage('');
    try {
      const res = await fetch(`/api/orders/${orderNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note, staffName: 'Admin' })
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage(`অর্ডার ${orderNumber} এর স্ট্যাটাস সফলভাবে "${newStatus}" করা হয়েছে।`);
        // Refresh orders & active order
        fetchOrders();
        if (selectedOrder && selectedOrder.orderNumber === orderNumber) {
          setSelectedOrder(data.order);
        }
      } else {
        setStatusMessage(data.error || 'স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে');
      }
    } catch (err) {
      setStatusMessage('নেটওয়ার্ক সমস্যা');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-full text-[10px]">অপেক্ষমাণ (Pending)</span>;
      case 'CONFIRMED':
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 font-bold px-2 py-0.5 rounded-full text-[10px]">কনফার্মড (Confirmed)</span>;
      case 'PROCESSING':
        return <span className="bg-indigo-100 text-indigo-900 border border-indigo-300 font-bold px-2 py-0.5 rounded-full text-[10px]">প্রসেসিং (Processing)</span>;
      case 'SHIPPED':
        return <span className="bg-purple-100 text-purple-900 border border-purple-300 font-bold px-2 py-0.5 rounded-full text-[10px]">কুরিয়ারে (Shipped)</span>;
      case 'DELIVERED':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded-full text-[10px]">ডেলিভার্ড (Delivered)</span>;
      case 'CANCELLED':
        return <span className="bg-rose-100 text-rose-900 border border-rose-300 font-bold px-2 py-0.5 rounded-full text-[10px]">বাতিল (Cancelled)</span>;
      case 'RETURNED':
        return <span className="bg-zinc-200 text-zinc-900 border border-zinc-400 font-bold px-2 py-0.5 rounded-full text-[10px]">রিটার্নড (Returned)</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header and Counters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
              অর্ডার ব্যবস্থাপনা (Order Management)
            </h1>
            <p className="text-xs text-zinc-500">
              মোট <span className="font-bold text-zinc-900">{totalCount}</span> টি অর্ডার নথিভুক্ত রয়েছে
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/manual-order"
              className="px-3.5 py-2 bg-black hover:bg-zinc-800 text-[#D4AF37] text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
            >
              <span>+ ম্যানুয়াল অর্ডার এন্ট্রি</span>
            </Link>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between">
            <span>{statusMessage}</span>
            <button onClick={() => setStatusMessage('')} className="text-emerald-600 font-bold">✕</button>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          
          {/* Search box */}
          <div className="sm:col-span-5 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="অর্ডার # (GG-...), গ্রাহকের নাম বা মোবাইল নম্বর..."
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-[#D4AF37]"
            />
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-2.5 outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="ALL">সকল স্ট্যাটাস (All Status)</option>
              <option value="PENDING">অপেক্ষমাণ (Pending)</option>
              <option value="CONFIRMED">কনফার্মড (Confirmed)</option>
              <option value="PROCESSING">প্রসেসিং (Processing)</option>
              <option value="SHIPPED">কুরিয়ারে পাঠানো (Shipped)</option>
              <option value="DELIVERED">ডেলিভারি সম্পন্ন (Delivered)</option>
              <option value="CANCELLED">বাতিল (Cancelled)</option>
              <option value="RETURNED">রিটার্ন (Returned)</option>
            </select>
          </div>

          {/* District Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-2.5 outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="ALL">সকল জেলা (All Districts)</option>
              {BANGLADESH_DISTRICTS.map((d) => (
                <option key={d.name} value={d.name}>{d.bn} ({d.name})</option>
              ))}
            </select>
          </div>

        </div>

        {/* Orders Table (Desktop & Phone friendly cards) */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-zinc-400 text-xs">অর্ডার লোড হচ্ছে...</div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 text-xs italic">
              কোনো অর্ডার পাওয়া যায়নি
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 text-zinc-600 border-b border-zinc-200">
                  <tr>
                    <th className="p-3 font-bold">অর্ডার নম্বর</th>
                    <th className="p-3 font-bold">গ্রাহক ও ফোন</th>
                    <th className="p-3 font-bold">জেলা ও ঠিকানা</th>
                    <th className="p-3 font-bold">আইটেম</th>
                    <th className="p-3 font-bold">বিল ও পেমেন্ট</th>
                    <th className="p-3 font-bold">স্ট্যাটাস</th>
                    <th className="p-3 font-bold text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-zinc-900">
                        {ord.orderNumber}
                        <span className="block text-[10px] text-zinc-400 font-sans font-normal mt-0.5">
                          {formatDate(ord.createdAt)}
                        </span>
                      </td>

                      <td className="p-3">
                        <span className="font-semibold text-zinc-900 block">{ord.customerName}</span>
                        <span className="font-mono text-zinc-500 text-[11px]">{ord.customerPhone}</span>
                      </td>

                      <td className="p-3 max-w-[200px]">
                        <span className="font-bold text-zinc-800 block">{ord.district}</span>
                        <span className="text-zinc-500 truncate block text-[11px]">{ord.customerAddress}</span>
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-zinc-800">{ord.items?.length || 0} টি</span>
                        <span className="block text-[10px] text-zinc-500 truncate max-w-[150px]">
                          {ord.items?.map((it: any) => it.productName).join(', ')}
                        </span>
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-[#b89528] text-sm block">
                          {formatPrice(ord.grandTotal)}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-medium">
                          {ord.paymentMethod} {ord.transactionId && `(Trx: ${ord.transactionId})`}
                        </span>
                      </td>

                      <td className="p-3">
                        {getStatusBadge(ord.status)}
                      </td>

                      <td className="p-3 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-lg inline-flex items-center gap-1"
                        >
                          <Eye size={12} />
                          <span>বিস্তারিত</span>
                        </button>
                        <Link
                          href={`/admin/orders/${ord.orderNumber}/invoice`}
                          target="_blank"
                          className="px-2.5 py-1.5 bg-black hover:bg-zinc-800 text-[#D4AF37] font-bold rounded-lg inline-flex items-center gap-1"
                        >
                          <Printer size={12} />
                          <span>চালান</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-xs">
              <span className="text-zinc-500">পৃষ্ঠা {page} / {totalPages}</span>
              <div className="flex gap-1">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 bg-white border rounded disabled:opacity-40"
                >
                  পূর্ববর্তী
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 bg-white border rounded disabled:opacity-40"
                >
                  পরবর্তী
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Order Detailed Drawer / Modal */}
        {/* Page 9 Requirements: Customer details, transaction ID, note, cancel & stock rule */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-zinc-200 max-h-[90vh] overflow-y-auto space-y-5 animate-in zoom-in-95">
              
              <div className="flex items-center justify-between pb-3 border-b">
                <div>
                  <span className="text-xs text-zinc-400">অর্ডার বিবরণ</span>
                  <h3 className="font-mono font-bold text-lg text-zinc-900">{selectedOrder.orderNumber}</h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-zinc-400 hover:text-zinc-800 text-xl font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {/* Status Change Buttons */}
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 space-y-2">
                <span className="font-bold text-xs text-zinc-800 block">স্ট্যাটাস আপডেট করুন:</span>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button
                    disabled={actionLoading || selectedOrder.status === 'CONFIRMED'}
                    onClick={() => handleUpdateStatus(selectedOrder.orderNumber, 'CONFIRMED')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:opacity-40"
                  >
                    Confirm Order
                  </button>
                  <button
                    disabled={actionLoading || selectedOrder.status === 'PROCESSING'}
                    onClick={() => handleUpdateStatus(selectedOrder.orderNumber, 'PROCESSING')}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg disabled:opacity-40"
                  >
                    Set Processing
                  </button>
                  <button
                    disabled={actionLoading || selectedOrder.status === 'SHIPPED'}
                    onClick={() => handleUpdateStatus(selectedOrder.orderNumber, 'SHIPPED')}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg disabled:opacity-40"
                  >
                    Mark Shipped (SMS)
                  </button>
                  <button
                    disabled={actionLoading || selectedOrder.status === 'DELIVERED'}
                    onClick={() => handleUpdateStatus(selectedOrder.orderNumber, 'DELIVERED')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg disabled:opacity-40"
                  >
                    Mark Delivered
                  </button>
                  {/* Cancel Order with automated Restock */}
                  <button
                    disabled={actionLoading || selectedOrder.status === 'CANCELLED'}
                    onClick={() => {
                      if (confirm(`আপনি কি নিশ্চিত অর্ডার ${selectedOrder.orderNumber} বাতিল করতে চান? পণ্যসমূহ স্বয়ংক্রিয়ভাবে স্টকে ফিরে যাবে।`)) {
                        handleUpdateStatus(selectedOrder.orderNumber, 'CANCELLED', 'Order cancelled by admin - items restocked');
                      }
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg disabled:opacity-40"
                  >
                    Cancel & Restock
                  </button>
                </div>
                {selectedOrder.isRestocked && (
                  <p className="text-[11px] text-emerald-700 font-bold mt-1">
                    ✓ এই অর্ডারের পণ্যসমূহ স্টকে যুক্ত হয়েছে (Restocked exactly once).
                  </p>
                )}
              </div>

              {/* Customer and Delivery info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 space-y-1">
                  <span className="font-bold text-zinc-900 block">গ্রাহকের ঠিকানা:</span>
                  <p className="font-semibold text-zinc-800">{selectedOrder.customerName}</p>
                  <p className="text-zinc-600">{selectedOrder.customerAddress}</p>
                  <p className="text-zinc-600">জেলা: {selectedOrder.district}</p>
                  <p className="font-mono text-zinc-700 font-bold">ফোন: {selectedOrder.customerPhone}</p>
                  {selectedOrder.orderNote && (
                    <p className="text-zinc-500 italic pt-1 border-t mt-1">
                      নোট: &ldquo;{selectedOrder.orderNote}&rdquo;
                    </p>
                  )}
                </div>

                <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 space-y-1">
                  <span className="font-bold text-zinc-900 block">পেমেন্ট বিবরণ:</span>
                  <p className="text-zinc-700">পদ্ধতি: <strong>{selectedOrder.paymentMethod}</strong></p>
                  <p className="text-zinc-700">স্ট্যাটাস: <strong>{selectedOrder.paymentStatus}</strong></p>
                  {selectedOrder.transactionId && (
                    <p className="text-emerald-700 font-mono font-bold">
                      TrxID: {selectedOrder.transactionId}
                    </p>
                  )}
                  {selectedOrder.senderPhone && (
                    <p className="text-zinc-600 font-mono">
                      প্রেরক: {selectedOrder.senderPhone}
                    </p>
                  )}
                  <p className="text-base font-extrabold text-[#b89528] pt-1 border-t mt-1">
                    মোট বিল: {formatPrice(selectedOrder.grandTotal)}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="border border-zinc-200 rounded-xl overflow-hidden text-xs">
                <div className="bg-zinc-100 p-2.5 font-bold text-zinc-800">
                  অর্ডারকৃত পণ্যসমূহ
                </div>
                <div className="divide-y divide-zinc-200 p-3 space-y-2">
                  {selectedOrder.items?.map((it: any) => (
                    <div key={it.id} className="pt-2 first:pt-0 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={it.productImage} alt={it.productName} className="w-10 h-12 object-cover rounded border" />
                        <div>
                          <p className="font-bold text-zinc-900">{it.productName}</p>
                          <p className="text-[11px] text-zinc-500">
                            সাইজ: {it.size || 'N/A'} • কালার: {it.color || 'N/A'} • পরিমাণ: {it.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-zinc-900">{formatPrice(it.total)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Link
                  href={`/admin/orders/${selectedOrder.orderNumber}/invoice`}
                  target="_blank"
                  className="px-4 py-2 bg-black text-[#D4AF37] font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Printer size={14} />
                  <span>চালান ও পার্সেল লেবেল প্রিন্ট</span>
                </Link>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-zinc-200 text-zinc-800 font-bold text-xs rounded-xl hover:bg-zinc-300"
                >
                  বন্ধ করুন
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">লোড হচ্ছে...</div>}>
      <AdminOrdersContent />
    </Suspense>
  );
}
