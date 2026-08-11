# Rudrastra Backend Handoff Specification
**Version: 1.0 (FINAL FRONTEND-APPROVED BOUNDARY)**

> [!IMPORTANT]
> **READ THIS BEFORE WRITING BACKEND CODE.**
> This document defines the exact architectural contracts, boundaries, and models the frontend requires. The frontend acts exclusively as a dumb UI intent layer. It is not authoritative over financial math, security entitlements, or tenancy contexts. The backend is the sole source of truth.

---

## 1. Architectural Boundaries

### 1.1 The "Dumb Frontend" Rule
- The frontend **never** calculates a final order total, tax, or shipping cost. It submits `AddToCartCommand` and displays whatever `CartState` the backend returns.
- The frontend **never** decides if a user is allowed to perform an action. It submits a query for capabilities and disables buttons based solely on the returned `CapabilityDecision`.
- The frontend **never** implies an absolute tenancy context. `organizationId` is passed as a UX hint to resolve ambiguous multi-tenant sessions, but the backend must enforce RBAC/RLS based on the authenticated principal token.

### 1.2 Infrastructure Independence
All backend control plane logic (idempotency, fencing) relies on a `PlatformDatabase` port. It is up to the backend implementation (e.g., Drizzle, Prisma, PostgreSQL) to inject this dependency. Do not leak SQL syntax or ORM specifics into the application contracts.

---

## 2. Three Mandatory Handoff Conditions

### Condition 1: Backend must not trust frontend security context.
`organizationId`, `sellerId`, `userId`, capability decisions, prices, totals, inventory, payment status, and scan status are **claims/context from the client, not authorization evidence**.
The backend independently derives and verifies them.

### Condition 2: Backend becomes the first real source of truth.
The MockAdapters are now scaffolding. You should replace:
```text
UI
 ↓
Contract
 ↓
MockAdapter
```
with:
```text
UI
 ↓
Contract
 ↓
RealAdapter
 ↓
API/Application Command
 ↓
Authorization
 ↓
Domain
 ↓
PostgreSQL
```
Do **not** redesign the frontend while doing this unless a contract genuinely proves insufficient.

### Condition 3: Don't let the backend implement only CRUD.
The capability architecture frozen in Phase 0 is substantially more important than simply getting PostgreSQL queries working.
The backend must implement the control-plane invariants:
```text
Capability Registry
        ↓
Platform Availability
        ↓
Dependencies
        ↓
Rollout
        ↓
Entitlement
        ↓
Organization Overrides
        ↓
RBAC
        ↓
Execution
```
with the frozen emergency kills, safe mode, versioning, idempotency, optimistic concurrency, fencing, LKG, activation barriers, audit trail, etc.

---

## 3. Explicit Instruction for the Backend Engineer

> **The frontend is the contract consumer, not the authority. Implement the backend against the existing contracts and architecture. Do not introduce frontend workarounds for backend limitations. If a contract is insufficient, document the mismatch before changing it.**

---

## 4. Core Contracts & Signatures (`src/contracts/base.ts`)

### 2.1 The Command Metadata Lifecycle
Every mutation is a `Command` requiring a `CommandContext`.

```typescript
export interface CommandMetadata {
  requestId: string;       // Log Tracing (Which network request produced this log?)
  commandId: string;       // Business Identity (Which logical command execution is this?)
  idempotencyKey: string;  // Retry Protection (Has the backend already executed this?)
}
```

**Backend Enforcement:** The backend MUST reject any command execution where the `idempotencyKey` matches an existing record but the payload hash differs (returns `IDEMPOTENCY_CONFLICT`).

### 2.2 Canonical Money Representation
Floating-point arithmetic is completely banned for financial data.

```typescript
export type Money = {
  amountMinor: string; // e.g., "149900" for 1499.00 INR
  currency: string;
};
```
**Backend Enforcement:** All database representations and API responses must return `amountMinor: string`. The UI will divide by 100 for display purposes only.

### 2.3 Strict Error Taxonomy
The frontend depends on deterministic error handling. Do not return generic `500 Server Error` strings.

```typescript
export type CommandErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_ENTITLED'
  | 'CAPABILITY_UNAVAILABLE'
  | 'DEPENDENCY_DISABLED'
  | 'ROLLOUT_EXCLUDED'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'IDEMPOTENCY_CONFLICT'
  | 'STALE_CONFIGURATION'
  | 'RATE_LIMITED'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR';
```

**UI Expectations:**
- `STALE_CONFIGURATION`: The UI will force a page refresh or prompt the user.
- `UNAUTHORIZED` / `FORBIDDEN`: The UI will purge the session state and redirect to login.

### 2.4 Capability Decisions
The backend is responsible for feature flags and entitlements.

```typescript
export interface CapabilityDecision {
  allowed: boolean;
  capability: string;
  reason: CapabilityDecisionReason;
}
```
**Backend Enforcement:** Return `allowed: false` with a specific reason (e.g., `NOT_ENTITLED`) rather than a generic 403. The UI will render graceful degradation (e.g., lock icons or upsell banners).

### 2.5 Query Pagination
All list queries must conform to standard pagination semantics.

```typescript
export type PageRequest = {
  cursor?: string;
  limit: number;
  sort?: { field: string; direction: 'asc' | 'desc' };
  filters?: Record<string, unknown>;
};

export type PageResponse<T> = {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
};
```

---

## 3. Specific Domain Contracts

### 3.1 File Uploads (BOM & RMA)
- **Constraint:** The frontend will not submit arbitrary binary blobs to domain mutations.
- **Contract (`RfqContract.ts`):** Uploads are semantic. The UI will hit an infrastructure endpoint to upload a file, receive a `fileId`, and pass the `fileId` and `scanStatus` to the business command.
- **Backend Requirement:** Implement an S3/Cloudflare R2 pre-signed URL workflow with malware scanning hooks before allowing the `fileId` to be processed into an RFQ or Order.

### 3.2 Async Cancellations
- **Constraint:** The frontend utilizes `AbortSignal` to cancel queries and mutations when users navigate away.
- **Backend Requirement:** If the backend receives a closed connection / aborted signal during a read query, it should safely terminate. For mutations, the backend must rely on its `PlatformDatabase` transactional atomicity to either complete fully or roll back completely if aborted prematurely.

---

## 6. The Actual Next Sequence

### Phase 1 — Backend foundation
```text
Supabase Auth
      ↓
Organizations / Tenancy
      ↓
RBAC
      ↓
PostgreSQL + Drizzle
      ↓
Capability Control Plane
      ↓
CQRS Commands / Queries
      ↓
Idempotency
      ↓
Audit
```

### Phase 2 — Core commerce
```text
Catalog
 ↓
Cart
 ↓
Checkout
 ↓
Orders
 ↓
Payments
 ↓
Order lifecycle
```

### Phase 3 — Seller
```text
Seller onboarding
 ↓
Verification
 ↓
Offers
 ↓
Inventory
 ↓
Fulfillment
 ↓
Seller orders
 ↓
Payouts
```

### Phase 4 — Engineering / procurement
```text
BOM
 ↓
Validation
 ↓
Compatibility
 ↓
Supplier matching
 ↓
RFQ
 ↓
RFQ comparison
 ↓
Approval
 ↓
Purchase Order
```

### Phase 5 — Control Center
Only after the evaluator itself works correctly:
```text
Capability Registry
        ↓
Control Plane API
        ↓
Control Center
        ↓
Simulator
        ↓
Impact Analysis
        ↓
Audit
        ↓
Emergency Controls
```
*(This ordering matters. Don't build a beautiful cockpit for an evaluator that hasn't been proven.)*
