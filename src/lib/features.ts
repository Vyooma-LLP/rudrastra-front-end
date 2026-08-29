// Centralized Feature Registry
// Defines which features are active in the current deployment.
// Any feature marked as 'false' must be hidden from navigation and guarded at the route level.

export const FEATURES = {
  // Ops & Core Admin Features
  opsProductEngine: true,
  opsCategories: true,
  opsManufacturers: true,
  opsSpecs: true,
  opsQuotes: true,
  opsReconciliation: false,
  opsAuditLogs: false,
  opsTickets: false,
  opsDisputes: false,
  opsFulfillment: false,
  opsControlCenter: false,
  opsFinanceLedger: false,
  opsFinanceInvoices: false,
  opsFinancePayouts: false,
  opsFinanceReports: false,
  opsIncidents: false,
  opsRma: false,

  // Seller Features
  sellerDashboard: true,
  sellerCatalog: true,
  sellerOffers: true,
  sellerInventory: true,
  sellerOrders: false,
  sellerReturns: false,
  sellerPayouts: false,
  sellerAnalytics: false,

  // Organization (B2B Procurement) Features
  organizationProjects: false,
  organizationDashboard: false,
  organizationProcurement: false,
  organizationSuppliers: false,
  organizationHistory: false,
  organizationApprovals: false,
  organizationMembers: false,

  // Customer Account Features
  accountProfile: true,
  accountQuotes: true,
  accountOrders: false,
  accountTickets: false,
  accountWarranties: false,
  accountRma: false,

  // Storefront Features
  storefrontCart: true,
  storefrontQuoteRequest: true,
  storefrontCompatibilityEngine: false,
  storefrontCompare: false,
  storefrontBom: false,
  storefrontEngineering: false,
  storefrontArchitectures: false,
  storefrontCalculator: false,
  storefrontSell: true,
  storefrontSupport: false,
};

export type FeatureKey = keyof typeof FEATURES;

export function isFeatureEnabled(key: FeatureKey): boolean {
  return FEATURES[key] === true;
}
