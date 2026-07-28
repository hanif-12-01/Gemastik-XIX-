#!/usr/bin/env tsx
/**
 * Guarded Staging Seed Script
 *
 * Usage: pnpm db:seed:staging
 *
 * Seeds a Preview/Staging database with demo + seed data.
 * Refuses to run against production.
 */
import { execSync } from 'child_process'

const deploymentEnv = process.env.DEPLOYMENT_ENV || process.env.NODE_ENV || 'development'
const databaseUrl = process.env.DATABASE_URL

console.log('\n=== EcoThread Staging Database Seed ===')
console.log(`Deployment environment: ${deploymentEnv}`)

// Guard: must NOT be production
if (deploymentEnv === 'production') {
  console.error('\n❌ BLOCKED: Cannot seed a production database with staging/demo data.')
  console.error('   Seed data contains demo records that must not appear in production.')
  process.exit(1)
}

if (!databaseUrl) {
  console.error('\n❌ BLOCKED: DATABASE_URL is not set.')
  process.exit(1)
}

const env = { ...process.env }

try {
  console.log('--- Running: prisma db seed ---')
  execSync('npx prisma db seed', { env, stdio: 'inherit' })
  console.log('')
  console.log('✅ Staging seed completed successfully.')
} catch (err) {
  console.error('\n❌ Seed failed:', err)
  process.exit(1)
}
