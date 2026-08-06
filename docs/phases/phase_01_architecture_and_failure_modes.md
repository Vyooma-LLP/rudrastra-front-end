# Phase 1: Architecture, CQRS Contracts & Architectural Failure Model
**Canonical Technical B2B Marketplace + Product Information System (PIM) + Engineering Discovery Engine**

---

## 1. Phase Objective

Phase 1 defines the **Modular Monolith** domain architecture across four distinct planes, CQRS contracts, transactional outbox/inbox infrastructure, and the **Architectural Failure Model**. This ensures the platform scales cleanly without microservice sprawl while preventing silent data corruption under concurrency, network replay, and disaster scenarios.

---

## 2. Modular Monolith Architecture & Four Planes

Rudrastra is segmented into four planes:
1. **Product Plane**: Catalog, Search, Discovery, Compatibility
2. **Commerce Plane**: Cart/Checkout, Orders, Inventory, Payments, Logistics, Ledger
3. **Control Plane**: Identity, RBAC, Audit, Flags
4. **Operations Plane**: Tickets, Incidents, Exceptions, Reconciliation, Diagnostics

### Strict CQRS & Module Boundary Rules
* **Commands Own Mutations**: Any mutation must execute as an explicit Command method within an ACID transaction, pushing events to a Transactional Outbox.
* **Queries Never Mutate**: Read operations inside `queries/` cannot import mutation repositories.
* **No Arbitrary Status CRUD**: Status updates must pass through canonical state-machine Command transitions.

---

## 3. Architectural Failure Model

Instead of relying on successful completion of distributed external calls, Rudrastra implements an architecture that expects and mitigates failure:

* **Failure Categories**: Concurrency, Network Partitions, Provider Outages, Operational Mistakes, Split-Brain.
* **Failure Propagation**: Bounded failure domains. A failure in one seller's order must not corrupt the parent order.
* **Consistency Boundaries**: Authoritative database (ACID) -> Outbox (At-least-once) -> Inbox (Idempotency) -> Search (Derived).
* **Retry Semantics**: Exponential backoff with Dead Letter Queue (DLQ) accumulation and alerting.
* **Recovery Semantics**: Automated recovery via the Operations Plane's Reconciliation Engine.
* **State-Machine Discipline**: Explicit enforcement of valid states and transitions.
* **Event Guarantees**: Outbox/Inbox provides exactly-once business effects.

### Concrete 100-Control Registry
For the exhaustive list of 100 predictable failures and their controls, see the authoritative registry:
**[`docs/operations/failure_control_spec.md`](file:///Users/praneeth/Downloads/antigravity/rudhastra%20ecomm/docs/operations/failure_control_spec.md)**

---

## 4. Acceptance Criteria / Definition of Done

* [x] CQRS Command vs. Query directory separation is documented.
* [x] The Architectural Failure Model is defined with clear consistency boundaries, retry/recovery semantics, and event guarantees.
* [x] The explicit 100-control registry is referenced as the source of truth for failure mitigation.
* [x] Disaster Recovery SLOs (`RPO ≤ 5 min`, `RTO ≤ 15 min` for DB; `RTO ≤ 60s` for Search) are defined.
