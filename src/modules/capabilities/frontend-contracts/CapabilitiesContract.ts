import { Command, Query } from '../../../contracts/base';

export type CapabilityState = 'ACTIVE' | 'EMERGENCY_KILLED' | 'DISABLED';
export type CapabilitiesMap = Record<string, CapabilityState>;

export type GetCapabilitiesQuery = Query<void, CapabilitiesMap>;

export interface ToggleCapabilityInput {
  featureKey: string;
}

export type ToggleCapabilityCommand = Command<ToggleCapabilityInput, CapabilitiesMap>;
