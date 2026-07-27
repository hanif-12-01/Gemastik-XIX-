import crypto from 'crypto'
import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

async function runAuthTests() {
  console.log('🧪 Starting ECOT-MVP-002 Auth & RBAC Integration Tests...')

  // 1. Verify Seed Users Exist in Database
  const admin = await prisma.user.findUnique({ where: { email: 'admin@ecothread.local' } })
  const mitra = await prisma.user.findUnique({ where: { email: 'mitra@ecothread.local' } })
  const user = await prisma.user.findUnique({ where: { email: 'user@ecothread.local' } })

  if (!admin || !mitra || !user) {
    throw new Error('❌ Seed users are missing from database!')
  }

  console.log('  ✓ Seed users exist in database')

  // 2. Verify Password Hashing
  const validHash = hashPassword('Password123!')
  if (admin.passwordHash !== validHash) {
    throw new Error('❌ Admin password hash mismatch!')
  }
  console.log('  ✓ Password hash verification passed')

  // 3. Verify RBAC Roles
  if (admin.role !== Role.admin) throw new Error('❌ Admin role check failed')
  if (mitra.role !== Role.mitra) throw new Error('❌ Mitra role check failed')
  if (user.role !== Role.user) throw new Error('❌ User role check failed')
  console.log('  ✓ Role assignments verified (admin, mitra, user)')

  console.log('✅ ECOT-MVP-002 Auth & RBAC Integration Tests PASSED!')
  await prisma.$disconnect()
}

runAuthTests().catch((e) => {
  console.error('❌ Auth test error:', e)
  process.exit(1)
})
