# ROADMAP 08 — VERCEL DEPLOYMENT REPORT

**Status**: ✅ CODE READY — AWAITING VERCEL PROJECT CREATION  
**Branch**: `deploy/roadmap-08-vercel`  
**Base Commit**: `bbe49e4` (Roadmap 7 release candidate)  
**Feature Commit**: `aa5830f`  
**Date**: 2026-07-28  
**Engineer**: AI Lead Engineer  

---

## 1. Executive Summary

Roadmap 8 prepares the EcoThread monorepo for Vercel deployment. All application code, configuration files, deployment scripts, and operations documentation have been implemented and verified locally.

### Completed Deliverables

| Category | Deliverable | Status |
|----------|-------------|--------|
| **API Refactoring** | `buildApp()` factory extracted to `apps/api/src/app.ts` | ✅ Done |
| **API Refactoring** | Local-dev listener in `apps/api/src/index.ts` | ✅ Done |
| **API Refactoring** | Vercel Function handler `apps/api/api/index.ts` | ✅ Done |
| **API Refactoring** | Vercel config `apps/api/vercel.json` | ✅ Done |
| **Health Endpoints** | `GET /api/v1/health/live` (no DB) | ✅ Done |
| **Health Endpoints** | `GET /api/v1/health/ready` (with DB ping + Blob config check) | ✅ Done |
| **Storage Migration** | Local disk `uploads/qc/` → `@vercel/blob` SDK | ✅ Done |
| **Storage Migration** | Environment-namespaced blob paths (`{env}/private/{category}/...`) | ✅ Done |
| **Storage Migration** | Local-dev fallback when blob token not set | ✅ Done |
| **Environment Vars** | `WEB_APP_URL` (server-side, replaces `VITE_APP_URL` in API) | ✅ Done |
| **Environment Vars** | `DEPLOYMENT_ENV` (preview / production / development) | ✅ Done |
| **Environment Vars** | `BLOB_READ_WRITE_TOKEN` / `PRIVATE_BLOB_READ_WRITE_TOKEN` | ✅ Done |
| **Dependency** | `@vercel/blob` added to `apps/api/package.json` | ✅ Done |
| **Web Config** | `apps/web/vercel.json` verified (SPA rewrite, Vite framework) | ✅ Done |
| **Deploy Scripts** | `scripts/db-migrate-preview.ts` (guarded) | ✅ Done |
| **Deploy Scripts** | `scripts/db-migrate-production.ts` (guarded + confirmation token) | ✅ Done |
| **Deploy Scripts** | `scripts/db-seed-staging.ts` (blocks production) | ✅ Done |
| **Deploy Scripts** | `scripts/deploy-check.ts` (pre-deployment verification) | ✅ Done |
| **Root Config** | `package.json` scripts: `db:migrate:preview`, `db:migrate:production`, `db:seed:staging`, `deploy:check` | ✅ Done |
| **Root Config** | `.env.example` updated with all Roadmap 8 variables | ✅ Done |
| **Root Config** | `.gitignore` updated (`.vercel/`, `auth-state/`, `uploads/`) | ✅ Done |
| **Vercel CLI** | Installed globally (`vercel@latest`) | ✅ Done |

---

## 2. Local Build Verification

| Check | Result |
|-------|--------|
| `pnpm --filter @ecothread/api typecheck` | ✅ PASS |
| `pnpm --filter @ecothread/web typecheck` | ✅ PASS |
| `pnpm --filter @ecothread/web build` | ✅ PASS (502 kB bundle) |
| `prisma validate` | ✅ PASS |
| `prisma migrate status` (local) | ✅ PASS |
| `pnpm deploy:check` (after commit) | ✅ PASS |
| All required files exist | ✅ PASS |
| All env vars documented in `.env.example` | ✅ PASS |

---

## 3. Architecture Documentation

| Document | Path |
|----------|------|
| Vercel Deployment Architecture | `docs/architecture/vercel-deployment-architecture.md` |
| Serverless Database Connection Strategy | `docs/architecture/serverless-database-connection.md` |
| Vercel Blob Environment Namespacing | `docs/architecture/vercel-blob-environments.md` |

---

## 4. Operations Documentation

| Document | Path |
|----------|------|
| Vercel Deployment Runbook | `docs/operations/vercel-deployment-runbook.md` |
| Database Migration Runbook | `docs/operations/database-migration-runbook.md` |
| Rollback Runbook | `docs/operations/rollback-runbook.md` |
| Secret Rotation Runbook | `docs/operations/secret-rotation-runbook.md` |

---

## 5. QA Checklists

| Document | Path |
|----------|------|
| Preview Deployment Checklist (39 checks) | `docs/qa/PREVIEW_DEPLOYMENT_CHECKLIST.md` |
| Production Promotion Checklist (25 checks) | `docs/qa/PRODUCTION_PROMOTION_CHECKLIST.md` |

---

## 6. Files Changed Summary

### New Files (15)

