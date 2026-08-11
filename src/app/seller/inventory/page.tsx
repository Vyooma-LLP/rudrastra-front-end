"use client";

import React, { useEffect, useState } from 'react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { MockListSellerInventoryAdapter } from '@/modules/seller/frontend-contracts/MockSellerInventoryAdapter';
import { SellerInventoryItem } from '@/modules/seller/frontend-contracts/SellerInventoryContract';

const listSellerInventoryQuery = new MockListSellerInventoryAdapter();

export default function SellerInventoryPage() {
  const [items, setItems] = useState<SellerInventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    listSellerInventoryQuery.execute({ page: { limit: 10 } }).then(data => {
      if (mounted) {
        setItems(data.items);
        setIsLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <CapabilityGuard featureKey="seller.inventory">
<div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Physical Inventory Stock Ledger</h1>
        <p className="text-xs text-[#777777]">Strict tracking of on-hand vs reserved stock (`sellable = on_hand - reserved`).</p>
      </div>

      <div className="bg-[#F5F5F5] border border-[#E5E5E5] overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-white border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-4">SKU Code</th>
              <th className="p-4">Warehouse Location</th>
              <th className="p-4">On-Hand Stock</th>
              <th className="p-4">Reserved Stock</th>
              <th className="p-4">Sellable Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5] text-[#111111] font-mono">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#111111]"></div>
                </td>
              </tr>
            ) : items.map(item => (
              <tr key={item.skuCode}>
                <td className="p-4 font-bold text-[#138808]">{item.skuCode}</td>
                <td className="p-4 font-sans">{item.warehouseLocation}</td>
                <td className="p-4">{item.onHandStock} Units</td>
                <td className="p-4 text-[#F35C27]">{item.reservedStock} Units</td>
                <td className="p-4 font-bold text-[#138808]">{item.sellableStock} Units</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </CapabilityGuard>
  );
}
