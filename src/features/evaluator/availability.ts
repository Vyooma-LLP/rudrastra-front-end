import crypto from 'crypto';
import type { FeatureKey } from '../registry/keys';
import { CAPABILITIES } from '../registry/capabilities';

/**
 * Checks platform-level availability (Kill Switches and Rollouts).
 * This runs before Entitlement checks.
 * 
 * Note: In production, this would query the DB `capability_availability` table (often cached).
 */
export class AvailabilityEvaluator {
  /**
   * Deterministic hashing for organization-scoped rollout percentage.
   * Ensures an org either gets a feature or doesn't, stably across requests.
   */
  public static isRolloutApplicable(featureKey: FeatureKey, organizationId: string, percentage: number): boolean {
    if (percentage >= 100) return true;
    if (percentage <= 0) return false;

    const hash = crypto.createHash('md5').update(`${featureKey}:${organizationId}`).digest('hex');
    const bucket = parseInt(hash.substring(0, 4), 16) % 100; // 0 to 99
    
    return bucket < percentage;
  }

  /**
   * Evaluates runtime availability against global state and lifecycle.
   */
  public static async evaluate(
    featureKey: FeatureKey, 
    organizationId: string, 
    environment: 'development' | 'staging' | 'production'
  ): Promise<{ available: boolean; reason?: 'UNAVAILABLE' | 'ROLLOUT_EXCLUDED' }> {
    
    // 1. Static Lifecycle Check
    const capability = CAPABILITIES.find(c => c.key === featureKey);
    if (!capability) return { available: false, reason: 'UNAVAILABLE' };

    // In a real system, you'd fetch this from the DB (with caching)
    // For this scaffold, we simulate a fetched DB state
    const dbState = {
      globalStatus: 'ACTIVE',
      killSwitchActive: false,
      rolloutPercentage: 100
    };

    // 2. Global Kill Switch (Absolute, fails closed)
    if (dbState.killSwitchActive) {
      return { available: false, reason: 'UNAVAILABLE' };
    }

    // 3. Lifecycle Guardrails
    if (environment === 'production' && (capability.lifecycle === 'PLANNED' || capability.lifecycle === 'DEVELOPMENT')) {
      return { available: false, reason: 'UNAVAILABLE' };
    }
    if (capability.lifecycle === 'REMOVED' || capability.lifecycle === 'DEPRECATED') {
      return { available: false, reason: 'UNAVAILABLE' };
    }

    // 4. Deterministic Organization Rollout
    if (!this.isRolloutApplicable(featureKey, organizationId, dbState.rolloutPercentage)) {
      return { available: false, reason: 'ROLLOUT_EXCLUDED' };
    }

    return { available: true };
  }
}
