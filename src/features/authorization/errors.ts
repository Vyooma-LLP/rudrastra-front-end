import type { FeatureKey, AuthorizationDecision } from '../registry/types';

export class CapabilityAuthorizationError extends Error {
  public readonly capability: FeatureKey;
  public readonly reason: AuthorizationDecision['reason'];
  public readonly statusCode: number = 403;

  constructor(decision: AuthorizationDecision, message?: string) {
    const defaultMessage = `Capability Authorization Failed: ${decision.reason} for capability '${decision.capability}'`;
    super(message || defaultMessage);
    
    this.name = 'CapabilityAuthorizationError';
    this.capability = decision.capability;
    this.reason = decision.reason;
    
    // Explicitly set prototype to preserve instanceof checks
    Object.setPrototypeOf(this, CapabilityAuthorizationError.prototype);
  }

  /**
   * Serializes the error into a structured JSON response suitable for an API boundary.
   * Internal metadata is intentionally stripped to prevent leaking sensitive diagnostic state.
   */
  public toAPIResponse() {
    return {
      error: {
        code: 'FORBIDDEN',
        message: 'You do not have access to this capability or the capability is currently unavailable.',
        details: {
          reason: this.reason,
          capability: this.capability
        }
      }
    };
  }
}
