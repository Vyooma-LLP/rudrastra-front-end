# Rudrastra Infrastructure Canonicalization — Final Report

Date: 2026-09-23

## 1. Executive status

**INCOMPLETE.** Core canonicalization, security remediation, and a real (not fabricated) connectivity/security regression pass are done. Production deployment, CI/CD, and GitHub Environments are **not** done — each surfaced a real unknown about production infrastructure that needs your decision before proceeding.

## 2. Git state

- `origin` (`Vyooma-LLP/rudrastra-front-end`) confirmed by user as the canonical repo.
- `main` and `staging` both now at `19b17f7`, pushed to origin (fast-forwarded, no merge commit needed — `main` was a strict ancestor of `staging`).
- A second remote (`target` → `rudraastra-dev/rudraastra-mvp-1`, a different repo with divergent history) was found configured locally with a plaintext GitHub token in its URL. Removed the remote. **Token itself is not yet revoked — needs manual action, see Security section.**

## 3. Environment map

| Vercel project | Supabase project | Role |
|---|---|---|
| `rudrastra-ecomm` | `xurmlezgwfyxkrwhakxf` ("rudrastra-dev") | **Real Production** |
| `rudraastra-staging` | `tqolbhkqxsccsxsvhxgh` ("rudraastra-staging") | Staging/QA (synthetic data only, confirmed by user) |
| `nabhastra-demo-web` | none configured | Unused/dormant |

**`rudrastra-ecomm` (Production) has no Git repository connected** — confirmed via `vercel project inspect`, no Git section present. Deployments there are manual (CLI or dashboard), not driven by pushes to `origin/main`. This means pushing to `main` just now did **not** trigger a production deployment (confirmed: latest Production deployment is 40 days old).

## 4. Database state

**Staging** (`tqolbhkqxsccsxsvhxgh`):
- 24 public tables, 0 with RLS enabled — intentional per ADR-005, not drift.
- `get_user_role`, `is_ops_admin`, canonical `handle_new_user`, `on_auth_user_created` trigger — all present (applied this session, Phase D1).
- Storage: 5 canonical policies (4 on `product-media`, 1 read-only on legacy `products`). Previously-live broad "any authenticated user" policies removed.
- 0 objects in legacy bucket, 0 `product_media` rows referencing it.
- Currently **paused**.

**Production** (`xurmlezgwfyxkrwhakxf`):
- Read-only audit (via Management API, `read_only: true`, no credentials handled): same canonical functions/trigger/storage policies **already present** — Production was the source these were extracted from, never vulnerable.
- Also 0-of-24 tables with RLS — consistent with Staging, appears to be how Production has always run.
- **No formal migration bookkeeping reconciliation performed** (E6 not done — see Blockers).

## 5. Storage state

Both environments: `product-media` (public read, ADMIN/OPS-only write) and legacy `products` (public read only, zero write policies, zero objects) match canonical `0004`. Verified twice via disposable from-empty reconstruction (before and after a real bug fix in `0004`'s legacy-policy-name handling).

## 6. Security changes (all committed to `main`+`staging`)

- `224023c` — signed-upload architecture (`generateSignedUploadUrl` + `seller_offers`-based ownership check, `SignedUploadProvider`, `AssetUploaderBase` wiring)
- `be55c52` — fixed real storage-policy hole in `0004`, added ADR-005
- `8791c7c` — fixed raw DB/SQL error disclosure in 4 auth routes
- `b8caf4e` — **removed** an unauthenticated, path-traversal-vulnerable legacy upload route (`src/app/api/upload/route.ts`), confirmed dead/unreferenced
- `19b17f7` — same error-disclosure fix across 9 more files (admin/products, admin/quotes, orders, account/profile, cart, checkout, quotes) + regression test

Also found and fixed this session, independent of the plan: a real privilege-escalation bug in Staging's `handle_new_user` (no role clamping — fixed by applying canonical `0003`), and the legacy-policy-name bug in `0004` (real permissive policies weren't being dropped).

## 7. Tests

| Test | Result |
|---|---|
| `tsc --noEmit` | PASS |
| `npm run build` | PASS |
| `npm run lint` | **174 errors, 330 warnings** — pre-existing, not introduced this session, not fixed (out of scope) |
| `release-gate-privilege-escalation.spec.ts` | BLOCKED (Supavisor connectivity) |
| `release-gate-idor.spec.ts` | BLOCKED (Supavisor connectivity) |
| `release-gate-auth-consistency.spec.ts` | BLOCKED (Supavisor connectivity) |
| `release-gate-error-disclosure.spec.ts` | Written, NOT RUN (3 of 4 sub-tests are runnable without the bug's exact trigger condition; the one that reproduces the original bug is `test.skip()`'d, needs live Staging) |

## 8. E3 — Supavisor connectivity incident

Two independent resume attempts across this session hit `tenant/user ... not found` against Staging's pooler, including on the **second attempt using the exact canonical connection string fetched live from Supabase's Management API** (`GET /v1/projects/{ref}/config/database/pooler`) rather than a memorized one — ruling out connection-string-construction error as the cause. This matches Supabase's documented Supavisor routing-propagation behavior. Not retried repeatedly per explicit instruction.

**E3 = BLOCKED. Not a pass, not a fail.**

## 9. Production release

**Not performed.** No deployment triggered, no SHA deployed, no smoke tests run. See Blockers.

## 10. Rollback

Not yet established as a tested procedure — see Blockers (depends on resolving Production's deployment source first).

## 11. Known limitations / blockers (genuine, not softened)

1. **E3 blocked** — Staging Supavisor connectivity; not application-attributable, not resolved.
2. **Production has no Git integration** — the assumed "push to main → deploy" pipeline doesn't exist. Needs your decision on whether/how to connect it (E13 prerequisite).
3. **Exposed GitHub PAT not yet revoked** — action required at github.com/settings/tokens (I can't do this programmatically or via UI).
4. **`SUPABASE_SERVICE_ROLE_KEY` still missing** everywhere (local, all 3 Vercel projects) — signed-upload feature is unusable until set. Blocked earlier by the harness's `[Credential Materialization]` classifier when I tried to fetch the actual values; needs manual retrieval from the Supabase dashboard.
5. **E6 (Production migration bookkeeping reconciliation) not performed** — Production's actual state matches canonical, but no check was done on whether Drizzle's own migration-tracking table reflects `0003`/`0004` as applied there.
6. **E7 (backup/recovery verification) not performed.**
7. **E11/E12 (CI/CD, GitHub Environments) not started** — deliberately not begun given the above unknowns about production's actual deployment mechanism.
8. **174 pre-existing lint errors** — not fixed, out of scope this session.
9. GitHub flagged **15 Dependabot vulnerabilities** (4 critical, 6 high, 5 moderate) on push — not investigated this session.

## 12. Final architecture (current reality, not aspirational)

```
origin (Vyooma-LLP/rudrastra-front-end)
  main == staging @ 19b17f7 (pushed)
        |
        +-- rudraastra-staging (Vercel) -- deploy mechanism unconfirmed
        +-- rudrastra-ecomm (Vercel)     -- NO git integration; manual deploy only
```
