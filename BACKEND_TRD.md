# BACKEND_extras/historical/TRD.md

**DOCUMENT AUTHORITY HIERARCHY**
1. **BACKEND_extras/historical/PRD.md** (Product requirements / business behavior) 
   ↓
2. **BACKEND_extras/historical/TRD.md** (Technical architecture / system invariants)
   ↓
3. **BACKEND_PLAN.md** (Implementation sequence / milestones)
   ↓
4. **BACKEND_INSTRUCTIONS.md** (Engineering execution rules)

*Authority Rule: TRD defines HOW the system technically guarantees the PRD. TRD is the technical source of truth.*

---

## A. System Architecture
Modular monolith deployed on AWS (ECS/Fargate) communicating with Amazon Aurora PostgreSQL (or Supabase Postgres). Unidirectional CQRS data flow.

## B. Trust Boundaries
- **Frontend**: Untrusted. All claims (IDs, totals, states) must be verified.
- **API Boundary**: Enforces authentication and schema validation (Zod).
- **Application Boundary**: Enforces capability checks and RBAC.
- **Database Boundary**: Enforces relational integrity, constraints, and optimistic locking.

## C. Data Ownership Model
- Catalog is owned by Platform.
- Inventory is owned by Sellers.
- Carts/Orders are owned by Organizations.
- Financial Ledger is owned by the immutable transaction system.

## D. Domain Boundaries
Identity, Catalog, Marketplace, Inventory, Cart, Checkout, Orders, Finance, Procurement, Operations.

## E. Module Dependency Graph
Strict acyclic dependencies. (e.g., Cart depends on Catalog, but Catalog does not depend on Cart).

## F. API Architecture
REST or RPC via Next.js Server Actions / API Routes, strongly typed via tRPC or similar patterns.

## G. Authentication Architecture
Supabase Auth (or AWS Cognito). JWT validation at the edge/middleware.

## H. Authorization Architecture
Server-side resolution. `(UserId) -> Organization Memberships -> Roles -> Permissions`.

## I. Organization Isolation
Enforced at the Database level via RLS (Row Level Security) and Application level via tenancy checks on every query/command.

## J. Capability Evaluator
Centralized singleton evaluating feature flags based on Precedence (Emergency Kill > Safe Mode > Availability > Dependency > Deny > Entitlement > Rollout > RBAC).

## K. Entitlement Model
Organization-specific overrides stored in `entitlements` table, queried during capability evaluation.

## L. PostgreSQL Architecture
Primary transactional store. Source of truth.

## M. Database Schema Strategy
Drizzle ORM. Strictly typed, with explicit foreign keys, check constraints, and unique indexes.

## N. Money Architecture (ABSOLUTE RULE)
```typescript
type Money = { amountMinor: string; currency: string; }
```
No floating-point math. Backend computes all totals.

## O. Idempotency Architecture
All mutations require an `idempotencyKey`. Stored in `idempotency_keys` table. 
- Same key + same payload = Return original result.
- Same key + different payload = `IDEMPOTENCY_CONFLICT`.

## P. Concurrency Architecture
- Inventory reservation: `SELECT ... FOR UPDATE SKIP LOCKED`.
- Catalog updates: Optimistic concurrency control (version numbers).

## Q. Event Architecture
Transactional Outbox pattern. Mutations write to `outbox_events` in the same transaction.

## R. Queue Architecture
SQS (or equivalent) processes `outbox_events` asynchronously.

## S. Worker Architecture
Idempotent background workers. Safe to retry, safe if messages are duplicated.

## T. File Architecture
Browser -> Pre-signed URL -> S3 Quarantine -> Malware Scan Event -> S3 Promotion -> Business Workflow.

## U. Payment Architecture
State machine execution. Idempotent webhook handlers. Webhook success != Order success if DB fails.

## V. Shipping Architecture
Async integration via workers interacting with 3PL APIs.

## W. Control-Plane Architecture
Immutable configuration versions. Active configuration propagated to instances.

## X. Audit Architecture
`audit_logs` table records actor, action, resource, and before/after state diffs.

## Y. Observability
Structured JSON logging. `requestId`, `commandId`, `idempotencyKey` propagated across execution context.

## Z. AWS Infrastructure
- **ECS/Fargate**: Mandatory. Serverless compute for modular monolith.
- **RDS PostgreSQL**: Mandatory. Transactional authority.
- **S3**: Mandatory. File storage.
- **SQS**: Mandatory. Async processing.
- **CloudFront / ALB**: Mandatory. Edge routing.
- *EKS, Kafka, Microservices*: **REJECTED** (Unjustified complexity).

## AA. Deployment
CI/CD via GitHub Actions. Immutable Docker images. Blue/Green deployments.

## AB. DNS
GoDaddy (DNS) -> AWS ALB. (Migration to Route 53 is OPTIONAL).

## AC. Secrets
AWS Secrets Manager. Never injected directly into frontend build.

## AD. Backup & AE. Disaster Recovery
RDS Automated Backups + PITR. S3 cross-region replication for critical engineering assets. RPO < 5m.

## AF. Security & AG. Threat Model
Explicit mitigation against IDOR, Replay attacks, SQLi, Mass Assignment, and Webhook Forgery.

## AH. Failure Matrix (30 Scenarios)
| Failure | Detection | Immediate Behavior | Recovery | Data Integrity | User Experience |
| :--- | :--- | :--- | :--- | :--- | :--- |
| DB Unavailable | Connection timeout | Return 503 | Auto-failover | Preserved | Error page |
| Duplicate Checkout | Unique constraint / Idempotency | Reject 2nd request | N/A | Preserved | Handled silently |
| Queue Message Loss | DLQ monitoring | Alert on DLQ | Re-drive DLQ | Preserved | Eventual consistency delay |
| ... *(Extends to 30 scenarios including webhook delays, worker crashes, quarantine failures)* ... |
