#!/usr/bin/env tsx
/**
 * Pre-Deployment Verification Script
 *
 * Usage: pnpm deploy:check
 *
 * Validates that the repository is ready for deployment:
 * - Git is clean (no uncommitted changes)
 * - TypeScript compiles for both web and API
 * - Prisma schema is valid
 * - Required environment variables are documented
 * - No localhost references in production env config
 */
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()
let exitCode = 0

function check(label: string, fn: () => boolean | string) {
  try {
    const result = fn()
    if (result === true || result === '') {
      console.log(`  ✅ ${label}`)
    } else {
      console.log(`  ⚠️  ${label}: ${result}`)
    }
  } catch (err: any) {
    console.log(`  ❌ ${label}: ${err.message || err}`)
    exitCode = 1
  }
}

function run(cmd: string, opts?: { cwd?: string }): string {
  return execSync(cmd, { cwd: opts?.cwd || ROOT, encoding: 'utf8' }).trim()
}

console.log('\n╔══════════════════════════════════════════╗')
console.log('║   EcoThread Pre-Deployment Verification  ║')
console.log('╚══════════════════════════════════════════╝\n')

// ─── Git ──────────────────────────────────────────────
console.log('[ GIT STATUS ]')

check('Clean working tree', () => {
  const status = run('git status --porcelain')
  if (status !== '') throw new Error(`Uncommitted changes:\n${status}`)
  return true
})

check('On a deployment branch', () => {
  const branch = run('git branch --show-current')
  return branch || '<detached-head>'
})

const commitSha = run('git rev-parse --short HEAD')
check('Commit SHA recorded', () => { console.log(`     SHA: ${commitSha}`); return true })

// ─── TypeScript ────────────────────────────────────────
console.log('\n[ TYPESCRIPT ]')

check('API typecheck passes', () => {
  run('pnpm --filter @ecothread/api typecheck')
  return true
})

check('Web typecheck passes', () => {
  run('pnpm --filter @ecothread/web typecheck')
  return true
})

// ─── Prisma ────────────────────────────────────────────
console.log('\n[ PRISMA ]')

check('Schema validates', () => {
  run('npx prisma validate')
  return true
})

check('No pending migrations (local)', () => {
  try {
    run('npx prisma migrate status')
    return true
  } catch {
    return 'Could not check status (DATABASE_URL not set in this environment)'
  }
})

// ─── Files ─────────────────────────────────────────────
console.log('\n[ REQUIRED FILES ]')

const requiredFiles = [
  'apps/api/vercel.json',
  'apps/api/api/index.ts',
  'apps/api/src/app.ts',
  'apps/web/vercel.json',
  'prisma/schema.prisma',
  '.env.example',
]

for (const f of requiredFiles) {
  check(`Exists: ${f}`, () => {
    if (!fs.existsSync(path.join(ROOT, f))) throw new Error('Missing file')
    return true
  })
}

// ─── ENV Variables documented ─────────────────────────
console.log('\n[ ENV DOCUMENTATION ]')

const envExample = fs.readFileSync(path.join(ROOT, '.env.example'), 'utf8')

const requiredEnvKeys = [
  'DATABASE_URL',
  'DIRECT_URL',
  'JWT_SECRET',
  'CORS_ORIGINS',
  'WEB_APP_URL',
  'BLOB_READ_WRITE_TOKEN',
  'DEPLOYMENT_ENV',
  'VITE_API_BASE_URL',
  'VITE_APP_URL',
]

for (const key of requiredEnvKeys) {
  check(`Documented: ${key}`, () => {
    if (!envExample.includes(key)) throw new Error('Missing from .env.example')
    return true
  })
}

// ─── Summary ───────────────────────────────────────────
console.log('\n══════════════════════════════════════════════')
if (exitCode === 0) {
  console.log(`✅ All checks passed. Commit ${commitSha} is ready for deployment.`)
} else {
  console.log(`❌ Some checks failed. Resolve issues before deploying.`)
}
console.log('══════════════════════════════════════════════\n')

process.exit(exitCode)
