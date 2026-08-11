import { FeatureKey } from '../registry/keys';
import { CAPABILITIES } from '../registry/capabilities';
import { AvailabilityEvaluator } from './availability';
import { EntitlementEvaluator } from './entitlement';

// Note: DB imports would go here for fetching dynamic states
// import { db } from '@/lib/db'; 

export interface EvaluationContext {
  featureKey: FeatureKey;
  environment: 'development' | 'staging' | 'production';
  organizationId: string;
  userId?: string;
  rbacAction?: string;
}

export interface EvaluationResult {
  allowed: boolean;
  reason: string;
  phase: 'HARD_BLOCK' | 'ACCESS_REQUIREMENT' | 'GRANTED';
  details?: unknown;
}

/**
 * The core Precedence Evaluator implementing the Frozen v4.0 Architecture.
 * Enforces the strict sequence of HARD BLOCKS vs ACCESS REQUIREMENTS.
 */
export class PrecedenceEvaluator {
  
  /**
   * Evaluates capability access strictly applying the frozen precedence rules.
   */
  public static async evaluate(ctx: EvaluationContext): Promise<EvaluationResult> {
    
    // ---------------------------------------------------------------------------
    // PHASE 1: HARD BLOCKS (Any failure = Explicit DENY)
    // ---------------------------------------------------------------------------
    
    // 1. Capability Exists
    const capability = CAPABILITIES.find(c => c.key === ctx.featureKey);
    if (!capability) {
      return { allowed: false, phase: 'HARD_BLOCK', reason: 'CAPABILITY_DOES_NOT_EXIST' };
    }
    
    // 2. Emergency Kill (Global, Env, Org)
    const isKilled = await this.checkEmergencyKills(ctx);
    if (isKilled) {
      return { allowed: false, phase: 'HARD_BLOCK', reason: 'EMERGENCY_KILL_ACTIVE' };
    }
    
    // 3. Platform Safe Mode (Blocks critical mutations)
    if (capability.riskClass === 'CRITICAL' || capability.riskClass === 'HIGH') {
      const safeModeActive = await this.checkSafeMode(ctx.environment);
      if (safeModeActive) {
        return { allowed: false, phase: 'HARD_BLOCK', reason: 'PLATFORM_SAFE_MODE_ACTIVE' };
      }
    }
    
    // 4. Platform Availability (Global kill switch & Environment Lifecycle)
    const availability = await AvailabilityEvaluator.evaluate(ctx.featureKey, ctx.organizationId, ctx.environment);
    // Note: AvailabilityEvaluator currently returns rollout too, but we should split it.
    // For this architecture, we treat 'UNAVAILABLE' as a hard block. 
    if (!availability.available && availability.reason === 'UNAVAILABLE') {
      return { allowed: false, phase: 'HARD_BLOCK', reason: 'PLATFORM_UNAVAILABLE' };
    }
    
    // 5. Dependency Failure
    const depsSatisfied = await this.checkDependencies(capability.dependencies, ctx);
    if (!depsSatisfied) {
      return { allowed: false, phase: 'HARD_BLOCK', reason: 'DEPENDENCY_FAILURE' };
    }
    
    // 6. Organization Explicit DENY
    const orgOverride = await this.getOrganizationOverride(ctx.organizationId, ctx.featureKey);
    if (orgOverride === 'DENY') {
      return { allowed: false, phase: 'HARD_BLOCK', reason: 'ORGANIZATION_EXPLICIT_DENY' };
    }
    
    // ---------------------------------------------------------------------------
    // PHASE 2: ACCESS REQUIREMENTS (Must satisfy all to proceed)
    // ---------------------------------------------------------------------------
    
    // 7. Commercial Entitlement (or Org Explicit GRANT)
    let hasCommercialAccess = false;
    if (orgOverride === 'GRANT') {
      hasCommercialAccess = true;
    } else {
      const entitlement = await EntitlementEvaluator.evaluate(ctx.featureKey, ctx.organizationId);
      hasCommercialAccess = entitlement.entitled;
    }
    
    if (!hasCommercialAccess) {
      return { allowed: false, phase: 'ACCESS_REQUIREMENT', reason: 'LACKS_COMMERCIAL_ENTITLEMENT' };
    }
    
    // 8. Rollout Percentage
    if (availability.reason === 'ROLLOUT_EXCLUDED') {
      return { allowed: false, phase: 'ACCESS_REQUIREMENT', reason: 'ROLLOUT_EXCLUDED' };
    }
    
    // 9. RBAC Permission (if requested)
    if (ctx.userId && ctx.rbacAction) {
      const hasRbac = await this.checkRBAC(ctx.userId, ctx.organizationId, ctx.rbacAction);
      if (!hasRbac) {
        return { allowed: false, phase: 'ACCESS_REQUIREMENT', reason: 'LACKS_RBAC_PERMISSION' };
      }
    }
    
    return { allowed: true, phase: 'GRANTED', reason: 'ALL_CHECKS_PASSED' };
  }
  
  // --- Stub implementations for the scaffold ---
  
  private static async checkEmergencyKills(ctx: EvaluationContext): Promise<boolean> {
    // In production: SELECT FROM capability_emergency_kills WHERE status = 'ACTIVE' 
    // AND expiresAt > NOW() AND (scope match)
    return false;
  }
  
  private static async checkSafeMode(environment: string): Promise<boolean> {
    // In production: SELECT active FROM platform_safe_mode WHERE environment = env
    return false;
  }
  
  private static async checkDependencies(dependencies: readonly FeatureKey[] | undefined, ctx: EvaluationContext): Promise<boolean> {
    if (!dependencies || dependencies.length === 0) return true;
    
    for (const dep of dependencies) {
      // Recursive evaluation for dependencies
      const depResult = await this.evaluate({ ...ctx, featureKey: dep });
      if (!depResult.allowed) {
        return false;
      }
    }
    return true;
  }
  
  private static async getOrganizationOverride(orgId: string, featureKey: string): Promise<'GRANT' | 'DENY' | null> {
    // In production: SELECT override_type FROM organization_capability_overrides WHERE org = orgId AND feature = featureKey
    return null;
  }
  
  private static async checkRBAC(userId: string, orgId: string, action: string): Promise<boolean> {
    // Placeholder for RBAC logic
    return true;
  }
}
