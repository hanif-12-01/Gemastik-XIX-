# EcoThread Preview Deployment Checklist

**Date**: _______________________  
**Deployment Branch**: deploy/roadmap-08-vercel  
**Commit SHA**: _______________________  
**Preview API URL**: _______________________  
**Preview Web URL**: _______________________  
**Tester**: _______________________

---

## Phase 1: Infrastructure

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | Vercel project `ecothread-api` created and linked | ☐ PASS ☐ FAIL | |
| 2 | Vercel project `ecothread-web` created and linked | ☐ PASS ☐ FAIL | |
| 3 | Neon PostgreSQL provisioned (Preview branch) | ☐ PASS ☐ FAIL | |
| 4 | `DATABASE_URL` set on API project (pooled) | ☐ PASS ☐ FAIL | |
| 5 | `DIRECT_URL` set on API project (direct) | ☐ PASS ☐ FAIL | |
| 6 | `JWT_SECRET` set (strong random value) | ☐ PASS ☐ FAIL | |
| 7 | `CORS_ORIGINS` set to Preview web URL | ☐ PASS ☐ FAIL | |
| 8 | `WEB_APP_URL` set to Preview web URL | ☐ PASS ☐ FAIL | |
| 9 | `BLOB_READ_WRITE_TOKEN` set | ☐ PASS ☐ FAIL | |
| 10 | `DEPLOYMENT_ENV=preview` set | ☐ PASS ☐ FAIL | |
| 11 | Preview DB migrations applied (`pnpm db:migrate:preview`) | ☐ PASS ☐ FAIL | |
| 12 | Staging seed applied (`pnpm db:seed:staging`) | ☐ PASS ☐ FAIL | |

---

## Phase 2: API Health

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 13 | `GET /api/v1/health/live` → 200 OK | ☐ PASS ☐ FAIL | |
| 14 | `GET /api/v1/health/ready` → 200 OK, `database: ok` | ☐ PASS ☐ FAIL | |
| 15 | `GET /api/v1/health/ready` → `blob_configured: yes` | ☐ PASS ☐ FAIL | |
| 16 | `GET /api/v1/health` (legacy) → 200 OK | ☐ PASS ☐ FAIL | |

---

## Phase 3: Web Landing

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 17 | Web root `/` loads (no blank page, no JS error) | ☐ PASS ☐ FAIL | |
| 18 | Direct navigation to `/admin/login` renders (SPA rewrite works) | ☐ PASS ☐ FAIL | |
| 19 | No `localhost` references visible in page source | ☐ PASS ☐ FAIL | |

---

## Phase 4: Authentication

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 20 | Admin login with seed credentials succeeds | ☐ PASS ☐ FAIL | |
| 21 | Admin JWT token is returned (no 401 on `/api/v1/me`) | ☐ PASS ☐ FAIL | |
| 22 | CORS: API returns `Access-Control-Allow-Origin` with Preview web URL | ☐ PASS ☐ FAIL | |
| 23 | CORS: localhost is NOT in the `Access-Control-Allow-Origin` header | ☐ PASS ☐ FAIL | |
| 24 | Customer registration flow works | ☐ PASS ☐ FAIL | |
| 25 | Mitra login works | ☐ PASS ☐ FAIL | |

---

## Phase 5: File Upload (Blob)

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 26 | `POST /api/v1/uploads/qc` with valid image → 201, returns blob URL | ☐ PASS ☐ FAIL | |
| 27 | Returned URL is a Vercel Blob URL (not `/api/v1/uploads/qc/local/`) | ☐ PASS ☐ FAIL | |
| 28 | Blob URL path contains `preview/private/qc/` namespace | ☐ PASS ☐ FAIL | |
| 29 | Blob URL is accessible (image loads in browser) | ☐ PASS ☐ FAIL | |
| 30 | `POST /api/v1/uploads/qc` without auth → 401 | ☐ PASS ☐ FAIL | |

---

## Phase 6: Business Flows (Smoke Test)

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 31 | Admin dashboard loads stats | ☐ PASS ☐ FAIL | |
| 32 | Public catalog `/api/v1/catalog` returns data | ☐ PASS ☐ FAIL | |
| 33 | Public DPP page loads for seeded product code | ☐ PASS ☐ FAIL | |
| 34 | DPP QR code URL does NOT contain `localhost` | ☐ PASS ☐ FAIL | |
| 35 | Admin Mitra verification flow works | ☐ PASS ☐ FAIL | |

---

## Phase 7: Security

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 36 | `/api/v1/admin/dashboard-stats` without auth → 401 | ☐ PASS ☐ FAIL | |
| 37 | Mitra JWT cannot access admin endpoints → 403 | ☐ PASS ☐ FAIL | |
| 38 | `/api/v1/uploads/qc/some-file` without auth → 401 | ☐ PASS ☐ FAIL | |
| 39 | Response headers: no `X-Powered-By` leaking server version | ☐ PASS ☐ FAIL | |

---

## Preview Gate Decision

All 39 checks: ☐ PASS (proceed) ☐ FAIL (do not promote)

**Signed off by**: ___________________  
**Date**: ___________________

---

> ✅ If all checks PASS → proceed to production promotion per `PRODUCTION_PROMOTION_CHECKLIST.md`
