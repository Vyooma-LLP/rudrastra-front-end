# Vyooma — Technical B2B Marketplace & Engineering Discovery Engine
**India's Canonical Drone Hardware Catalog, Product Information System (PIM) & Engineering Discovery Platform**

> [!IMPORTANT]
> **Architecture v1.0 is frozen. Agents must implement the existing contracts; architectural deviations require explicit change control. No new infrastructure, domain abstractions, libraries, or architectural patterns may be introduced merely for convenience.**

---

## 1. System Identity & Core Moat

Vyooma is engineered to solve technical discovery and procurement for India's drone manufacturing, defense, research, and enterprise drone hardware ecosystem.
* **The Strategic Asset**: A canonical, typed technical catalog (`manufacturers` + `catalog_products` + `product_variants`), structured engineering specifications, and a polymorphic compatibility graph.
* **The Monetization Layer**: Multi-vendor B2B commerce (`seller_offers`, `inventory_items`, `orders`, `b2b_procurement`, `financial_ledger`) built on top of authoritative engineering data.

---

## 2. Executive Architecture & Governance Score: ~9.6/10 (FINAL GO)

* **Architecture v1.0**: 🟢 **FROZEN**
* **Locked Stack**: Next.js 16 (App Router) + TypeScript (`strict`) + Tailwind CSS + shadcn/ui + PostgreSQL (Supabase DB + Auth + RLS) + Drizzle ORM + Typesense + Cloudflare R2 / CDN / WAF + Razorpay Route + Shiprocket + Resend + PostHog + Sentry.
* **Mechanical CI & Governance**: Defined in [`.agents/ARCHITECTURE_CHECKLIST.md`](file:///Users/praneeth/Downloads/antigravity/rudhastra%20ecomm/.agents/ARCHITECTURE_CHECKLIST.md) and [`.agents/AGENTS.md`](file:///Users/praneeth/Downloads/antigravity/rudhastra%20ecomm/.agents/AGENTS.md).
* **Adversarial Resiliency**: Governed by **19 Mandatory Adversarial Failure Modes** and measurable DR SLOs (`RPO ≤ 5 min`, `RTO ≤ 15 min` for DB; `RTO ≤ 60s` for Search Index).

---

## 3. Strict CQRS Modular Monolith Structure (`src/modules/<domain>/`)

Every domain module separates mutations, queries, pure domain logic, and repositories:
```text
src/
  modules/
    orders/
      commands/         # Command Server Actions / State Transitions (can mutate)
      queries/          # Query Functions / Read Services (read-only)
      domain/           # Pure Domain Logic, Types & State-Machine Transitions
      repositories/     # Drizzle ORM Database Queries & Mutations
```

---

## 4. The 16-Phase Strictly Sequential Execution Roadmap

Implementation executes in a strictly linear, phase-gated order:

1. **Phase 0**: Requirements & Domain Invariants -> [`docs/phases/phase_00_requirements_and_invariants.md`](file:///Users/praneeth/Downloads/antigravity/rudhastra%20ecomm/docs/phases/phase_00_requirements_and_invariants.md)
2. **Phase 1**: Architecture & 19 Failure Modes -> [`docs/phases/phase_01_architecture_and_failure_modes.md`](file:///Users/praneeth/Downloads/antigravity/rudhastra%20ecomm/docs/phases/phase_01_architecture_and_failure_modes.md)
3. **Phase 2**: Identity, Tenancy & Authorization -> [`docs/phases/phase_02_identity_tenancy_authorization.md`](file:///Users/praneeth/Downloads/antigravity/rudhastra%20ecomm/docs/phases/phase_02_identity_tenancy_authorization.md)
4. **Phase 3**: Canonical Schema & SQL Migrations -> [`docs/phases/phase_03_database_schema_and_rls.md`](file:///Users/praneeth/Downloads/antigravity/rudhastra%20ecomm/docs/phases/phase_03_database_schema_and_rls.md)
5. **Phase 4**: Design System & Tokens -> [`docs/phases/phase_04_design_system.md`](file:///Users/praneeth/Downloads/antigravity/rudhastra%20ecomm/docs/phases/phase_04_design_system.md)
6. **Phase 5**: Catalog & PIM Engine -> [`docs/phases/phase_05_catalog_and_pim.md`](file:///Users/praneeth/Downloads/antigravity/rudhastra%20ecomm/docs/phases/phase_05_catalog_and_pim.md)
7. **Phase 6**: Search Infrastructure (Typesense) -> [`docs/phases/phase_06_search_infrastructure.md`](file:///Users/praneeth/Downloads/antigravity/rudhastra%20ecomm/docs/phases/phase_06_search_infrastructure.md)
8. **Phase 7**: Sellers & Offers -> [`docs/phases/phase_07_sellers_and_offers.md`](file:///Users/praneeth/Downloads/antigravity/rudhastra%20ecomm/docs/phases/phase_07_sellers_and_offers.md)
9. **Phase 8**: Cart & Inventory Reservations -> [`docs/phases/phase_08_cart_and_inventory.md`](file:///Users/praneeth/Downloads/antigravity/rudhastra%20ecomm/docs/phases/phase_08_cart_and_inventory.md)
10. **Phase 9**: Checkout, Payments & Double-Entry Ledger -> [`docs/phases/phase_09_checkout_payments_ledger.md`](file:///Users/praneeth/Downloads/antigravity/rudhastra%20ecomm/docs/phases/phase_09_checkout_payments_ledger.md)
11. **Phase 10**: Orders, Multi-Package Shipments & Returns -> [`docs/phases/phase_10_orders_and_fulfillment.md`](file:///Users/praneeth/Downloads/antigravity/rudhastra%20ecomm/docs/phases/phase_10_orders_and_fulfillment.md)
12. **Phase 11**: B2B Procurement, RFQs & Net Terms -> [`docs/phases/phase_11_b2b_procurement.md`](file:///Users/praneeth/Downloads/antigravity/rudhastra%20ecomm/docs/phases/phase_11_b2b_procurement.md)
13. **Phase 12**: Admin Verification Console -> [`docs/phases/phase_12_admin_catalog_verification.md`](file:///Users/praneeth/Downloads/antigravity/rudhastra%20ecomm/docs/phases/phase_12_admin_catalog_verification.md)
14. **Phase 13**: Engineering Compatibility Graph -> [`docs/phases/phase_13_compatibility_graph.md`](file:///Users/praneeth/Downloads/antigravity/rudhastra%20ecomm/docs/phases/phase_13_compatibility_graph.md)
15. **Phase 14**: Security Hardening & Final Audit -> [`docs/phases/phase_14_security_performance_seo.md`](file:///Users/praneeth/Downloads/antigravity/rudhastra%20ecomm/docs/phases/phase_14_security_performance_seo.md)
16. **Phase 15**: Production Readiness & Go-Live -> [`docs/phases/phase_15_production_readiness.md`](file:///Users/praneeth/Downloads/antigravity/rudhastra%20ecomm/docs/phases/phase_15_production_readiness.md)

---

## 5. Implementation Kickoff

* **Next Execution Gate**: Build and verify Phase 2 (Identity, Tenancy & RLS) and Phase 3 (Canonical Drizzle Schema & SQL Migrations) against the mechanical CI/CD compliance rules.
