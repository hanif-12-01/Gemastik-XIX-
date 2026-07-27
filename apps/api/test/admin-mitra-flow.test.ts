import { EcoThreadApiClient } from '@ecothread/api-client'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const adminClient = new EcoThreadApiClient('http://localhost:4000/api/v1')
const mitra1Client = new EcoThreadApiClient('http://localhost:4000/api/v1')
const mitra2Client = new EcoThreadApiClient('http://localhost:4000/api/v1')

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`Assertion failed: ${msg}`)
}

async function testAdminMitraFlow() {
  console.log('🧪 Starting ECOT-MVP-004 Admin <-> Mitra Integration Flow Tests...')

  // 1. Create a second Mitra user for isolation testing
  let mitra2User = await prisma.user.findUnique({ where: { email: 'mitra2@ecothread.local' } })
  if (!mitra2User) {
    const crypto = await import('crypto')
    mitra2User = await prisma.user.create({
      data: {
        email: 'mitra2@ecothread.local',
        passwordHash: crypto.createHash('sha256').update('Password123!').digest('hex'),
        role: 'mitra',
        name: 'Pak Budi (Mitra Penjahit Cimahi)',
        mitraProfile: {
          create: {
            workshopName: 'Budi Craft Cimahi',
            location: 'Cimahi'
          }
        }
      }
    })
  }

  // Logins
  await adminClient.login('admin@ecothread.local', 'Password123!')
  const mitra1Auth = await mitra1Client.login('mitra@ecothread.local', 'Password123!')
  await mitra2Client.login('mitra2@ecothread.local', 'Password123!')
  console.log('  ✓ Admin, Mitra 1, and Mitra 2 logged in')

  // 2. Admin creates material batch & order
  const batch = await adminClient.createMaterialBatch({
    sourceName: 'Hub Solokan Jeruk',
    materialType: 'Flannel Sisa Cutting',
    weightKg: 15.0
  })

  const ecoKit = await prisma.ecoKit.findFirst()
  const order = await adminClient.createProductionOrder({
    ecoKitId: ecoKit!.id,
    agreedPayoutRate: 200000.0
  })
  console.log(`  ✓ Admin created order ${order.orderCode}`)

  // 3. Admin assigns order to Mitra 1
  const assigned = await adminClient.assignOrder(order.id, mitra1Auth.user.id)
  assert(assigned.status === 'offered', 'Order is offered to Mitra 1')
  console.log(`  ✓ Admin assigned ${order.orderCode} to Mitra 1 (${mitra1Auth.user.name})`)

  // 4. Isolation Check: Mitra 1 sees the order, Mitra 2 DOES NOT see Mitra 1's order
  const mitra1Orders = await mitra1Client.getMitraOrders()
  const mitra2Orders = await mitra2Client.getMitraOrders()

  const foundInMitra1 = mitra1Orders.some((o: any) => o.id === order.id)
  const foundInMitra2 = mitra2Orders.some((o: any) => o.id === order.id)

  assert(foundInMitra1 === true, "Assigned order appears in Mitra 1's order list")
  assert(foundInMitra2 === false, "Assigned order DOES NOT appear in Mitra 2's list (Isolation Verified)")
  console.log('  ✓ Mitra isolation verified: Mitra 2 cannot see Mitra 1 order')

  // 5. Mitra 1 accepts & updates progress
  await mitra1Client.acceptOrder(order.id)
  await mitra1Client.updateProgress(order.id, {
    stepName: 'Proses Jahit Furing',
    percentage: 75.0,
    notes: 'Hampir selesai'
  })
  console.log('  ✓ Mitra 1 accepted and updated progress to 75%')

  // 6. Admin checks order status in real time
  const updatedOrder = await prisma.productionOrder.findUnique({
    where: { id: order.id },
    include: { productionProgress: true }
  })
  assert(updatedOrder?.status === 'in_progress', 'Order status in Admin backend is updated to in_progress')
  assert(updatedOrder?.productionProgress.length! > 0, 'Progress step visible in Admin backend')
  console.log(`  ✓ Admin backend verified order status: ${updatedOrder?.status}, latest progress: ${updatedOrder?.productionProgress[0].percentage}%`)

  console.log('✅ All ECOT-MVP-004 Admin <-> Mitra Flow Tests PASSED!')
  await prisma.$disconnect()
}

testAdminMitraFlow().catch((e) => {
  console.error('❌ Admin-Mitra Flow test error:', e)
  process.exit(1)
})
