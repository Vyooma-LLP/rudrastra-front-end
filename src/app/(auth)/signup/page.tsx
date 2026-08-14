"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { UserPlus, Mail, Lock, Building2, ShieldCheck, ArrowRight, Store, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  
  const [role, setRole] = useState<"CUSTOMER" | "SELLER">("CUSTOMER");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [gstin, setGstin] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    // 1. Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address (e.g., name@gmail.com or name@company.com).");
      setIsSubmitting(false);
      return;
    }

    // 2. Validate Password
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsSubmitting(false);
      return;
    }

    // 3. Validate Names
    if (fullName.trim().length < 2) {
      setError("Please enter your full name.");
      setIsSubmitting(false);
      return;
    }
    
    if (companyName.trim().length < 2) {
      setError("Please enter your company or entity name.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          fullName,
          role,
          companyName,
          gstin: gstin || undefined,
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Signup failed");
      }

      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#111111] font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-xl bg-white border border-[#E5E5E5] p-8 shadow-sm space-y-6">
          
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 bg-[#F35C27]/10 border border-[#F35C27]/30 text-[#F35C27] rounded-full flex items-center justify-center mx-auto">
              <UserPlus className="w-6 h-6" />
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-[#111111]">Create Rudraastra Account</h1>
            <p className="text-xs text-[#777777]">Join India&apos;s canonical B2B Marketplace & Engineering Discovery Engine.</p>
          </div>

          {/* Account Type Selection */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div 
              onClick={() => setRole("CUSTOMER")}
              className={`border-2 p-3 rounded cursor-pointer space-y-1 ${role === "CUSTOMER" ? "border-[#111111] bg-[#F5F5F5]" : "border-[#E5E5E5] bg-white hover:border-[#111111]"}`}>
              <div className="flex items-center gap-2 font-bold text-[#111111]">
                <Building2 className="w-4 h-4 text-[#F35C27]" /> Customer / Buyer
              </div>
              <div className="text-[10px] text-[#777777]">Drone manufacturers, defense labs, engineering teams</div>
            </div>
            <div 
              onClick={() => setRole("SELLER")}
              className={`border-2 p-3 rounded cursor-pointer space-y-1 ${role === "SELLER" ? "border-[#138808] bg-[#F5F5F5]" : "border-[#E5E5E5] bg-white hover:border-[#138808]"}`}>
              <div className="flex items-center gap-2 font-bold text-[#111111]">
                <Store className="w-4 h-4 text-[#138808]" /> Seller Merchant
              </div>
              <div className="text-[10px] text-[#777777]">Component OEM manufacturers & verified distributors</div>
            </div>
          </div>

          {/* Registration Form */}
          <form className="space-y-4 text-xs" onSubmit={handleSignup}>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 flex items-start gap-2 rounded">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[#777777] font-semibold mb-1 block">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="Praneeth Kumar" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded p-2.5 text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="text-[#777777] font-semibold mb-1 block">Company / Entity Name</label>
                <input 
                  type="text" 
                  name="companyName"
                  placeholder="Vyooma Technologies Pvt Ltd" 
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded p-2.5 text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[#777777] font-semibold mb-1 block">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#777777] absolute left-3 top-3" />
                  <input 
                    type="email" 
                    name="email"
                    placeholder="engineer@company.com" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded p-2.5 pl-9 text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[#777777] font-semibold mb-1 block">GSTIN (Optional for Individuals)</label>
                <input 
                  type="text" 
                  name="gstin"
                  placeholder="36AAACV9981K1Z9" 
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded p-2.5 text-[#111111] font-mono focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div>
              <label className="text-[#777777] font-semibold mb-1 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#777777] absolute left-3 top-3" />
                <input 
                  type="password" 
                  name="password"
                  placeholder="Minimum 8 characters with numbers & symbols" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded p-2.5 pl-9 text-[#111111] font-mono focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-[#777777]">
              <input type="checkbox" id="terms" required defaultChecked className="mt-0.5 rounded border-[#E5E5E5]" />
              <label htmlFor="terms">
                I agree to the <Link href="/terms" className="text-[#111111] underline">Terms of Service</Link>, <Link href="/privacy" className="text-[#111111] underline">Privacy Policy</Link>, and B2B Technical Verification Guidelines.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3 bg-[#111111] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors uppercase tracking-wider mt-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="border-t border-[#E5E5E5] pt-4 text-center text-xs space-y-1">
            <span className="text-[#777777]">Already have an account? </span>
            <Link href="/login" className="text-[#F35C27] font-bold hover:underline">Sign In here</Link>
          </div>

          <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-3 text-[11px] text-[#777777] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#138808] shrink-0" />
            <span>Instant Role Provisioning via Supabase Auth & RLS Policy Enforcement</span>
          </div>

        </div>
      </main>

      <Footer hideValueProp />
    </div>
  );
}
