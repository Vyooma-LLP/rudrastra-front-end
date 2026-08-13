# SUPABASE MVP — FORENSIC IMPLEMENTATION INVENTORY

## THE "BALCONY VERDICT"
**STATUS: YELLOW / RED MIX**

The current implementation is a standard, lightweight Next.js CRUD application that uses Supabase Auth and Drizzle ORM to manage basic user and cart state. **It does not implement the frozen architecture (CQRS, RLS, Ledgers, CQRS commands)**. 

While the UI is extensive and visually matches the requested aesthetic, **the vast majority of the "features" are purely mock data hardcoded in the frontend**.

---

## 1. INFRASTRUCTURE & SECURITY BASELINE

### Database Schema (Factual)
Only **4 tables** exist in the Postgres database (`src/db/schema.ts`):
1. `users`
2. `sellers`
3. `products`
4. `cart_items`

*(Note: Essential tables like `product_variants`, `seller_offers`, `orders`, `inventory_items`, and `ledger_transactions` do not exist).*

### Security & Row Level Security (RLS)
- **RLS BYPASS:** The backend strictly uses Drizzle initialized with the `DATABASE_URL` (superuser connection string) in `src/db/index.ts`. Because it uses the service/postgres role, **all database queries bypass RLS completely**.
- **Tenancy Enforcement:** Security is enforced via application logic. The API routes extract the user from `supabase.auth.getUser()` and manually append `.where(eq(table.userId, userId))` (e.g., in `src/app/api/cart/route.ts`).
- **Verdict:** While functional for a basic prototype, this completely violates the architectural mandate: *“PostgreSQL is the Source of Truth... Every Tenant Boundary is Enforced by Authorization + Database Policy.”*

---

## 2. FEATURE INVENTORY (REAL vs MOCK)

| Feature Area | Status | Evidence / Factual Reality |
| :--- | :--- | :--- |
| **Authentication** | **REAL (Partial)** | Uses Supabase Auth (`/api/auth/signup`, `login`, `logout`) via `SupabaseAuthAdapter.ts`. Successfully creates records in the `users` and `sellers` tables using Drizzle. |
| **Cart** | **REAL (Partial)** | `SupabaseCartAdapter.ts` hits `/api/cart`. Items are stored persistently in the `cart_items` table. <br><br>🚨 *Vulnerability:* The cart's total and GST are calculated purely on the frontend inside the adapter. |
| **Catalog (PIM)** | **MOCK** | The UI renders products on the homepage and PDPs, but the data is hardcoded in the React components (e.g., `src/app/(storefront)/page.tsx` and `src/app/(storefront)/products/[id]/page.tsx`). No API fetches products. |
| **Checkout & Payments** | **MOCK** | `MockCheckoutAdapter.ts` handles checkout by simulating a 600ms delay and returning a fake `orderId`. No `orders` table exists. |
| **Manufacturers & Sellers** | **MOCK** | `MockManufacturerAdapter.ts` and `MockSellerInventoryAdapter.ts`. Seller offers are hardcoded arrays in the UI components. |
| **B2B Procurement (BOM/RFQ)** | **MOCK** | `MockBomAdapter.ts` and `MockRfqAdapter.ts`. Purely frontend visual demonstrations. |
| **Compatibility Graph** | **MOCK** | `MockCompatibilityAdapter.ts`. The UI displays a hardcoded tree of compatible components. |

---

## 3. NOTABLE DEVIATIONS FROM THE MANDATE

1. **"Product ≠ Variant ≠ Seller Offer ≠ Seller SKU"**
   - **Failed:** The schema models a monolithic `products` table that directly includes `price` and `stockQty` tied to a `sellerId`. This combines the canonical catalog with seller offers, violating the core B2B model.
   
2. **"Financial Integrity & Ledger"**
   - **Failed:** Checkout is mocked, and financial calculations (Subtotal, GST) exist in frontend TypeScript (`calculateSummary` in `SupabaseCartAdapter.ts`), making them trivially manipulatable.

3. **"State Transition CQRS"**
   - **Failed:** The architecture is a direct Next.js API Routes pattern (`GET`, `POST`) operating directly on Drizzle tables. There are no explicit Command or Query objects enforcing state machines on the backend.

---

## 4. CONCLUSION

The current state is a **Frontend UI Mockup with Basic Auth/Cart attached**. It successfully validates the visual aesthetic and the interaction design, but it contains **0% of the foundational B2B engineering capabilities** (relational catalog, ledger, multi-tenant RLS, inventory reservations).

If the goal is an MVP, this functions as a clickable demo. If the goal is a robust platform, the backend must be rebuilt to adhere to the architecture constraints.
