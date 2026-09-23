# ARCHITECTURE_DECISIONS.md

This document serves as the decision ledger. Every major architectural decision must be recorded here to prevent accidental architectural drift in the future.

---

### ADR-001: Modular Monolith vs Microservices
- **Date**: 2026-08-11
- **Status**: Approved
- **Context**: The system needs a backend architecture that scales but remains maintainable for a small engineering team.
- **Decision**: We will build a modular monolith using isolated domain boundaries (CQRS).
- **Reason**: The current scale and organizational structure do not justify the distributed operational complexity of microservices.
- **Consequences**: Easier deployments, cross-module transactions via DB are possible, but strict discipline is required to avoid spaghetti code.
- **Rejected Alternatives**: Microservices, Serverless Functions (Lambda everywhere).

### ADR-002: RDS PostgreSQL as Transactional Authority
- **Date**: 2026-08-11
- **Status**: Approved
- **Context**: We need an ACID-compliant database to handle complex multi-tenant B2B commerce.
- **Decision**: Amazon Aurora PostgreSQL (or equivalent managed Postgres).
- **Reason**: Relational transactional domain, deep reliance on constraint integrity, row-level locking for inventory, and compatibility with existing Drizzle ORM setup.
- **Consequences**: Scalability relies on vertical scaling and read-replicas.
- **Rejected Alternatives**: DynamoDB, MongoDB.

### ADR-003: SQS for Asynchronous Jobs
- **Date**: 2026-08-11
- **Status**: Approved
- **Context**: We need to process outbox events, file scanning, and background notifications.
- **Decision**: Use Amazon SQS for queueing.
- **Reason**: Simple, robust, at-least-once delivery without the operational overhead of managing an event streaming platform.
- **Consequences**: Workers must be strictly idempotent due to at-least-once delivery.
- **Rejected Alternatives**: Kafka, RabbitMQ.

### ADR-004: Money Representation Strategy
- **Date**: 2026-08-11
- **Status**: Approved
- **Context**: Financial calculations must avoid floating-point errors.
- **Decision**: All money is represented as an object: `{ amountMinor: string, currency: string }`.
- **Reason**: Represents exact integer values (paise/cents). String format prevents JS precision loss on massive enterprise orders.
- **Consequences**: Frontend must always divide by 100 for display; Backend must do all calculations using BigInt or specialized decimal libraries.

### ADR-005: Trust Boundary Lives in the Next.js Server Layer, Not Postgres RLS
- **Date**: 2026-09-23
- **Status**: Approved
- **Context**: A Staging DB audit (during the Git-canonical infrastructure migration project) found that none of the 24 `public` tables have Row Level Security enabled — only `0000`'s table creation had ever been applied there, not `0001_enable_rls.sql`. This looked like drift/an unresolved gap, so it was raised explicitly rather than assumed safe or silently fixed.
- **Decision**: All real data access goes through the Next.js server (Server Actions / API routes) via Drizzle, using the `postgres` role, which owns the tables and bypasses RLS regardless of whether it's enabled. Authorization is enforced in server code (e.g. the `seller_offers`-ownership check in `src/app/actions/upload.ts`), not by Postgres RLS policies on these 24 tables. RLS remains the enforced boundary only for `storage.objects` (see `0004_storage_baseline.sql`) and any future path that talks to Postgres directly with the `anon`/`authenticated` Supabase client keys.
- **Reason**: Given the above trust boundary, enabling RLS with no policies on all 24 tables would enforce nothing for the actual data path (still bypassed by the `postgres` role) while risking breaking any code path that *does* use the anon/authenticated Supabase client directly, for zero real security gain today.
- **Consequences**: The 24-table RLS gap is **not a blocker** for Staging/Production migration work — it's tracked here as a hardening backlog item. If a future feature introduces a genuine anon/authenticated-key access path to these tables (e.g. a public API, browser-side Supabase queries), RLS must be designed and enabled for that specific table *before* that path ships — don't assume this ADR still holds without checking the access path first.
- **Rejected Alternatives**: Blanket-enabling RLS with permissive default policies (rejected: false sense of security, real policies still need per-table design); leaving the gap undocumented (rejected: exactly the kind of unrecorded architectural fact this ledger exists to prevent).

*(Future ADRs to be appended here by the Backend Engineer).*
