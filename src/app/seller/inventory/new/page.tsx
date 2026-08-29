"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';

/**
 * SECURITY: No sellerId is sent from this page.
 * - GET /api/seller/offers uses the session cookie to return only THIS seller's SKUs.
 * - POST /api/seller/inventory uses the session cookie to bind inventory to THIS seller.
 * The server performs an ownership check to ensure the submitted skuId belongs
 * to the authenticated seller before writing any inventory record.
 */
export default function NewInventoryPage() {
  const router = useRouter();

  const [skus, setSkus] = useState<any[]>([]);
  const [skuId, setSkuId] = useState('');
  const [onHandQuantity, setOnHandQuantity] = useState('0');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    // No sellerId in query params — server derives it from the session cookie
    fetch('/api/seller/offers')
      .then(async res => {
        if (!res.ok) throw new Error('Failed to load SKUs');
        return res.json();
      })
      .then(data => setSkus(Array.isArray(data) ? data.filter((d: any) => d.skuId) : []))
      .catch(err => setFetchError(err.message));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/seller/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // NO sellerId — the server resolves it from the authenticated session
          // The server also verifies this skuId belongs to the authenticated seller
          skuId,
          onHandQuantity,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || err.error || 'Failed to log inventory');
      }

      router.push('/seller/inventory');
      router.refresh();
    } catch (err: any) {
      setSubmitError(err.message);
      setLoading(false);
    }
  };

  return (
    <CapabilityGuard featureKey="seller.inventory">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Log Physical Inventory</h1>
          <p className="text-xs text-[#777777]">Assign stock to your mapped SKUs.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#F5F5F5] border border-[#E5E5E5] p-6 space-y-6">
          {submitError && (
            <div className="text-red-500 text-xs font-bold bg-red-50 border border-red-200 p-3">{submitError}</div>
          )}
          {fetchError && (
            <div className="text-amber-700 text-xs bg-amber-50 border border-amber-200 p-3">
              Could not load SKUs: {fetchError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="skuId" className="block text-xs font-bold text-[#111111] mb-1">Select SKU</label>
              <select
                id="skuId"
                required
                value={skuId}
                onChange={e => setSkuId(e.target.value)}
                className="w-full border border-[#E5E5E5] px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
              >
                <option value="">Select a SKU...</option>
                {skus.map(s => (
                  <option key={s.skuId} value={s.skuId}>{s.skuCode} — {s.productTitle}</option>
                ))}
              </select>
              {skus.length === 0 && !fetchError && (
                <p className="text-[10px] text-[#777777] mt-1">
                  No SKUs found. <a href="/seller/offers/new" className="text-[#305CDE] underline">Map an offer first.</a>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="onHandQuantity" className="block text-xs font-bold text-[#111111] mb-1">Total On-Hand Quantity</label>
              <input
                id="onHandQuantity"
                type="number"
                required
                min="0"
                value={onHandQuantity}
                onChange={e => setOnHandQuantity(e.target.value)}
                className="w-full border border-[#E5E5E5] px-3 py-2 text-xs focus:outline-none focus:border-[#111111]"
                placeholder="0"
              />
              <p className="text-[10px] text-[#777777] mt-1">This will update the absolute on-hand stock count.</p>
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
              disabled={loading || !skuId}
              className="px-4 py-2 bg-[#111111] text-white hover:bg-black text-xs font-bold disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : 'Update Stock'}
            </button>
          </div>
        </form>
      </div>
    </CapabilityGuard>
  );
}
