"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CapabilitiesMap } from '../../modules/capabilities/frontend-contracts/CapabilitiesContract';
import { SupabaseGetCapabilitiesAdapter, SupabaseToggleCapabilityAdapter } from '../../modules/capabilities/frontend-contracts/SupabaseCapabilitiesAdapter';
import { CommandContext } from '../../contracts/base';

const getCapabilitiesQuery = new SupabaseGetCapabilitiesAdapter();
const toggleCapabilityCommand = new SupabaseToggleCapabilityAdapter();

interface CapabilitiesContextValue {
  capabilitiesState: CapabilitiesMap;
  isLoading: boolean;
  toggleCapability: (featureKey: string) => Promise<void>;
}

const CapabilitiesContext = createContext<CapabilitiesContextValue | undefined>(undefined);

export function CapabilitiesProvider({ children }: { children: ReactNode }) {
  const [capabilitiesState, setCapabilitiesState] = useState<CapabilitiesMap>({});
  const [isLoading, setIsLoading] = useState(true);

  const refreshCapabilities = async () => {
    setIsLoading(true);
    try {
      const data = await getCapabilitiesQuery.execute();
      setCapabilitiesState(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCapabilities();
  }, []);

  const toggleCapability = async (featureKey: string) => {
    const ctx: CommandContext = { metadata: { requestId: crypto.randomUUID(), commandId: crypto.randomUUID(), idempotencyKey: crypto.randomUUID() }, channel: 'web' };
    const res = await toggleCapabilityCommand.execute({ featureKey }, ctx);
    if (res.status === 'SUCCESS' && res.data) {
      setCapabilitiesState(res.data);
    } else {
      throw new Error(res.error?.message || 'Failed to toggle capability');
    }
  };

  return (
    <CapabilitiesContext.Provider value={{ capabilitiesState, isLoading, toggleCapability }}>
      {children}
    </CapabilitiesContext.Provider>
  );
}

export function useCapabilitiesContext() {
  const context = useContext(CapabilitiesContext);
  if (context === undefined) {
    throw new Error('useCapabilitiesContext must be used within a CapabilitiesProvider');
  }
  return context;
}
