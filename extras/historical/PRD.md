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

# RUDRASTRA — PRODUCT REQUIREMENTS DOCUMENT

## PRD v1.0 — FINAL / FROZEN

**Product:** Rudrastra
**Category:** Technical B2B/B2C E-Commerce Marketplace & Engineering Discovery Platform
**Primary Market:** Indigenous drone hardware and unmanned-system components
**Document Status:** **FROZEN — FINAL GO**

---

# 0. DOCUMENT AUTHORITY

This document defines the **canonical product requirements** for Rudrastra.

The PRD defines:

* What Rudrastra is
* Who uses it
* What users can do
* What marketplace capabilities must exist
* What buyer, seller, admin, support, finance and operations workflows must exist
* What guarantees the product must provide
* What operational capabilities are required to run the company reliably
* What failure conditions the product must prevent
* What must be observable, recoverable and auditable

The PRD does **not** define the final implementation architecture.

The TRD remains authoritative for:

* system architecture
* domain boundaries
* database schema
* infrastructure
* API contracts
* event architecture
* CQRS implementation
* queues/workers
* caching
* deployment architecture
* security implementation
* technology selection

### PRD → TRD Governance Rule

Any requirement introduced by this PRD that is not currently represented in the frozen TRD **must be reconciled into the next TRD revision before its implementation phase begins**.

No developer may silently invent architecture to satisfy a PRD requirement.

---

# 1. PRODUCT DEFINITION

## 1.1 What Rudrastra Is

**Rudrastra is India's technical marketplace and engineering discovery platform for indigenous drone hardware and unmanned-system components.**

It combines:

```text
Technical Catalog
        +
Engineering Discovery
        +
Verified Product Information
        +
Multi-Vendor Marketplace
        +
B2B Procurement
        +
Fulfillment
        +
Internal Operations
```

Rudrastra should feel like a modern premium e-commerce marketplace on the surface.

Underneath, it is a structured technical commerce system capable of representing:

* products
* manufacturers
* sellers
* offers
* specifications
* variants
* compatibility
* inventory
* orders
* payments
* shipments
* returns
* refunds
* procurement
* seller payouts
* customer support
* operational exceptions

### Core Product Promise

> **Find the right drone component, understand exactly what it is, determine whether it fits your system, compare alternatives, and procure it from a trusted Indian supply chain.**

---

# 2. PRODUCT POSITIONING

Rudrastra is **not**:

* a generic Amazon clone
* a drone manufacturer
* merely a product catalog
* merely a distributor
* an engineering consultancy
* an IT service-management platform
* an internal operations-management SaaS

Rudrastra **is**:

> A technical commerce platform where engineering-grade product information and marketplace infrastructure are combined.

The marketplace model remains primary.

Operations exists because **a serious marketplace requires serious operations**.

---

# 3. PRIMARY ACTORS

Rudrastra supports five major user groups.

## 3.1 Individual Buyers

Examples:

* hobbyists
* drone builders
* researchers
* students
* independent engineers

Capabilities:

* discover products
* compare specifications
* evaluate compatibility
* add to cart
* purchase
* track orders
* initiate returns
* contact support
* review products

---

## 3.2 B2B Buyers

Examples:

* drone startups
* OEMs
* robotics companies
* research organizations
* universities
* defense/aerospace suppliers
* industrial operators

Capabilities:

* organization accounts
* multiple members
* procurement workflows
* approval rules
* GSTIN
* purchase orders
* RFQs
* quotations
* bulk procurement
* credit terms where enabled
* order history
* invoices
* procurement records

---

## 3.3 Sellers

Sellers are independent businesses operating on the Rudrastra marketplace.

Seller capabilities include:

* seller onboarding
* KYC/business verification
* catalog association
* offer creation
* pricing
* inventory
* fulfillment
* shipment management
* returns
* customer communication
* payouts
* analytics
* seller support

---

## 3.4 Rudrastra Internal Teams

Internal users include:

* customer support
* seller support
* catalog operations
* procurement
* finance
* fulfillment operations
* marketplace operations
* product
* engineering
* security
* management

These users operate internal tools.

---

## 3.5 Platform Engineering / Operations

Engineering and platform operators maintain:

* production systems
* deployments
* workers
* integrations
* databases
* observability
* incidents
* configuration
* feature flags
* infrastructure

This is an **internal company capability**, not the core product.

---

# 4. CORE PRODUCT PLANES

Rudrastra consists of four conceptual planes.