| File | Purpose |
|------|---------|
| `apps/api/src/app.ts` | Fastify app factory (extracted from monolithic index.ts) |
| `apps/api/api/index.ts` | Vercel Function handler (exports handler, no listen()) |
| `apps/api/vercel.json` | Vercel Node.js function config + routing |
| `scripts/db-migrate-preview.ts` | Guarded preview DB migration |
| `scripts/db-migrate-production.ts` | Guarded production DB migration |
| `scripts/db-seed-staging.ts` | Guarded staging seed |
| `scripts/deploy-check.ts` | Pre-deployment verification |
| `docs/architecture/vercel-deployment-architecture.md` | Architecture doc |
| `docs/architecture/serverless-database-connection.md` | DB connection doc |
| `docs/architecture/vercel-blob-environments.md` | Blob storage doc |
| `docs/operations/vercel-deployment-runbook.md` | Deployment runbook |
| `docs/operations/database-migration-runbook.md` | Migration runbook |
| `docs/operations/rollback-runbook.md` | Rollback runbook |
| `docs/operations/secret-rotation-runbook.md` | Secret rotation runbook |
| `docs/qa/PREVIEW_DEPLOYMENT_CHECKLIST.md` | Preview checklist |
| `docs/qa/PRODUCTION_PROMOTION_CHECKLIST.md` | Production checklist |

### Modified Files (6)

| File | Change |
|------|--------|
| `apps/api/src/index.ts` | Replaced 2541-line monolith with 22-line local-dev listener |
| `apps/api/package.json` | Added `@vercel/blob` dependency |
| `apps/api/tsconfig.json` | Included `api/` directory, removed `rootDir` restriction |
| `package.json` | Added 4 deployment scripts |
| `.env.example` | Added all Roadmap 8 env variables |
| `.gitignore` | Added `.vercel/`, `auth-state/`, `uploads/` |

---

## 7. Key Design Decisions

### 7.1 App Factory Pattern

The 2,541-line `index.ts` was split:
- `app.ts` (≈1,100 lines) — pure Fastify app factory, no `listen()`, reusable by both local dev and Vercel
- `index.ts` (22 lines) — calls `buildApp()` + `listen()` for local dev only
- `api/index.ts` (33 lines) — Vercel handler, calls `buildApp()` + `ready()`, reused per warm invocation

### 7.2 Vercel Blob Storage

Local disk writes replaced with `@vercel/blob` `put()`. Path convention:
```
{env}/private/{category}/{userId}-{timestamp}-{filename}
```
Local dev without blob token gets a synthetic URL fallback (no crash, no external dependency).

### 7.3 Singleton PrismaClient

Module-level singleton via `getPrisma()` — safe for serverless. Each cold start gets one client; warm invocations reuse it.

### 7.4 Guarded Migration Scripts

- **Preview**: blocks `DEPLOYMENT_ENV=production`, allows localhost for local testing
- **Production**: requires `DEPLOYMENT_ENV=production` AND `PRODUCTION_MIGRATION_CONFIRM=ECOTHREAD_PROD_MIGRATE_YES`, blocks localhost

---

## 8. Remaining Steps (Require User Interaction)

The following steps require Vercel account access and cannot be automated without user credentials:

1. **`vercel login`** — authenticate CLI with Vercel account
2. **Create Vercel projects** — `ecothread-api` and `ecothread-web`
3. **Provision Neon PostgreSQL** — via Vercel Marketplace
4. **Configure Vercel Blob** — create blob store
5. **Set environment variables** — per project, per environment
6. **Push to GitHub** — trigger automatic deployment
7. **Run preview migrations** — `pnpm db:migrate:preview`
8. **Run preview seed** — `pnpm db:seed:staging`
9. **Execute Preview Deployment Checklist** — 39 checks
10. **Production promotion** — after explicit user approval

---

## 9. Risk Assessment

| Risk | Severity | Mitigation | Status |
|------|----------|------------|--------|
| Local disk → Blob migration (data loss) | High | All new uploads use Blob; old local files don't exist in production yet | ✅ Mitigated |
| Preview/Prod DB separation | High | Guarded scripts block cross-environment access | ✅ Mitigated |
| CORS misconfiguration | Medium | Explicit origin list from env vars, no wildcards | ✅ Mitigated |
| Cold start latency | Low | Singleton PrismaClient, Neon hibernation acceptable for MVP | ✅ Documented |
| JWT secret reuse between environments | Medium | Separate secrets per environment enforced by docs | ✅ Documented |

---

## 10. Conclusion

**Roadmap 8 code implementation is COMPLETE.**

All application code changes, deployment scripts, and documentation are committed on branch `deploy/roadmap-08-vercel`. The codebase is ready for Vercel project creation and deployment.

**Next action**: User must run `vercel login` and follow the [Vercel Deployment Runbook](../operations/vercel-deployment-runbook.md) to complete cloud provisioning.

**Production Promotion Gate**: Will be evaluated after Preview deployment verification passes all 39 checks.
