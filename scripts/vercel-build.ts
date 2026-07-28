#!/usr/bin/env tsx
import 'dotenv/config'
import { execSync } from 'node:child_process'

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.PRISMA_DATABASE_URL

const directUrl =
  process.env.DIRECT_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  databaseUrl

if (!databaseUrl) {
  console.error('')
  console.error('❌ EcoThread deployment dihentikan: database production belum terhubung.')
  console.error('   Hubungkan PostgreSQL pada Vercel project dan sediakan DATABASE_URL.')
  console.error('   Nama legacy POSTGRES_PRISMA_URL atau POSTGRES_URL juga didukung.')
  process.exit(1)
}

process.env.DATABASE_URL = databaseUrl
process.env.DIRECT_URL = directUrl || databaseUrl

function run(command: string) {
  execSync(command, {
    env: process.env,
    stdio: 'inherit'
  })
}

console.log('✅ Database environment ditemukan. Menyiapkan deployment EcoThread...')

run('pnpm db:generate')
run('pnpm exec prisma migrate deploy')
run('pnpm db:seed')
run('pnpm --filter @ecothread/contracts build')
run('pnpm --filter @ecothread/api-client build')
run('pnpm --filter @ecothread/api build')
run('pnpm --filter @ecothread/web build')

console.log('✅ Build, migrasi, dan seed demo EcoThread selesai.')
