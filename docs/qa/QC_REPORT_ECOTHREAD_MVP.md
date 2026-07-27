# QC Report EcoThread MVP

## Release Decision

**NO-GO**

Multiple explicit NO-GO trigger conditions are confirmed simultaneously: SHA-256 password hashing (not bcrypt/Argon2), SQLite in use instead of PostgreSQL, a critical cross-role/ownership access-control bypass on order detail data, and — most severe — all three core frontend applications (Admin, Mitra, User) have **zero backend API integration**, meaning the entire UI-driven vertical slice is currently unusable/undemoable as a real product.

## Executive Summary

This audit independently re-verified the EcoThread MVP against 15 release criteria using source code review, live API testing (curl/HTTP), and live browser rendering — not by trusting prior agent reports or existing test-suite output.

The backend API (`apps/api`) is functionally the most mature part of the system: RBAC role checks, state-machine transition validation, payout/DPP idempotency, and audit logging are all implemented and confirmed working at the HTTP level. However, this is undermined by a critical authorization gap on the single-order detail route, and by using SHA-256 for password hashing with JWTs that never expire.

The far larger problem is architectural: **none of the three frontend apps (`apps/admin`, `apps/mitra`, `apps/user`) call the real API at all.** Every screen renders hardcoded mock `useState` arrays with fictional data (e.g. `ORD-001`, `ECO-0089`) that don't even match real seeded records (`ORD-2026-0001`). Every "core action" button (create eco-kit, approve QC, mint DPP, mark payout paid) is an `alert()` popup that mutates local state only. Photo "upload" is a fake `simulatePhotoUpload()` that pushes a `{id, name}` object with no real file. No login screen exists in any app. This means QC-02 through QC-10 — the entire UI-driven vertical slice — cannot be executed as a real user would, no matter how correct the backend is underneath.

Given this, the product cannot be demoed or submitted as a working system today. Release is blocked pending P0 remediation.

## Environment

- Branch: `feature/ecothread-mvp-final`
- Commit: `ecd613704cd4bb76a69a754f36127bb98cb162ae`
- OS: Windows 11
- Node: v22.17.0
- pnpm: 10.33.2
- Database: SQLite (`file:./dev.db`) — **NOT PostgreSQL**, despite Supabase being the intended architecture
- API URL: `http://localhost:4000` (local dev only — no staging deployment exists)
- Admin URL: `http://localhost:5173` (local dev only)
- Mitra URL: `http://localhost:5174` (local dev only)
- User URL: `http://localhost:5175` (local dev only)

## QC Matrix

