# Vyooma Architecture Compliance & Automated CI Governance Checklist
**Architecture v1.0 — Structurally Hardened, Mechanical Enforcement Contract**

---

## 1. Executive Governance Rule

This checksheet (`.agents/ARCHITECTURE_CHECKLIST.md`) transforms Vyooma's architectural invariants from prose documentation into **mechanically enforced CI/CD, linting, and structural rules**. Every Pull Request, AI agent code generation, and database migration MUST satisfy 100% of these checks before merging.

---

## 2. Directory Structure & CQRS Module Contract

Every domain module in `src/modules/<domain>/` MUST adhere to the following directory separation and import boundaries:

```text
src/
  modules/
    orders/
      commands/         # Command Server Actions / State Transitions (can mutate)
      queries/          # Query Functions / Read Services (read-only)
      domain/           # Pure Domain Logic, Types & State-Machine Transitions
      repositories/     # Drizzle ORM Database Queries & Mutations
```

### Automated Lint / ESLint Boundary Enforcement Matrix
* **`queries/` Rule**: Files inside `queries/` **CANNOT** import from mutation repositories or execute `db.insert()`, `db.update()`, or `db.delete()`.
* **`domain/` Rule**: Files inside `domain/` **CANNOT** access HTTP headers, cookies, external network APIs, or database ORM instances. They must remain pure TypeScript functions and state machines.
* **`commands/` Rule**: Any mutation **MUST** execute within an explicit `commands/` function inside a database transaction (`db.transaction()`).

---

## 3. Automated CI & Architecture Compliance Matrix

| Rule ID | Architectural Invariant | Automated CI / Linter Enforcement Mechanism | Severity |
| :---: | :--- | :--- | :---: |
| **CI-01** | **Ledger Immutability** | Fail CI if any `.ts` file imports `ledgerTransactions`, `ledgerEntries`, or `financialTransactions` alongside an `update()` or `delete()` Drizzle method. SQL migrations must revoke `UPDATE` and `DELETE` privileges. | 🔴 FATAL |
| **CI-02** | **State-Machine Governance** | Fail CI if code directly sets `{ status: ... }` on Orders, Seller Orders, Shipments, Returns, or Payments outside designated state-machine transition functions in `domain/`. | 🔴 FATAL |
| **CI-03** | **RLS Policy Validity** | Fail database migration linting if any table enabled for RLS defines a mutation policy without **both** `USING (...)` and `WITH CHECK (...)`. | 🔴 FATAL |
| **CI-04** | **Webhook Authenticity & Idempotency** | Fail CI if any route handler under `src/app/api/webhooks/*` lacks cryptographic HMAC signature verification AND database idempotency check against `processed_webhooks`. | 🔴 FATAL |
| **CI-05** | **Monetary Precision (No Floating Point)** | Fail CI if JavaScript floating-point arithmetic (`+`, `-`, `*`, `/`) is performed on any variable matching `*Inr`, `*Amount`, or `*Price`. All money calculations must use integer paise or `Decimal.js` / numeric SQL strings. | 🔴 FATAL |
| **CI-06** | **Inventory Concurrency Protection** | Fail CI if any inventory mutation executes a direct decrement (`on_hand_quantity - X`) without explicit `SELECT ... FOR UPDATE SKIP LOCKED` or transactional reservation matching. | 🔴 FATAL |
| **CI-07** | **Rebuildable Search Isolation** | Fail CI if any non-worker application code directly invokes the Typesense mutation SDK (`typesense.collections().documents().upsert()`). All index updates must occur via transactional `outbox_events`. | 🔴 FATAL |
| **CI-08** | **Least-Privilege Worker Isolation** | Fail code review if a background job imports `service_role` credentials without executing `authorizeWorker([REQUIRED_CAPABILITY], context)`. | 🔴 FATAL |
| **CI-09** | **Double-Entry Balance Verification** | Fail transaction posting if `SUM(debits) !== SUM(credits)` within `ledger_entries` prior to transitioning `ledger_transactions.status` from `'DRAFT'` to `'POSTED'`. | 🔴 FATAL |
| **CI-10** | **Authoritative Checkout Tax Snapshot** | Fail CI if invoice or receipt generation recalculates GST percentage rates rather than reading the immutable tax snapshot stored in `order_items` and `order_addresses`. | 🔴 FATAL |

---

## 4. Disaster Recovery (DR) Measurable RPO / RTO Invariants

Disaster Recovery is governed by strict, measurable Service Level Objectives (SLOs):
1. **PostgreSQL Database Source of Truth**:
   * **Recovery Point Objective (RPO)**: `≤ 5 minutes` (enforced via continuous WAL archiving and Supabase Point-in-Time Recovery).
   * **Recovery Time Objective (RTO)**: `≤ 15 minutes` to restore a full database snapshot and resume transaction processing.
2. **Typesense Disposable Read Index**:
   * **RPO**: `0 minutes` (derived index; no unique authoritative data is stored in Typesense).
   * **RTO**: `≤ 60 seconds` to execute `/api/admin/search/rebuild` and reconstruct 100% of the active product catalog from PostgreSQL outbox logs.

---

## 5. Mandatory Implementation Sequencing Invariant

AI coding agents and developers **MUST NEVER** parallelize or skip phases. The implementation order is strictly sequential:

```text
Phase 0 (Requirements & Invariants)
  ↓
Phase 1 (Architecture & 19 Failure Modes)
  ↓
Phase 2 (Identity, Tenancy & RLS Authority)
  ↓
Phase 3 (Canonical Schema & Migrations)
  ↓
Phase 4 (Design System & Tokens)
  ↓
Phase 5 (Catalog & PIM Engine)
  ↓
Phase 6 (Typesense Search Indexing)
  ↓
Phase 7 (Sellers & Offers)
  ↓
Phase 8 (Cart & Inventory Reservations)
  ↓
Phase 9 (Checkout, Payments & Ledger)
  ↓
Phase 10 (Orders, Shipments & Returns)
  ↓
Phase 11 (B2B Procurement & Net Terms)
  ↓
Phase 12 (Admin Verification Console)
  ↓
Phase 13 (Compatibility Graph & Evidence)
  ↓
Phase 14 (Security Hardening & Final Audit)
  ↓
Phase 15 (Production Readiness & Go-Live)
```

* **No Scaffolding Overlap**: Do not attempt to scaffold Phase 1 and Phase 3 simultaneously. Each phase must pass its own Definition of Done checks before the next phase begins.
