# SECURITY_FINDINGS

## OVERVIEW
This report details the authorization, IDOR, and data integrity boundaries of the MVP.

## FINDINGS

### P0 - UNAUTHENTICATED ADMIN PAGE LEAK (FALSE GREEN)
- **Path**: `/ops/reconciliation`
- **Expected**: Unauthenticated users should be redirected to `/signup` or return 401/403.
- **Actual**: API returned 200 OK because the `ops/layout.tsx` redirects to `/signup`, which returns a 200 OK with the signup form.
- **Verdict**: PASS. The backend correctly protects the page via the layout file, throwing a redirect. The previous false alarm was an artifact of HTTP redirect following. The security boundary holds.

### P1 - INTERNAL ERROR EXPOSURE ON INVALID PRODUCT ID
- **Path**: `GET /api/products/[id]` (e.g. `/api/products/unknown-id`)
- **Expected**: Return 400 Bad Request or 404 Not Found for malformed UUIDs.
- **Actual**: Returns 500 Internal Server Error with the raw SQL query exposed in the error message: `{"error":"INTERNAL_ERROR","message":"Failed query: select \"id\", \"seller_id\"..."}`.
- **Verdict**: FAIL. Exposes internal database schema and raw queries to any user.

### P0 - ARCHITECTURE CONFORMANCE FAILURE
- **Path**: Database Schema (`src/db/schema.ts`)
- **Expected**: `catalog_products -> product_variants -> seller_offers -> seller_skus -> inventory_items`
- **Actual**: Simplified `products` table with no multi-tenant PIM/seller capability.
- **Verdict**: FAIL. The implementation directly contradicts the frozen MVP architecture document.

### IDOR BOUNDARIES (API)
- `GET /api/cart`: 401 Unauthorized (PASS)
- `POST /api/cart`: 401 Unauthorized (PASS)
- `GET /api/quotes`: 401 Unauthorized (PASS)
- `GET /api/admin/quotes`: 401 Unauthorized (PASS)