| No | Kriteria | Status | Evidence | Severity | Action |
|----|----------|--------|----------|----------|--------|
| QC-01 | All apps run concurrently, no crash | PASS | API :4000, Admin :5173, Mitra :5174, User :5175 all confirmed HTTP 200 running simultaneously this session | - | - |
| QC-02 | All 3 frontends tested in real browser | FAIL | Browser screenshot of Admin confirms visual render only; source confirms 0 `fetch/axios/api-client` calls in any of the 3 apps | Critical | P0 |
| QC-03 | Login (3 demo accounts), logout, session persist, role rejection | FAIL | No login screen/component found in any app (`apps/admin`, `apps/mitra`, `apps/user` — regex search for login UI = 0 matches). Server-side role rejection PASS at API level (403/401 confirmed) but untestable via UI | Critical | P0 |
| QC-04 | Admin creates order via UI form | FAIL | "Order Produksi baru berhasil diteruskan..." is an `alert()` only; no API call made | Critical | P0 |
| QC-05 | Order visible to correct mitra only, persists on refresh | BLOCKED (UI) / PARTIAL (API) | UI: untestable, no backend wiring. API: `GET /api/v1/mitra/production-orders` list route correctly filters by `mitraUserId` (verified live) | High | P0 |
| QC-06 | Mitra submits QC evidence via UI, real file upload | FAIL | `simulatePhotoUpload()` in `apps/mitra/src/App.jsx` pushes fake `{id, name}` object, no `<input type="file">` handling, no upload call. Backend schema also only accepts `z.string().url()`, no multipart middleware registered | Critical | P0 |
| QC-07 | Admin approves QC via UI, checklist required, payout created, audit logged | FAIL (UI) / PASS (API) | UI: QC decision buttons are `alert()`-only. API: payout creation idempotency confirmed PASS, audit log confirmed written | Critical | P0 |
| QC-08 | QR/DPP scannable, no fake blockchain badges | FAIL | DPP QR hardcoded to `http://localhost:5175/dpp/${productCode}` (broken outside localhost); Admin dashboard shows fake "MINTING BERHASIL... jaringan Polygon" alert — simulated blockchain, not real | Critical | P0 |
| QC-09 | User creates pre-order via UI, uploads payment proof, admin verifies | FAIL | `apps/user/src/App.jsx` is a static 181-line presentational demo, zero backend integration, no real preorder flow | Critical | P0 |
| QC-10 | Persistence across refresh/relogin/restart; frontend not source of truth | FAIL | Frontend state is pure disconnected mock data (violates "frontend not source of truth" — there is no truth flowing to/from frontend at all). Backend persistence itself is fine at API level | Critical | P0 |
| QC-11 | PostgreSQL actually used in runtime | FAIL | `prisma/schema.prisma` line: `provider = "sqlite"`; live DB is `dev.db` SQLite file; Supabase credentials in `.env` are placeholders | Critical | P0 |
| QC-12 | Password NOT SHA-256 | FAIL | `apps/api/src/index.ts` and `prisma/seed.ts` both use `crypto.createHash('sha256')` for password hashing; JWT issued has no `exp` claim (never expires) | Critical | P0 |
| QC-13 | .env/secrets safety, no git leak | PASS | `.env` is gitignored (`.gitignore` confirmed); `git log --all --diff-filter=A -- .env` = empty (never committed); grep for `SERVICE_ROLE\|PRIVATE_KEY\|BEGIN PRIVATE KEY` found only placeholders/docs | - | - |
| QC-14 | Staging actually deployed with public URLs | FAIL | `DEPLOYMENT.md` lines 68-93 contain only generic Render/Railway/Vercel suggestions and a Dockerfile template — no real deployed URL exists anywhere in repo or docs | Critical | P0 |
| QC-15 | Whether new demo recording is justified | FAIL | Given QC-02–QC-10 failures, a demo recording would necessarily misrepresent the product as functional when it is not; not justified until P0 items are fixed | High | P0 |

## Detailed Findings

### F1. Frontend apps have zero backend integration (Critical)
Regex search across `apps/admin/src`, `apps/mitra/src`, `apps/user/src` for `fetch(`, `axios`, `api-client`, `EcoThreadApiClient`, `localhost:4000` → **0 results** in all three. Each `package.json` declares `@ecothread/api-client` as a dependency, but it is never imported. The only consumer of `packages/api-client` in the entire repo is `apps/api/test/*.test.ts`.

- `apps/admin/src/ecothread_dashboard.jsx`: all data (`analyticsData`, `inventoryData`, `mitraData`, `ordersData`, `qcData`, `blockchainData`) is hardcoded via `useState([...])`. Order IDs like `ORD-001` do not match real seeded format `ORD-2026-0001`.
- `apps/mitra/src/App.jsx`: mock `orders` array (`ECO-0089`, etc.), also mismatched with real DB.
- `apps/user/src/App.jsx`: static hardcoded product "Jaket Denim Upcycle", decorative "Blockchain Verified" badge with no real check.

### F2. Core action buttons are `alert()`-only, no real mutation reaches backend (Critical)
15+ confirmed instances in `apps/admin/src/ecothread_dashboard.jsx`, e.g.:
```
"Order Produksi baru berhasil diteruskan..."
"✅ MINTING BERHASIL!\nSertifikat Digital Product Passport (DPP) ke jaringan Polygon berhasil di-mint..."
```
These are JavaScript `alert()` calls followed by local React state mutation only — no HTTP request is made. The "blockchain minting" is entirely fabricated theater.

