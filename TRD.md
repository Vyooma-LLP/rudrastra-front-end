# RUDRASTRA TECHNICAL REQUIREMENTS DOCUMENT

## TRD v1.1
**Status: FROZEN**

## 0. Document Authority
This Technical Requirements Document (TRD) is the technical contract and navigation layer for the Rudrastra architecture.
- **Product Requirements (WHAT)**: Defined by `PRD.md`
- **Failure Control (WHAT MUST NOT FAIL)**: Defined by `docs/operations/failure_control_spec.md`
- **Architecture (HOW IT IS BUILT)**: Defined by `ARCHITECTURE.md`
- **Engineering Governance**: Defined by `.agents/AGENTS.md`

**Global Rule**: No technical specification may contradict `ARCHITECTURE.md`, and no application specification may redefine a cross-cutting invariant. Application documents may specialize global architecture but may not weaken it. No implementation may weaken, bypass, or reinterpret a frozen invariant without an explicit controlled revision.

## 1. Relationship to PRD
The TRD exists to guarantee that the technical system can satisfy the requirements, workflows, and operational capabilities defined in the frozen PRD.

## 2. Relationship to Failure Control Specification
The TRD defines the **enforcement mechanisms** for the 100 concrete failure controls documented in the Failure Control Spec. The Failure Control Spec is a peer governing artifact that the TRD must satisfy.

## 3. Technical System Definition
Rudrastra is a Technical B2B Marketplace, Product Information System (PIM), and Engineering Discovery Engine. It operates as a strict modular monolith, separating transactional commerce from operational observability and cross-domain reconciliation.

## 4. Architectural Principles
- **Exactly-once business effects**: Rudrastra provides exactly-once business effects, not exactly-once message delivery.
- **No distributed workflow may depend exclusively on successful completion of an external call.**
- **Every critical business operation must have an authoritative state, an explicit state transition model, an idempotent execution boundary, durable event propagation, observable execution, failure recovery, and independent reconciliation where external or distributed state is involved.**

## 5. Four System Planes
The system is divided into four distinct planes:
- **Product Plane**: Catalog, Search, Discovery, Compatibility
- **Commerce Plane**: Cart/Checkout, Orders, Inventory, Payments, Logistics, Ledger
- **Control Plane**: Identity, RBAC, Audit, Feature Flags
- **Operations Plane**: Tickets, Tasks, Incidents, Problems, Changes, Exceptions, SLA, Reconciliation, Diagnostics

## 6. 14 Non-Negotiable System Invariants
These invariants map directly to the Failure Control Spec and must be architecturally enforced:
1. **AUTH_INV (Authorization Invariant)**: No protected operation may execute without server-side authorization against the current actor, organization, resource, and capability.
2. **CAT_INV (Canonical Catalog Invariant)**: Canonical product identity is created and mutated only by the Catalog domain; seller offers cannot create independent physical-product identities.
3. **SRCH_INV (Search Integrity Invariant)**: Search is a derived projection and can never override authoritative catalog state; exact MPN matching is deterministic.
4. **INV_INV (Inventory Concurrency Invariant)**: Inventory reservations are atomic, concurrency-safe, and bounded by authoritative available quantity.
5. **CHK_INV (Checkout Idempotency Invariant)**: Every checkout operation is idempotent and produces at most one authoritative order/payment intent outcome.
6. **PAY_INV (Payment Reconciliation Invariant)**: Payment state is reconciled against provider state and cannot be considered final solely from asynchronous delivery assumptions.
7. **LEDG_INV (Financial Ledger Integrity Invariant)**: Financial truth is represented by immutable auditable ledger entries and independently reconciled against commerce events.
8. **REF_INV (Refund Limit Invariant)**: Refund operations are bounded, idempotent, and cannot exceed refundable financial state.
9. **SLR_INV (Seller Payout Limit Invariant)**: Seller payouts are derived from verified eligible financial state and cannot exceed the seller's payable balance.
10. **MKT_INV (Multi-Seller Aggregation Invariant)**: Multi-seller order aggregation preserves seller boundaries, independent fulfillment state, and financial attribution.
11. **AUD_INV (Privileged Audit Invariant)**: Privileged mutations are attributable, authorized, auditable, and linked to their operational context.
12. **OPS_INV (Operational Discoverability Invariant)**: Any operationally significant failure must be discoverable through telemetry, exception generation, or governed work creation.
13. **DIST_INV (Distributed Event Recovery Invariant)**: Distributed operations must tolerate retries, duplication, delayed delivery, partial failure, and worker loss without creating contradictory business effects.
14. **HUM_INV (Human Mistake Defense Invariant)**: High-risk human actions require capability authorization, impact awareness, controlled execution, and verifiable outcome.