```text
                         RUDRASTRA
                            │
       ┌────────────────────┼────────────────────┐
       ↓                    ↓                    ↓
 PRODUCT PLANE        COMMERCE PLANE       INTERNAL PLANES
       │                    │                    │
       │                    │             ┌──────┴──────┐
       │                    │             ↓             ↓
Customer Experience    Transactional     CONTROL     OPERATIONS
Marketplace            Commerce          & Security  & Work
```

## 4.1 PRODUCT PLANE

Everything customers and sellers directly experience.

Includes:

* storefront
* discovery
* search
* product pages
* comparison
* compatibility
* cart
* checkout
* buyer account
* B2B workspace
* seller portal
* customer support surfaces

---

## 4.2 COMMERCE PLANE

Everything responsible for marketplace transactions and physical commerce.

Includes:

* cart
* checkout
* orders
* seller orders
* inventory
* payments
* taxes
* invoices
* shipments
* returns
* refunds
* financial ledger
* seller payouts
* procurement

---

## 4.3 CONTROL PLANE

Controls access, governance and platform safety.

Includes:

* authentication
* authorization
* RBAC
* organization membership
* configuration
* feature flags
* audit logging
* security controls
* privileged actions

---

## 4.4 OPERATIONS PLANE

The internal machinery used to run Rudrastra as a company.

Includes:

* customer tickets
* seller tickets
* internal tasks
* operational exceptions
* engineering incidents
* problems
* change requests
* reconciliation queues
* SLA tracking
* runbooks
* operational dashboards
* service catalog
* deployment visibility
* incident response
* production diagnostics

### Critical Boundary

The Operations Plane **must not become a second product platform**.

Its purpose is:

> **Keep Rudrastra's marketplace operating reliably.**

---

# 5. PRODUCT INVARIANTS

All product development must preserve the following invariants.

## 5.1 Technical Correctness > Catalog Breadth

500 accurate components are more valuable than 50,000 unreliable listings.

---

## 5.2 Canonical Product Identity > Seller Listing Identity

Products exist canonically.

```text
Manufacturer
     ↓
Canonical Product
     ↓
Product Variant
     ↓
Seller Offer
```

Sellers attach offers to canonical products.

Sellers must not create isolated duplicate identities for the same physical product.

---

## 5.3 Manufacturer ≠ Seller

These are separate entities.

The UI must clearly distinguish:

* Manufactured by
* Sold by
* Fulfilled by
* Authorized Partner

---

## 5.4 Exact MPN Integrity

Exact MPN searches must never silently substitute another product.

If no exact result exists:

> **No exact match found**

Similar products must appear separately.

---

## 5.5 AI Extraction ≠ Verification

AI-generated specifications remain:

> **AI Extracted — Unverified**

until supported by authoritative evidence or human verification.

---

## 5.6 Verified Technical Claims Require Evidence

Technical claims must maintain evidence provenance.

Evidence levels may include:

* Manufacturer Claim
* Document Verified
* Specification Verified
* Rudrastra Tested
* Rudrastra Lab Verified

---

## 5.7 Product Revisions Remain Distinguishable

Material revisions must not be silently merged.

Examples:

* Rev A
* Rev B
* V1
* V2

---

## 5.8 Technical Suitability > Price

Price must not automatically dominate engineering suitability.

Ranking may consider:

```text
Technical Match
+
Authenticity
+
Seller Reliability
+
Availability
+
Price
```

---

## 5.9 Availability Is Explicit

Inventory states must communicate meaningful availability.

Examples:

* In Stock — Ships in 24h
* Low Stock
* Ships in 3 Days
* Lead Time — 14 Days
* Made to Order
* RFQ Required
* Out of Stock

Search availability is advisory.

Checkout availability is authoritative.

---

## 5.10 Multi-Seller Fulfillment Is Transparent

A cart containing products from multiple sellers must clearly show:

* seller
* warehouse where applicable
* shipping
* lead time
* taxes
* fulfillment
* tracking

---

## 5.11 Landed Cost Transparency

Before commitment, users should understand:

```text
Product Price
+
GST
+
Shipping
+
Handling
+
Other Applicable Charges
=
Total
```

---

## 5.12 Progressive Checkout

### Individual

```text
Address
   ↓
Payment
   ↓
Confirmation
```

### B2B

```text
Organization
   ↓
GSTIN
   ↓
PO / Procurement Details
   ↓
Approval
   ↓
Payment / Credit Terms
   ↓
Confirmation
```

---

## 5.13 Engineering Decisions Are Traceable

BOMs, compatibility decisions, comparisons and quotations must preserve the relevant technical state at the time of evaluation.

---

## 5.14 Marketplace Trust Is Evidence-Based

Seller trust should be represented through measurable dimensions such as:

* technical accuracy
* fulfillment performance
* response time
* DOA rate
* cancellation rate
* return rate

---

