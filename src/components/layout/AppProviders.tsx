"use client";

import { ReactNode, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { CartProvider } from '../commerce/CartContext';
import { CapabilitiesProvider } from './CapabilitiesContext';

/**
 * Inner wrapper: reads auth session, then passes userId to CartProvider
 * and devEmail to CapabilitiesProvider so they can defer/skip expensive fetches.
 */
function InnerProviders({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  return (
    <CapabilitiesProvider devEmail={session?.userId ? undefined : undefined}>
      <CartProvider userId={session?.userId ?? null}>
        {children}
      </CartProvider>
    </CapabilitiesProvider>
  );
}

/**
 * AppProviders: wraps AuthProvider first, then chains Cart + Capabilities
 * so that Cart only fetches when a real session exists.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleError = (event: ErrorEvent) => {
      const filename = event.filename || '';
      if (
        filename.includes('chrome-extension://') || 
        filename.includes('safari-extension://') || 
        filename.includes('moz-extension://')
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (reason) {
        const stack = reason.stack || String(reason);
        const message = reason.message || '';
        if (
          stack.includes('chrome-extension://') || 
          stack.includes('safari-extension://') || 
          stack.includes('moz-extension://') ||
          stack.includes('MetaMask') ||
          message.includes('MetaMask')
        ) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    };

    window.addEventListener('error', handleError, true);
    window.addEventListener('unhandledrejection', handleRejection, true);

    return () => {
      window.removeEventListener('error', handleError, true);
      window.removeEventListener('unhandledrejection', handleRejection, true);
    };
  }, []);

  return (
    <AuthProvider>
      <InnerProviders>
        {children}
      </InnerProviders>
    </AuthProvider>
  );
}
