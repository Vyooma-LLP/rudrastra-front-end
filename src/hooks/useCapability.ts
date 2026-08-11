import { useAuth } from '../components/layout/AuthContext';

// Define the abstract capabilities that the frontend cares about
export interface UserCapabilities {
  canApproveCatalog: boolean;
  canManageInventory: boolean;
  canViewAuditLogs: boolean;
  canPurchaseOnNetTerms: boolean;
  canManageOrganization: boolean;
  canViewSellerDashboard: boolean;
  canRequestRMA: boolean;
}

export function useCapability(): UserCapabilities {
  const { session } = useAuth();
  const role = session?.role || 'logged_out';

  // In a real backend, this would not just check a hardcoded role. 
  // It would evaluate the user's specific permissions or organization capabilities.
  // For the Mock UI, we derive these safely without scattering role checks in the UI components.
  
  return {
    canApproveCatalog: role === 'ops' || role === 'owner',
    canManageInventory: role === 'seller' || role === 'owner',
    canViewAuditLogs: role === 'ops' || role === 'owner',
    canPurchaseOnNetTerms: role === 'customer' || role === 'owner',
    canManageOrganization: role === 'customer' || role === 'owner',
    canViewSellerDashboard: role === 'seller' || role === 'owner',
    canRequestRMA: role === 'customer' || role === 'owner',
  };
}
