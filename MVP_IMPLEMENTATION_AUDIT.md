# MVP IMPLEMENTATION AUDIT

Based on forensic inspection of the existing Supabase MVP.

| Feature | Current State | Real/Mock | Keep | Modify | Replace | Reason |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Authentication & Users** | Supabase Auth + Drizzle inserting into `users` & `sellers` | REAL | Keep | Modify | | Auth is real, but we need to ensure server-side protection on all routes. Remove the forced `sellers` creation unless needed. |
| **Product Catalog (Schema)** | Basic `products` table in Drizzle with price/stock. | REAL (DB) | Keep | Modify | | DB schema exists but isn't used by the frontend. Need to add missing fields (e.g., `slug`, `isActive`, `category`). |
| **Product Catalog (UI)** | Homepage & PDP use hardcoded arrays in React components. | MOCK (UI) | | | Replace | Must fetch real products from DB. Hardcoded data must be deleted. |
| **Search & Filters** | Fake URL query params; no backend search. | MOCK | | | Replace | Must implement real basic ILIKE/filter query against the database. |
| **Cart (Backend)** | API inserts into `cart_items`, links to `products` table. | REAL | Keep | Modify | | API exists but doesn't validate stock or active status securely. Needs hardening. |
| **Cart (Frontend)** | `SupabaseCartAdapter` calculates Subtotal & GST. | VULNERABLE | | | Replace | Frontend calculates price logic which is a security risk. Move calculation to backend. |
| **Checkout & Order Creation** | `MockCheckoutAdapter` delays 600ms and fakes an order ID. | MOCK | | | Replace | Build real `/api/checkout` flow to create `orders` and `order_items` securely. |
| **Orders Database** | No `orders` or `order_items` tables exist. | NONE | | | Replace | Need to define real schema mirroring checkout data and snapshotting product price. |
| **Order History (UI)** | `MockOrderAdapter` returns fake past orders. | MOCK | | | Replace | Build real fetch from `/api/orders`. |
| **Inventory Management** | `products.stockQty` exists but isn't enforced at checkout. | PARTIAL | Keep | Modify | | Implement stock validation and decrements during the real checkout flow. |
| **Admin Operations** | No admin interfaces or backend APIs exist for CRUD operations. | NONE | | | Replace | Build basic API and UI for an admin to create/edit products and view orders. |
| **Payments** | Not implemented. | NONE | | | Replace | Needs a basic decision (e.g., COD/Pending) for the MVP order status. |
| **Security / RLS** | Drizzle connects using `DATABASE_URL` (superuser) bypassing RLS. | VULNERABLE | Keep | Modify | | Ensure Next.js API strictly enforces user boundaries for all requests since RLS is bypassed. |

## DEFERRED FEATURES (DO NOT IMPLEMENT IN MVP)
- B2B Procurement (BOM, RFQ)
- Compatibility Graph
- Ledger Architecture
- CQRS & Outbox Event Bus
- Microservices, Redis, Kafka, ECS, SQS
- Elaborate Seller Orchestration

*Verdict:* We will retain the existing Supabase configuration, Next.js framework, and Drizzle ORM, but we must strip out all mock adapters and replace them with real database-backed flows for Products, Cart, Checkout, and Orders.
