import type { FeatureKey } from "./keys";
export type { FeatureKey };

export type CapabilityType = 
  | 'PRODUCT' 
  | 'ENGINEERING' 
  | 'PROCUREMENT' 
  | 'COMMERCE' 
  | 'FINANCE' 
  | 'OPERATIONS' 
  | 'PLATFORM'
  | 'SELLER';

export type CapabilityLifecycle = 
  | 'PLANNED' 
  | 'DEVELOPMENT' 
  | 'BETA' 
  | 'ACTIVE' 
  | 'DEPRECATED' 
  | 'REMOVED';

export interface CapabilityDefinition {
  /** The unique, strictly typed identifier for the capability */
  key: FeatureKey;
  
  /** Human readable name */
  name: string;
  
  /** Explanation of what this capability allows the system to do */
  description?: string;
  
  /** The domain boundary this capability belongs to */
  type: CapabilityType;
  
  /** The technical lifecycle stage of the capability */
  lifecycle: CapabilityLifecycle;
  
  /** The exact keys of capabilities that MUST be active for this to function */
  dependencies?: FeatureKey[];
  
  domain?: string;
  riskClass?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  defaultEntitlement?: 'ENABLED' | 'DISABLED';
}

export type AuthContext = {
  /** The ID of the user attempting the action */
  userId: string;
  
  /** The organization context the user is acting under */
  organizationId: string;
  
  /** The RBAC roles assigned to the user in this organization context */
  roles: string[];
  
  /** The granular permissions the user holds in this context */
  permissions: string[];
  
  /** Unique session tracking ID */
  sessionId: string;
  
  /** The current request execution ID */
  requestId: string;
  
  /** The entry point of the command */
  channel: 'web' | 'api' | 'worker' | 'webhook' | 'cli';
  
  /** What type of actor is executing this */
  actorType: 'user' | 'service' | 'system' | 'superadmin';
};

export type AuthorizationDecision = {
  /** True if the operation is explicitly allowed */
  allowed: boolean;
  
  /** The capability that was evaluated */
  capability: FeatureKey;
  
  /** The structured reason code for the decision */
  reason:
    | 'ALLOWED'
    | 'NOT_FOUND'
    | 'UNAVAILABLE'
    | 'NOT_ENTITLED'
    | 'DEPENDENCY_DISABLED'
    | 'PERMISSION_DENIED'
    | 'ROLLOUT_EXCLUDED';
    
  /** Additional diagnostic metadata (never returned directly to the client) */
  metadata?: Record<string, unknown>;
};
