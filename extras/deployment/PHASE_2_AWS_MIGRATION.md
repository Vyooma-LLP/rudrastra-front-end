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

# Phase 2: Enterprise AWS Migration Blueprint (v2.0)

This document formalizes the agreed-upon future architectural evolution for the Rudrastra Backend when transaction volume exceeds 10,000 orders/day or enterprise SLAs mandate it.

## 1. Core Philosophy: The Modular Monolith Continues
We retain the single modular monolith (defined in Phase 1) with clean Domain/CQRS boundaries, but migrate the underlying infrastructure runtime to AWS Managed Services.

## 2. Infrastructure Upgrades

| Domain Component | Phase 1 (Current) | Phase 2 (AWS Scale Upgrade) | Rationale |
| :--- | :--- | :--- | :--- |
| **Database** | Supabase (PostgreSQL 15+) | **Amazon Aurora PostgreSQL + RDS Proxy** | Limitless read replicas, extreme high availability, connection pooling for thousands of concurrent workers. |
| **Backend Compute** | Next.js Server Functions (Vercel) | **NestJS + Fastify (AWS ECS Fargate)** | Decoupled long-running background tasks, Websockets, AI model execution without Vercel timeout limits. |
| **Cache Layer** | PostgreSQL Cache / Next.js Data Cache | **Amazon ElastiCache (Redis)** | Sub-millisecond latency for hot catalog data, rate-limiting, and idempotency locks. |
| **Search Engine** | Typesense | **Amazon OpenSearch Service** | Faceted search, vector search, synonym dictionaries, and massive multi-tenant sharding. |
| **Object Storage** | Cloudflare R2 | **Amazon S3** | Deep enterprise integration, lifecycle rules, cross-region replication for CAD models/logs. |
| **Identity & Auth** | Supabase Auth | **Auth0** | Advanced B2B enterprise SSO, custom SAML, granular RBAC delegation. |
| **Async Queues** | PostgreSQL Outbox Poller | **Amazon EventBridge + SQS** | Massive fan-out architecture, zero-polling event delivery. |
| **Durable Workflows**| (None / State Machines in DB) | **Temporal Cloud** | Guaranteed execution for long-running workflows (e.g., 30-day RMA resolution, delayed payouts). |

## 3. Transition Strategy (Zero Lock-In Guarantee)
Because we strictly enforce the following architectural patterns in Phase 1:
- **Drizzle ORM** (Standard PostgreSQL queries, zero BaaS-specific functions).
- **CQRS Abstraction** (Business logic isolated in `src/modules/<domain>/commands` & `queries`).
- **Domain Adapters** (Payment, Shipping, Notifications hidden behind interfaces).

The migration to Phase 2 will require **zero rewrites of core domain logic**. The transition involves simply updating environment variables (Database URL, Search URL) and shifting API execution from Next.js routes to NestJS controllers.

## 4. Proposed Phase 2 Architecture Diagram

```text
                         INTERNET
                            │
                     ┌─────────────┐
                     │ CLOUDFLARE  │
                     └──────┬──────┘
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
             VERCEL                 AWS API GATEWAY
                 │                     │
          Next.js Frontend      AWS ECS / FARGATE
                                (NestJS Backend)
                                       │
                     ┌─────────────────┼─────────────────┐
                     ▼                 ▼                 ▼
                  Aurora             Redis          OpenSearch
                 PostgreSQL
                     │
                  Outbox
                     │
                     ▼
                EventBridge
                     │
             ┌───────┴────────┐
             ▼                ▼
            SQS            Temporal
             │                │
          Workers          Workflows
```
