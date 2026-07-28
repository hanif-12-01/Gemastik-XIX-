import { EcoThreadApiClient } from '@ecothread/api-client'
import { PrismaClient } from '../generated/client'

const prisma = new PrismaClient()
const adminClient = new EcoThreadApiClient('http://localhost:4000/api/v1')
const mitraClient = new EcoThreadApiClient('http://localhost:4000/api/v1')

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`Assertion failed: ${msg}`)
}

async function testCoreDataApi() {
  console.log('🧪 Starting ECOT-MVP-003 Core Data & API Integration Tests...')

  // Login Admin & Mitra
  await adminClient.login('admin@ecothread.local', 'Password123!')
  await mitraClient.login('mitra@ecothread.local', 'Password123!')
  console.log('  ✓ Logged in as Admin and Mitra')

  // 1. Create Material Batch
  const newBatch = await adminClient.createMaterialBatch({
    sourceName: 'Bank Sampah Majalaya 2',
    materialType: 'Cotton Waste Grade A',
    weightKg: 30.0,
    color: 'Navy Blue'
  })
  assert(!!newBatch.id, 'Material batch created with UUID')
  assert(newBatch.batchCode.startsWith('MAT-2026-'), 'Material batch code generated correctly')
  console.log(`  ✓ Material batch created: ${newBatch.batchCode}`)

  // 2. Fetch Material Batches
  const batches = await adminClient.getMaterialBatches()
  assert(Array.isArray(batches) && batches.length > 0, 'Material batches list returned')
  console.log(`  ✓ Fetched ${batches.length} material batches`)

  // 3. Create Production Order
  const ecoKit = await prisma.ecoKit.findFirst()
  assert(!!ecoKit, 'EcoKit exists for testing')

  const newOrder = await adminClient.createProductionOrder({
    ecoKitId: ecoKit!.id,
    agreedPayoutRate: 180000.0
  })
  assert(!!newOrder.id, 'Production order created with UUID')
  assert(newOrder.orderCode.startsWith('ORD-2026-'), 'Order code generated correctly')
  assert(newOrder.status === 'draft', 'New order starts in draft status')
  console.log(`  ✓ Production order created: ${newOrder.orderCode}`)

  // 4. Assign Order to Mitra
  const mitraUser = await prisma.user.findUnique({ where: { email: 'mitra@ecothread.local' } })
  assert(!!mitraUser, 'Mitra user exists')

  const assignedOrder = await adminClient.assignOrder(newOrder.id, mitraUser!.id)
  assert(assignedOrder.status === 'offered', 'Assigned order transitions to offered status')
  console.log(`  ✓ Production order assigned to Mitra, status: ${assignedOrder.status}`)

  // 5. Mitra Accepts Order
  const acceptedOrder = await mitraClient.acceptOrder(newOrder.id)
  assert(acceptedOrder.status === 'accepted', 'Mitra accepts order, status: accepted')
  console.log(`  ✓ Mitra accepted order: ${acceptedOrder.orderCode}`)

  // 6. Mitra Updates Progress
  const progress = await mitraClient.updateProgress(newOrder.id, {
    stepName: 'Pemotongan & Pemetaan',
    percentage: 50.0,
    notes: 'Kain telah dipotong sesuai pola'
  })
  assert(progress.percentage === 50.0, 'Progress percentage recorded')
  console.log('  ✓ Mitra updated progress to 50%')

  // 7. Verify Audit Logs Recorded
  const auditLogs = await prisma.auditLog.findMany({
    where: { entityId: newOrder.id }
  })
  assert(auditLogs.length >= 2, 'Audit logs recorded for order creation & assignment')
  console.log(`  ✓ Audit logs recorded successfully (${auditLogs.length} logs for order)`)

  console.log('✅ All ECOT-MVP-003 Core Data & API Tests PASSED!')
  await prisma.$disconnect()
}

testCoreDataApi().catch((e) => {
  console.error('❌ Core Data API test error:', e)
  process.exit(1)
})