## 7. Authoritative Domain Ownership
Every piece of state has exactly one authoritative owner. Other systems may hold projections, but they cannot become competing sources of truth.
- Product identity → Catalog
- Seller offer → Marketplace
- Inventory → Inventory
- Order lifecycle → Orders
- Payment lifecycle → Payments
- Financial truth → Ledger
- Shipment lifecycle → Logistics
- Refund lifecycle → Refunds
- User authorization → Identity/Control
- Operational work → Operations

## 8. State Management Requirements
Arbitrary status mutation is prohibited. All state transitions must adhere to the rules defined in `docs/architecture/state_machine_spec.md`.

## 9. Distributed Systems Requirements
Outbox/Inbox architecture is mandatory.
- **Transactional Outbox**: Update business state and create outbox event in a single DB transaction.
- **Inbox/Consumer Deduplication**: Check `event_id` before processing to ensure idempotency.

## 10. Idempotency Requirements
Idempotency is a cross-cutting platform primitive.
`Idempotency-Key + Operation Type + Actor/Tenant -> Idempotency Store -> Exactly one authoritative outcome`.
Repeating the same logical operation must never create multiple business outcomes.

## 11. Event Architecture Requirements
Domain Events, Metrics, Traces, and Reconciliation Results form the Event/State Fabric. CQRS projections consume these events but are never authoritative business state.

## 12. Reconciliation Integrity Contract
- **Temporal Consistency**: Authoritative current state > Historical state > Projection state > Cached state > Search-index state.
- **Reconciliation Engine**: An explicit architecture comparing Expected State vs Observed State, generating Mismatches, Exceptions, Work Assignments, and Automated Recovery.
- **Reconciliation Integrity**: Every critical reconciliation process must define its Scope, Trigger/Frequency, Expected State, Observed State, Mismatch Classification, Owner, Retry Policy, Escalation, Safe Remediation, Verification, Dead-letter State, Alerting, and Audit Trail.
> **An unresolved reconciliation mismatch is itself a first-class operational state and may never silently disappear.**

## 13. Security & Authorization Requirements
Capability-based security. Roles are bundles of capabilities. Enforces tenant isolation, organization boundaries, seller isolation, support access boundaries, and PII access.

## 14. Audit & Traceability Requirements
Correlation IDs (`request_id`, `correlation_id`, `causation_id`, `actor_id`, `organization_id`, `tenant_id`) must propagate across all cross-system operations to construct a Universal Timeline.

## 15. Observability Requirements
Operations Plane derives visibility from events/metrics/traces/reconciliation, rather than transactional queries. 

## 16. Operational Requirements
Operations is the control mechanism that observes and repairs inconsistencies produced across the commerce system. It manages tickets, tasks, incidents, problems, changes, and exceptions.

## 17. Application Architecture Requirements
**Mandatory Application-Spec Contract:**
Application specifications (`docs/applications/*.md`) define how each subsystem works in depth. They must not contradict global architecture and must adhere to the following mandatory document structure:
- Authority / Scope
- Domain Owner
- Authoritative State
- Dependencies
- State Machines
- Commands / Queries
- Events
- Invariants
- Related Failure Controls (with traceability: `FC-ID -> App Spec -> Arch Control -> Impl -> Test`)
- Failure Modes
- Detection
- Recovery
- Reconciliation
- Adversarial Tests
- Observability
- Security / Permissions
- Operational Runbook

> **An application specification is incomplete and cannot enter implementation if any mandatory section is absent or marked N/A without documented justification.**

## 18. Integration Requirements
**Bounded External Interaction Contract:**
External interactions require intent recording, external action, provider result, internal state transition, and reconciliation.
Every external dependency MUST explicitly define:
- Timeout / execution bound (connection, response)
- Retry policy / budget / backoff
- Circuit breaker / load-shed strategy / concurrency limits
- Fallback or graceful degradation
- Intent recording
- Reconciliation
- Alert / operational ownership

> **No external dependency may be capable of indefinitely occupying a request thread, worker, queue consumer, connection, or other finite platform resource. Secondary failure must never become marketplace failure.**

## 19. Data Architecture Requirements
Ledger architecture must be append-oriented. Derived balances replace mutable balance columns as the source of financial truth.

## 20. Performance & Scalability Requirements
Cache stampede protections and read replica scaling apply. Search projections scale reads independently of authoritative DB writes.

## 21. Disaster Recovery Requirements
RPO ≤ 5 min, RTO ≤ 15 min for the DB. RTO ≤ 60s for Search index (rebuildable from PostgreSQL).

## 22. Failure Control Traceability
The 100 control items in `failure_control_spec.md` map to the 14 Invariants enforced by this TRD.

## 23. Architecture Decision Governance
Changes require explicit Architecture Review against the constitutional invariants and failure controls.

## 24. Technical Readiness Gate
Architecture cannot proceed unless all invariants have enforcement, controls have owners, critical state machines are defined, cross-domain operations have failure semantics, integrations have reconciliation, privileged actions are authorized/audited, and critical data has authoritative ownership.

## 25. Linked Technical Specifications
See `docs/DOCUMENTATION_INDEX.md` for the registry of all authoritative specs.
