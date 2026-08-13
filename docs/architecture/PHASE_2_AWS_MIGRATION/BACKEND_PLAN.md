# BACKEND_PLAN.md

**DOCUMENT AUTHORITY HIERARCHY**
1. **BACKEND_extras/historical/PRD.md** (Product requirements / business behavior) 
   ↓
2. **BACKEND_extras/historical/TRD.md** (Technical architecture / system invariants)
   ↓
3. **BACKEND_PLAN.md** (Implementation sequence / milestones)
   ↓
4. **BACKEND_INSTRUCTIONS.md** (Engineering execution rules)

*Authority Rule: PLAN defines IN WHAT ORDER the TRD will be implemented. It MUST NOT redefine architecture.*

---

## Phase 0: Repository Forensic Analysis (FOUNDATION)
- **Objective**: Reconcile frontend contracts, identify contradictions.
- **Deliverables**: `CONTRACT_INVENTORY.md`, `CONTRADICTION_REGISTER.md`.
- **Exit Criteria**: All contradictions resolved and approved.

## Phase 1: Infrastructure Foundation (FOUNDATION)
- **Objective**: Setup AWS, CI/CD, Secrets, Logging, and Database.
- **Deliverables**: Terraform/CDK scripts, CI/CD pipelines, Base PostgreSQL setup.
- **Exit Criteria**: Code can be deployed to a staging ECS environment and connect to RDS.

## Phase 2: Database & Core Domain Abstractions (FOUNDATION)
- **Objective**: Implement CQRS base classes, Idempotency middleware, and Outbox pattern.
- **Deliverables**: Drizzle schemas, Base Command/Query handlers.
- **Exit Criteria**: A dummy command executes transactionally with idempotency protection.

## Phase 3: Identity, Organization & Authorization (DOMAIN)
- **Objective**: Implement Tenancy and RBAC.
- **Deliverables**: Auth hooks, Organization tables, Role tables.
- **Exit Criteria**: End-to-end authentication flow; cross-tenant access is blocked via tests.

## Phase 4: Capability Control Plane (HARDENING)
- **Objective**: Implement the frozen capability evaluator.
- **Deliverables**: Evaluator logic, Registry tables, Precedence rules.
- **Exit Criteria**: Emergency kill switches successfully block API execution in tests.

## Phase 5: Catalog, Manufacturers, Products (DOMAIN)
- **Objective**: Implement immutable product catalog.
- **Deliverables**: Catalog schemas, PIM endpoints.
- **Exit Criteria**: Specifications can be queried strongly typed.

## Phase 6: Cart & Inventory (DOMAIN)
- **Objective**: Implement shopping cart and inventory reservations.
- **Deliverables**: Cart queries, `ReserveInventoryCommand`.
- **Exit Criteria**: Concurrent checkout attempts result in correct lock behavior.

## Phase 7: Checkout, Orders, Payments (INTEGRATION)
- **Objective**: Execute financially authoritative checkouts.
- **Deliverables**: Order generation, Payment state machine, Webhook idempotency.
- **Exit Criteria**: Backend correctly derives totals; fake/delayed webhooks are handled gracefully.

## Phase 8: RFQ & Procurement (DOMAIN)
- **Objective**: Implement B2B quoting.
- **Deliverables**: PR, PO, RFQ state machines.
- **Exit Criteria**: Approval workflows properly transition states.

## Phase 9: Engineering, BOM, Compatibility (DOMAIN)
- **Objective**: Structured BOM parsing and graph evaluation.
- **Deliverables**: Compatibility engine, BOM parser worker.
- **Exit Criteria**: System rejects incompatible components accurately.

## Phase 10: Files & Workers (INTEGRATION)
- **Objective**: Implement secure file ingestion.
- **Deliverables**: S3 pre-signed URLs, Quarantine SQS worker.
- **Exit Criteria**: Malware-flagged files never reach business logic.

## Phase 11: Seller Operations & Shipping (DOMAIN)
- **Objective**: Implement fulfillment lifecycle.
- **Deliverables**: Shipment creation, 3PL API integration.
- **Exit Criteria**: Seller can partially fulfill an order.

## Phase 12: Observability & Security (HARDENING)
- **Objective**: Finalize telemetry, audit logs, and threat modeling.
- **Deliverables**: Dashboard configurations, WAF rules.
- **Exit Criteria**: Security audit passes without P0 findings.

## Phase 13: Production Deployment (PRODUCTION)
- **Objective**: Go-live.
- **Deliverables**: Production AWS environment, DNS cutover.
- **Exit Criteria**: System is live, backups are tested and verified via a restoration drill.

---

### BALCONY VERDICT
**Status**: YELLOW
**Reasoning**: The plan is structurally sound, but implementation may only proceed after the Backend Engineer completes Phase 0 (Forensic Analysis) and explicitly acknowledges any identified architectural risks.
