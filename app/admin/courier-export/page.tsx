'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Download, FileSpreadsheet } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';

export default function AdminCourierExportPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [courier, setCourier] = useState('STEADFAST');

  useEffect(() => {
    fetch('/api/orders?status=CONFIRMED')
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch((err) => console.error(err));
  }, []);

  const handleDownloadCSV = () => {
    if (!orders.length) return;

    let headers = '';
    let rows = '';

    if (courier === 'STEADFAST') {
      headers = 'Invoice,Recipient Name,Recipient Phone,Recipient Address,Cod Amount,Note\n';
      rows = orders
        .map(
          (o) =>
            `"${o.orderNumber}","${o.customerName}","${o.customerPhone}","${o.customerAddress}, ${o.district}",${o.paymentMethod === 'COD' ? o.grandTotal : 0},"${o.orderNote || ''}"`
        )
        .join('\n');
    } else if (courier === 'PATHAO') {
      headers = 'Merchant Order ID,Recipient Name,Recipient Phone,Recipient Address,Recipient District,Amount to Collect\n';
      rows = orders
        .map(
          (o) =>
            `"${o.orderNumber}","${o.customerName}","${o.customerPhone}","${o.customerAddress}","${o.district}",${o.paymentMethod === 'COD' ? o.grandTotal : 0}`
        )
        .join('\n');
    } else {
      headers = 'Parcel ID,Customer Name,Customer Mobile,Customer Address,District,COD Amount\n';
      rows = orders
        .map(
          (o) =>
            `"${o.orderNumber}","${o.customerName}","${o.customerPhone}","${o.customerAddress}","${o.district}",${o.paymentMethod === 'COD' ? o.grandTotal : 0}`
        )
        .join('\n');
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(headers + rows);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', `${courier.toLowerCase()}-manifest-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
            কুরিয়ার হ্যান্ডওভার এক্সপোর্ট (Courier Handover Export)
          </h1>
          <p className="text-xs text-zinc-500">
            Steadfast, Pathao Courier বা RedX ফরম্যাটে পার্সেল তালিকা ডাউনলোড করুন
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-5 text-xs">
          <div>
            <label className="block font-bold text-zinc-800 mb-2">কুরিয়ার ফরম্যাট নির্বাচন করুন:</label>
            <div className="grid grid-cols-3 gap-3">
              {['STEADFAST', 'PATHAO', 'REDX'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCourier(c)}
                  className={`p-3 rounded-xl border-2 font-bold text-center transition-all ${
                    courier === c
                      ? 'border-[#D4AF37] bg-[#fbf6e6] text-black shadow-xs'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                  }`}
                >
                  {c} Courier
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
            <span className="font-bold text-zinc-800 block mb-1">প্রস্তুত পার্সেল:</span>
            <p className="text-zinc-600">
              বর্তমানে কুরিয়ারে হস্তান্তরের জন্য প্রস্তুত অর্ডারের সংখ্যা: <strong>{orders.length}</strong> টি।
            </p>
          </div>

          <button
            onClick={handleDownloadCSV}
            disabled={orders.length === 0}
            className="w-full py-3.5 bg-black hover:bg-zinc-800 text-[#D4AF37] font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-40"
          >
            <Download size={18} />
            <span>{courier} CSV ফাইল ডাউনলোড করুন</span>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
