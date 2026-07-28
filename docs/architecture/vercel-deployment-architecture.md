# EcoThread Vercel Deployment Architecture

## Overview

EcoThread uses a **monorepo with two Vercel projects** deployed from the same GitHub repository. Each project maps to a subdirectory (root directory) within the monorepo.

```
GitHub: hanif-12-01/Gemastik-XIX-
├── apps/web/     ← Vercel Project: ecothread-web (Vite SPA)
└── apps/api/     ← Vercel Project: ecothread-api (Fastify/Node.js)
```

## Project Configuration

### ecothread-web

| Field | Value |
|-------|-------|
| Framework | Vite |
| Root Directory | `apps/web` |
| Build Command | `pnpm --filter @ecothread/web build` |
| Output Directory | `dist` |
| Install Command | `pnpm install --frozen-lockfile` |
| Node.js Version | 22.x |

**SPA Rewrite** (in `apps/web/vercel.json`):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
All requests to non-asset paths redirect to `index.html`, allowing React Router to handle client-side navigation.

**Build-time env vars** injected by Vercel:
- `VITE_API_BASE_URL` — Preview/Production API URL
- `VITE_APP_URL` — Preview/Production web URL
- `VITE_ENVIRONMENT` — `preview` or `production`

### ecothread-api

| Field | Value |
|-------|-------|
| Framework | Other (Node.js) |
| Root Directory | `apps/api` |
| Build Command | (none — handled by `@vercel/node` builder) |
| Output Directory | (none) |
| Install Command | `pnpm install --frozen-lockfile` |
| Node.js Version | 22.x |
| Entry | `api/index.ts` |

**Vercel Function entrypoint** (`apps/api/api/index.ts`):
```
Vercel → api/index.ts → buildApp() → Fastify instance
```

The Fastify app is built once per cold start and reused across warm invocations.

## Request Flow

```
Browser → Vercel Edge → ecothread-web (Static CDN)
                             │
                             │ fetch() to API
                             ▼
                    Vercel Edge → ecothread-api (Serverless Function)
                                        │
                                        │ Prisma + Neon
                                        ▼
                               Neon PostgreSQL (cloud)
                                        │
                               @vercel/blob (file storage)
```

## Environment Isolation

| Environment | Web URL | API URL | Database Branch |
|-------------|---------|---------|-----------------|
| Local Dev | localhost:3000 | localhost:4000 | Docker Compose |
| Preview | `ecothread-web-git-deploy-*.vercel.app` | `ecothread-api-git-deploy-*.vercel.app` | Neon: preview |
| Production | `ecothread-web.vercel.app` | `ecothread-api.vercel.app` | Neon: main |

## Security Boundaries

- **JWT tokens** are validated by the API on every protected request.
- **CORS_ORIGINS** is set to the exact deployed web URL (no wildcards in production).
- **Blob tokens** are server-side env vars only — never in `VITE_` variables or client code.
- **Private uploads** use Vercel Blob with environment-namespaced paths.
- **Database passwords** are only in `DATABASE_URL` / `DIRECT_URL` on the API project.

## Scalability Notes

- Vercel Serverless Functions scale automatically.
- Neon PostgreSQL hibernates after inactivity (acceptable cold-start for MVP).
- Connection pooling: use Neon's pooled endpoint for `DATABASE_URL` (`?pgbouncer=true&connection_limit=1`).
- PrismaClient is a singleton per function instance (not re-created per request).
