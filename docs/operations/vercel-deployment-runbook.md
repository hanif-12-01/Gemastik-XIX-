# Vercel Deployment Runbook

## Prerequisites

- Vercel CLI installed: `npm i -g vercel@latest`
- Logged in: `vercel login`
- Repository: `hanif-12-01/Gemastik-XIX-` connected to Vercel

## Step 1: Install Vercel CLI

```powershell
npm install -g vercel@latest
vercel --version
vercel login
```

## Step 2: Create Vercel Projects

### 2a. Create ecothread-api project

```powershell
cd D:\LOMBA\GEMASTIK\apps\api
vercel link --project ecothread-api
```

Or via Vercel Dashboard:
1. Import Git Repository: `hanif-12-01/Gemastik-XIX-`
2. Project Name: `ecothread-api`
3. Root Directory: `apps/api`
4. Framework Preset: Other
5. Build & Output Settings: leave defaults (handled by vercel.json)

### 2b. Create ecothread-web project

```powershell
cd D:\LOMBA\GEMASTIK\apps\web
vercel link --project ecothread-web
```

Or via Vercel Dashboard:
1. Import Git Repository: `hanif-12-01/Gemastik-XIX-`
2. Project Name: `ecothread-web`
3. Root Directory: `apps/web`
4. Framework Preset: Vite
5. Build Command: `pnpm --filter @ecothread/web build`
6. Output Directory: `dist`

## Step 3: Provision Neon PostgreSQL

1. Vercel Dashboard → ecothread-api → Storage → Add → Neon Serverless Postgres
2. Create database: `ecothread-db`
3. Copy **pooled** connection string → set as `DATABASE_URL` on API project
4. Copy **direct** connection string → set as `DIRECT_URL` on API project
5. For Preview environment: use a separate Neon branch (create in Neon Dashboard)

## Step 4: Configure Vercel Blob

1. Vercel Dashboard → ecothread-api → Storage → Add → Blob
2. Store name: `ecothread-private-blob`
3. Copy `BLOB_READ_WRITE_TOKEN` → set on ecothread-api project (all environments)

## Step 5: Set Environment Variables

### ecothread-api environment variables

Set these on the Vercel Dashboard → ecothread-api → Settings → Environment Variables:

| Variable | Preview | Production |
|----------|---------|------------|
| `DATABASE_URL` | Neon preview branch pooled URL | Neon production branch pooled URL |
| `DIRECT_URL` | Neon preview branch direct URL | Neon production branch direct URL |
| `JWT_SECRET` | Generate: `openssl rand -hex 64` | Different strong secret |
| `JWT_EXPIRES_IN` | `8h` | `8h` |
| `CORS_ORIGINS` | Preview web URL | Production web URL |
| `WEB_APP_URL` | Preview web URL | Production web URL |
| `BLOB_READ_WRITE_TOKEN` | Blob token | Blob token |
| `DEPLOYMENT_ENV` | `preview` | `production` |
| `NODE_ENV` | `production` | `production` |
| `APP_VERSION` | (auto from VERCEL_GIT_COMMIT_SHA) | (same) |

### ecothread-web environment variables

| Variable | Preview | Production |
|----------|---------|------------|
| `VITE_API_BASE_URL` | Preview API URL + `/api/v1` | Production API URL + `/api/v1` |
| `VITE_APP_URL` | Preview web URL | Production web URL |
| `VITE_ENVIRONMENT` | `preview` | `production` |

## Step 6: Deploy API Preview

```powershell
cd D:\LOMBA\GEMASTIK\apps\api
vercel deploy --prebuilt=false
```

Or push to the deployment branch — Vercel auto-deploys on push.

## Step 7: Run Preview Database Migrations

```powershell
# Set environment variables
$env:DATABASE_URL = "neon-preview-pooled-url"
$env:DIRECT_URL = "neon-preview-direct-url"
$env:DEPLOYMENT_ENV = "preview"

pnpm db:migrate:preview
```

## Step 8: Run Staging Seed

```powershell
$env:DATABASE_URL = "neon-preview-pooled-url"
$env:DEPLOYMENT_ENV = "preview"
pnpm db:seed:staging
```

## Step 9: Deploy Web Preview

```powershell
cd D:\LOMBA\GEMASTIK\apps\web
vercel deploy
```

## Step 10: Preview Verification

Run the verification checklist from `docs/qa/PREVIEW_DEPLOYMENT_CHECKLIST.md`.

## Step 11: Production Promotion

Only after all Preview verification passes and explicit user approval:

```powershell
# Production migrations
$env:DATABASE_URL = "neon-production-pooled-url"
$env:DIRECT_URL = "neon-production-direct-url"
$env:DEPLOYMENT_ENV = "production"
$env:PRODUCTION_MIGRATION_CONFIRM = "ECOTHREAD_PROD_MIGRATE_YES"

pnpm db:migrate:production

# Promote to production
cd D:\LOMBA\GEMASTIK\apps\api
vercel promote <preview-deployment-url>

cd D:\LOMBA\GEMASTIK\apps\web
vercel promote <preview-deployment-url>
```
