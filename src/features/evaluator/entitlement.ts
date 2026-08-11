import type { FeatureKey } from '../registry/keys';

/**
 * Checks commercial entitlement for an organization.
 * Queries PostgreSQL to determine if the organization has an active package
 * granting this capability, and resolves any explicit GRANT/DENY overrides.
 */
export class EntitlementEvaluator {
  
  /**
   * Evaluates if the given organization is commercially entitled to the capability.
   */
  public static async evaluate(
    featureKey: FeatureKey, 
    organizationId: string
  ): Promise<{ entitled: boolean; reason?: 'NOT_ENTITLED' }> {
    
    // In a real system, you query `organization_capability_overrides`, 
    // `organization_entitlements`, and `entitlement_package_capabilities` via Drizzle.
    
    // For this scaffold, we simulate the database logic sequence:
    
    // 1. Fetch organization overrides
    const orgOverride = await this.mockFetchOverride(organizationId, featureKey);
    
    if (orgOverride === 'DENY') {
      return { entitled: false, reason: 'NOT_ENTITLED' };
    }
    
    if (orgOverride === 'GRANT') {
      return { entitled: true };
    }
    
    // 2. Fetch active packages for the organization
    const packageCapabilities = await this.mockFetchPackageCapabilities(organizationId);
    
    if (packageCapabilities.has(featureKey)) {
      return { entitled: true };
    }
    
    // Default fail-closed if no package grants it and no GRANT override exists
    return { entitled: false, reason: 'NOT_ENTITLED' };
  }
  
  private static async mockFetchOverride(orgId: string, featureKey: string): Promise<'GRANT' | 'DENY' | null> {
    return null;
  }
  
  private static async mockFetchPackageCapabilities(orgId: string): Promise<Set<FeatureKey>> {
    // By default, assuming all capabilities are granted in the mock 
    // just to allow the application to boot smoothly during dev.
    // Real implementation will query Drizzle.
    return new Set<FeatureKey>(); 
  }
}
