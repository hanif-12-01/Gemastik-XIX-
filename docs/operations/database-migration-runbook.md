# Database Migration Runbook

## Local Development

```powershell
# Create and apply migration
pnpm db:migrate           # runs: prisma migrate dev

# Generate Prisma client after schema changes
pnpm db:generate          # runs: prisma generate

# Seed local database
pnpm db:seed              # runs: tsx prisma/seed.ts
```

## Preview Deployment Migrations

```powershell
# Set credentials (use Neon Preview branch)
$env:DATABASE_URL = "postgresql://...neon.tech.../ecothread?pgbouncer=true&connection_limit=1"
$env:DIRECT_URL = "postgresql://...neon.tech.../ecothread"
$env:DEPLOYMENT_ENV = "preview"

pnpm db:migrate:preview
```

## Production Migrations

> ⚠️ **CAUTION**: This modifies production data. Take a database snapshot FIRST.

```powershell
# Step 1: Take Neon snapshot (via Neon Dashboard → Branches → Create Branch from production)

# Step 2: Set credentials (use Neon Production branch)
$env:DATABASE_URL = "postgresql://...neon.tech.../ecothread-prod?pgbouncer=true&connection_limit=1"
$env:DIRECT_URL = "postgresql://...neon.tech.../ecothread-prod"
$env:DEPLOYMENT_ENV = "production"
$env:PRODUCTION_MIGRATION_CONFIRM = "ECOTHREAD_PROD_MIGRATE_YES"

# Step 3: Run migration
pnpm db:migrate:production

# Step 4: Verify migration status
npx prisma migrate status
```

## Rollback Strategy

Prisma does NOT automatically roll back migrations. If a migration fails:

1. **Identify the failed migration** from `prisma migrate status` output.
2. **Restore from snapshot** (Neon branch created before migration).
3. **Do NOT run `prisma migrate dev` against production** — always use `prisma migrate deploy`.

### Creating a Rollback Migration

If a migration was applied and needs reverting:
1. Write a new migration that reverses the schema change.
2. Test in Preview environment first.
3. Apply to production using the migration runbook above.

## Migration File Naming Convention

```
YYYYMMDDHHMMSS_description_of_change
Example: 20260727120000_add_customer_order_tracking_field
```

## Emergency Procedures

If production database is unresponsive after migration:
1. Switch to Neon's branching — point `DATABASE_URL` to the pre-migration snapshot branch.
2. Redeploy API with the snapshot branch connection string.
3. Investigate and fix the migration issue.
4. Re-run the fixed migration.
