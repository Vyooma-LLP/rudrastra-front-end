"use client";

import React, { useEffect, useState } from 'react';
import { useCapabilitiesContext } from './CapabilitiesContext';

interface CapabilityGuardProps {
  featureKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  hideCompletely?: boolean;
}

/**
 * Visual guard component. 
 * Re-purposed for the MVP to keep future features visually present but 
 * block interaction.
 */
export function CapabilityGuard({ featureKey, children, fallback, hideCompletely }: CapabilityGuardProps) {
  const { capabilitiesState, isLoading } = useCapabilitiesContext();
  
  // By default during loading, assume it's disabled to prevent flicker of sensitive UI.
  // Except if you want it visually present anyway, it's fine.
  const isEnabled = capabilitiesState[featureKey] === 'ACTIVE';

  if (isLoading && hideCompletely) return null; // Or skeleton

  if (hideCompletely && !isEnabled) return null;
  if (fallback && !isEnabled) return <>{fallback}</>;

  if (!isEnabled) {
    return (
      <div 
          style={{ display: "contents" }} 
          onClickCapture={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Standard UX feedback for blocked MVP features
              alert("Feature disabled: Coming Soon in future architecture phase.");
          }}
      >
        <div style={{ opacity: 0.7, pointerEvents: "none", display: "contents" }}>
            {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
