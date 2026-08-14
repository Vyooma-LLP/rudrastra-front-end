"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Lock, Mail, ArrowRight, ShieldCheck, Building2, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '@/components/layout/AuthContext';

export default function LoginPage() {
  const { authenticate } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Video loading & transition states
  const [isMounted, setIsMounted] = useState(false);
  const [leftLoaded, setLeftLoaded] = useState(false);
  const [rightLoaded, setRightLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await authenticate(email, password);
      // Trigger premium page transition video overlay (which handles redirect on ended)
      setIsTransitioning(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to authenticate.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#111111] font-sans flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Main Login Viewport Grid */}
      <main className="flex-1 grid grid-cols-12 min-h-[calc(100vh-64px)] overflow-hidden bg-[#F5F5F5]">
        
        {/* LEFT COLUMN: Loop Video (Hidden on Mobile) */}
        <div className="hidden lg:block lg:col-span-4 h-full relative bg-white border-r border-[#E5E5E5] overflow-hidden">
          {isMounted && (
            <video
              src="/videos/login_page_left.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              onLoadedData={() => setLeftLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${leftLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          )}
          {/* Fallback subtle background while loading */}
          <div className={`absolute inset-0 bg-slate-50 transition-opacity duration-500 ${leftLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
          {/* Elegant overlay shadow */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111111]/5" />
        </div>

        {/* MIDDLE COLUMN: Authentic Form Section */}
        <div className="col-span-12 lg:col-span-4 h-full flex items-center justify-center p-6 bg-[#F5F5F5] lg:bg-white overflow-y-auto z-10">
          <div className="w-full max-w-md bg-white border border-[#E5E5E5] lg:border-0 p-8 lg:p-4 shadow-sm lg:shadow-none space-y-6">
            
            {/* Header */}
            <div className="space-y-2 text-center">
              <div className="w-12 h-12 bg-[#111111] text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="font-heading text-2xl font-bold tracking-tight text-[#111111]">Sign In to Rudraastra</h1>
              <p className="text-xs text-[#777777]">Access your engineering orders, B2B procurement, or seller merchant portal.</p>
            </div>

            {/* Login Form */}
            <form className="space-y-4 text-xs" onSubmit={handleLogin}>
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 flex items-start gap-2 rounded">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="text-[#777777] font-semibold mb-1 block">Work / Corporate Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#777777] absolute left-3 top-3" />
                  <input 
                    type="email" 
                    name="email"
                    placeholder="engineer@company.com" 
                    required
                    disabled={isSubmitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded p-2.5 pl-9 text-[#111111] font-medium focus:outline-none focus:border-[#111111] disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[#777777] font-semibold">Password</label>
                  <Link href="/forgot-password" className="text-[11px] text-[#F35C27] hover:underline">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#777777] absolute left-3 top-3" />
                  <input 
                    type="password" 
                    name="password"
                    placeholder="••••••••••••" 
                    required
                    disabled={isSubmitting}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded p-2.5 pl-9 text-[#111111] font-mono focus:outline-none focus:border-[#111111] disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#777777]">
                <input type="checkbox" id="remember" defaultChecked disabled={isSubmitting} className="rounded border-[#E5E5E5]" />
                <label htmlFor="remember">Keep me signed in on this device</label>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3 bg-[#111111] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors uppercase tracking-wider mt-2 disabled:opacity-50 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Social / Corporate SSO Divider */}
            <div className="border-t border-[#E5E5E5] pt-4 text-center text-xs space-y-3">
              <p className="text-[#777777]">Don&apos;t have a Rudraastra Account yet?</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link 
                  href="/signup?role=customer" 
                  className="flex-1 py-2.5 border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Customer / Engineer
                </Link>
                <Link 
                  href="/signup?role=seller" 
                  className="flex-1 py-2.5 border border-[#138808] text-[#138808] hover:bg-[#138808] hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" /> Seller Merchant
                </Link>
              </div>
            </div>

            <div className="bg-[#F5F5F5] border border-[#E5E5E5] p-3 text-[11px] text-[#777777] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#138808] shrink-0" />
              <span>Encrypted Corporate SSO & Role-Based Supabase JWT Auth</span>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Loop Video (Hidden on Mobile) */}
        <div className="hidden lg:block lg:col-span-4 h-full relative bg-[#e5e5e5] border-l border-[#E5E5E5] overflow-hidden">
          {isMounted && (
            <video
              src="/videos/login_page_right.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              onLoadedData={() => setRightLoaded(true)}
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ${rightLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          )}
          {/* Fallback subtle background while loading */}
          <div className={`absolute inset-0 bg-[#e5e5e5] transition-opacity duration-500 ${rightLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
          {/* Elegant overlay shadow */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#111111]/5" />
        </div>

      </main>

      <Footer hideValueProp />

      {/* FULL-SCREEN PREMIUM PAGE TRANSITION OVERLAY */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500">
          <video
            src="/videos/page_transition.mp4"
            autoPlay
            muted
            playsInline
            onCanPlay={(e) => {
              e.currentTarget.playbackRate = 2.0;
            }}
            onEnded={() => {
              window.location.href = "/";
            }}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
