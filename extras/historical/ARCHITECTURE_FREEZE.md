> [!WARNING]
> ARCHIVED / NON-AUTHORITATIVE
>
> This document is retained for historical/reference purposes only.
> Do NOT use this document as the current implementation specification.
>
> Current authoritative documents:
> BACKEND_PRD.md
> BACKEND_TRD.md
> BACKEND_PLAN.md
> BACKEND_INSTRUCTIONS.md
> ARCHITECTURE_DECISIONS.md
> CONTRACT_INVENTORY.md
> CONTRADICTION_REGISTER.md
> BACKEND_HANDOFF.md

# Rudrastra Architecture Freeze Directive (Phase 0 Deliverable)
**Version: v1.0 — FROZEN**  
**Governance Authority: .agents/AGENTS.md & ARCHITECTURE.md**

> **HARDENED MANDATE:** Architecture v1.0 is frozen. Agents and developers must implement the existing contracts; architectural deviations require explicit change control. No new infrastructure, domain abstractions, unapproved npm packages, or architectural patterns may be introduced.

---

## 1. Governance Authority Hierarchy

```text
PRD.md
    Product and operational requirements (WHAT)

docs/operations/failure_control_spec.md
    100 Failure prevention and control requirements (WHAT MUST NOT FAIL)

TRD.md & ARCHITECTURE.md
    System architecture and enforcement mechanisms (HOW IT IS STRUCTURED)

ARCHITECTURE_FREEZE.md
    Binding execution rules, boundary ownership, forbidden patterns (CANONICAL CONSTRAINTS)

.agents/AGENTS.md
    Engineering governance & agent execution rules
```

---

## 2. Core Architectural Commandments & Invariants

1. **`Product ≠ Variant ≠ Seller Offer ≠ Seller SKU ≠ Inventory`**  
   Seller listings must never be combined with canonical catalog product or variant tables.
2. **`PostgreSQL is the Source of Truth; Typesense is Rebuildable`**  
   PostgreSQL (Supabase) handles all relational integrity, ACID transactions, and audit logs. Typesense is strictly a disposable derived search index reconstructible via `/api/admin/search/rebuild`.
3. **`Technical Specifications are Typed PIM Data`**  
   Category-specific spec values link to `product_variants.id` via `product_spec_values`. Unvalidated JSON blobs or ad-hoc columns on product tables are strictly forbidden.
4. **`Inventory and Money Movement are Transactional and Auditable`**  
   Enforce `sellable = on_hand - reserved`. Inventory reservations use atomic row locking (`SELECT FOR UPDATE SKIP LOCKED`) with 10-min TTL. Financial truth uses double-entry ledger entries (`ledger_transactions`, `ledger_entries`) satisfying `Σ debits == Σ credits`.
5. **`Tenant Boundary Enforced by Authorization + Database RLS`**  
   Protected operations require server-side JWT auth + Supabase RLS (`USING` + `WITH CHECK`).
6. **`Explicit CQRS State Machines & Idempotent Webhooks`**  
   Status mutations must follow explicit FSM contracts (`docs/architecture/state_machine_spec.md`). Webhooks use cryptographic verification and `processed_webhooks` deduplication.
7. **`Outbox Delivery At-Least-Once; Idempotent Consumers`**  
   State mutations and outbox events commit in a single DB transaction. Consumers are strictly idempotent.
8. **`Least-Privilege Worker Capability Model`**  
   Workers operate with explicit `WORKER_CAPABILITIES` (`SEARCH_INDEX_WRITE`, `OUTBOX_PROCESS`, `SHIPMENT_SYNC`, `EMAIL_SEND`, `LEDGER_RECONCILIATION`), enforced before any privileged mutation.

---

## 3. Domain Ownership & Table Registry

