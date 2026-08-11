"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, Building2, ShieldCheck, ArrowRight } from 'lucide-react';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { useCartContext } from '@/components/commerce/CartContext';
import { useCommand } from '@/hooks/useCommand';
import { MockPlaceOrderAdapter } from '@/modules/commerce/frontend-contracts/MockCheckoutAdapter';
import { CheckoutState } from '@/modules/commerce/frontend-contracts/CheckoutContract';
import { formatMoney } from '@/utils/money';

const placeOrderCommand = new MockPlaceOrderAdapter();

export default function CheckoutPage() {
  const router = useRouter();
  const { cartState } = useCartContext();
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    shippingAddress: 'Plot 42, Hardware Park, Shamshabad, Hyderabad, Telangana 501218',
    companyName: 'Vyooma Technologies Pvt Ltd',
    gstin: '36AAACV9981K1Z9',
    paymentMethod: 'NET_TERMS'
  });

  const { execute, isLoading } = useCommand({
    command: placeOrderCommand,
    onSuccess: (result) => {
      // In a real app, we might check result.status to route to payment gateway
      router.push(`/checkout/success`);
    }
  });

  const handlePlaceOrder = () => {
    execute({
      shippingAddress: checkoutState.shippingAddress,
      companyName: checkoutState.companyName,
      gstin: checkoutState.gstin,
      paymentMethod: checkoutState.paymentMethod
    });
  };

  return (
    <CapabilityGuard featureKey="commerce.checkout">
      <div className="min-h-screen bg-[#F5F5F5] text-[#111111] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight text-[#111111] flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-[#F35C27]" />
            B2B Order Checkout & Payment
          </h1>
          <p className="text-xs text-[#777777] mt-1">
            Verified corporate GST checkout with instant net terms validation or Razorpay route settlement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Corporate GST Shipping Address */}
            <div className="bg-white border border-[#E5E5E5] p-6 space-y-4 shadow-sm text-xs">
              <h2 className="text-sm font-bold text-[#111111] uppercase tracking-wider border-b border-[#E5E5E5] pb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#305CDE]" /> 1. Shipping & Corporate GST Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#777777] font-semibold mb-1 block">Company / Entity Name</label>
                  <input type="text" value={checkoutState.companyName} onChange={e => setCheckoutState({...checkoutState, companyName: e.target.value})} className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded p-2.5 text-[#111111] font-semibold" />
                </div>
                <div>
                  <label className="text-[#777777] font-semibold mb-1 block">Corporate GSTIN</label>
                  <input type="text" value={checkoutState.gstin} onChange={e => setCheckoutState({...checkoutState, gstin: e.target.value})} className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded p-2.5 text-[#111111] font-mono font-semibold" />
                </div>
                <div className="col-span-2">
                  <label className="text-[#777777] font-semibold mb-1 block">Delivery Address</label>
                  <input type="text" value={checkoutState.shippingAddress} onChange={e => setCheckoutState({...checkoutState, shippingAddress: e.target.value})} className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded p-2.5 text-[#111111]" />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method Selection */}
            <div className="bg-white border border-[#E5E5E5] p-6 space-y-4 shadow-sm text-xs">
              <h2 className="text-sm font-bold text-[#111111] uppercase tracking-wider border-b border-[#E5E5E5] pb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#138808]" /> 2. Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => setCheckoutState({...checkoutState, paymentMethod: 'NET_TERMS'})}
                  className={`border-2 p-4 space-y-2 cursor-pointer transition-colors ${checkoutState.paymentMethod === 'NET_TERMS' ? 'border-[#138808] bg-[#138808]/5' : 'border-[#E5E5E5] bg-[#F5F5F5] hover:border-[#111111]'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#138808]">Approved B2B Net Terms</span>
                    <span className="px-2 py-0.5 border border-[#138808] text-[#138808] font-mono font-bold text-[10px]">NET-30</span>
                  </div>
                  <p className="text-[11px] text-[#777777]">Pay within 30 days using pre-approved credit line (₹4,41,826 Available).</p>
                </div>
                <div 
                  onClick={() => setCheckoutState({...checkoutState, paymentMethod: 'RAZORPAY'})}
                  className={`border-2 p-4 space-y-2 cursor-pointer transition-colors ${checkoutState.paymentMethod === 'RAZORPAY' ? 'border-[#305CDE] bg-[#305CDE]/5' : 'border-[#E5E5E5] bg-[#F5F5F5] hover:border-[#111111]'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#111111]">Razorpay Online / UPI / Card</span>
                    <span className="px-2 py-0.5 border border-[#305CDE] text-[#305CDE] font-mono font-bold text-[10px]">INSTANT</span>
                  </div>
                  <p className="text-[11px] text-[#777777]">Corporate Net Banking, Credit Cards, or UPI Payment.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Checkout Right Summary */}
          <div className="space-y-6">
            <div className="bg-white border border-[#E5E5E5] p-6 space-y-6 shadow-sm text-xs">
              <h2 className="font-heading text-base font-bold text-[#111111] border-b border-[#E5E5E5] pb-3">
                Final Checkout Summary
              </h2>

              <div className="space-y-3 font-mono">
                <div className="flex justify-between text-[#777777]">
                  <span>Items Subtotal</span>
                  <span className="text-[#111111] font-semibold">₹{formatMoney(cartState?.summary.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#777777]">
                  <span>Total GST (18%)</span>
                  <span className="text-[#138808] font-semibold">₹{formatMoney(cartState?.summary.gstAmount)}</span>
                </div>
                <div className="border-t border-[#E5E5E5] pt-3 flex justify-between text-sm font-extrabold text-[#111111]">
                  <span>Payable Amount</span>
                  <span className="text-[#F35C27]">₹{formatMoney(cartState?.summary.total)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="w-full py-3.5 bg-[#111111] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors uppercase tracking-wider disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize & Place Order</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
      </div>
    </CapabilityGuard>
  );
}