## 5.15 Operational Completeness

No production capability is considered complete until:

```text
Owner
+
Observability
+
Failure Handling
+
Support Path
+
Recovery Procedure
+
Auditability
```

are defined.

---

# 6. IDENTITY & WORKSPACES

Rudrastra uses one identity system.

```text
                    USER IDENTITY
                         │
                Organization Membership
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
       Personal       B2B Org         Seller
       Workspace      Workspace        Workspace
```

Role is not equivalent to account type.

A user may belong to multiple organizations and switch active workspaces.

Example:

```text
AeroTech Labs
Role: Procurement Manager

XYZ Robotics
Role: Seller Operations Manager

Personal
Role: Engineer
```

---

# 7. CUSTOMER EXPERIENCE

## 7.1 Public Storefront

Primary routes:

```text
/
 /components
 /product/*
 /search
 /compare
 /compatibility
 /solutions
```

Capabilities:

* technical discovery
* search
* filtering
* specification browsing
* product comparison
* compatibility evaluation
* seller comparison
* purchasing

---

# 8. PRODUCT INFORMATION SYSTEM

Every canonical product may contain:

* manufacturer
* MPN
* SKU references
* category
* variants
* revisions
* specifications
* documentation
* CAD files where applicable
* images
* compatibility
* evidence
* verification state

The catalog is the technical source of truth for product identity.

---

# 9. MARKETPLACE MODEL

```text
Manufacturer
      │
      ↓
Canonical Product
      │
      ├──────── Seller A Offer
      │
      ├──────── Seller B Offer
      │
      └──────── Seller C Offer
```

Seller offers contain marketplace-specific information:

* price
* stock
* lead time
* seller
* fulfillment
* shipping
* seller-specific warranty
* seller-specific terms

This prevents duplicate product identities.

---

# 10. SEARCH & ENGINEERING DISCOVERY

Search must support:

* exact MPN
* category
* manufacturer
* technical specifications
* compatibility
* availability
* seller
* price
* application

Exact MPN matching has priority over fuzzy matching.

Search results must distinguish:

```text
EXACT MATCH
───────────
Canonical Match

SIMILAR COMPONENTS
──────────────────
Related / Approximate Matches
```

---

# 11. COMPATIBILITY ENGINE

The compatibility system should support relationships such as:

```text
Motor ↔ ESC
Motor ↔ Propeller
ESC ↔ Flight Controller
Battery ↔ Power System
Radio ↔ Receiver
Component ↔ Frame
```

Compatibility results must distinguish:

* compatible
* conditionally compatible
* incompatible
* insufficient data

The system must never manufacture compatibility claims from missing information.

---

# 12. CART & CHECKOUT

Multi-seller carts must preserve seller boundaries.

```text
CART
│
├── Seller A
│   ├── Product 1
│   └── Product 2
│
└── Seller B
    └── Product 3
```

Checkout must handle:

* inventory reservation
* tax calculation
* shipping
* payment
* seller order splitting
* idempotency
* failure recovery

---

# 13. ORDERS & FULFILLMENT

A marketplace order may contain multiple seller orders.

```text
Customer Order
      │
      ├── Seller Order A
      │       └── Shipment A
      │
      └── Seller Order B
              └── Shipment B
```

Each seller must independently manage its fulfillment lifecycle.

Customer-facing status must aggregate these states intelligently.

---

# 14. RETURNS, REFUNDS & DISPUTES

Returns must support technical-commerce scenarios.

Examples:

* wrong component
* damaged component
* DOA
* counterfeit suspicion
* incorrect specification
* incompatible product
* seller fulfillment error

Technical disputes may require:

* photos
* electrical measurements
* test conditions
* flight information
* logs
* serial number
* evidence

Refunds must be idempotent.

---

# 15. B2B PROCUREMENT

B2B buyers may require:

* GSTIN
* organization profiles
* purchase orders
* approval workflows
* RFQs
* quotations
* bulk pricing
* invoices
* credit terms
* procurement history

---

# 16. SELLER OPERATING SYSTEM

The Seller Portal is a first-class product surface.

```text
SELLER
│
├── Dashboard
├── Products
├── Offers
├── Inventory
├── Orders
├── Shipments
├── Returns
├── Customers
├── Payouts
├── Analytics
└── Support
```

Seller support must be separate from internal engineering incidents.

---

# 17. INTERNAL COMPANY OPERATIONS

This is where the Operations Plane begins.

Rudrastra operates like a software-enabled marketplace company.

Therefore operational problems must not disappear into:

* Slack
* WhatsApp
* email
* someone's memory
* random spreadsheets
* undocumented conversations

They must become governed work.

---

# 18. WORK ITEM ENGINE

