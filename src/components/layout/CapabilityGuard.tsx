"use client";

import React, { useEffect, useState } from 'react';
import { toast } from "@/components/ui/Toast";
import { useCapabilitiesContext } from './CapabilitiesContext';

interface CapabilityGuardProps {
  featureKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  hideCompletely?: boolean;
  inline?: boolean;
}

/**
 * Visual guard component. 
 * Re-purposed for the MVP to keep future features visually present but 
 * block interaction.
 */
export function CapabilityGuard({ featureKey, children, fallback, hideCompletely, inline = false }: CapabilityGuardProps) {
  const { capabilitiesState, isLoading } = useCapabilitiesContext();
  
  // By default during loading, assume it's disabled to prevent flicker of sensitive UI.
  const isEnabled = capabilitiesState[featureKey] === 'ACTIVE';

  if (isLoading && hideCompletely) return null;

  if (hideCompletely && !isEnabled) return null;
  if (fallback && !isEnabled) return <>{fallback}</>;

  if (!isEnabled) {
    return (
      <div 
          className={`relative ${inline ? 'inline-block' : 'block w-full'}`}
          title="Coming Soon"
          onClickCapture={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast("Coming Soon");
          }}
      >
        <div className="opacity-50 pointer-events-none cursor-not-allowed">
            {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
