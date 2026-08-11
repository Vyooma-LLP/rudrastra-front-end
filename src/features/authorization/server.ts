import type { FeatureKey, AuthContext, AuthorizationDecision } from '../registry/types';
import { getDependencyClosure } from '../registry/validator';
import { AvailabilityEvaluator } from '../evaluator/availability';
import { EntitlementEvaluator } from '../evaluator/entitlement';
import { CapabilityAuthorizationError } from './errors';

export interface AuthorizeRequest {
  capability: FeatureKey;
  permission?: string;
  context: AuthContext;
}

/**
 * The core authoritative enforcement engine.
 * Must be called at the Application Command boundary before executing domain logic.
 */
export async function authorize(request: AuthorizeRequest): Promise<AuthorizationDecision> {
  const { capability, permission, context } = request;
  
  // 1. Dependency Closure Check (Memory-O(1))
  // Resolves whether this capability (and all its dependencies) are technically valid.
  let closure: Set<FeatureKey>;
  try {
    closure = getDependencyClosure(capability);
  } catch (err) {
    return { allowed: false, capability, reason: 'NOT_FOUND' };
  }

  // 2. Global Availability & Rollout Check
  // In a real system, you'd pull the environment string from process.env
  const currentEnvironment = 'development';
  
  // We must evaluate availability for the target capability AND all its dependencies
  // If a dependency is disabled via kill switch, the target capability is also disabled.
  for (const depKey of [capability, ...closure]) {
    const availability = await AvailabilityEvaluator.evaluate(depKey, context.organizationId, currentEnvironment);
    if (!availability.available) {
      return { 
        allowed: false, 
        capability, 
        reason: depKey === capability ? (availability.reason || 'UNAVAILABLE') : 'DEPENDENCY_DISABLED',
        metadata: { failedDependency: depKey }
      };
    }
  }

  // 3. Commercial Entitlement Check
  // We only need to check entitlement for the top-level capability requested.
  // Dependencies do not necessarily need independent entitlements if the top-level package includes them.
  const entitlement = await EntitlementEvaluator.evaluate(capability, context.organizationId);
  if (!entitlement.entitled) {
    return { allowed: false, capability, reason: 'NOT_ENTITLED' };
  }

  // 4. RBAC Permission Check
  if (permission && !context.permissions.includes(permission)) {
    // If we're superadmin, we bypass RBAC (break glass)
    if (context.actorType !== 'superadmin') {
      return { allowed: false, capability, reason: 'PERMISSION_DENIED' };
    }
  }

  return { allowed: true, capability, reason: 'ALLOWED' };
}

/**
 * A fail-closed convenience wrapper around `authorize()`.
 * Use this in Next.js Server Actions, API routes, or Background Workers.
 * 
 * @throws {CapabilityAuthorizationError} if the request is not allowed.
 */
export async function requireCapability(
  capability: FeatureKey,
  context: AuthContext,
  permission?: string
): Promise<void> {
  const decision = await authorize({ capability, permission, context });
  
  if (!decision.allowed) {
    throw new CapabilityAuthorizationError(decision);
  }
}
