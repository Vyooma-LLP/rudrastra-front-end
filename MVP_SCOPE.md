# MVP SCOPE

## INCLUDED (The Minimal E-Commerce Core)

These are the only features that will be fully implemented and backed by real database functionality.

1. **Authentication**
   - User signup, login, logout, and session persistence via Supabase Auth.
2. **Users**
   - Basic user profiles and roles (USER vs ADMIN).
3. **Products**
   - Real, database-backed product catalog (`products` table).
   - Product listing, search, and detail views.
   - Admin-managed active/inactive status and stock quantities.
4. **Cart**
   - Add, update, and remove items securely via the backend.
   - Server-side verification of product validity, stock availability, and ownership.
5. **Checkout & Orders**
   - Server-authoritative checkout calculation (Subtotal, GST, Total).
   - Real order creation (`orders` and `order_items` tables).
   - Snapshotting of product price, name, and SKU at the time of purchase.
6. **Order History**
   - Users can view their own past orders and current statuses.
7. **Basic Admin**
   - Minimal capability to manage products (CRUD) and view/update order statuses.
8. **Basic Inventory & Security**
   - Stock decrements on purchase to prevent overselling.
   - Server-side validation of all user input (preventing malicious quantities, IDOR, and price tampering).

---

## DEFERRED (Out of Scope for MVP)

These features were previously architected but are strictly excluded from this phase to guarantee a rapid, secure launch.

- B2B Procurement Workflows (BOM Upload, RFQ logic)
- Engineering Compatibility Graph
- Advanced Manufacturer & PIM Intelligence (Complex taxonomies)
- Ledger Architecture (Double-entry accounting for payments)
- Event-Driven CQRS (Outbox, message buses, background jobs)
- Microservices & AWS Infrastructure (ECS, SQS, RDS, Redis, Kafka)
- Elaborate Seller Orchestration (Multi-tenant vendor payouts, complex seller dashboards)
- Automated Malware Scanning & CAD Pipelines
- Advanced Role-Based Access Control (Entitlement Engines)