| Domain Module | Path | Primary Schema Tables | Permitted Cross-Domain Calls |
|:---|:---|:---|:---|
| **Identity** | `src/modules/identity` | `users`, `organizations`, `organization_members`, `projects`, `user_roles` | Read-only by all domains |
| **Catalog** | `src/modules/catalog` | `manufacturers`, `categories`, `catalog_products`, `product_variants`, `spec_definitions`, `product_spec_values`, `product_revisions` | Read-only by search, marketplace, cart |
| **Marketplace** | `src/modules/marketplace` | `seller_accounts`, `seller_offers`, `seller_skus` | References `product_variants` and `organizations` |
| **Inventory** | `src/modules/inventory` | `inventory_locations`, `inventory_items`, `inventory_reservations`, `serial_numbers` | References `seller_skus`. Mutated via Orders command |
| **Cart** | `src/modules/cart` | `carts`, `cart_items` | Reads catalog/offers; initiates inventory reservation |
| **Checkout & Payments** | `src/modules/checkout` | `payment_intents`, `processed_webhooks` | Invokes Orders, Ledger, Razorpay API |
| **Orders** | `src/modules/orders` | `orders`, `seller_orders`, `order_items`, `order_addresses`, `shipments`, `shipment_items` | Mutates inventory, posts to Ledger, emits Outbox |
| **Finance & Ledger** | `src/modules/finance` | `ledger_accounts`, `ledger_transactions`, `ledger_entries`, `seller_payouts` | Read-only query by seller/ops; mutated via Orders/Payments |
| **Procurement** | `src/modules/procurement` | `purchase_requests`, `purchase_request_items`, `quotes`, `quote_items`, `purchase_orders`, `credit_limits` | References `organizations`, `variants`, `seller_offers` |
| **Operations plane** | `src/modules/operations` | `support_tickets`, `ticket_messages`, `return_requests`, `return_items`, `refunds`, `warranties`, `disputes`, `audit_logs` | References orders, items, serial numbers, sellers, users |

---

## 4. Forbidden Architectural Anti-Patterns

- ❌ **No Neo4j / Graph Databases:** `graphify` is used strictly for codebase structural analysis. PostgreSQL is the sole relational store for runtime commerce and compatibility edges.
- ❌ **No Direct Status String Mutations:** Calling `UPDATE orders SET status = 'SHIPPED'` without executing the domain Command and FSM pre-condition checks is prohibited.
- ❌ **No Float Money Arithmetic:** All financial numbers must use `numeric(12,2)` or integer paise to prevent rounding errors.
- ❌ **No Frontend State Trust:** Prices, tax calculations, stock availability, seller commissions, and RBAC permissions sent from the browser client are strictly untrusted.
- ❌ **No Silent Try-Catch Fallbacks:** Errors must emit trace log alerts and escalate to the Operations plane rather than returning empty dummy arrays or swallowing exceptions.

---

## 5. 16-Step Gated Definition of Done (DoD) per Feature Slice

Every feature slice across Phases 5 → 15 must satisfy all 16 criteria before being marked `IMPLEMENTED` / `VERIFIED`:

```text
[ ] 1. Database schema (Drizzle ORM definitions in src/modules/<domain>/schema.ts)
[ ] 2. Migration script generated & validated
[ ] 3. Domain entities, value objects & invariants written
[ ] 4. Transaction boundaries & CQRS Commands/Queries established
[ ] 5. API routes / Server Actions implemented
[ ] 6. Input validation (Zod schemas) & sanitization
[ ] 7. Authorization & Supabase RLS policies (USING + WITH CHECK)
[ ] 8. Immutable audit logging for privileged mutations
[ ] 9. Transactional outbox event emission (where applicable)
[ ] 10. Background worker & idempotency checks (processed_webhooks / event_id)
[ ] 11. Failure handling, retries & Dead-Letter Queue (DLQ) integration
[ ] 12. User Interface (Storefront / Ops / Seller) built with responsive layout
[ ] 13. Component states complete (Loading, Empty, Error, Success)
[ ] 14. Unit, integration & security test suites executed
[ ] 15. Observability telemetry (Sentry error tracking & PostHog events) logged
[ ] 16. Failure control verification against failure_control_spec.md
```
