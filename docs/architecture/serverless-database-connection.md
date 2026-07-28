# Serverless Database Connection Strategy

## Problem

Vercel Serverless Functions create a new process per cold start. If `PrismaClient` is instantiated on every request, it will exhaust PostgreSQL connection limits quickly.

## Solution: Singleton PrismaClient

EcoThread uses a module-level singleton pattern in `apps/api/src/app.ts`:

```typescript
let _prisma: PrismaClient | undefined

export function getPrisma(): PrismaClient {
  if (!_prisma) {
    _prisma = new PrismaClient()
  }
  return _prisma
}
```

- The `buildApp()` factory calls `getPrisma()` once.
- Warm invocations reuse the same `PrismaClient` instance.
- Cold starts create a new `PrismaClient` (expected behavior).

## Neon PostgreSQL Connection Strings

### DATABASE_URL (runtime / pooled)

Use Neon's **pooled connection string** (with PgBouncer):

```
postgresql://user:pass@ep-xxx.neon.tech:5432/dbname?pgbouncer=true&connection_limit=1
```

Key parameters:
- `pgbouncer=true` — enables PgBouncer compatibility
- `connection_limit=1` — limits connections per Prisma instance to prevent pool exhaustion in serverless

### DIRECT_URL (migrations only)

Use Neon's **direct connection string** (bypasses PgBouncer):

```
postgresql://user:pass@ep-xxx.neon.tech:5432/dbname
```

Required for:
- `prisma migrate deploy`
- `prisma migrate status`
- `prisma db seed`

### Prisma Schema Configuration

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")    // pooled — runtime
  directUrl = env("DIRECT_URL")      // direct — migrations only
}
```

## Cold Start Latency

Neon hibernates after ~5 minutes of inactivity. First request after hibernation may take 1–3 seconds for database wake-up. This is acceptable for the MVP.

For production readiness post-MVP, consider:
- Vercel Cron job to ping `/api/v1/health/ready` every 4 minutes
- Neon paid plan with always-on option

## Health Check Endpoint

`GET /api/v1/health/ready` performs a lightweight DB ping:

```typescript
await prisma.$queryRaw`SELECT 1`
```

Responds with 200 if DB is reachable, 503 if not. Used by deployment verification scripts.
