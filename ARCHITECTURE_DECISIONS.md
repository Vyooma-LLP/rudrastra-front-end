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

*(Future ADRs to be appended here by the Backend Engineer).*
