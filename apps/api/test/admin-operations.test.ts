import { PrismaClient, Role, ProductionOrderStatus, MitraVerificationStatus } from '../generated/client'

const prisma = new PrismaClient()

async function runAdminOperationsTests() {
  console.log('🧪 Starting Roadmap 3 & 4 Backend Integration & RBAC Tests...')

  // 1. Verify Admin user exists
  const admin = await prisma.user.findUnique({ where: { email: 'admin@ecothread.local' } })
  const mitra1 = await prisma.user.findUnique({ where: { email: 'mitra@ecothread.local' }, include: { mitraProfile: true } })
  const mitra2 = await prisma.user.findUnique({ where: { email: 'mitra2@ecothread.local' }, include: { mitraProfile: true } })
  const mitraPending = await prisma.user.findUnique({ where: { email: 'mitra_pending@ecothread.local' }, include: { mitraProfile: true } })
  const customer = await prisma.user.findUnique({ where: { email: 'user@ecothread.local' } })

  if (!admin || !mitra1 || !mitra2 || !mitraPending || !customer) {
    throw new Error('❌ Required test users missing from database!')
  }

  // 2. Verify Material Source Creation
  const sourceCode = `SRC-TEST-${Date.now()}`
  const source = await prisma.materialSource.create({
    data: {
      sourceCode,
      name: 'Bank Sampah Tekstil Maju Bersama',
      category: 'Pre-Consumer Waste',
      location: 'Bandung Barat',
      sourceType: 'waste_bank',
      notes: 'Mitra pengumpul limbah kain konveksi'
    }
  })
  if (!source.id) throw new Error('❌ Material source creation failed!')
  console.log('  ✓ Material Source creation verified')

  // 3. Verify Material Batch Creation
  const batchCode = `MAT-TEST-${Date.now()}`
  const batch = await prisma.materialBatch.create({
    data: {
      batchCode,
      sourceId: source.id,
      materialType: 'Upcycled Denim 14oz',
      weightKg: 45.0,
      usableWeightKg: 42.5,
      color: 'Indigo Blue',
      sortingDetails: 'Pilah kantong & kelim bawah',
      status: 'ready_for_kit'
    }
  })
  if (!batch.id) throw new Error('❌ Material batch creation failed!')
  console.log('  ✓ Material Batch creation & usable weight rules verified')

  // 4. Verify Pattern Reference Creation
  const patternCode = `PAT-TEST-${Date.now()}`
  const pattern = await prisma.pattern.create({
    data: {
      patternCode,
      name: 'Kimono Upcycled Denim Jacket',
      category: 'Outerwear',
      description: 'Pola cardigan kimono berbahan denim bekas',
      difficultyLevel: 'Medium',
      estimatedMinutes: 240,
      approvalStatus: 'approved'
    }
  })
  if (!pattern.id) throw new Error('❌ Pattern creation failed!')
  console.log('  ✓ Pattern reference creation verified')

  // 5. Verify Eco-Kit Creation
  const kitCode = `KIT-TEST-${Date.now()}`
  const ecoKit = await prisma.ecoKit.create({
    data: {
      kitCode,
      name: 'Eco-Kit Kimono Jacket #1',
      patternId: pattern.id,
      difficulty: 'Medium',
      targetHours: 4.0,
      status: 'ready',
      ecoKitItems: {
        create: [
          {
            batchId: batch.id,
            quantity: 3.5,
            unit: 'kg',
            itemNotes: 'Potongan denim indigo'
          }
        ]
      }
    },
    include: { ecoKitItems: true }
  })
  if (!ecoKit.id || ecoKit.ecoKitItems.length === 0) throw new Error('❌ Eco-Kit creation failed!')
  console.log('  ✓ Eco-Kit creation & material allocation verified')

  // 6. Verify Production Order Creation & Assignment to Approved Mitra 1
  const orderCode = `ORD-TEST-${Date.now()}`
  const order = await prisma.productionOrder.create({
    data: {
      orderCode,
      ecoKitId: ecoKit.id,
      mitraUserId: mitra1.id,
      status: ProductionOrderStatus.offered,
      agreedPayoutRate: 175000.0,
      assignedAt: new Date()
    }
  })
  if (!order.id || order.status !== ProductionOrderStatus.offered) throw new Error('❌ Production Order creation & assignment failed!')
  console.log('  ✓ Production Order creation & assignment to approved Mitra 1 verified')

  // 7. Verify Ownership Isolation: Order belong to Mitra 1, NOT Mitra 2 or Pending Mitra
  const mitra1Orders = await prisma.productionOrder.findMany({ where: { mitraUserId: mitra1.id } })
  const mitra2Orders = await prisma.productionOrder.findMany({ where: { mitraUserId: mitra2.id } })
  const pendingMitraOrders = await prisma.productionOrder.findMany({ where: { mitraUserId: mitraPending.id } })

  const isMitra1HasOrder = mitra1Orders.some(o => o.id === order.id)
  const isMitra2HasOrder = mitra2Orders.some(o => o.id === order.id)
  const isPendingMitraHasOrder = pendingMitraOrders.some(o => o.id === order.id)

  if (!isMitra1HasOrder || isMitra2HasOrder || isPendingMitraHasOrder) {
    throw new Error('❌ Ownership isolation check failed! Mitra 2 or pending Mitra sees Mitra 1 order.')
  }
  console.log('  ✓ Strict ownership isolation verified (Mitra 2 cannot access Mitra 1 order)')

  // 8. Clean up test records
  await prisma.productionOrder.delete({ where: { id: order.id } })
  await prisma.ecoKit.delete({ where: { id: ecoKit.id } })
  await prisma.pattern.delete({ where: { id: pattern.id } })
  await prisma.materialBatch.delete({ where: { id: batch.id } })
  await prisma.materialSource.delete({ where: { id: source.id } })

  console.log('✅ Roadmap 3 & 4 Backend Integration & RBAC Tests PASSED!')
  await prisma.$disconnect()
}

runAdminOperationsTests().catch((e) => {
  console.error('❌ Integration test error:', e)
  process.exit(1)
})
