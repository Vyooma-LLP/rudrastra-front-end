"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ClipboardList, Package, MapPin, CreditCard } from 'lucide-react';
import { formatMoney } from '@/utils/money';

export default function QuoteDetailPage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/quotes/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.quote) setData(data);
      })
      .finally(() => setIsLoading(false));
  }, [params.id]);

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-12 bg-[#E5E5E5] w-1/3 mb-8"></div>
      <div className="h-64 bg-[#E5E5E5]"></div>
    </div>;
  }

  if (!data) {
    return <div className="text-center p-12 text-[#777777]">Quote not found.</div>;
  }

  const { quote, items } = data;

  return (
    <div className="space-y-8">
      <div className="border-b border-[#E5E5E5] pb-4 flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-[#111111] flex items-center gap-3">
            <ClipboardList className="w-6 h-6 text-[#F35C27]" />
            Quote Details
          </h1>
          <p className="font-mono text-sm text-[#777777] mt-1">{quote.quoteNumber}</p>
        </div>
        <div className="flex items-start">
          <span className={`text-xs px-3 py-1 font-bold tracking-wider uppercase border
            ${quote.status === 'NEW' ? 'border-blue-500 text-blue-600 bg-blue-50' :
              quote.status === 'REVIEWING' ? 'border-amber-500 text-amber-600 bg-amber-50' :
              quote.status === 'QUOTED' ? 'border-[#138808] text-[#138808] bg-[#138808]/5' :
              quote.status === 'ACCEPTED' ? 'border-[#305CDE] text-[#305CDE] bg-[#305CDE]/5' :
              'border-[#777777] text-[#777777] bg-[#F5F5F5]'
            }
          `}>
            Status: {quote.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Customer Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#305CDE]" /> Corporate & Shipping
          </h3>
          <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 text-xs space-y-2">
            <div>
              <strong className="text-[#111111]">Contact:</strong> {quote.customerName} ({quote.email} | {quote.phone})
            </div>
            {quote.companyName && <div><strong className="text-[#111111]">Company:</strong> {quote.companyName}</div>}
            <div className="pt-2 border-t border-[#E5E5E5] mt-2">
              <strong className="text-[#111111]">Delivery Address:</strong><br/>
              {quote.shippingAddressLine1}<br/>
              {quote.shippingAddressLine2 && <>{quote.shippingAddressLine2}<br/></>}
              {quote.shippingCity}, {quote.shippingState} - {quote.shippingPincode}
            </div>
          </div>
        </div>

        {/* Financial Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#138808]" /> Estimated Value
          </h3>
          <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 text-xs space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-[#777777]">Estimated Subtotal</span>
              <span className="text-[#111111] font-bold">₹{formatMoney({ amountMinor: String(quote.estimatedSubtotal), currency: 'INR' })}</span>
            </div>
            <div className="text-[10px] text-[#777777] italic mt-4 border-t border-[#E5E5E5] pt-2">
              * Final pricing, shipping, and availability will be confirmed by our team in the official quote.
            </div>
          </div>
        </div>
      </div>

      {quote.notes && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Notes / Requirements</h3>
          <div className="bg-[#FFF9C4]/30 border border-[#FFF9C4] p-4 text-xs text-[#111111] whitespace-pre-wrap">
            {quote.notes}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
          <Package className="w-4 h-4" /> Requested Items ({items.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F5F5F5] border-b border-[#E5E5E5] text-[#777777]">
                <th className="p-3 font-semibold uppercase tracking-wider">Product</th>
                <th className="p-3 font-semibold uppercase tracking-wider text-right">Est. Price</th>
                <th className="p-3 font-semibold uppercase tracking-wider text-center">Qty</th>
                <th className="p-3 font-semibold uppercase tracking-wider text-right">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => (
                <tr key={item.id} className="border-b border-[#E5E5E5] hover:bg-[#F9F9F9]">
                  <td className="p-3 font-medium text-[#111111]">{item.productNameSnapshot}</td>
                  <td className="p-3 text-right font-mono">₹{formatMoney({ amountMinor: String(item.priceSnapshot), currency: 'INR' })}</td>
                  <td className="p-3 text-center font-mono font-bold">{item.quantity}</td>
                  <td className="p-3 text-right font-mono font-bold text-[#111111]">
                    ₹{formatMoney({ amountMinor: String(item.priceSnapshot * item.quantity), currency: 'INR' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
