import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const dbUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL || ''
  console.log('🔍 Validating target database URL for reset...')

  if (dbUrl.includes('prod') || dbUrl.includes('production') || dbUrl.includes('rds.amazonaws.com') || dbUrl.includes('supabase.co')) {
    console.error('❌ SAFETY GUARD TRIGGERED: Refusing to reset database URL that appears to be production!')
    process.exit(1)
  }

  console.log('🧹 Truncating non-essential data for test reset...')
  await prisma.$transaction([
    prisma.auditLog.deleteMany({}),
    prisma.payment.deleteMany({}),
    prisma.customerOrderItem.deleteMany({}),
    prisma.customerOrder.deleteMany({}),
    prisma.impactRecord.deleteMany({}),
    prisma.dppVersion.deleteMany({}),
    prisma.dppRecord.deleteMany({}),
    prisma.catalogItem.deleteMany({}),
    prisma.productMaterial.deleteMany({}),
    prisma.product.deleteMany({}),
    prisma.payout.deleteMany({}),
    prisma.qcReview.deleteMany({}),
    prisma.productionEvidence.deleteMany({}),
    prisma.productionProgress.deleteMany({}),
    prisma.productionIssue.deleteMany({}),
    prisma.productionOrder.deleteMany({}),
    prisma.ecoKitItem.deleteMany({}),
    prisma.ecoKit.deleteMany({}),
    prisma.patternVersion.deleteMany({}),
    prisma.pattern.deleteMany({}),
    prisma.sanitizationRecord.deleteMany({}),
    prisma.materialBatch.deleteMany({}),
    prisma.materialSource.deleteMany({}),
    prisma.adminInvitation.deleteMany({}),
    prisma.passwordResetToken.deleteMany({}),
    prisma.mitraProfile.deleteMany({}),
    prisma.userProfile.deleteMany({}),
    prisma.user.deleteMany({})
  ])

  console.log('✅ Deterministic Test Database Reset Completed Successfully!')
}

main()
  .catch((e) => {
    console.error('❌ DB Reset error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
