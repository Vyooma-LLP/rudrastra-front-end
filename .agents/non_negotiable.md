# NON-NEGOTIABLE SKILL DEPLOYMENT RULES
**Antigravity AI Agent Skill Control System**

This document defines the strict, non-negotiable deployment rules for the 19 critical AI skills within the Rudrastra project. Agents MUST consult this document to understand exactly **when** and **how** to invoke a skill, preventing overlaps, hallucinations, and unauthorized architectural deviations.

## The Skill Control Hierarchy
```text
                     DEVELOPER
                      │
                PRODUCT VISION (requirements)
                      │
                SUPER POWER (workflows/productivity)
                      │
          ┌───────────┴───────────┐
          │                       │
     ARCHITECTURE              PRODUCT
          │                       │
   architecture-review      requirements
          │
     ┌────┼────┬────┐
     │    │    │    │
    DB  CODE SECURITY PERFORMANCE
     │    │    │    │
 postgres Karpathy Strix   performance
            │
        CodeRabbit
            │
      ┌─────┴─────┐
      │           │
     UX          DATA
      │           │
 taste/impeccable markitdown
 ui-ux-pro       graphify
      │
      └─────┬─────┘
            │
          TESTING
            │
        Playwright
            │
        OBSERVABILITY
            │
          Sentry
```

## Tier 1: Mandatory Foundation (Highest Priority)

### 1. `architecture-review`
* **When to use**: Before any code is written for a major feature.
* **Role**: Attack the proposed architecture. Look for ways it will break.
* **Non-Negotiable Pipeline**: Requirements → Architecture → Failure Modes → Security → Data Consistency → Performance → Cost → Implementation → Tests.
* **Rule**: You don't want every agent saying "Looks good!". You want one agent whose job is "Here's how this will break."

### 2. `postgres` / `database-design`
* **When to use**: When modeling Products, Offers, SKUs, Inventory, Reservations, Orders, Payments, Settlement, Organizations, or Compatibility.
* **Role**: Enforce strict relational modeling, normalization, constraints, indexes, ACID transactions, row-level locking (concurrency), migrations, query plans, and Row-Level Security (RLS).

### 3. `webapp-testing` (Playwright)
* **When to use**: To write explicit behavioral validation (Unit, Integration, E2E, Regression, Payment, Authorization, Concurrency tests).
* **Role**: Prevent race conditions (e.g., User A + User B fighting for the last inventory item) and webhook duplication (e.g., processing two identical payment webhooks into one order).

### 4. Security Stack (`security-guidance`, `coderabbit`, `strix`)
* **When to use**: Following the strict pipeline: `Implementation` → `security-guidance` → `CodeRabbit` → `Strix` → `Playwright Tests` → `dependency audit`.
* **Role**: Explicitly hunt for authorization bugs (IDOR, RBAC/RLS bypass, seller data leakage, admin privilege escalation) which are far more dangerous in a marketplace than standard SQL injection.

### 5. `performance`
* **When to use**: When building the storefront, catalog, or loading heavy assets (CAD/datasheets/images).
* **Role**: Prevent "beautiful" from becoming "slow." Audit Core Web Vitals, image optimization, bundle size, hydration, RSC boundaries, CDN caching, and database/search latency.

### 6. `seo`
* **When to use**: When generating consumer-facing product pages, categories, and faceted navigation.
* **Role**: Own technical SEO, schema.org, canonical URLs, sitemaps, metadata, internal linking, and indexation to capture organic B2B hardware traffic.

---

## Tier 2: Very Valuable Constraints

### 7. `requirements` / `product`
* **When to use**: At the start of a task to ground the AI.
* **Role**: Enforce acceptance criteria, non-goals, dependencies, and Definition of Done. Prevents implementing 17 unnecessary features just because they were recently requested.

### 8. `observability`
* **When to use**: When building critical state transitions (payments, inventory, orders, shipping, payouts).
* **Role**: Enforce engineering discipline around logs, metrics, traces, request IDs, correlation IDs, business metrics, and audit logs. Sentry alone is not enough.

### 9. `accessibility`
* **When to use**: After UI development but before final polish.
* **Role**: Ensure WCAG compliance, keyboard navigation, screen readers, focus management, contrast, semantic HTML, and accessible dialogs/forms. Do not assume UI/UX skills cover this.

### 10. `dependency-management`
* **When to use**: Before installing any new npm package.
* **Role**: Prevent dependency bloat. Ask: Does it need to exist? Is it maintained? License? Bundle cost? Security history? Can native platform functionality replace it?

---

## Tier 3: Specialized Tools & UX Sequencing

### 11-13. The UX Sequence (`taste` → `ui-ux-pro` → `impeccable`)
* **When to use**: When building or overhauling UI components.
* **Strict Rule**: **Sequential, never competing.**
  1. `taste`: Establish the visual direction.
  2. `ui-ux-pro`: Build the interaction architecture.
  3. `impeccable`: Apply final visual polish.
* **Overlap Prevention**: Do not let three agents independently redesign the same UI simultaneously.

### 14. `graphify`
* **When to use**: For **domain modeling** and visualizing relationships (Motor ↔ ESC ↔ Battery).
* **Strict Rule**: Do NOT let graphify convince the AI that everything needs to become a graph database. PostgreSQL relational modeling is perfectly capable. Use graphify only for architectural thought, not deployment.

### 15. `obsidian brain`
* **When to use**: For context, reasoning, and accumulated knowledge.
* **Strict Rule**: Use as a **knowledge layer**, never as a substitute for source-of-truth systems. (Postgres = business truth, Git = code truth, Architecture docs = architectural decisions, Obsidian = reasoning/context).

### 16. `cave man`
* **When to use**: During architecture design and implementation to enforce simplicity and aggressively avoid overengineering.

### 17. `super power`
* **When to use**: To coordinate multi-agent workflows and maximize productivity.

### 18. `karpathy-guidelines`
* **When to use**: During actual code generation to enforce disciplined, clean coding practices.

### 19. `markitdown` & `humanizer`
* **When to use**: For extracting structured data from documents (`markitdown`) and ensuring human-quality copy in the UI (`humanizer`).

---

**CRITICAL DIRECTIVE**: Never use AI skills as a pile of independent agents. This document enforces an **engineering control system** where each skill has a specific responsibility and failure-detection role.
