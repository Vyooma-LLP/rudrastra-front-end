"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';

/**
 * SECURITY: No sellerId is sent from this form.
 * The server derives the authenticated seller identity from the session cookie.
 * Sending sellerId from the client would allow any user to forge offers
 * under another seller's account.
 */
export default function NewSellerOfferForm({ variants }: { variants: any[] }) {
  const router = useRouter();

  const [variantId, setVariantId] = useState('');
  const [skuCode, setSkuCode] = useState('');
  const [price, setPrice] = useState('');
  const [moq, setMoq] = useState('1');
  const [leadTime, setLeadTime] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/seller/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // NO sellerId — the server resolves it from the authenticated session
          variantId,
          skuCode,
          price: Math.round(parseFloat(price) * 100), // convert to paise
          moq: parseInt(moq, 10),
          leadTimeDays: parseInt(leadTime, 10),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || err.error || 'Failed to map offer');
      }

      router.push('/seller/offers');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <CapabilityGuard featureKey="seller.offers">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Map New Offer & SKU</h1>
          <p className="text-xs text-[#777777]">Link your inventory to a canonical product variant.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#F5F5F5] border border-[#E5E5E5] p-6 space-y-6">
          {error && <div className="text-red-500 text-xs font-bold bg-red-50 border border-red-200 p-3">{error}</div>}

          <div className="space-y-4">
            <div>
              <label htmlFor="variantId" className="block text-xs font-bold text-[#111111] mb-1">Canonical Product Variant</label>
              <select
                id="variantId"
                required
                value={variantId}
                onChange={e => setVariantId(e.target.value)}
                className="w-full border border-[#E5E5E5] px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
              >
                <option value="">Select a variant...</option>
                {variants.map(v => (
                  <option key={v.id} value={v.id}>{v.productTitle} - {v.name} ({v.mpn})</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="skuCode" className="block text-xs font-bold text-[#111111] mb-1">Your SKU Code</label>
              <input
                id="skuCode"
                type="text"
                required
                value={skuCode}
                onChange={e => setSkuCode(e.target.value)}
                className="w-full border border-[#E5E5E5] px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                placeholder="e.g. SKU-12345"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-xs font-bold text-[#111111] mb-1">Price (₹)</label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full border border-[#E5E5E5] px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label htmlFor="moq" className="block text-xs font-bold text-[#111111] mb-1">MOQ</label>
                <input
                  id="moq"
                  type="number"
                  min="1"
                  required
                  value={moq}
                  onChange={e => setMoq(e.target.value)}
                  className="w-full border border-[#E5E5E5] px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="leadTime" className="block text-xs font-bold text-[#111111] mb-1">Lead Time (Days)</label>
              <input
                id="leadTime"
                type="number"
                min="0"
                required
                value={leadTime}
                onChange={e => setLeadTime(e.target.value)}
                className="w-full border border-[#E5E5E5] px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E5E5] flex justify-end gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-[#E5E5E5] text-[#111111] hover:bg-[#E5E5E5] text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#111111] text-white hover:bg-black text-xs font-bold disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : 'Save Offer Mapping'}
            </button>
          </div>
        </form>
      </div>
    </CapabilityGuard>
  );
}
