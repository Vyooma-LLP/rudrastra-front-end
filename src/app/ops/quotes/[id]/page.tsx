"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ClipboardList, Package, MapPin, CreditCard, Save } from 'lucide-react';
import { formatMoney } from '@/utils/money';
import { toast } from '@/components/ui/Toast';

export default function OpsQuoteDetail() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/quotes/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.quote) {
          setData(data);
          setStatus(data.quote.status);
        }
      })
      .finally(() => setIsLoading(false));
  }, [params.id]);

  const handleUpdateStatus = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/quotes/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast('Status updated successfully');
      router.refresh();
    } catch (err) {
      toast((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-4 p-8"><div className="h-12 bg-[#E5E5E5] w-1/3 mb-8"></div><div className="h-64 bg-[#E5E5E5]"></div></div>;
  }

  if (!data) return <div className="text-center p-12 text-[#777777]">Quote not found.</div>;

  const { quote, items } = data;

  return (
    <div className="space-y-8">
      <div className="border-b border-[#E5E5E5] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-[#111111] flex items-center gap-3">
            <ClipboardList className="w-6 h-6 text-[#305CDE]" />
            Ops Quote Review
          </h1>
          <p className="font-mono text-sm text-[#777777] mt-1">{quote.quoteNumber}</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-[#E5E5E5] p-2 shadow-sm">
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-[#F5F5F5] border border-[#E5E5E5] px-3 py-1.5 text-xs font-bold uppercase tracking-wider outline-none"
          >
            <option value="NEW">NEW</option>
            <option value="REVIEWING">REVIEWING</option>
            <option value="QUOTED">QUOTED</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
          <button 
            onClick={handleUpdateStatus}
            disabled={isSaving || status === quote.status}
            className="bg-[#111111] hover:bg-black text-white px-3 py-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'Saving...' : <><Save className="w-3 h-3" /> Save</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#305CDE]" /> Customer & Shipping
          </h3>
          <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 text-xs space-y-2">
            <div><strong className="text-[#111111]">Name:</strong> {quote.customerName}</div>
            <div><strong className="text-[#111111]">Email:</strong> {quote.email}</div>
            <div><strong className="text-[#111111]">Phone:</strong> {quote.phone}</div>
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
            <CreditCard className="w-4 h-4 text-[#138808]" /> Requested Value
          </h3>
          <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-4 text-xs space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-[#777777]">System Estimated Subtotal</span>
              <span className="text-[#111111] font-bold">₹{formatMoney({ amountMinor: String(quote.estimatedSubtotal), currency: 'INR' })}</span>
            </div>
          </div>
        </div>
      </div>

      {quote.notes && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Customer Notes</h3>
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
                <th className="p-3 font-semibold uppercase tracking-wider text-right">Requested Unit Price</th>
                <th className="p-3 font-semibold uppercase tracking-wider text-center">Qty</th>
                <th className="p-3 font-semibold uppercase tracking-wider text-right">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => (
                <tr key={item.id} className="border-b border-[#E5E5E5] hover:bg-[#F9F9F9]">
                  <td className="p-3 font-medium text-[#111111]">
                    {item.productNameSnapshot}
                    <div className="text-[10px] text-[#777777] font-mono mt-0.5">ID: {item.productId}</div>
                  </td>
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
