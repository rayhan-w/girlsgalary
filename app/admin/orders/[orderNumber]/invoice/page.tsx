import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import PrintButton from './PrintButton';

export const dynamic = 'force-dynamic';

export default async function InvoicePage({
  params
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true }
  });

  if (!order) notFound();

  const settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-8 font-sans max-w-3xl mx-auto print:p-0 print:max-w-none">
      
      {/* Non-print toolbar */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b print:hidden">
        <span className="text-xs font-bold text-zinc-500">
          Girlsgalary অফিসিয়াল চালান ও পার্সেল লেবেল
        </span>
        <PrintButton />
      </div>

      {/* Invoice Container */}
      <div className="border border-black p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-black pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-wider">
              GIRLS<span className="text-amber-700">GALARY</span>
            </h1>
            <p className="text-xs text-zinc-600 mt-1">Ladies Ecommerce Shop, Bangladesh</p>
            <p className="text-xs text-zinc-600">হটলাইন: {settings?.hotline || '01307-214246'}</p>
            <p className="text-xs text-zinc-600">ঠিকানা: {settings?.address || 'সৈয়দপুর, নীলফামারী, বাংলাদেশ'}</p>
          </div>

          <div className="text-right">
            <span className="inline-block bg-black text-white text-xs font-bold px-3 py-1 uppercase tracking-widest">
              অর্ডার চালান / INVOICE
            </span>
            <p className="font-mono font-bold text-sm mt-1"># {order.orderNumber}</p>
            <p className="text-xs text-zinc-600">তারিখ: {formatDate(order.createdAt)}</p>
          </div>
        </div>

        {/* Customer & Shipping Details */}
        <div className="grid grid-cols-2 gap-4 text-xs border border-zinc-300 p-4 rounded bg-zinc-50">
          <div>
            <span className="font-bold text-zinc-900 uppercase block mb-1">প্রাপক / CUSTOMER:</span>
            <p className="text-sm font-bold text-zinc-900">{order.customerName}</p>
            <p className="text-zinc-800 mt-0.5">{order.customerAddress}</p>
            <p className="text-zinc-800 font-semibold">জেলা: {order.district}</p>
            <p className="font-mono font-bold text-zinc-900 text-sm mt-1">মোবাইল: {order.customerPhone}</p>
          </div>

          <div className="border-l pl-4 border-zinc-300">
            <span className="font-bold text-zinc-900 uppercase block mb-1">পেমেন্ট ও কুরিয়ার:</span>
            <p className="text-zinc-700">পদ্ধতি: <strong>{order.paymentMethod}</strong></p>
            <p className="text-zinc-700">জোন: <strong>{order.deliveryZone}</strong></p>
            <div className="mt-2 p-2 bg-amber-100/70 border border-amber-300 rounded">
              <span className="text-[10px] uppercase font-bold text-amber-900 block">ক্যাশ অন ডেলিভারি (COD) আদায়:</span>
              <span className="text-base font-black text-black">
                {order.paymentMethod === 'COD' ? formatPrice(order.grandTotal) : '৳০ (পরিশোধিত)'}
              </span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-xs text-left border-collapse border border-zinc-300">
          <thead>
            <tr className="bg-zinc-100 border-b border-zinc-300">
              <th className="p-2.5 border-r border-zinc-300 font-bold w-12 text-center">নং</th>
              <th className="p-2.5 border-r border-zinc-300 font-bold">পণ্যের বিবরণ (Item Description)</th>
              <th className="p-2.5 border-r border-zinc-300 font-bold text-center">সাইজ/কালার</th>
              <th className="p-2.5 border-r border-zinc-300 font-bold text-center">পরিমাণ</th>
              <th className="p-2.5 border-r border-zinc-300 font-bold text-right">দর</th>
              <th className="p-2.5 font-bold text-right">মোট (টাকা)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {order.items.map((item, idx) => (
              <tr key={item.id}>
                <td className="p-2.5 border-r border-zinc-300 text-center font-mono">{idx + 1}</td>
                <td className="p-2.5 border-r border-zinc-300 font-semibold">{item.productName}</td>
                <td className="p-2.5 border-r border-zinc-300 text-center">
                  {[item.size, item.color].filter(Boolean).join(' / ') || '-'}
                </td>
                <td className="p-2.5 border-r border-zinc-300 text-center font-bold">{item.quantity}</td>
                <td className="p-2.5 border-r border-zinc-300 text-right">{formatPrice(item.price)}</td>
                <td className="p-2.5 text-right font-bold">{formatPrice(item.total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-black bg-zinc-50 font-bold">
            <tr>
              <td colSpan={5} className="p-2 text-right border-r border-zinc-300">সাবটোটাল:</td>
              <td className="p-2 text-right">{formatPrice(order.subtotal)}</td>
            </tr>
            <tr>
              <td colSpan={5} className="p-2 text-right border-r border-zinc-300">ডেলিভারি চার্জ:</td>
              <td className="p-2 text-right">{order.deliveryCharge === 0 ? 'ফ্রি' : formatPrice(order.deliveryCharge)}</td>
            </tr>
            {order.discount > 0 && (
              <tr>
                <td colSpan={5} className="p-2 text-right border-r border-zinc-300 text-emerald-800">ডিসকাউন্ট:</td>
                <td className="p-2 text-right text-emerald-800">- {formatPrice(order.discount)}</td>
              </tr>
            )}
            <tr className="text-sm bg-zinc-200/80">
              <td colSpan={5} className="p-2.5 text-right border-r border-zinc-300 font-black">সর্বমোট বিল (Grand Total):</td>
              <td className="p-2.5 text-right font-black text-black">{formatPrice(order.grandTotal)}</td>
            </tr>
          </tfoot>
        </table>

        {/* Customer Note if any */}
        {order.orderNote && (
          <div className="p-2.5 bg-zinc-100 border text-xs italic">
            <strong>গ্রাহকের নোট:</strong> {order.orderNote}
          </div>
        )}

        {/* Signatures & Footer Note */}
        <div className="pt-10 flex items-center justify-between text-xs border-t">
          <div className="text-center">
            <div className="w-36 border-t border-black mb-1" />
            <span>প্রাপকের স্বাক্ষর</span>
          </div>

          <div className="text-center">
            <div className="w-36 border-t border-black mb-1" />
            <span>অনুমোদিত কর্তৃপক্ষ</span>
          </div>
        </div>

      </div>

      {/* Parcel Cut-out Label for Courier Delivery Box */}
      <div className="mt-8 border-2 border-dashed border-black p-4 text-xs space-y-2 break-before-page">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="font-bold text-sm">GIRLSGALARY পার্সেল লেবেল</span>
          <span className="font-mono font-bold text-sm">{order.orderNumber}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-bold block">প্রাপক:</span>
            <p className="font-bold text-sm">{order.customerName}</p>
            <p>{order.customerAddress}</p>
            <p className="font-bold">জেলা: {order.district}</p>
            <p className="font-mono font-bold text-sm">মোবাইল: {order.customerPhone}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] block">COD সংগ্রহযোগ্য টাকা:</span>
            <span className="text-xl font-black block mt-1">{formatPrice(order.grandTotal)}</span>
            <span className="text-[10px] text-zinc-500 block mt-2">প্রেরক: Girlsgalary (01307-214246), সৈয়দপুর, নীলফামারী</span>
          </div>
        </div>
      </div>

    </div>
  );
}
