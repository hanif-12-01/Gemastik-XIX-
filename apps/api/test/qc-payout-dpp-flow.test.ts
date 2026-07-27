import { EcoThreadApiClient } from '@ecothread/api-client'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const adminClient = new EcoThreadApiClient('http://localhost:4000/api/v1')
const mitraClient = new EcoThreadApiClient('http://localhost:4000/api/v1')
const publicClient = new EcoThreadApiClient('http://localhost:4000/api/v1')

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`Assertion failed: ${msg}`)
}

async function testQcPayoutDppFlow() {
  console.log('🧪 Starting ECOT-MVP-005 QC, Payout, Product, & DPP Integration Tests...')

  // Logins
  await adminClient.login('admin@ecothread.local', 'Password123!')
  const mitraAuth = await mitraClient.login('mitra@ecothread.local', 'Password123!')

  // 1. Create order & assign
  const ecoKit = await prisma.ecoKit.findFirst()
  const order = await adminClient.createProductionOrder({
    ecoKitId: ecoKit!.id,
    agreedPayoutRate: 250000.0
  })
  await adminClient.assignOrder(order.id, mitraAuth.user.id)
  await mitraClient.acceptOrder(order.id)
  console.log(`  ✓ Order ${order.orderCode} created and accepted by Mitra`)

  // 2. Mitra submits QC evidence (front, back, detail photos)
  const qcSubmission = await mitraClient.submitQcEvidence(order.id, {
    frontPhoto: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600',
    backPhoto: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&q=80&w=600',
    detailPhoto: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=600',
    notes: 'Jahitan selesai presisi tinggi',
    actualSize: 'L'
  })
  assert(qcSubmission.order.status === 'submitted_to_qc', 'Order status updated to submitted_to_qc')
  console.log('  ✓ Mitra submitted QC evidence (front, back, detail photos)')

  // 3. Admin performs QC Review with checklist & approves
  const qcDecision = await adminClient.submitQcDecision(order.id, {
    isApproved: true,
    decisionNotes: 'QC Lolos 100%. Jahitan sangat rapi dan presisi.',
    checkFront: true,
    checkBack: true,
    checkStitching: true,
    checkMeasures: true
  })
  assert(qcDecision.order.status === 'qc_approved', 'Order status updated to qc_approved')
  console.log('  ✓ Admin approved QC with 4-item checklist')

  // 4. Verify Idempotent Payout Created
  const payout = await prisma.payout.findFirst({ where: { orderId: order.id } })
  assert(!!payout, 'Payout created automatically after QC approval')
  assert(payout?.amount === 250000.0, 'Payout amount matches agreed rate')
  assert(payout?.status === 'pending', 'Payout status is pending')
  console.log(`  ✓ Payout record created (Amount: Rp ${payout?.amount.toLocaleString('id-ID')}, Status: pending)`)

  // 5. Admin marks payout as paid with payment reference
  const paidPayout = await adminClient.markPayoutPaid(payout!.id, 'PAY-BCA-20260727-888')
  assert(paidPayout.status === 'paid', 'Payout status updated to paid')
  assert(paidPayout.paymentReference === 'PAY-BCA-20260727-888', 'Payment reference recorded')

  const completedOrder = await prisma.productionOrder.findUnique({ where: { id: order.id } })
  assert(completedOrder?.status === 'completed', 'Order status updated to completed after payout')
  console.log(`  ✓ Admin marked payout paid with reference ${paidPayout.paymentReference}, order status: completed`)

  // 6. Admin creates product & publishes DPP
  const product = await adminClient.createProduct({
    productionOrderId: order.id,
    name: 'Upcycled Patchwork Kimono Jacket - Flow Test',
    description: 'Edisi terbatas jaket kimono daur ulang denim.',
    size: 'L',
    category: 'Outerwear',
    beforeImageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600',
    afterImageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600'
  })

  const dppRecord = await adminClient.publishDpp(product.id)
  assert(dppRecord.verificationState === 'database_verified', 'DPP verification state is database_verified')
  console.log(`  ✓ Product created (${product.productCode}) and DPP published (State: ${dppRecord.verificationState})`)

  // 7. Public fetches DPP by productCode
  const publicDpp = await publicClient.getDpp(product.productCode)
  assert(publicDpp.productCode === product.productCode, 'Public DPP product code matches')
  assert(publicDpp.product.name === product.name, 'Public DPP product name matches')
  assert(publicDpp.verificationState === 'database_verified', 'Public DPP verification state is database_verified')
  assert(publicDpp.product.impactRecords.length > 0, 'Impact metrics included')
  console.log(`  ✓ Public DPP fetched successfully for ${product.productCode}!`)

  console.log('✅ All ECOT-MVP-005 QC, Payout, Product, & DPP Tests PASSED!')
  await prisma.$disconnect()
}

testQcPayoutDppFlow().catch((e) => {
  console.error('❌ QC Payout DPP Flow test error:', e)
  process.exit(1)
})
