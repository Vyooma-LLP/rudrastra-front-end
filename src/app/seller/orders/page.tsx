"use client";

import React, { useEffect, useState } from 'react';
import { Truck, CheckCircle } from 'lucide-react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { useCommand } from '@/hooks/useCommand';
import { MockListSellerOrdersAdapter, MockGenerateAwbAdapter } from '@/modules/seller/frontend-contracts/MockSellerOrdersAdapter';
import { SellerOrder } from '@/modules/seller/frontend-contracts/SellerOrdersContract';

const listSellerOrdersQuery = new MockListSellerOrdersAdapter();
const generateAwbCommand = new MockGenerateAwbAdapter();

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = () => {
    setIsLoading(true);
    listSellerOrdersQuery.execute({}).then(data => {
      setOrders(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, []);

  const { execute: generateAwb, isLoading: isGenerating } = useCommand({
    command: generateAwbCommand,
    onSuccess: () => {
      fetchOrders();
    }
  });

  return (
    <CapabilityGuard featureKey="seller.orders">
<div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Seller Orders & Shipments</h1>
        <p className="text-xs text-[#777777]">Fulfill seller sub-orders, generate Shiprocket AWBs, and issue dispatch manifests.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#111111]"></div>
        </div>
      ) : orders.map(order => (
        <div key={order.id} className="bg-[#F5F5F5] border border-[#E5E5E5] p-5 space-y-3 text-xs">
          <div className="flex justify-between items-center border-b border-[#E5E5E5] pb-3">
            <div>
              <span className="font-mono font-bold text-[#138808] text-sm">Seller Order #{order.id}</span>
              <div className="text-[#777777]">Customer: {order.customerName} • Ship-to: {order.shippingLocation}</div>
            </div>
            <span className={`px-2 py-0.5 border font-semibold text-[10px] ${order.status === 'SHIPPED' ? 'border-[#138808] text-[#138808] bg-[#138808]/5' : 'border-[#F35C27] text-[#F35C27] bg-[#F35C27]/5'}`}>
              {order.status}
            </span>
          </div>
          <div className="flex justify-between items-center font-mono">
            <span>Items: {order.itemsSummary}</span>
            {order.status === 'AWAITING DISPATCH' ? (
              <button 
                onClick={() => generateAwb({ sellerOrderId: order.id })}
                disabled={isGenerating}
                className="px-3 py-1.5 bg-[#111111] text-white hover:bg-black font-sans font-bold flex items-center gap-1 disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                ) : (
                  <Truck className="w-3.5 h-3.5" />
                )}
                Generate Shiprocket AWB
              </button>
            ) : (
              <div className="flex items-center gap-2 font-bold text-[#138808]">
                <CheckCircle className="w-4 h-4" />
                AWB: {order.awb}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
    </CapabilityGuard>
  );
}
