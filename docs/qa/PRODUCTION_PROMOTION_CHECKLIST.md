# EcoThread Production Promotion Checklist

> ⚠️ **CAUTION**: Production promotion is irreversible without a rollback procedure.
> Complete ALL checks before promoting.

**Date**: _______________________  
**Preview API URL**: _______________________  
**Preview Web URL**: _______________________  
**Production API URL**: _______________________  
**Production Web URL**: _______________________  
**Approver**: _______________________

---

## Gate 1: Preview Verification Complete

| # | Check | Status |
|---|-------|--------|
| 1 | All 39 PREVIEW_DEPLOYMENT_CHECKLIST checks passed | ☐ PASS ☐ FAIL |
| 2 | No critical/high severity issues found | ☐ PASS ☐ FAIL |
| 3 | Explicit product-owner approval obtained | ☐ PASS ☐ FAIL |

---

## Gate 2: Production Infrastructure Ready

| # | Check | Status |
|---|-------|--------|
| 4 | Neon Production branch provisioned | ☐ PASS ☐ FAIL |
| 5 | Production `DATABASE_URL` (pooled) set on ecothread-api | ☐ PASS ☐ FAIL |
| 6 | Production `DIRECT_URL` (direct) set on ecothread-api | ☐ PASS ☐ FAIL |
| 7 | Production `JWT_SECRET` (different from preview) set | ☐ PASS ☐ FAIL |
| 8 | Production `CORS_ORIGINS` set to production web URL | ☐ PASS ☐ FAIL |
| 9 | Production `WEB_APP_URL` set to production web URL | ☐ PASS ☐ FAIL |
| 10 | Production `BLOB_READ_WRITE_TOKEN` set | ☐ PASS ☐ FAIL |
| 11 | Production `DEPLOYMENT_ENV=production` set | ☐ PASS ☐ FAIL |
| 12 | Production `VITE_API_BASE_URL` and `VITE_APP_URL` set on web project | ☐ PASS ☐ FAIL |

---

## Gate 3: Production Migrations

| # | Check | Status |
|---|-------|--------|
| 13 | Neon pre-migration snapshot created | ☐ PASS ☐ FAIL |
| 14 | `pnpm db:migrate:production` ran successfully | ☐ PASS ☐ FAIL |
| 15 | `npx prisma migrate status` is clean | ☐ PASS ☐ FAIL |

---

## Gate 4: Production Promotion

| # | Check | Status |
|---|-------|--------|
| 16 | API promoted: `vercel promote <preview-url> --project ecothread-api` | ☐ PASS ☐ FAIL |
| 17 | Web promoted: `vercel promote <preview-url> --project ecothread-web` | ☐ PASS ☐ FAIL |
| 18 | `GET <prod-api>/api/v1/health/live` → 200 OK | ☐ PASS ☐ FAIL |
| 19 | `GET <prod-api>/api/v1/health/ready` → 200 OK, `database: ok` | ☐ PASS ☐ FAIL |
| 20 | Production web loads without error | ☐ PASS ☐ FAIL |
| 21 | Admin login works on production | ☐ PASS ☐ FAIL |
| 22 | Public catalog loads on production | ☐ PASS ☐ FAIL |
| 23 | CORS: production API returns only production web URL in `Access-Control-Allow-Origin` | ☐ PASS ☐ FAIL |
| 24 | DPP QR code URL points to production web domain | ☐ PASS ☐ FAIL |
| 25 | No localhost references anywhere in production responses | ☐ PASS ☐ FAIL |

---

## Rollback Plan

If production smoke tests fail after promotion:

1. `vercel rollback --project ecothread-api`
2. `vercel rollback --project ecothread-web`
3. If schema migration was applied and broke something: restore Neon snapshot branch.
4. Notify the team and document the failure.

---

## Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Lead Engineer | | | |
| Product Owner | | | |

---

**Production Promotion Status**: ☐ APPROVED AND COMPLETE ☐ BLOCKED — REQUIRES REVISION
