"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SessionContext, SessionRole } from '../../modules/auth/frontend-contracts/AuthContract';
import { 
  SupabaseGetSessionContextAdapter,
  SupabaseAuthAdapter,
  SupabaseSwitchRoleAdapter,
  SupabaseSignOutAdapter
} from '../../modules/auth/frontend-contracts/SupabaseAuthAdapter';
import { CommandContext } from '../../contracts/base';
import { generateUUID } from '../../utils/uuid';

// Instantiate the adapters (In a real app, you might use dependency injection here)
const getSessionQuery = new SupabaseGetSessionContextAdapter();
const authCommand = new SupabaseAuthAdapter();
const switchRoleCommand = new SupabaseSwitchRoleAdapter();
const signOutCommand = new SupabaseSignOutAdapter();

interface AuthContextValue {
  session: SessionContext | null;
  isLoading: boolean;
  authenticate: (email: string, password?: string) => Promise<void>;
  switchRole: (role: SessionRole) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    setIsLoading(true);
    try {
      const data = await getSessionQuery.execute();
      setSession(data);
    } catch (e) {
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshSession();
  }, []);

  const authenticate = async (email: string, password?: string) => {
    const ctx: CommandContext = { metadata: { requestId: generateUUID(), commandId: generateUUID(), idempotencyKey: generateUUID() }, channel: 'web' };
    const res = await authCommand.execute({ email, password }, ctx);
    if (res.status === 'SUCCESS' && res.data) {
      setSession(res.data);
    } else {
      throw new Error(res.error?.message || 'Authentication failed');
    }
  };

  const switchRole = async (role: SessionRole) => {
    const ctx: CommandContext = { metadata: { requestId: generateUUID(), commandId: generateUUID(), idempotencyKey: generateUUID() }, channel: 'web' };
    const res = await switchRoleCommand.execute({ role }, ctx);
    if (res.status === 'SUCCESS' && res.data) {
      setSession(res.data);
    } else {
      throw new Error(res.error?.message || 'Role switch failed');
    }
  };

  const signOut = async () => {
    const ctx: CommandContext = { metadata: { requestId: generateUUID(), commandId: generateUUID(), idempotencyKey: generateUUID() }, channel: 'web' };
    await signOutCommand.execute(undefined, ctx);
    setSession(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ session, isLoading, authenticate, switchRole, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
