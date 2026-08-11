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

# Phase 14: Security Hardening, Performance Optimization & SEO Audit
**Canonical Technical B2B Marketplace + Product Information System (PIM) + Engineering Discovery Engine**

---

## 1. Phase Objective

Phase 14 is NOT the first time security is implemented; security is continuous across Phases 2 through 13. Phase 14 performs the **Final Security Hardening & Adversarial Audit**, measurable Core Web Vitals optimization, and public-only SEO structured data validation.

---

## 2. Security Hardening Audit Matrix

| Threat Vector | Required Mitigation | Verification Command / Test |
| :--- | :--- | :--- |
| **IDOR / Tenant Data Leak** | Server Actions use Supabase JWT `auth.uid()`; PostgreSQL enforces RLS (`USING` + `WITH CHECK`). | Playwright RLS penetration test suite (`RLS-01` to `RLS-05`). |
| **Least-Privilege Worker Abuse** | Workers declare explicit capabilities from `WORKER_CAPABILITIES`; RBAC layer rejects unpermitted mutations. | Least-privilege capability penetration test. |
| **Webhook Forgery** | Razorpay (`x-razorpay-signature`) and Shiprocket webhooks verify HMAC-SHA256 signatures before processing. | Webhook test suite passing invalid HMAC header and asserting HTTP 401/403. |
| **Malicious Uploads** | Files uploaded to R2 are scanned; metadata requires `checksum_sha256` and `malware_scan_status = 'CLEAN'`. | Upload test asserting error on `.exe` or checksum-mismatched files. |
| **SQL / XSS Injection** | Drizzle ORM parameterized queries + Zod schema validation on all Server Action inputs. | Zod input boundary unit test suite. |

---

## 3. Measurable Core Web Vitals Performance Targets (Hardened Rule #33)

Rather than optimizing for a prescriptive vanity score, Vyooma targets measurable Core Web Vitals:
* **Largest Contentful Paint (LCP)**: `< 2.5 seconds` on 75th percentile mobile connections.
* **Interaction to Next Paint (INP)**: `< 200 milliseconds` on faceted search and spec table filters.
* **Cumulative Layout Shift (CLS)**: `< 0.1` across all catalog and checkout viewports.
* **Time to First Byte (TTFB)**: `< 300 milliseconds` via Cloudflare Edge CDN caching.
* **CAD Progressive Loading**: 100% of 3D CAD previews load lightweight `.glb` LOD streams; 0MB raw STEP payload on initial load.

---

## 4. Public-Only Technical SEO (`schema.org` JSON-LD)

```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "T-Motor MN4014 400KV",
  "image": ["https://assets.vyooma.com/products/mn4014-main.jpg"],
  "description": "High-efficiency brushless motor for long-range UAVs. KV: 400 RPM/V, Max Thrust: 3.2kg.",
  "sku": "MN4014-400KV",
  "mpn": "MN4014",
  "brand": {
    "@type": "Brand",
    "name": "T-Motor"
  },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "INR",
    "lowPrice": "8200.00",
    "highPrice": "8700.00",
    "offerCount": "3"
  }
}
```

### SEO Invariant (Hardened Rule #34)
* `AggregateOffer` and public JSON-LD structured data **must only reflect publicly purchasable offers**.
* Private, organization-specific, or negotiated B2B quotes and net terms pricing are strictly excluded from SEO structured data.

---

## 5. Acceptance Criteria / Definition of Done

* [x] Final adversarial security audit verifies RLS and least-privilege worker RBAC boundaries.
* [x] Core Web Vitals LCP, INP, CLS, and TTFB measurable budgets are enforced.
* [x] Public SEO JSON-LD structured data excludes private B2B negotiated pricing.
