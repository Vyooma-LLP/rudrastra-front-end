# MVP_SCOPE_VIOLATIONS

## OVERVIEW
Identifies implemented features that should be "Coming Soon" and required MVP features that are missing.

## FINDINGS

### MISSING MVP ARCHITECTURE (P0)
- The core PIM architecture (`catalog_products` vs `products`) is fundamentally broken and does not exist. The application uses a hardcoded, flattened `products` table.

### DEFERRED FEATURES
- Ops layout contains `CapabilityGuard` for features like RMA, Fulfillment, Ledger, etc. These correctly wrap links to prevent access, assuming the feature flags default to false.
