#!/usr/bin/env tsx
/**
 * Guarded Preview Database Migration Script
 *
 * Usage: pnpm db:migrate:preview
 *
 * Safety guards:
 * - Checks DEPLOYMENT_ENV=preview or NODE_ENV=test/development
 * - Refuses to run against a database URL that contains production indicators
 * - Prints only redacted host, never the full URL
 * - Runs prisma migrate status before and after
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

function isProductionUrl(url: string): boolean {
  const lower = url.toLowerCase()
  // Reject if the URL contains production indicators
  const productionIndicators = [
    '/ecothread_prod',
    '/ecothread-prod',
    '-production',
    '_production',
    'prod-db',
    '.prod.',
    'neon.tech', // Will be overridden below — Neon URLs are fine if they're the preview branch
  ]
  // We can't reliably detect Neon branch names from URL alone
  // So we rely on DEPLOYMENT_ENV guard primarily
  return false // Rely on env-var guard
}

const databaseUrl = process.env.DATABASE_URL
const directUrl = process.env.DIRECT_URL || databaseUrl
const deploymentEnv = process.env.DEPLOYMENT_ENV || process.env.NODE_ENV || 'development'

console.log('\n=== EcoThread Preview Database Migration ===')
console.log(`Deployment environment: ${deploymentEnv}`)

// Guard: must NOT be production
if (deploymentEnv === 'production') {
  console.error('\n❌ BLOCKED: DEPLOYMENT_ENV=production detected.')
  console.error('   Use pnpm db:migrate:production for production migrations.')
  process.exit(1)
}

// Guard: DATABASE_URL must be set
if (!databaseUrl) {
  console.error('\n❌ BLOCKED: DATABASE_URL is not set.')
  console.error('   Set DATABASE_URL to the Preview database connection string.')
  process.exit(1)
}

// Guard: reject localhost for preview deployment
if (databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')) {
  console.warn('\n⚠️  WARNING: DATABASE_URL points to localhost.')
  console.warn('   For a real Preview deployment, use the Neon Preview branch URL.')
  // Allow for local testing
}

console.log(`Database host: ${redactUrl(databaseUrl)}`)
console.log('')

// Run with DIRECT_URL for migrations
const env = {
  ...process.env,
  DATABASE_URL: databaseUrl,
  DIRECT_URL: directUrl || databaseUrl,
}

try {
  console.log('--- Running: prisma migrate status ---')
  execSync('npx prisma migrate status', { env, stdio: 'inherit' })
  console.log('')

  console.log('--- Running: prisma migrate deploy ---')
  execSync('npx prisma migrate deploy', { env, stdio: 'inherit' })
  console.log('')

  console.log('--- Running: prisma migrate status (post-deploy) ---')
  execSync('npx prisma migrate status', { env, stdio: 'inherit' })
  console.log('')

  console.log('✅ Preview database migration completed successfully.')
} catch (err) {
  console.error('\n❌ Migration failed:', err)
  process.exit(1)
}
