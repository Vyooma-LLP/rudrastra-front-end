# BACKEND_extras/historical/PRD.md

**DOCUMENT AUTHORITY HIERARCHY**
1. **BACKEND_extras/historical/PRD.md** (Product requirements / business behavior) 
   ↓
2. **BACKEND_extras/historical/TRD.md** (Technical architecture / system invariants)
   ↓
3. **BACKEND_PLAN.md** (Implementation sequence / milestones)
   ↓
4. **BACKEND_INSTRUCTIONS.md** (Engineering execution rules)

*Authority Rule: PRD defines WHAT the product must do and WHY. It cannot casually override TRD architecture.*

---

## 1. Product Vision
Rudrastra is India's canonical Technical B2B Marketplace, Product Information System (PIM), and Engineering Discovery Engine for Drone Hardware. It is a highly structured technical catalog where commerce is a monetization layer on top of authoritative engineering data.

## 2. Problem Definition
The B2B drone component market lacks a centralized, technically rigorous catalog. Procurement teams currently rely on unstructured data, leading to compatibility errors, unreliable inventory claims, and inefficient RFQ-to-PO lifecycles.

## 3. Product Scope
A multi-tenant platform featuring:
- A canonical, immutable product catalog.
- Multi-seller inventory and pricing (offers).
- B2B procurement workflows (RFQ, Quotes, POs).
- Engineering workflows (BOM uploads, Compatibility checks).
- Granular capability-based access control.

## 4. Users
- **Engineers**: Search for components, verify compatibility, build BOMs.
- **Procurement Officers**: Request quotes, negotiate net terms, approve POs.
- **Sellers**: Manage inventory, fulfill orders, process returns.
- **Platform Operators**: Manage the capability registry, audit logs, and catalog taxonomy.

## 5. Organizations
- **MUST**: Users belong to organizations. Tenancy is strictly enforced.
- **MUST**: Organizations have commercial entitlements and credit limits.

## 6. Buyers
- **MUST**: Buyers operate within an organization's RBAC model.
- **MUST**: Buyers can initiate cart checkouts or RFQ workflows depending on cart size and organization rules.

## 7. Sellers
- **MUST**: Sellers manage independent SKUs mapped to canonical product variants.
- **MUST**: Sellers can only view and fulfill their own seller-orders.

## 8. Marketplace Behavior
- **MUST**: The marketplace aggregates seller offers against canonical products.
- **MUST**: Inventory availability is strictly enforced via real-time reservations.

## 9. Catalog Behavior
- **MUST**: The catalog is authoritative. Products and variants are globally unique.
- **MUST**: Specifications are strongly typed PIM data, not unstructured JSON.

## 10. Commerce Workflows
- **MUST**: Cart operations validate live inventory and seller constraints.
- **MUST**: Checkout processes split into multi-seller orders.

## 11. Checkout/Order Workflows
- **MUST**: Orders capture immutable snapshots of prices, taxes, and shipping at checkout time.
- **MUST**: Order state machines enforce strict transitions (Pending -> Paid -> Processing -> Shipped -> Delivered).

## 12. Procurement Workflows
- **MUST**: Organizations can issue Purchase Requests (PRs).
- **MUST**: PRs require organizational approval before becoming Purchase Orders (POs).

## 13. RFQ Workflows
- **MUST**: Buyers can request bulk quotes from sellers.
- **MUST**: Sellers can respond with binding quotes (price, MOQ, lead time).

## 14. Engineering Workflows
- **MUST**: Engineers can upload BOMs for automated parsing.
- **MUST**: System identifies missing or incompatible components.

## 15. BOM Workflows
- **MUST**: BOMs are parsed into structured line items mapped to the catalog.

## 16. Compatibility Workflows
- **MUST**: The system evaluates graph-based compatibility rules between components (e.g., ESC to Motor).

## 17. Seller Operations
- **MUST**: Sellers manage their fulfillment pipeline.
- **MUST**: Sellers can initiate partial shipments.

## 18. Shipping
- **MUST**: Shipping integrations (e.g., Shiprocket) process dispatch and tracking.
- **MUST**: Shipping costs are authoritatively calculated server-side.

## 19. File Processing
- **MUST**: All uploads (BOMs, CADs, PDFs) are quarantined and scanned for malware before business processing.

## 20. Authentication
- **MUST**: All actors authenticate via secure identity provider (e.g., Supabase Auth).

## 21. Authorization
- **MUST**: Server-side RBAC enforces user permissions within their organization.

## 22. Capabilities
- **MUST**: Platform features are gated by the Capability Registry.

## 23. Entitlements
- **MUST**: Organizations are granted entitlements that override base capabilities.

## 24. Financial Behavior
- **MUST**: The backend is absolutely authoritative for all financial math (prices, discounts, taxes, splits, payouts).
- **MUST**: Money is represented strictly as integer minor units (paise).

## 25. Notifications
- **MUST**: The system emits asynchronous events for email/SMS notifications.

## 26. Audit Requirements
- **MUST**: All privileged and financial mutations are logged immutably.

## 27. Control-Plane Behavior
- **MUST**: Platform operators can emergency-kill features or put the system in Safe Mode.

## 28. Operational Requirements
- **MUST**: System provides telemetry, metrics, and distributed tracing.

## 29. Security Requirements
- **MUST**: Strict tenant isolation. No IDOR vulnerabilities.
- **MUST**: Idempotency on all mutations.

## 30. Availability Requirements
- **MUST**: 99.9% uptime for core commerce APIs.

## 31. Performance Requirements
- **SHOULD**: API p95 latency < 200ms.

## 32. Data Integrity Requirements
- **MUST**: Relational integrity enforced via PostgreSQL foreign keys and constraints.

## 33. Disaster Recovery Expectations
- **MUST**: RPO < 5 minutes, RTO < 4 hours.

## 34. Compliance Considerations
- **MUST**: Compliance with local data localization and financial laws (e.g., GST).

## 35. Out-of-Scope Functionality
- Direct consumer (B2C) features.
- In-house logistics fleet management.

## 36. MVP
- Core catalog, cart, checkout, basic seller fulfillment, and capability control plane.

## 37. Future Scope
- Advanced AI compatibility engine, automated supplier negotiations.

## 38. Acceptance Criteria
- REQ-COMMERCE-001: The backend must recompute the authoritative checkout amount from server-side state. (Frontend total is ignored, backend calculates amount, amount is persisted, retries return same result).
