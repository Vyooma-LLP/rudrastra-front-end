"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { MockListOrdersAdapter } from '@/modules/orders/frontend-contracts/MockOrderAdapter';
import { Order } from '@/modules/orders/frontend-contracts/OrderContract';
import { formatMoney } from '@/utils/money';

const listOrdersQuery = new MockListOrdersAdapter();

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    listOrdersQuery.execute({}).then(data => {
      if (mounted) {
        setOrders(data);
        setIsLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <CapabilityGuard featureKey="commerce.orders">
<div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Order History & Granular Tracking</h1>
        <p className="text-xs text-[#777777]">View orders, seller split fulfillments, invoices, and shipment tracking.</p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#111111]"></div>
          </div>
        ) : orders.map(order => (
          <div key={order.id} className="bg-[#F5F5F5] border border-[#E5E5E5] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#E5E5E5] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#F35C27] text-sm">#{order.id}</span>
                <span className="px-2 py-0.5 border border-[#138808] text-[#138808] bg-[#138808]/5 font-semibold text-[10px]">{order.status}</span>
              </div>
              <p className="text-xs text-[#777777] mt-0.5">Placed on {order.placedOn} • Project: {order.projectContext || 'General'}</p>
            </div>
            <div className="text-right">
              <div className="font-mono font-extrabold text-[#111111] text-base">₹{formatMoney(order.totalAmount)}</div>
              <div className="text-[11px] text-[#138808]">Includes 18% GST (₹{formatMoney(order.gstAmount)})</div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="text-[#777777] font-semibold uppercase tracking-wider text-[10px]">Fulfillment Breakdown</div>
            
            {order.subOrders.map(subOrder => (
              <div key={subOrder.id} className="bg-white border border-[#E5E5E5] p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <div className="font-semibold text-[#111111]">Sub-Order #{subOrder.id} • {subOrder.sellerName}</div>
                  <div className="text-[#777777]">{subOrder.itemsDescription}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 border border-[#305CDE] text-[#305CDE] font-mono">AWB: {subOrder.awb || 'Pending'}</span>
                  <Link href={`/account/orders/${order.id}`} className="text-[#F35C27] font-semibold hover:underline">Track Package</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        ))}
      </div>
    </div>
    </CapabilityGuard>
  );
}
