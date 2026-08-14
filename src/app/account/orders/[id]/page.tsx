"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Package, Truck, CheckCircle, Clock, Download, ArrowLeft } from 'lucide-react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { MockGetOrderDetailsAdapter } from '@/modules/orders/frontend-contracts/MockOrderAdapter';
import { Order } from '@/modules/orders/frontend-contracts/OrderContract';
import { toast } from '@/components/ui/Toast';

const getOrderDetailsQuery = new MockGetOrderDetailsAdapter();

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (id) {
      getOrderDetailsQuery.execute({ orderId: id })
        .then(data => {
          if (mounted) {
            setOrder(data);
            setIsLoading(false);
          }
        })
        .catch(err => {
          console.error(err);
          if (mounted) setIsLoading(false);
        });
    }
    return () => { mounted = false; };
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#111111]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-12 text-center text-[#777777]">Order not found.</div>
    );
  }

  return (
    <CapabilityGuard featureKey="commerce.orders">
<div className="space-y-8">
      <div>
        <Link href="/account/orders" className="text-xs text-[#777777] hover:text-[#111111] flex items-center gap-1 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight flex items-center gap-2">
              Order #{order.id}
              <span className="px-2.5 py-0.5 border border-[#138808] text-[#138808] bg-[#138808]/5 text-xs font-semibold">{order.status}</span>
            </h1>
            <p className="text-xs text-[#777777]">Placed on {order.placedOn} • Razorpay Txn: {order.transactionId || 'N/A'}</p>
          </div>
          <button onClick={() => toast('GST Invoice PDF will be generated when the backend invoicing service is connected')} className="px-4 py-2 border border-[#111111] bg-[#111111] text-white hover:bg-black text-xs font-semibold flex items-center gap-2">
            <Download className="w-4 h-4" /> Download GST Invoice
          </button>
        </div>
      </div>

      <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-6 space-y-4">
        <h2 className="font-heading text-sm font-bold text-[#111111] uppercase tracking-wider">Granular FSM Progress Tracker</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          {['CREATED', 'PAYMENT_CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map(statusStep => {
            const fsmItem = order.fsm.find(s => s.status === statusStep);
            const isCompleted = !!fsmItem;
            
            let Icon = Package;
            if (statusStep === 'CREATED' || statusStep === 'PAYMENT_CONFIRMED') Icon = CheckCircle;
            if (statusStep === 'PROCESSING') Icon = Clock;
            if (statusStep === 'SHIPPED') Icon = Truck;

            return (
              <div key={statusStep} className={`bg-white border p-3 space-y-1 ${isCompleted ? 'border-[#138808]' : 'border-[#E5E5E5] opacity-50'}`}>
                <Icon className={`w-5 h-5 mx-auto ${isCompleted ? 'text-[#138808]' : 'text-[#777777]'}`} />
                <div className={`font-bold ${isCompleted ? 'text-[#138808]' : 'text-[#777777]'}`}>{statusStep}</div>
                <div className="text-[10px] text-[#777777]">{fsmItem ? fsmItem.timestamp : 'Pending'}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </CapabilityGuard>
  );
}