The internal system supports typed work items.

```text
CUSTOMER_TICKET
SELLER_TICKET
INTERNAL_TASK
INCIDENT
PROBLEM
CHANGE_REQUEST
FINANCIAL_EXCEPTION
CATALOG_EXCEPTION
SECURITY_EVENT
```

These are **internal operational objects**.

They are not equivalent to marketplace products or customer-facing commerce entities.

---

# 19. TICKETS

Tickets represent issues requiring human or automated operational handling.

Examples:

### Customer

> Payment succeeded but order isn't visible.

### Seller

> Inventory is not syncing.

### Finance

> Seller payout differs from expected amount.

### Catalog

> Product specification is incorrect.

### Internal

> Update GST configuration.

Every ticket should support:

* ID
* type
* requester
* owner
* team
* priority
* SLA
* status
* linked entities
* timeline
* comments
* attachments
* resolution
* audit history

---

# 20. TICKET LIFECYCLE

```text
NEW
 ↓
TRIAGED
 ↓
ASSIGNED
 ↓
IN_PROGRESS
 ↓
WAITING
 ↓
RESOLVED
 ↓
CLOSED
```

Waiting states must distinguish why work is blocked.

Examples:

* Waiting for Customer
* Waiting for Seller
* Waiting for Finance
* Waiting for Engineering
* Waiting for External Provider

---

# 21. INCIDENT MANAGEMENT

Incidents are for **system-level production impact**.

Example:

> Razorpay webhooks are failing globally.

Lifecycle:

```text
DETECTED
 ↓
ACKNOWLEDGED
 ↓
INVESTIGATING
 ↓
MITIGATING
 ↓
MONITORING
 ↓
RESOLVED
 ↓
POSTMORTEM
 ↓
CLOSED
```

Severity:

```text
SEV-1 — Critical
SEV-2 — Major
SEV-3 — Moderate
SEV-4 — Minor
```

### Critical distinction

A customer ticket is not automatically an incident.

A single failed order may remain a ticket.

A systemic payment failure may become an incident.

Multiple correlated customer tickets may be clustered under the incident.

---

# 22. PROBLEM MANAGEMENT

Problems exist to eliminate recurring causes.

Example:

```text
Incident
   ↓
Incident occurs repeatedly
   ↓
Problem created
   ↓
RCA
   ↓
Remediation
   ↓
Engineering Change
   ↓
Deployment
   ↓
Verification
   ↓
Problem Closed
```

A recurring incident must not be permanently "fixed" through manual support actions.

---

# 23. CHANGE MANAGEMENT

Production changes must be attributable.

Examples:

* database migrations
* payment configuration
* tax configuration
* feature rollout
* infrastructure changes
* catalog logic changes
* pricing engine changes

```text
Change Request
      ↓
Approval
      ↓
Deployment
      ↓
Observation
      ↓
Verification
```

Emergency changes may bypass normal approval but must generate retrospective audit records.

---

# 24. EXCEPTION CENTER

Business-system inconsistencies must never silently disappear.

Examples:

```text
Payment captured
        +
Order missing
```

```text
Order shipped
        +
Order state still processing
```

```text
Return received
        +
Inventory not restored
```

```text
Ledger payout
        +
Seller payout mismatch
```

These enter:

> `/ops/exceptions`

Exceptions may automatically create work items.

---

# 25. RECONCILIATION

Critical systems must periodically verify one another.

Examples:

```text
Payments ↔ Orders
Orders ↔ Inventory
Orders ↔ Shipments
Returns ↔ Inventory
Ledger ↔ Payouts
Catalog ↔ Search Index
```

A mismatch must produce:

```text
Mismatch
   ↓
Exception
   ↓
Owner
   ↓
Investigation
   ↓
Resolution
   ↓
Verification
```

---

# 26. SLA MANAGEMENT

Customer-facing and operational work must support:

* first response SLA
* resolution SLA
* escalation deadline

SLA timers must be state-aware.

For example, customer-waiting time may pause the resolution clock where policy permits.

SLA breaches must create escalation work.

---

# 27. UNIVERSAL ENTITY TRACEABILITY

Every operationally significant entity should be linkable.

Examples:

```text
Order
Payment
Refund
Shipment
Inventory Reservation
Seller
Product
Ticket
Incident
Deployment
Webhook
Invoice
Payout
Correlation ID
```

An operator should be able to move through relationships rather than manually searching separate systems.

---

# 28. UNIVERSAL TIMELINE

Every important entity should expose a chronological event history where applicable.

Example:

