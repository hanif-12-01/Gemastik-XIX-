#!/usr/bin/env tsx
/**
 * Guarded Production Database Migration Script
 *
 * Usage: pnpm db:migrate:production
 *
 * Safety guards:
 * - Requires DEPLOYMENT_ENV=production
 * - Requires PRODUCTION_MIGRATION_CONFIRM=ECOTHREAD_PROD_MIGRATE_YES
 * - Prints only redacted host, never the full URL
 * - Runs migrate status before and after
 * - Requires explicit confirmation token to proceed
 */
import { execSync } from 'child_process'

function redactUrl(url: string): string {
  try {
    const u = new URL(url)
    return `${u.protocol}//<redacted>@${u.host}${u.pathname}`
  } catch {
    return '<invalid-url>'
  }
}

const databaseUrl = process.env.DATABASE_URL
const directUrl = process.env.DIRECT_URL || databaseUrl
const deploymentEnv = process.env.DEPLOYMENT_ENV || process.env.NODE_ENV
const confirmToken = process.env.PRODUCTION_MIGRATION_CONFIRM

const REQUIRED_CONFIRM = 'ECOTHREAD_PROD_MIGRATE_YES'

console.log('\n=== EcoThread PRODUCTION Database Migration ===')
console.log('⚠️  WARNING: This will run migrations against the PRODUCTION database.')
console.log('')
console.log(`Deployment environment: ${deploymentEnv}`)

// Guard: MUST be production
if (deploymentEnv !== 'production') {
  console.error('\n❌ BLOCKED: DEPLOYMENT_ENV must be "production".')
  console.error('   Set DEPLOYMENT_ENV=production to run this script.')
  process.exit(1)
}

// Guard: DATABASE_URL must be set
if (!databaseUrl) {
  console.error('\n❌ BLOCKED: DATABASE_URL is not set.')
  process.exit(1)
}

// Guard: reject localhost for production
if (databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')) {
  console.error('\n❌ BLOCKED: DATABASE_URL points to localhost. Production databases must use remote URLs.')
  process.exit(1)
}

// Guard: require explicit confirmation
if (confirmToken !== REQUIRED_CONFIRM) {
  console.error(`\n❌ BLOCKED: PRODUCTION_MIGRATION_CONFIRM must be set to "${REQUIRED_CONFIRM}".`)
  console.error('   Run with PRODUCTION_MIGRATION_CONFIRM=ECOTHREAD_PROD_MIGRATE_YES to proceed.')
  process.exit(1)
}

console.log(`Database host: ${redactUrl(databaseUrl)}`)
console.log('')
console.log('✅ All guards passed. Proceeding with production migration in 3 seconds...')
await new Promise((resolve) => setTimeout(resolve, 3000))

const env = {
  ...process.env,
  DATABASE_URL: databaseUrl,
  DIRECT_URL: directUrl || databaseUrl,
}

try {
  console.log('\n--- Running: prisma migrate status (pre-deploy) ---')
  execSync('npx prisma migrate status', { env, stdio: 'inherit' })
  console.log('')

  console.log('--- Running: prisma migrate deploy ---')
  execSync('npx prisma migrate deploy', { env, stdio: 'inherit' })
  console.log('')

  console.log('--- Running: prisma migrate status (post-deploy) ---')
  execSync('npx prisma migrate status', { env, stdio: 'inherit' })
  console.log('')

  console.log('✅ PRODUCTION database migration completed successfully.')
  console.log('   Proceed to production deployment and smoke tests.')
} catch (err) {
  console.error('\n❌ PRODUCTION Migration failed:', err)
  console.error('   Check database state immediately. Do NOT promote to traffic.')
  process.exit(1)
}
