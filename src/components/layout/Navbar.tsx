"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingCart, User, Package, Wrench, ShieldCheck, 
  Store, Building2, ChevronDown, Menu, X, Tag, Layers, Landmark,
  LogIn, UserPlus, LogOut, ShieldAlert, Code2
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { SessionRole } from "../../modules/auth/frontend-contracts/AuthContract";
import { useCartContext } from "../commerce/CartContext";

export function Navbar() {
  const pathname = usePathname();
  const { session, switchRole, signOut, isLoading } = useAuth();
  const { cartState } = useCartContext();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  
  const sessionRole = session?.role || "logged_out";
  const userEmail = session?.userEmail || "";
  const userName = session?.userName || "";

  const handleEmailChange = async (newEmail: string) => {
    // If we wanted to allow full arbitrary email changes from the nav we'd call authenticate() here.
    // Since the navbar mock is mostly for switching roles, we'll keep the mock simple.
    console.log("Email change requested:", newEmail);
  };

  const handleRoleChange = async (newRole: SessionRole) => {
    setIsSwitching(true);
    try {
      await switchRole(newRole);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSwitching(false);
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleSignOut = async () => {
    setIsSwitching(true);
    try {
      await signOut();
    } finally {
      setIsSwitching(false);
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const centerNavLinks = [
    { name: "Categories", path: "/categories" },
    { name: "Products", path: "/products" },
    { name: "Engineering", path: "/engineering" },
    { name: "Manufacturers", path: "/manufacturers" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[var(--border)] text-[var(--foreground)] font-sans">
      <nav className="w-full px-6 lg:px-10 h-[72px] flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <svg width="36" height="28" viewBox="0 0 36 28" fill="none" className="text-[var(--foreground)]">
            <path d="M0 0L12 14L0 28H6L18 14L6 0H0Z" fill="currentColor" />
            <path d="M14 0L26 14L14 28H20L32 14L20 0H14Z" fill="currentColor" />
          </svg>
          <span className="font-heading font-bold text-[16px] tracking-tight ml-2">RUDRASTRA</span>
        </Link>

        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center gap-1 text-[14px] font-medium">
          {centerNavLinks.map((link) => {
            const isActive = pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`group flex items-center gap-1 px-4 py-2 border rounded-full transition-colors duration-fast ${
                  isActive ? "border-[#111111] font-semibold" : "border-transparent hover:border-[#111111]"
                }`}
              >
                {link.name}
                <svg className={`w-3.5 h-3.5 transition-all duration-fast ${isActive ? "opacity-100 ml-0" : "opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          <Link
            href="/cart"
            className="p-2 text-[var(--foreground)] hover:bg-slate-100 rounded-full transition-colors relative"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute top-0 right-0 bg-[#111111] text-white font-mono text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartState?.summary.itemCount || 0}
            </span>
          </Link>

          <Link
            href="/rfq"
            className="hidden md:inline-flex px-5 py-2.5 bg-[#111111] text-white border border-[#111111] hover:bg-black text-[13px] font-sans font-semibold transition-colors duration-fast shrink-0"
          >
            Request Quote
          </Link>

          {/* Authentication & Profile Menu */}
          {isLoading ? (
            <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-slate-800 animate-spin" />
          ) : sessionRole === "logged_out" ? (
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
              <Link 
                href="/login" 
                className="px-3.5 py-2 text-[#111111] hover:bg-slate-100 rounded transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
              <Link 
                href="/signup" 
                className="px-4 py-2 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white transition-colors flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" /> Create Account
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1.5 p-2 text-[var(--foreground)] hover:bg-slate-100 rounded-full transition-colors"
                title="User Profile Menu"
              >
                <User className="w-5 h-5" />
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-[var(--border)] rounded-xl shadow-xl p-3 z-50 text-[13px] text-slate-800 animate-in fade-in slide-in-from-top-2">
                  
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-[14px]">{userName}</span>
                      <span className={`px-2 py-0.5 font-mono text-[9px] font-bold uppercase rounded border ${
                        sessionRole === "owner" ? "border-amber-600 text-amber-600 bg-amber-50" :
                        sessionRole === "customer" ? "border-blue-600 text-blue-600 bg-blue-50" :
                        sessionRole === "seller" ? "border-emerald-600 text-emerald-600 bg-emerald-50" :
                        "border-rose-600 text-rose-600 bg-rose-50"
                      }`}>
                        {sessionRole}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">{userEmail}</div>
                  </div>

                  {true && (
                    <div className="bg-amber-50 border border-amber-200 p-2 rounded-lg mb-3 space-y-2 text-[10px]">
                      <div className="flex items-center justify-between font-bold text-amber-800 uppercase tracking-wider text-[9px]">
                        <span className="flex items-center gap-1"><Code2 className="w-3 h-3" /> Dev Context Panel</span>
                        <span className="text-[8px] font-mono text-amber-600">(Mock Adapter)</span>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-amber-700">Simulate Another User</label>
                        <select 
                          value={userEmail}
                          onChange={(e) => handleEmailChange(e.target.value)}
                          className="w-full bg-white border border-amber-200 rounded p-1 text-[11px] font-mono text-amber-900"
                        >
                          <option value="praneeth@vyooma.tech">praneeth@vyooma.tech (Owner)</option>
                          <option value="ops-agent@vyooma.tech">ops-agent@vyooma.tech (Ops Agent)</option>
                          <option value="guest@vyooma.tech">guest@vyooma.tech (Guest)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-amber-700">Current Role Context</label>
                        <div className="grid grid-cols-4 gap-1 text-center font-semibold text-[8px]">
                          <button 
                            disabled={isSwitching}
                            onClick={() => handleRoleChange("owner")} 
                            className={`py-1 rounded transition-all disabled:opacity-50 ${sessionRole === "owner" ? "bg-amber-600 text-white font-bold" : "bg-white text-amber-900 border border-amber-200"}`}
                          >Owner</button>
                          <button 
                            disabled={isSwitching}
                            onClick={() => handleRoleChange("customer")} 
                            className={`py-1 rounded transition-all disabled:opacity-50 ${sessionRole === "customer" ? "bg-amber-600 text-white font-bold" : "bg-white text-amber-900 border border-amber-200"}`}
                          >Customer</button>
                          <button 
                            disabled={isSwitching}
                            onClick={() => handleRoleChange("seller")} 
                            className={`py-1 rounded transition-all disabled:opacity-50 ${sessionRole === "seller" ? "bg-amber-600 text-white font-bold" : "bg-white text-amber-900 border border-amber-200"}`}
                          >Seller</button>
                          <button 
                            disabled={isSwitching}
                            onClick={() => handleRoleChange("ops")} 
                            className={`py-1 rounded transition-all disabled:opacity-50 ${sessionRole === "ops" ? "bg-amber-600 text-white font-bold" : "bg-white text-amber-900 border border-amber-200"}`}
                          >
                            Ops
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {sessionRole === "customer" && (
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">Customer Account</div>
                      <Link
                        href="/account"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-800 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-600" />
                        <div>
                          <div className="font-semibold">Account Dashboard</div>
                          <div className="text-[10px] text-slate-500">Orders, RMA & Warranties</div>
                        </div>
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-800 transition-colors"
                      >
                        <Package className="w-4 h-4 text-slate-600" />
                        <div>
                          <div className="font-semibold">Orders & Tracking</div>
                          <div className="text-[10px] text-slate-500">View status & invoices</div>
                        </div>
                      </Link>
                      <Link
                        href="/account/rma"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-800 transition-colors"
                      >
                        <Wrench className="w-4 h-4 text-slate-600" />
                        <div>
                          <div className="font-semibold">Technical RMA & Returns</div>
                          <div className="text-[10px] text-slate-500">Hardware return diagnostics</div>
                        </div>
                      </Link>
                      <Link
                        href="/organization/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-blue-700 transition-colors border-t border-slate-100 mt-1 pt-2"
                      >
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="font-semibold">Organization Workspace</div>
                          <div className="text-[10px] text-slate-500">B2B Projects & PO Approvals</div>
                        </div>
                      </Link>
                      <Link
                        href="/sell"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-emerald-50 text-emerald-700 transition-colors"
                      >
                        <Store className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="font-semibold">Become a Seller</div>
                          <div className="text-[10px] text-emerald-600">Register merchant account</div>
                        </div>
                      </Link>
                    </div>
                  )}

                  {sessionRole === "seller" && (
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 px-2 py-1">Seller Merchant Hub</div>
                      <Link
                        href="/seller/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-800 transition-colors"
                      >
                        <Store className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="font-semibold">Seller Dashboard</div>
                          <div className="text-[10px] text-slate-500">Sales & fulfillment overview</div>
                        </div>
                      </Link>
                      <Link
                        href="/seller/offers"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-800 transition-colors"
                      >
                        <Tag className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="font-semibold">Offers & SKU Mapping</div>
                          <div className="text-[10px] text-slate-500">Pricing & GST HSN rates</div>
                        </div>
                      </Link>
                      <Link
                        href="/seller/inventory"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-800 transition-colors"
                      >
                        <Layers className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="font-semibold">Inventory Ledger</div>
                          <div className="text-[10px] text-slate-500">On-hand & reserved stock</div>
                        </div>
                      </Link>
                      <Link
                        href="/seller/payouts"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-800 transition-colors"
                      >
                        <Landmark className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="font-semibold">Razorpay Payouts</div>
                          <div className="text-[10px] text-slate-500">Bank settlements</div>
                        </div>
                      </Link>
                    </div>
                  )}

                  {sessionRole === "ops" && (
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600 px-2 py-1">Ops Mission Control</div>
                      <Link
                        href="/ops"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-800 transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        <div>
                          <div className="font-semibold">Ops Control Center</div>
                          <div className="text-[10px] text-slate-500">Platform overview</div>
                        </div>
                      </Link>
                      <Link
                        href="/ops/catalog"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-800 transition-colors"
                      >
                        <Layers className="w-4 h-4 text-rose-600" />
                        <div>
                          <div className="font-semibold">PIM Verification Desk</div>
                          <div className="text-[10px] text-slate-500">Approve MPN specs</div>
                        </div>
                      </Link>
                      <Link
                        href="/ops/audit-logs"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-800 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-rose-600" />
                        <div>
                          <div className="font-semibold">System Audit Trail</div>
                          <div className="text-[10px] text-slate-500">Security audit logs</div>
                        </div>
                      </Link>
                    </div>
                  )}

                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <button
                      disabled={isSwitching}
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-rose-600 hover:bg-rose-50 font-bold transition-colors text-left disabled:opacity-50"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out of Session
                    </button>
                  </div>

                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[var(--foreground)]"
            aria-label="Open menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[var(--border)] p-4 space-y-3 text-[14px]">
          <div className="space-y-1">
            {centerNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-slate-100 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="border-t border-[var(--border)] pt-3 space-y-2 text-[13px]">
            <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-1.5 font-bold">🛒 Cart ({cartState?.summary.itemCount || 0} Items)</Link>
            <Link href="/rfq" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 bg-[#111111] text-white text-center font-bold">Request Quote</Link>
            
            {sessionRole === "logged_out" ? (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-center border border-[#111111] font-bold">Sign In</Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-center bg-[#111111] text-white font-bold">Register</Link>
              </div>
            ) : (
              <div className="space-y-1 pt-2">
                <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-1.5 font-semibold">👤 Account Dashboard</Link>
                <button 
                  disabled={isSwitching}
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-1.5 font-bold text-rose-600 disabled:opacity-50"
                >
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