```text
ORDER ORD-18291

13:41 Cart created
13:41 Checkout initiated
13:41 Payment captured
13:41 Webhook received
13:41 Inventory reservation failed
13:42 Retry attempted
13:43 Ticket created
13:45 Operator action
13:45 Order confirmed
13:45 Customer notified
```

This provides operational truth.

---

# 29. GLOBAL OPERATIONAL SEARCH

`⌘K` inside `/ops` should support identifiers such as:

* Order ID
* Payment ID
* Shipment ID
* Ticket ID
* Incident ID
* Product MPN
* SKU
* Seller ID
* User ID
* Webhook ID
* Deployment ID
* Invoice ID
* Refund ID
* Correlation ID

Search should resolve entities and their relationships.

---

# 30. PRODUCTION OPERATIONS CONSOLE

`/ops` is the internal production and marketplace operations console.

It should provide a high-signal overview.

```text
┌───────────────────────────────────────────────────────┐
│ RUDRASTRA OPERATIONS                                  │
│ SYSTEM HEALTH: HEALTHY                                │
├───────────────────────────────────────────────────────┤
│ INCIDENTS                                             │
│ SEV-1  0 | SEV-2  0 | SEV-3  2 | SEV-4  4             │
├───────────────────────────────────────────────────────┤
│ WORK                                                   │
│ Tickets 12 | Tasks 8 | Exceptions 2 | Problems 1      │
├───────────────────────────────────────────────────────┤
│ COMMERCE                                               │
│ Payment Exceptions 0                                  │
│ Inventory Exceptions 1                                │
│ Payout Exceptions 0                                   │
├───────────────────────────────────────────────────────┤
│ PLATFORM                                               │
│ Database ● | Payments ● | Search ● | Workers ●        │
├───────────────────────────────────────────────────────┤
│ [Search] [Incidents] [Tickets] [Exceptions] [Deploy]  │
└───────────────────────────────────────────────────────┘
```

The dashboard should prioritize **actionable problems**, not vanity metrics.

---

# 31. SERVICE CATALOG

Every critical production subsystem must have an internal service record containing:

* service name
* business owner
* technical owner
* criticality
* code location
* database dependencies
* external dependencies
* metrics
* alerts
* runbook
* rollback mechanism
* feature flags
* known failure modes

Example:

```text
Checkout & Inventory Reservation

Business Owner: Commerce
Technical Owner: Checkout Engineering
Criticality: SEV-1

Code:
src/modules/checkout/

Dependencies:
Razorpay
Shiprocket
Database

Runbook:
checkout-failure.md

Rollback:
checkout_v2 feature flag
```

---

# 32. RUNBOOKS & KNOWLEDGE

Recurring operational knowledge must become durable organizational knowledge.

Examples:

* payment webhook failure
* inventory reservation conflict
* seller payout mismatch
* search indexing failure
* refund reconciliation
* database migration rollback

Knowledge may be represented as:

* runbooks
* playbooks
* known issues
* support macros
* troubleshooting guides

---

# 33. DIAGNOSTIC / "EXPLAIN THIS"

For complex failures, operators should be able to inspect:

```text
WHAT HAPPENED?
WHY DID IT HAPPEN?
WHAT SYSTEM CAUSED IT?
WHAT ENTITIES WERE AFFECTED?
WHAT CAN I SAFELY DO?
WHAT WILL HAPPEN IF I DO IT?
```

Example:

```text
ORDER #18291

Current State:
PAYMENT_CONFIRMED

Expected:
ORDER_CONFIRMED

Blocking Condition:
Inventory reservation failed

Related:
Payment
Webhook
Reservation
Seller Inventory
Ticket

Recommended:
Retry reservation
OR
Initiate refund
OR
Escalate
```

Actions must respect RBAC and audit requirements.

---

# 34. OPERATIONAL RBAC

Operational access is action-based.

Roles may include:

```text
OPS-L1
OPS-L2
OPS-L3
OPS-ADMIN
FINANCE
SECURITY
ENGINEERING
```

Permissions should be granular.

Examples:

```text
view_order
view_customer_pii
issue_refund
override_inventory
release_payout
replay_webhook
toggle_feature_flag
execute_migration
enter_safe_mode
```

Viewing data and modifying state are separate permissions.

---

# 35. PRIVILEGED ACTIONS

Dangerous actions require:

* explicit confirmation
* impact visibility
* audit record
* actor identity
* timestamp
* reason
* linked work item

High-risk operations may require dual authorization.

---

# 36. OPERATIONAL READINESS GATE

A new production capability must not be considered complete until:

