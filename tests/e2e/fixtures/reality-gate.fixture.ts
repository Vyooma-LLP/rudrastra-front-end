export type RealityGateRuntime = {
  runId: string;
  admin: { userId: string; email: string; };
  seller: { userId: string; sellerId: string; email: string; storeName: string; };
  customer: { userId: string; email: string; };
  manufacturer?: { id: string; name: string; };
  product?: { id: string; mpn: string; title: string; };
  variant?: { id: string; };
  offer?: { id: string; };
  sku?: { id: string; code: string; };
  quote?: { id: string; };
};
