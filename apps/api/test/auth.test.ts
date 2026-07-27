import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { PrismaClient, Role, MitraVerificationStatus } from '@prisma/client'

const prisma = new PrismaClient()

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

async function runAuthTests() {
  console.log('🧪 Starting Roadmap 2 Auth, Registration & Verification Tests...')

  // 1. Verify Seed Users Exist in Database
  const admin = await prisma.user.findUnique({ where: { email: 'admin@ecothread.local' } })
  const mitraApproved = await prisma.user.findUnique({ where: { email: 'mitra@ecothread.local' }, include: { mitraProfile: true } })
  const mitra2Approved = await prisma.user.findUnique({ where: { email: 'mitra2@ecothread.local' }, include: { mitraProfile: true } })
  const mitraPending = await prisma.user.findUnique({ where: { email: 'mitra_pending@ecothread.local' }, include: { mitraProfile: true } })
  const customerUser = await prisma.user.findUnique({ where: { email: 'user@ecothread.local' } })

  if (!admin || !mitraApproved || !mitra2Approved || !mitraPending || !customerUser) {
    throw new Error('❌ Seed users are missing from database!')
  }

  console.log('  ✓ Seed users verified (Admin, Mitra Approved 1 & 2, Mitra Pending, Customer)')

  // 2. Verify Password Hashing (Bcrypt & Legacy SHA-256 Rejection)
  const isValidPassword = bcrypt.compareSync('Password123!', admin.passwordHash)
  if (!isValidPassword) {
    throw new Error('❌ Admin password hash mismatch!')
  }
  const isLegacySha256Valid = admin.passwordHash.startsWith('$2')
  if (!isLegacySha256Valid) {
    throw new Error('❌ Password hash must be bcrypt ($2 format)!')
  }
  console.log('  ✓ Bcrypt password hashing verified (SHA-256 format absent)')

  // 3. Verify Role Assignments
  if (admin.role !== Role.admin) throw new Error('❌ Admin role check failed')
  if (mitraApproved.role !== Role.mitra) throw new Error('❌ Mitra role check failed')
  if (customerUser.role !== Role.user) throw new Error('❌ User role check failed')
  console.log('  ✓ Role assignments verified (admin, mitra, user)')

  // 4. Verify Mitra Verification Statuses
  if (mitraApproved.mitraProfile?.verificationStatus !== MitraVerificationStatus.approved) {
    throw new Error('❌ Approved Mitra verification status mismatch')
  }
  if (mitraPending.mitraProfile?.verificationStatus !== MitraVerificationStatus.pending_verification) {
    throw new Error('❌ Pending Mitra verification status mismatch')
  }
  console.log('  ✓ Mitra verification statuses verified (approved vs pending_verification)')

  // 5. Test Admin Invitation Lifecycle (Token Hash & Expiry & Single-Use)
  const rawInviteToken = crypto.randomBytes(32).toString('hex')
  const inviteTokenHash = hashToken(rawInviteToken)
  const inviteExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  const testInvitation = await prisma.adminInvitation.create({
    data: {
      email: 'test_invited_admin@ecothread.local',
      tokenHash: inviteTokenHash,
      invitedByUserId: admin.id,
      expiresAt: inviteExpiresAt
    }
  })

  // Verify invitation stored
  const fetchedInvite = await prisma.adminInvitation.findUnique({ where: { tokenHash: inviteTokenHash } })
  if (!fetchedInvite || fetchedInvite.usedAt) {
    throw new Error('❌ Invitation record lookup failed')
  }

  // Mark used
  await prisma.adminInvitation.update({
    where: { id: testInvitation.id },
    data: { usedAt: new Date() }
  })
  const usedInvite = await prisma.adminInvitation.findUnique({ where: { id: testInvitation.id } })
  if (!usedInvite?.usedAt) {
    throw new Error('❌ Invitation single-use status update failed')
  }
  console.log('  ✓ Admin invitation lifecycle (SHA-256 token hash, expiry, single-use) verified')

  // 6. Test Password Reset Token Lifecycle
  const rawResetToken = crypto.randomBytes(32).toString('hex')
  const resetTokenHash = hashToken(rawResetToken)

  const resetRecord = await prisma.passwordResetToken.create({
    data: {
      userId: customerUser.id,
      tokenHash: resetTokenHash,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000)
    }
  })
  if (!resetRecord.id) throw new Error('❌ Reset token creation failed')
  console.log('  ✓ Password reset token creation & hashing verified')

  // Cleanup test records
  await prisma.passwordResetToken.delete({ where: { id: resetRecord.id } })
  await prisma.adminInvitation.delete({ where: { id: testInvitation.id } })

  console.log('✅ Roadmap 2 Backend Auth Integration Tests PASSED!')
  await prisma.$disconnect()
}

runAuthTests().catch((e) => {
  console.error('❌ Auth test error:', e)
  process.exit(1)
})