### F3. Fake photo upload in Mitra app (Critical)
`apps/mitra/src/App.jsx`, `simulatePhotoUpload()`:
```js
const newPhoto = { id: Date.now(), name: `Foto ${uploadedPhotos.length + 1}` };
setUploadedPhotos([...uploadedPhotos, newPhoto]);
```
No `<input type="file">`, no `FormData`, no upload request. `submitForQC()` only checks `uploadedPhotos.length < 2` client-side. Backend `SubmitQcEvidenceSchema` (`packages/contracts/src/index.ts`) also only accepts `z.string().url()` — no multipart upload middleware exists in `apps/api/src/index.ts` either. Real photo evidence upload is impossible end-to-end today.

### F4. No login UI in any frontend (Critical)
Exhaustive regex search (`login|LoginPage|signin|Sign In|Masuk`) across all three apps' `src/` directories returned no real login form/screen. `apps/admin/src/main.jsx`, `apps/mitra/src/main.jsx`, `apps/user/src/main.jsx` all directly render their root component with no auth wrapper.

### F5. Critical cross-role authorization bypass (Critical, live-verified)
`GET /api/v1/mitra/production-orders/:id` (single order detail route) has **no ownership or role-matching check**, unlike the list route which does correctly filter (`mitraUserId = request.user.role === Role.mitra ? request.user.id : undefined`).

Live test performed this session:
```
GET http://localhost:4000/api/v1/mitra/production-orders/6c3b1963-e3bb-4b1b-b358-9aa60c0c7cfc
Authorization: Bearer <user-role JWT, NOT mitra, NOT owner>
→ HTTP 200
```
Response included full order detail: `orderCode`, `mitraUserId`, `agreedPayoutRate: 175000`, `productionEvidence` (QC photo URLs), `qcReviews` (reviewer notes), `payouts` (`amount: 175000`, `paymentReference: "PAY-BCA-20260727-009"`). A `user`-role account (not even `mitra` role) retrieved another party's confidential production/payout data. This is an explicit NO-GO trigger ("Mitra bisa membaca order milik Mitra lain") and is in fact broader than that — any authenticated role can read any order's detail.

### F6. Password hashing uses SHA-256, JWT never expires (Critical)
`apps/api/src/index.ts` and `prisma/seed.ts`: `crypto.createHash('sha256').update(password).digest('hex')`. No bcrypt/Argon2/Supabase Auth. Decoded live JWT payload confirmed no `exp` claim — tokens are valid indefinitely once issued.

### F7. SQLite in use, not PostgreSQL (Critical)
`prisma/schema.prisma`: `datasource db { provider = "sqlite" ... }`. Live `prisma/dev.db` file confirmed as the active database. `.env` contains only placeholder Supabase credentials, never actually configured.

### F8. No real staging deployment (Critical)
`DEPLOYMENT.md` lines 68-93 contain only generic instructions ("You could deploy to Render/Railway/Vercel...") and an example Dockerfile — no actual deployed URL, no evidence a staging environment has ever existed.

### F9. Hardcoded/static data undermining product claims (High)
- Admin "create product" always sets `co2SavedKg: 12.4, waterSavedLiters: 2450.0` regardless of actual product — fake impact metrics.
- DPP QR code hardcoded to `http://localhost:5175/dpp/${productCode}` — non-functional outside developer's own machine.

### F10. Payment self-verification (Medium)
Customer's own payment-proof submission endpoint sets `isVerified: true` immediately with no separate admin-approval step found in `apps/api/src/index.ts` — a customer can self-verify their own payment.

### F11. DEMO.md references nonexistent account (Low)
`DEMO.md` documents a `mitra2@ecothread.local` account for cross-mitra isolation testing; this account does not exist in `prisma/seed.ts`. The documented test step has likely never actually been performed.