```text
[ ] Owner assigned
[ ] Service registered
[ ] Metrics defined
[ ] Alerts defined
[ ] Dashboard available
[ ] Runbook written
[ ] Failure modes documented
[ ] Recovery defined
[ ] Rollback tested
[ ] Permissions defined
[ ] Audit events implemented
[ ] Customer failure messages defined
[ ] Support procedure defined
[ ] Reconciliation defined where applicable
[ ] SLA/SLO defined
[ ] Load tested
[ ] Failure tested
[ ] Security reviewed
```

This is a **release governance mechanism**, not a user-facing product feature.

---

# 37. OBSERVABILITY

Production systems must expose enough information to diagnose failures.

Core dimensions:

* logs
* metrics
* traces
* correlation IDs
* deployment history
* worker health
* queue depth
* external dependency health

Critical operations must be traceable across system boundaries.

---

# 38. FEATURE FLAGS & SAFE DEPLOYMENT

High-risk features must support:

```text
Deploy Code
    ↓
Feature OFF
    ↓
Internal
    ↓
10%
    ↓
50%
    ↓
100%
```

If failure occurs:

```text
Detection
   ↓
Kill Switch
   ↓
Fallback
   ↓
Investigation
```

Deployment and activation must remain separable.

---

# 39. SAFE MODE

If a critical external dependency fails, Rudrastra should degrade gracefully.

Example:

```text
PAYMENT PROVIDER OUTAGE

Still Available:
✓ Browse
✓ Search
✓ Product pages
✓ Comparison
✓ Compatibility
✓ Documentation
✓ RFQ

Temporarily Restricted:
✗ Payment
✗ Checkout confirmation
```

The marketplace should preserve as much functionality as possible rather than collapsing completely.

---

# 40. FAILURE PREVENTION FRAMEWORK & FAILURE CONTROL SPEC

Rudrastra's failure prevention strategy is governed by the authoritative **[Rudrastra Failure Control Specification v1.0](file:///Users/praneeth/Downloads/antigravity/rudhastra%20ecomm/docs/operations/failure_control_spec.md)**.

### The 14 Non-Negotiable System Invariants

1. **`AUTH_INV` (Authorization)**: No request may perform unauthorized actions—even if UI permits.
2. **`CAT_INV` (Canonical Catalog)**: ONE physical component $\rightarrow$ ONE canonical identity (`catalog_products`).
3. **`SRCH_INV` (Search Integrity)**: Search may be incomplete, but must NEVER be confidently wrong.
4. **`INV_INV` (Inventory Concurrency)**: Reserved stock $\le$ available stock (`Sellable = On-Hand - Reserved`).
5. **`CHK_INV` (Checkout Idempotency)**: State machines + idempotency + reconciliation, not HTTP status.
6. **`PAY_INV` (Payment Reconciliation)**: Captured payments MUST reconcile to orders or refunds.
7. **`LEDG_INV` (Ledger Integrity)**: Double-entry accounting guarantees $\sum(\text{Debits}) == \sum(\text{Credits})$.
8. **`REF_INV` (Refund Limits)**: Refunded amount $\le$ captured payment amount.
9. **`SLR_INV` (Seller Payout Limits)**: Released seller payouts $\le$ seller-eligible net balance.
10. **`MKT_INV` (Multi-Seller Isolation)**: Parent order is an aggregation of independent seller orders.
11. **`AUD_INV` (Privileged Audit)**: Every privileged mutation generates an immutable audit record.
12. **`OPS_INV` (Operational Visibility)**: Unresolved exceptions are visible; incidents have explicit owners.
13. **`DIST_INV` (Distributed Recovery)**: Every asynchronous side effect is idempotently recoverable.
14. **`HUM_INV` (Human Mistake Defense)**: Dangerous operations require dual/four-person authorization.

### 18 Failure Domains (Exhaustive 100-Item Registry)

