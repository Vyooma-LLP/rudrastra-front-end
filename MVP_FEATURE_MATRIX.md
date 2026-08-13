# MVP FEATURE MATRIX (ACTUAL IMPLEMENTATION STATUS)

| Area | Feature | Status | Evidence/Notes |
| :--- | :--- | :--- | :--- |
| **Auth** | User Signup | REAL | `SupabaseAuthAdapter`, writes to `users` and `sellers` via Drizzle `/api/auth/signup`. |
| **Auth** | User Login / Logout | REAL | `SupabaseAuthAdapter`, hits `/api/auth/login` and `/api/auth/logout`. |
| **Auth** | Session Persistence | REAL | Uses `createServerClient` and Next.js cookies in `utils/supabase/server.ts`. |
| **Auth** | Role Switching | NOT IMPLEMENTED | `SupabaseSwitchRoleAdapter` throws "unsupported" error. |
| **Catalog** | Category Navigation | MOCK | `src/app/(storefront)/page.tsx` renders hardcoded taxonomy categories. |
| **Catalog** | Component Search | MOCK | Input field redirects to `/products?q=xxx`, but no backend powers it. |
| **Catalog** | Product Listing (PLP) | MOCK | Hardcoded UI product arrays (e.g., `MN4014-400KV` in `page.tsx`). |
| **Catalog** | Product Details (PDP) | MOCK | Hardcoded in `products/[id]/page.tsx` (specs, overview, etc). |
| **Catalog** | Manufacturer Profiles | MOCK | `MockManufacturerAdapter.ts` returns simulated OEM data. |
| **Commerce** | Cart CRUD (Add/Update/Del) | REAL | Validated atomic `cart_items` writes via `/api/cart`. |
| **Commerce** | Cart Total Calculation | REAL | Server-authoritative strict minor-unit integer calculation. |
| **Commerce** | Product Price in Cart | REAL | Enforced strictly from `products` table via `db.select()`. |
| **Commerce** | Checkout (Order Creation) | REAL | Atomic, idempotent checkout via `/api/checkout` with inventory validation. |
| **Commerce** | Ledger Transactions | NOT IMPLEMENTED | No ledger architecture exists. |
| **B2B** | Seller Offers & Inventory | MOCK | `MockSellerInventoryAdapter.ts`. Offers on PDP are hardcoded. |
| **B2B** | BOM Upload & Parsing | MOCK | `MockBomAdapter.ts` fakes CSV parsing. |
| **B2B** | Request for Quote (RFQ) | MOCK | `MockRfqAdapter.ts` simulates RFQ dispatch. |
| **B2B** | Compatibility Graph | MOCK | `MockCompatibilityAdapter.ts`. Rules are hardcoded in frontend. |
| **Seller** | Seller Order Management | MOCK | `MockSellerOrdersAdapter.ts` |
| **Core** | Row Level Security (RLS) | BYPASSED | Drizzle uses `process.env.DATABASE_URL` (superuser role), completely overriding RLS. |
| **Core** | Outbox & Event Driven CQRS | NOT IMPLEMENTED | Directly hits Drizzle; no Outbox/DLQ implemented. |