### F12. Build fails at root (Medium)
`pnpm build` at repo root fails: `apps/explainer` is missing the `framer-motion` dependency. Admin/Mitra/User/api/contracts/api-client build individually without issue.

### F13. Orphan/dead scripts in apps/admin (Low)
23 stray `.js`/`.py` files at `apps/admin/` root (not in `src/`, not wired into Vite build): `fix*.js`, `patch*.js`, `inject.js`, `run.js`, `fix*.py`, `do_replace.py`, etc. One file, `eco2.js`, contains literally the text `55596` with no other content. Code hygiene issue only, no functional impact.

## Security Findings

1. **SHA-256 password hashing** (not salted-adaptive bcrypt/Argon2) — trivially crackable via rainbow tables at scale. **P0.**
2. **JWT has no expiry** — a leaked/stolen token is valid forever. **P0.**
3. **Cross-role/ownership authorization bypass** on `GET /api/v1/mitra/production-orders/:id` — any authenticated user can read any order's confidential detail (QC photos, payout amounts, bank reference numbers). **P0.**
4. **CORS `origin: true` with `credentials: true`** — reflects any request origin. Should be restricted to known frontend origins in production. **P1.**
5. **`.env` handling is correct**: gitignored, never committed historically, no real secrets found in tracked files via grep. **PASS.**

## Data Integrity Findings

1. Frontend mock data does not reflect real database state at all (order codes, IDs, statuses all fictional and diverge from seeded DB) — not a sync bug, but total absence of sync.
2. Hardcoded impact metrics (`co2SavedKg`, `waterSavedLiters`) applied identically to every product regardless of actual production data.
3. Seed script (`prisma/seed.ts`) is not idempotent for orders — re-running creates duplicate orders (`ORD-2026-0002` through `-0006` observed, all under one mitra) rather than upserting.
4. Payout creation and DPP publish endpoints ARE correctly idempotent at the API level (existing-record checks before create/upsert) — positive finding.

## Deployment Findings

- No public staging URLs exist for any app (API, Admin, Mitra, User, Explainer).
- `DEPLOYMENT.md` contains aspirational/generic instructions only, not an actual deployment record.
- Root `pnpm build` fails due to `apps/explainer` missing `framer-motion`.
- DPP QR codes hardcoded to `localhost:5175`, meaning even if deployed, generated QR codes from before deployment would be broken.

## Blockers

1. All three frontend apps must be wired to the real backend API before any UI-based criterion (QC-02 through QC-10) can be assessed as PASS.
2. Password hashing and JWT expiry must be fixed before any credential-handling criterion can pass (QC-12, and indirectly QC-03).
3. Database must actually run on PostgreSQL before QC-11 can pass.
4. The order-detail ownership check must be fixed before any data-isolation criterion can pass (QC-05, and general security posture).
5. A real staging deployment with public URLs must exist before QC-14 can pass.

## Remediation Plan

### P0 — Critical, before any further QA or submission
| Issue | Evidence | Root Cause | File | Effort | Acceptance Criteria |
|---|---|---|---|---|---|
| SHA-256 passwords | `crypto.createHash('sha256')` | Homemade auth instead of bcrypt/Argon2/Supabase Auth | `apps/api/src/index.ts`, `prisma/seed.ts` | M | All passwords stored as bcrypt/Argon2 hash or migrated to Supabase Auth; existing demo users re-seeded |
| JWT never expires | No `exp` claim in decoded token | Missing `expiresIn` option on sign | `apps/api/src/index.ts` | S | JWT includes `exp`, expired tokens rejected with 401 |
| Cross-role data leak | Live HTTP 200 with `user` token on mitra order detail | Missing ownership/role check on detail route | `apps/api/src/index.ts` (`GET /api/v1/mitra/production-orders/:id`) | S | Non-owner, non-admin role receives 403/404 |
| Frontends disconnected from backend | 0 `fetch/api-client` references in all 3 apps | Apps built as static mock demos, never wired | `apps/admin/src`, `apps/mitra/src`, `apps/user/src` | XL | Every screen reads/writes via `@ecothread/api-client`; no hardcoded mock arrays remain for core flows |
| No login UI | 0 login-related matches in all 3 apps | Never built | `apps/admin/src`, `apps/mitra/src`, `apps/user/src` | L | Each app has a login screen calling real `/auth/login`, stores/refreshes token, redirects on 401 |
| Fake photo upload | `simulatePhotoUpload()` pushes fake object | No real file input/multipart handling anywhere | `apps/mitra/src/App.jsx`, `apps/api/src/index.ts` | L | Real `<input type="file">` + multipart upload endpoint storing actual files/URLs |
| SQLite instead of PostgreSQL | `provider = "sqlite"` | Never migrated to configured Supabase Postgres | `prisma/schema.prisma`, `.env` | M | `provider = "postgresql"`, real Supabase `DATABASE_URL`, migrations re-applied |
| No staging deployment | `DEPLOYMENT.md` has no real URLs | Never deployed | Deployment infra | L | Public URLs for API + all 3 frontends, reachable and functional |