The full 100-item control matrix (`AUTH-001` to `HUM-006`) is maintained in **[docs/operations/failure_control_spec.md](file:///Users/praneeth/Downloads/antigravity/rudhastra%20ecomm/docs/operations/failure_control_spec.md)** covering:

```text
1. Identity & Authorization (AUTH-001 to AUTH-006)
2. Catalog & Product Identity (CAT-001 to CAT-008)
3. Search & Engineering Discovery (SRCH-001 to SRCH-005)
4. Inventory & Stock Concurrency (INV-001 to INV-007)
5. Cart (CART-001 to CART-004)
6. Checkout & State Machines (CHK-001 to CHK-006)
7. Payments & Webhooks (PAY-001 to PAY-007)
8. Orders & State Transitions (ORD-001 to ORD-005)
9. Multi-Seller Commerce (MKT-001 to MKT-006)
10. Financial Ledger & Payouts (LEDG-001 to LEDG-006)
11. Seller Operations & Risk (SLR-001 to SLR-006)
12. Logistics & Fulfillment (LOG-001 to LOG-005)
13. Technical Returns & Disputes (RET-001 to RET-006)
14. B2B Procurement & Credit (B2B-001 to B2B-005)
15. Internal Work & SLA Operations (OPS-001 to OPS-006)
16. Distributed Systems & Workers (DIST-001 to DIST-006)
17. Security & Abuse (SEC-001 to SEC-005)
18. Human & Operator Mistakes (HUM-001 to HUM-006)
```

Every control item enforces explicit **Prevention, Detection, Recovery, Owner, Runbook, Audit, RCA, and Adversarial Test Scenarios**.

---

# 41. OPERATIONAL GOVERNANCE PRINCIPLE

Rudrastra follows:

> **Detect → classify → assign → diagnose → mitigate → resolve → verify → document → prevent recurrence.**

For engineering incidents:

> **Detect → investigate → mitigate → recover → reconcile → postmortem → prevent recurrence.**

For customer issues:

> **Receive → triage → resolve → verify → close → learn.**

For recurring failures:

> **Incident → Problem → RCA → Engineering Change → Deployment → Verification.**

---

# 42. CRITICAL DOMAIN BOUNDARIES

These distinctions are mandatory.

| Situation                        | Object                       |
| -------------------------------- | ---------------------------- |
| Customer has an issue            | Customer Ticket              |
| Seller has an issue              | Seller Ticket                |
| Employee needs work done         | Internal Task                |
| Production system is degraded    | Incident                     |
| Recurring systemic cause exists  | Problem                      |
| Production modification required | Change Request               |
| Payment/order state mismatch     | Financial/Commerce Exception |
| Catalog inconsistency            | Catalog Exception            |
| Security threat                  | Security Event               |

A ticket, incident, task and problem are **not interchangeable**.

---

# 43. ROADMAP

## MVP

### Marketplace

* Public storefront
* Technical catalog
* Product pages
* Search
* Canonical products
* Product variants
* Seller offers
* Inventory
* Cart
* Checkout
* Payments
* Orders
* Basic shipment tracking
* Returns
* Buyer account
* Seller portal
* Admin

### B2B

* Organization accounts
* GSTIN
* PO checkout
* Basic procurement

### Operations

* Basic customer tickets
* Basic seller tickets
* Basic internal tasks
* Basic incidents
* `/ops`
* Audit logs
* Basic exception visibility
* Basic service ownership
* Basic operational dashboards

---

# 44. V1

* Compatibility engine
* Comparison engine
* RFQ
* Quotation generation
* Advanced B2B procurement
* Multi-member organizations
* Approval workflows
* Technical dispute engine
* Exception Center
* Reconciliation Center
* Universal Entity Timeline
* Global operational search
* Explain This
* Service Catalog
* Knowledge Base
* SLA engine
* Advanced incident management
* Problem management
* Change management

---

# 45. V2

* Mission-to-BOM recommendation engine
* Probabilistic compatibility/recommendation
* CAD preview
* Automated supplier forecasting
* Advanced procurement analytics
* Net-30 credit infrastructure
* Automated reconciliation
* Advanced operational automation
* Predictive failure detection
* Intelligent support triage

---

# 46. PRD → TRD RECONCILIATION REQUIREMENTS

The current PRD introduces operational requirements that must be reconciled into the next TRD revision.

At minimum, the TRD must explicitly determine architecture for:

```text
Work Item model
Ticket model
Incident model
Problem model
Change model
Exception model
SLA model
Assignment model
Operational audit model
Entity relationship model
Operational timeline
Correlation model
Incident clustering
Reconciliation engine
Runbook metadata
Service catalog metadata
Operational RBAC
```

The PRD does **not** prescribe whether these become:

* separate database tables
* a generic work-item abstraction
* domain-specific modules
* event-driven projections
* CQRS read models
* another architecture

That is a TRD decision.

---

# 47. PRD → TRD TRACEABILITY

| Requirement           | Plane               | Domain               | TRD Status                                         |
| --------------------- | ------------------- | -------------------- | -------------------------------------------------- |
| Exact MPN             | Product             | Search/Catalog       | Existing                                           |
| Canonical Product     | Product             | Catalog/PIM          | Existing                                           |
| Seller Offers         | Commerce            | Marketplace          | Existing                                           |
| Multi-Seller Cart     | Commerce            | Cart/Orders          | Existing                                           |
| Inventory Reservation | Commerce            | Inventory            | Existing                                           |
| Payments              | Commerce            | Payments             | Existing                                           |
| Production Health     | Operations          | Observability        | Requires reconciliation if absent                  |
| Customer Tickets      | Operations          | Work Management      | Requires TRD addition                              |
| Seller Tickets        | Operations          | Work Management      | Requires TRD addition                              |
| Incidents             | Operations          | Incident Management  | Requires TRD addition                              |
| Problems              | Operations          | Problem Management   | Requires TRD addition                              |
| Change Records        | Operations          | Change Management    | Requires TRD addition                              |
| Exceptions            | Operations          | Exception Management | Requires TRD addition                              |
| SLA Engine            | Operations          | SLA                  | Requires TRD addition                              |
| Universal Timeline    | Operations          | Operational Events   | Requires TRD addition                              |
| Explain This          | Operations          | Diagnostics          | Requires TRD addition                              |
| Reconciliation        | Operations/Commerce | Reconciliation       | Requires TRD addition                              |
| Service Catalog       | Operations          | Platform Metadata    | Requires documentation/architecture reconciliation |
| Operational RBAC      | Control             | Authorization        | Existing/extend as required                        |

---

# 48. ADVERSARIAL ACCEPTANCE STANDARD

Every critical workflow must be tested against:

```text
1. Happy Path
2. Wrong Input
3. Missing Data
4. Stale Data
5. Concurrent Operation
6. Seller Failure
7. Payment Failure
8. Network Failure
9. Mobile UX
10. Permission Violation
```

Examples include:

### Search

Exact MPN must never silently become a similar MPN.

### Checkout

Network failure must not produce duplicate payment/order state.

### Inventory

Five simultaneous buyers competing for one item must result in exactly one successful reservation.

### Payment

Payment captured + order failure must create a recoverable exception.

### Ticket

A customer issue must never disappear because no employee manually created a ticket.

### Incident

A systemic failure generating hundreds of customer tickets must be clustered under an appropriate incident.

### Refund

External refund success + internal failure must enter reconciliation rather than silently remaining inconsistent.

### Operator Action

A privileged action must be permission-checked, confirmed and audited.

---

# 49. PRODUCT COMPLETENESS DEFINITION

A Rudrastra feature is not complete merely because its UI works.

A feature is complete when:

```text
USER EXPERIENCE
      +
BUSINESS LOGIC
      +
DATA INTEGRITY
      +
SECURITY
      +
OBSERVABILITY
      +
FAILURE HANDLING
      +
SUPPORTABILITY
      +
RECOVERY
      +
AUDITABILITY
```

are all addressed at the appropriate level for that feature.

---

# 50. FINAL ARCHITECTURAL PRINCIPLE

Rudrastra should be thought of as:

```text
                  RUDRASTRA
                      │
        ┌─────────────┴─────────────┐
        │                           │
   MARKETPLACE                  COMPANY
   PRODUCT                      OPERATIONS
        │                           │
Customer/Seller                 Support
Experience                      Finance
        │                       Catalog Ops
Commerce                        Fulfillment
        │                       Engineering
        │                       Security
        └─────────────┬─────────────┘
                      │
               SHARED PLATFORM
                      │
          Identity / Data / Events /
       Observability / Audit / Security
```

The **marketplace is the business**.

The **operations system is how the business is run**.

The **control plane is how the platform is governed**.

The three must interact, but they must not be conceptually conflated.

---

# 51. FINAL GOVERNING PRINCIPLES

### Product

> **Technical correctness beats catalog breadth.**

### Marketplace

> **Canonical products beat seller-created duplicates.**

### Commerce

> **Every transaction must have an authoritative state.**

### Operations

> **Every important operational problem must have an owner, state, history and resolution path.**

### Engineering

> **Recurring incidents become problems, not permanent manual work.**

### Reliability

> **Recovery is incomplete until business state is verified.**

### Security

> **Access is granted by capability, not by job title alone.**

### Architecture

> **The PRD defines what must exist; the TRD defines how it exists.**

### Organizational Memory

> **If solving a problem requires knowing the one person who remembers how it works, the system is incomplete.**

---

# 52. FINAL STATUS

**Rudrastra PRD v1.0 is FROZEN — FINAL GO.**

No further product-scope additions should be casually appended to this document.

Future changes should follow:

```text
Requirement Change
       ↓
Impact Analysis
       ↓
PRD Revision
       ↓
TRD Reconciliation
       ↓
Architecture Review
       ↓
Implementation Plan
       ↓
Engineering
       ↓
Adversarial Validation
       ↓
Operational Readiness
       ↓
Release
```

This prevents the system from repeatedly drifting between PRD, TRD and implementation.

**The next authoritative artifact to change is the TRD—not the PRD—where the newly introduced Operations & Work Management requirements must be translated into actual domain boundaries, schemas, events, state machines, APIs, permissions and infrastructure.**
