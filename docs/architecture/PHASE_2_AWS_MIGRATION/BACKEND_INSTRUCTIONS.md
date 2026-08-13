# BACKEND_INSTRUCTIONS.md

**DOCUMENT AUTHORITY HIERARCHY**
1. **BACKEND_extras/historical/PRD.md** (Product requirements / business behavior) 
   ↓
2. **BACKEND_extras/historical/TRD.md** (Technical architecture / system invariants)
   ↓
3. **BACKEND_PLAN.md** (Implementation sequence / milestones)
   ↓
4. **BACKEND_INSTRUCTIONS.md** (Engineering execution rules)

*Authority Rule: INSTRUCTIONS defines HOW the engineer/AI must behave. It MUST NOT redefine product requirements or architecture.*

---

## 1. NON-NEGOTIABLE RULES

1. **Never trust frontend data.** All claims (totals, permissions, IDs) must be re-verified.
2. **Never use floating-point money.** Use integer minor units exclusively.
3. **Never bypass organization authorization.** Every query/command must assert tenancy.
4. **Never bypass capability evaluation.** Feature flags are mandatory.
5. **Never silently change frontend contracts.** Escalate mismatches.
6. **Never invent incompatible APIs.** Implement what the frontend expects.
7. **Never put security invariants only in frontend code.** Frontend is UX, backend is Security.
8. **Never create non-idempotent meaningful mutations.** `idempotencyKey` is required.
9. **Never assume requests happen once.** Network retries exist.
10. **Never assume webhooks happen once.** Duplicate webhooks exist.
11. **Never assume queues deliver once.** At-least-once delivery semantics apply.
12. **Never assume instances are current.** Rolling deployments mean multi-version concurrency.
13. **Never store secrets in source code.** Use AWS Secrets Manager.
14. **Never log secrets.** Mask PII, tokens, and passwords.
15. **Never bypass database constraints.** Relational integrity is mandatory.
16. **Never merge code without tests.** CI pipelines must pass.
17. **Never perform destructive migrations without a rollback strategy.** Expand/contract pattern required.
18. **Never call architecture "production-ready" without adversarial testing.** Prove it doesn't break.
19. **Never add AWS services without architectural justification.** Simple is better.
20. **Never introduce microservices without demonstrated need.** Modular monolith by default.

## 2. CODING & EXECUTION STANDARDS

- **TypeScript**: Strict mode enabled. No `any`. Use `unknown` and Zod validation.
- **Error Handling**: Use `CommandErrorCode` taxonomy. Never return raw SQL errors to the client.
- **Transactions**: State mutations and outbox events must execute within a single PostgreSQL transaction.
- **Testing**: Write unit tests for logic, integration tests for DB, adversarial tests for concurrency/idempotency.

## 3. ABSOLUTE STOP CONDITIONS

The engineer / AI **MUST STOP** execution and escalate for human approval if:
- A contradiction is discovered between frontend contracts and BACKEND_extras/historical/TRD.md.
- A tenancy or authorization invariant is ambiguous or mathematically unprovable.
- A database migration cannot safely be rolled back.
- External provider behavior (e.g., Payment Gateway, Shipping 3PL) is undocumented or unknown.
- Financial math rounds or truncates in an unpredictable way.

**If in doubt: ESCALATE, DO NOT GUESS.**
