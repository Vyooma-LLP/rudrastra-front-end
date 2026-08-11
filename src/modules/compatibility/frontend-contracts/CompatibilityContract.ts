import { Command } from '../../../contracts/base';

export interface ComponentSelection {
  motor: string;
  esc: string;
  flightController: string;
  battery: string;
  propeller: string;
}

export interface CompatibilityCheck {
  id: string;
  type: 'success' | 'warning' | 'error';
  title: string;
  description: string;
}

export interface CheckCompatibilityResult {
  isValid: boolean;
  checks: CompatibilityCheck[];
}

export type CheckCompatibilityCommand = Command<ComponentSelection, CheckCompatibilityResult>;
