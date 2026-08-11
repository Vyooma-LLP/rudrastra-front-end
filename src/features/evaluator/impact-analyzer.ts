import { FeatureKey } from '../registry/keys';
import { CAPABILITIES } from '../registry/capabilities';
import type { CapabilityDefinition } from '../registry/types';

export interface ImpactAnalysisResult {
  targetFeature: FeatureKey;
  
  // Dependency blast radius
  directDependents: FeatureKey[];
  transitiveDependents: FeatureKey[];
  
  // Business metrics blast radius (approximated for scaffold)
  affectedOrganizationsCount: number;
  activeUsersAffectedCount: number;
  activeSellersAffectedCount: number;
  activeWorkflowsAffectedCount: number;
  
  // Financial risk assessment
  blocksFinancialTransactions: boolean;
  
  // Reversibility
  reversibility: 'YES' | 'NO';
  
  // Required Approval
  requiresTwoPersonApproval: boolean;
}

/**
 * Calculates the exact business and technical blast radius if a feature were to be disabled.
 */
export class ImpactAnalyzer {
  
  public static async analyze(featureKey: FeatureKey, environment: string): Promise<ImpactAnalysisResult> {
    
    const target = CAPABILITIES.find(c => c.key === featureKey);
    if (!target) {
      throw new Error(`Capability ${featureKey} not found in registry.`);
    }
    
    // 1. Calculate Technical Dependents (What relies on this?)
    const directDependents = this.getDirectDependents(featureKey);
    const transitiveDependents = this.getTransitiveDependents(featureKey, directDependents);
    
    // 2. Determine Financial and Risk impact
    const allAffectedFeatures = [target.key, ...directDependents, ...transitiveDependents];
    const affectedCapabilities = allAffectedFeatures.map(k => CAPABILITIES.find(c => c.key === k)!);
    
    const blocksFinancialTransactions = affectedCapabilities.some(c => 
      c.riskClass === 'CRITICAL' || c.domain === 'finance' || c.domain === 'commerce'
    );
    
    const requiresTwoPersonApproval = affectedCapabilities.some(c => 
      c.riskClass === 'CRITICAL' || c.riskClass === 'HIGH'
    );
    
    // 3. Query Real Business Metrics (Mocked for Scaffold)
    // In production, this would do aggregations:
    // SELECT COUNT(DISTINCT org_id) FROM active_sessions WHERE using_feature = featureKey
    const affectedOrganizationsCount = 42; 
    const activeUsersAffectedCount = 183;
    const activeSellersAffectedCount = 31;
    const activeWorkflowsAffectedCount = 12;

    return {
      targetFeature: featureKey,
      directDependents,
      transitiveDependents,
      affectedOrganizationsCount,
      activeUsersAffectedCount,
      activeSellersAffectedCount,
      activeWorkflowsAffectedCount,
      blocksFinancialTransactions,
      reversibility: 'YES', // Standard configuration rollbacks are always YES
      requiresTwoPersonApproval
    };
  }
  
  private static getDirectDependents(targetKey: FeatureKey): FeatureKey[] {
    return CAPABILITIES
      .filter(c => c.dependencies?.includes(targetKey))
      .map(c => c.key);
  }
  
  private static getTransitiveDependents(targetKey: FeatureKey, direct: FeatureKey[]): FeatureKey[] {
    const visited = new Set<FeatureKey>(direct);
    const queue = [...direct];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      const dependents = this.getDirectDependents(current);
      
      for (const dep of dependents) {
        if (!visited.has(dep)) {
          visited.add(dep);
          queue.push(dep);
        }
      }
    }
    
    return Array.from(visited);
  }
}