### P1 — Before final demo
| Issue | File | Effort | Acceptance Criteria |
|---|---|---|---|
| Fake "blockchain minting" alert | `apps/admin/src/ecothread_dashboard.jsx` | S | Remove or clearly label as simulated; do not claim real Polygon network interaction unless implemented |
| Hardcoded impact metrics | `apps/api/src/index.ts` (admin create product) | S | Values computed from real production/material data, not constants |
| Hardcoded DPP QR URL | `apps/api/src/index.ts` | S | Use configurable base URL (env var), not hardcoded localhost |
| Payment self-verification | `apps/api/src/index.ts` | M | Separate admin-verify endpoint required before `isVerified: true` |
| CORS `origin: true` | `apps/api/src/index.ts` | S | Restrict to explicit allowed origins list |

### P2 — Cleanup
| Issue | File | Effort |
|---|---|---|
| Root `pnpm build` fails | `apps/explainer` | S — add missing `framer-motion` dependency |
| Seed not idempotent for orders | `prisma/seed.ts` | S — upsert instead of create |
| `DEMO.md` references nonexistent `mitra2` account | `DEMO.md`, `prisma/seed.ts` | S — add account or fix doc |

### P3 — Low priority
| Issue | File | Effort |
|---|---|---|
| 23 orphan fix/patch scripts | `apps/admin/*.js`, `*.py` | S — delete |
| Stray `admin-log.txt`, `mitra-log.txt`, `user-log.txt` | repo root | S — delete, gitignore |

## Re-test Checklist

- [ ] QC-12: Confirm password hash is bcrypt/Argon2 (not SHA-256); confirm JWT has `exp` and expired tokens return 401
- [ ] QC-05: Confirm `GET /api/v1/mitra/production-orders/:id` returns 403/404 for non-owner/non-admin roles
- [ ] QC-11: Confirm `schema.prisma` uses `postgresql` and live queries hit Supabase Postgres, not `dev.db`
- [ ] QC-03: Log in via real UI with each of the 3 demo accounts; confirm session persists on refresh; confirm wrong-role UI action is rejected server-side
- [ ] QC-04: Create an order via Admin UI form; confirm it appears in the real database (not just local state)
- [ ] QC-06: Upload a real photo file via Mitra UI; confirm it is stored and retrievable, not a fake `{id, name}` object
- [ ] QC-07: Approve QC via Admin UI with checklist; confirm payout row created in DB and audit log entry written
- [ ] QC-08: Scan DPP QR with a physical device against a real deployed URL; confirm no fake "blockchain minting" claims remain
- [ ] QC-09: Complete a full pre-order + payment-proof-upload flow via User UI; confirm admin can see and separately verify it
- [ ] QC-10: Refresh browser, log out/in, restart API server — confirm all data still reflects true DB state, not lost/reset
- [ ] QC-14: Access all 4 apps via real public staging URLs, not localhost
- [ ] Re-run `pnpm build` at root and confirm it succeeds for all apps including `apps/explainer`
