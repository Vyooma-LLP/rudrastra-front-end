"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CapabilitiesMap } from '../../modules/capabilities/frontend-contracts/CapabilitiesContract';
import { SupabaseToggleCapabilityAdapter } from '../../modules/capabilities/frontend-contracts/SupabaseCapabilitiesAdapter';
import { CommandContext } from '../../contracts/base';
import { generateUUID } from '../../utils/uuid';

const toggleCapabilityCommand = new SupabaseToggleCapabilityAdapter();

/**
 * MVP-hardcoded capability defaults.
 * These are served instantly on mount — no DB fetch for anonymous/regular users.
 * Only the dev user triggers a live fetch to see feature flag overrides.
 */
const MVP_CAPABILITY_DEFAULTS: CapabilitiesMap = {
  'auth.login': 'ACTIVE',
  'auth.signup': 'ACTIVE',
  'auth.session': 'ACTIVE',
  'catalog.products': 'ACTIVE',
  'catalog.categories': 'ACTIVE',
  'catalog.search': 'ACTIVE',
  'catalog.specifications': 'ACTIVE',
  'commerce.cart': 'ACTIVE',
  'commerce.checkout': 'ACTIVE',
  'commerce.orders': 'ACTIVE',
  'ops.control_center': 'ACTIVE',
  'ops.catalog': 'ACTIVE',
  'seller.offers': 'ACTIVE',
  'seller.inventory': 'ACTIVE',
  'seller.catalog': 'ACTIVE',
  'seller.payouts': 'ACTIVE',
  'seller.orders': 'ACTIVE',
  'seller.analytics': 'ACTIVE',
  'seller.returns': 'ACTIVE',
  'seller.dashboard': 'ACTIVE',
  // Non-MVP tools — disabled by default, no DB needed
  'engineering.compatibility': 'DISABLED',
  'engineering.bom': 'DISABLED',
  'engineering.configurator': 'DISABLED',
  'engineering.cad': 'DISABLED',
  'seller.portal': 'DISABLED',
  'organization.dashboard': 'DISABLED',
  'finance.ledger': 'DISABLED',
  'procurement.rfq': 'DISABLED',
};

const DEV_EMAIL = 'neethk2003@gmail.com';

interface CapabilitiesContextValue {
  capabilitiesState: CapabilitiesMap;
  isLoading: boolean;
  toggleCapability: (featureKey: string) => Promise<void>;
}

const CapabilitiesContext = createContext<CapabilitiesContextValue | undefined>(undefined);

export function CapabilitiesProvider({ children, devEmail }: { children: ReactNode; devEmail?: string }) {
  // Start with MVP defaults immediately — no loading flash
  const [capabilitiesState, setCapabilitiesState] = useState<CapabilitiesMap>(MVP_CAPABILITY_DEFAULTS);
  const [isLoading, setIsLoading] = useState(false); // NOT true — we have defaults already

  // Only fetch from DB if this is the dev user (to see flag overrides)
  useEffect(() => {
    if (!devEmail || devEmail !== DEV_EMAIL) return; // Regular users skip the DB fetch
    setIsLoading(true);
    fetch('/api/capabilities')
      .then(res => res.ok ? res.json() : MVP_CAPABILITY_DEFAULTS)
      .then(data => setCapabilitiesState(data))
      .catch(() => {/* Already have defaults, no-op */})
      .finally(() => setIsLoading(false));
  }, [devEmail]);

  const toggleCapability = async (featureKey: string) => {
    const ctx: CommandContext = { metadata: { requestId: generateUUID(), commandId: generateUUID(), idempotencyKey: generateUUID() }, channel: 'web' };
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
