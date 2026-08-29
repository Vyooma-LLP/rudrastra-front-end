"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Trash2, ArrowRight, ShieldCheck, 
  Cpu, FolderGit2, CheckCircle, AlertCircle
} from 'lucide-react';
import { useCartContext } from '@/components/commerce/CartContext';
import { formatMoney } from '@/utils/money';
import { toast } from '@/components/ui/Toast';

export default function CartPage() {
  const { cartState, isLoading, removeFromCart, updateQuantity, setProjectContext } = useCartContext();
  
  return (
    
      <div className="min-h-screen bg-[#F5F5F5] text-[#111111] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#E5E5E5] pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-extrabold tracking-tight text-[#111111] flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-[#F35C27]" />
              Engineering Procurement Cart
            </h1>
            <p className="text-xs text-[#777777] mt-1">
              Review selected hardware, verify component compatibility, and assign to engineering projects.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-[#E5E5E5] rounded px-3 py-1.5 text-xs text-[#111111]">
            <span className="font-semibold text-gray-500">Quote Request Cart</span>
          </div>
        </div>

        {/* Project Assignment Bar */}
        <div className="bg-white border border-[#E5E5E5] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#305CDE]/10 text-[#305CDE] rounded">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#305CDE] uppercase tracking-wider">Project Allocation Context</div>
              <div className="text-sm font-bold text-[#111111]">
                {cartState?.projectContext === 'PRJ-882' ? 'Vyooma Technologies — Autonomous FOD Drone V2' : 
                 cartState?.projectContext === 'PRJ-401' ? 'Solar Inspection Quad (PRJ-401)' : 'General Inventory Stock'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#777777]">Assigned Project:</span>
            <select 
              value={cartState?.projectContext || ''} 
              onChange={e => setProjectContext({ projectId: e.target.value })}
              className="bg-[#F5F5F5] border border-[#E5E5E5] rounded px-3 py-1.5 text-[#111111] font-semibold"
            >
              <option value="PRJ-882">FOD Drone V2 (PRJ-882)</option>
              <option value="PRJ-401">Solar Inspection Quad (PRJ-401)</option>
              <option value="">General Inventory Stock</option>
            </select>
          </div>
        </div>

        {/* Compatibility Warning Alert Banner */}
        {cartState?.isCompatibilityPassed ? (
          <div className="bg-[#138808]/5 border border-[#138808]/30 p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#138808] shrink-0 mt-0.5" />
            <div className="text-xs text-[#111111]">
              <span className="font-bold text-[#138808]">Compatibility Verification Passed:</span> All {cartState.summary.itemCount} selected components have verified electrical and protocol compatibility for operation.
            </div>
          </div>
        ) : (
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="text-xs text-[#111111]">
              <span className="font-bold text-yellow-600">Compatibility Verification Pending:</span> Not all selected components have been verified for compatibility. Risk of failure.
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Line Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-[#E5E5E5] p-6 space-y-6 shadow-sm">
              <h2 className="text-sm font-bold text-[#111111] uppercase tracking-wider border-b border-[#E5E5E5] pb-3">
                Selected Components ({cartState?.items.length || 0} Items)
              </h2>

              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#111111]"></div>
                </div>
              ) : cartState?.items.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-4 text-xs" data-testid="cart-item">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-[#F5F5F5] border border-[#E5E5E5] rounded flex items-center justify-center font-mono font-bold text-[#111111]">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-bold text-[#111111] text-sm">{item.name}</div>
                      <div className="text-[#777777]">MPN: {item.mpn} • Offered by <strong className="text-[#111111]" data-testid="cart-seller">{item.sellerName}</strong></div>
                      <div className="text-[#138808] font-semibold">In Stock ({item.stockAvailable} Units) • {item.leadTimeDays} Business Days Delivery</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1 border border-[#E5E5E5] bg-[#F5F5F5] rounded">
                      <button 
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity({ itemId: item.id, quantity: item.quantity - 1 });
                          }
                        }}
                        disabled={item.quantity <= 1}
                        className="px-2.5 py-1 text-xs font-bold text-gray-600 hover:text-black hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-xs px-1 text-gray-800">{item.quantity}</span>
                      <button 
                        onClick={() => {
                          if (item.quantity < item.stockAvailable) {
                            updateQuantity({ itemId: item.id, quantity: item.quantity + 1 });
                          } else {
                            toast("Cannot exceed available stock");
                          }
                        }}
                        disabled={item.quantity >= item.stockAvailable}
                        className="px-2.5 py-1 text-xs font-bold text-gray-600 hover:text-black hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <div className="font-mono font-bold text-[#111111] text-sm">₹{formatMoney(item.unitPrice)}</div>
                      <div className="text-[10px] text-[#777777] font-mono">Total: ₹{((parseInt(item.unitPrice.amountMinor) / 100) * item.quantity).toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                    </div>
                    <button 
                      onClick={() => removeFromCart({ itemId: item.id })}
                      className="text-rose-600 hover:text-rose-800 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {!isLoading && (!cartState?.items || cartState.items.length === 0) && (
                <div className="text-center p-8 text-[#777777]">
                  Your procurement cart is empty.
                </div>
              )}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="space-y-6">
            <div className="bg-white border border-[#E5E5E5] p-6 space-y-6 shadow-sm text-xs">
              <h2 className="font-heading text-base font-bold text-[#111111] border-b border-[#E5E5E5] pb-3">
                Estimated Cart Value
              </h2>

              <div className="space-y-3 font-mono">
                <div className="flex justify-between text-[#777777]">
                  <span>Subtotal</span>
                  <span className="text-[#111111] font-semibold">₹{formatMoney(cartState?.summary.subtotal)}</span>
                </div>
                <div className="border-t border-[#E5E5E5] pt-3 flex justify-between text-sm font-extrabold text-[#111111]">
                  <span>Estimated Cart Value</span>
                  <span className="text-[#F35C27]">₹{formatMoney(cartState?.summary.subtotal)}</span>
                </div>
                <div className="text-[10px] text-[#777777] italic mt-2">
                  * Final pricing will be confirmed after your quote request.
                </div>
              </div>

              {cartState?.items && cartState.items.length > 0 ? (
                <Link
                  href="/quote-request"
                  className="w-full py-3.5 bg-[#111111] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors uppercase tracking-wider text-center"
                >
                  <span>Request Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full py-3.5 bg-[#E5E5E5] text-gray-400 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed uppercase tracking-wider"
                >
                  <span>Request Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
      </div>
    
  );
}
