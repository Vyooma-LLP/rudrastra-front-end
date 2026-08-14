import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CapabilityGuard } from '@/components/layout/CapabilityGuard';
import { ShieldCheck, Layers, Headphones, Wrench, AlertTriangle, Scale, ScrollText, User, Building2, Store, DollarSign, FileText, Wallet, BarChart3, Truck, Flag, Database, Cpu, Settings, Bell } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function OpsLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const [userRecord] = await db.select().from(users).where(eq(users.email, user.email!));
  if (!userRecord || userRecord.role !== 'ADMIN') {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#111111] font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-[1600px] mx-auto px-6 lg:px-10 py-8 gap-8">
        <aside className="w-full md:w-64 bg-white border border-[#E5E5E5] p-6 flex flex-col justify-between shrink-0 space-y-6 shadow-sm">
          <div className="space-y-6">
            <div className="space-y-3 pb-4 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[#111111] text-sm">Ops Mission Control</h3>
                  <p className="text-[11px] text-rose-600 font-mono font-semibold">SUPERADMIN MODE</p>
                </div>
              </div>
            </div>

            <nav className="space-y-1 text-xs font-medium">
              <Link href="/ops" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#111111] hover:bg-[#F5F5F5] font-semibold transition-colors">
                <ShieldCheck className="w-4 h-4 text-rose-600" /> Ops Overview
              </Link>
              <Link href="/ops/catalog/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] font-semibold transition-colors">
                <Database className="w-4 h-4 text-indigo-600" /> Products Catalog
              </Link>
              <Link href="/ops/quotes" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] font-semibold transition-colors">
                <FileText className="w-4 h-4 text-indigo-600" /> Quote Inbox
              </Link>

              <div className="pt-2 pb-1 text-[10px] font-bold text-[#777777] uppercase tracking-wider px-3">Upcoming Features</div>
              
              <CapabilityGuard featureKey="coming.soon">
                <Link href="/ops/control-center" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors w-full">
                  <Layers className="w-4 h-4 text-rose-600" /> Control Center
                </Link>
              </CapabilityGuard>
              <CapabilityGuard featureKey="coming.soon">
                <Link href="/ops/catalog" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors w-full">
                  <Layers className="w-4 h-4 text-rose-600" /> PIM Catalog Verification
                </Link>
              </CapabilityGuard>
              <CapabilityGuard featureKey="coming.soon">
                <Link href="/ops/tickets" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors w-full">
                  <Headphones className="w-4 h-4 text-rose-600" /> Support Desk & SLAs
                </Link>
              </CapabilityGuard>
              <CapabilityGuard featureKey="coming.soon">
                <Link href="/ops/fulfillment" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors w-full">
                  <Truck className="w-4 h-4 text-rose-600" /> Fulfillment & Logistics
                </Link>
              </CapabilityGuard>
              <CapabilityGuard featureKey="coming.soon">
                <Link href="/ops/incidents" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors w-full">
                  <Flag className="w-4 h-4 text-rose-600" /> Incidents & SLAs
                </Link>
              </CapabilityGuard>
              <CapabilityGuard featureKey="coming.soon">
                <Link href="/ops/rma" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors w-full">
                  <Wrench className="w-4 h-4 text-rose-600" /> RMA Quarantine Desk
                </Link>
              </CapabilityGuard>
              
              <div className="pt-2 pb-1 text-[10px] font-bold text-[#777777] uppercase tracking-wider px-3">Catalog & Engineering</div>
              <CapabilityGuard featureKey="coming.soon">
                <Link href="/ops/catalog/specifications" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors w-full">
                  <Database className="w-4 h-4 text-indigo-600" /> Specification Analysis
                </Link>
              </CapabilityGuard>
              <CapabilityGuard featureKey="coming.soon">
                <Link href="/ops/catalog/mpn-resolution" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors w-full">
                  <Cpu className="w-4 h-4 text-indigo-600" /> MPN Resolution Desk
                </Link>
              </CapabilityGuard>
              <CapabilityGuard featureKey="coming.soon">
                <Link href="/ops/disputes" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors w-full">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Buyer/Seller Disputes
                </Link>
              </CapabilityGuard>
              <CapabilityGuard featureKey="coming.soon">
                <Link href="/ops/reconciliation" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors w-full">
                  <Scale className="w-4 h-4 text-rose-600" /> Financial Ledger Recon
                </Link>
              </CapabilityGuard>
              <CapabilityGuard featureKey="coming.soon">
                <Link href="/ops/finance/ledger" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors w-full">
                  <DollarSign className="w-4 h-4 text-rose-600" /> Core Finance Ledger
                </Link>
              </CapabilityGuard>
              <CapabilityGuard featureKey="coming.soon">
                <Link href="/ops/finance/invoices" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors w-full">
                  <FileText className="w-4 h-4 text-rose-600" /> Invoices & Billing
                </Link>
              </CapabilityGuard>
              <CapabilityGuard featureKey="coming.soon">
                <Link href="/ops/finance/payouts" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors w-full">
                  <Wallet className="w-4 h-4 text-rose-600" /> Seller Payouts
                </Link>
              </CapabilityGuard>
              <CapabilityGuard featureKey="coming.soon">
                <Link href="/ops/finance/reports" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors w-full">
                  <BarChart3 className="w-4 h-4 text-rose-600" /> Financial Reports
                </Link>
              </CapabilityGuard>
              <CapabilityGuard featureKey="coming.soon">
                <Link href="/ops/compliance" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors w-full">
                  <Scale className="w-4 h-4 text-rose-600" /> Compliance Audits
                </Link>
              </CapabilityGuard>
              
              <div className="pt-2 pb-1 text-[10px] font-bold text-[#777777] uppercase tracking-wider px-3">Platform Administration</div>
              <CapabilityGuard featureKey="coming.soon">
                <Link href="/ops/platform/rbac" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors w-full">
                  <Settings className="w-4 h-4 text-[#777777]" /> Identity & RBAC Control
                </Link>
              </CapabilityGuard>
              <CapabilityGuard featureKey="coming.soon">
                <Link href="/ops/platform/notifications" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors w-full">
                  <Bell className="w-4 h-4 text-[#777777]" /> Notification Engine
                </Link>
              </CapabilityGuard>
              <CapabilityGuard featureKey="coming.soon">
                <Link href="/ops/audit-logs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777777] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors w-full">
                  <ScrollText className="w-4 h-4 text-rose-600" /> System Audit Trail
                </Link>
              </CapabilityGuard>
            </nav>
          </div>

          <div className="pt-4 border-t border-[#E5E5E5] text-[11px] space-y-2">
            <div className="text-[#777777] font-semibold uppercase tracking-wider text-[10px]">Switch Portal Context</div>
            <div className="space-y-1">
              <Link href="/account" className="flex items-center gap-1.5 text-[#F35C27] font-semibold hover:underline">
                <User className="w-3.5 h-3.5" /> Customer Account
              </Link>
              <Link href="/organization/dashboard" className="flex items-center gap-1.5 text-[#305CDE] font-semibold hover:underline">
                <Building2 className="w-3.5 h-3.5" /> Organization Workspace
              </Link>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 bg-white border border-[#E5E5E5] p-6 md:p-8 shadow-sm">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
