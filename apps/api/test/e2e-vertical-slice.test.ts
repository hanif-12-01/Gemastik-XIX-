import { EcoThreadApiClient } from '@ecothread/api-client'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const adminClient = new EcoThreadApiClient('http://localhost:4000/api/v1')
const mitraClient = new EcoThreadApiClient('http://localhost:4000/api/v1')
const userClient = new EcoThreadApiClient('http://localhost:4000/api/v1')
const publicClient = new EcoThreadApiClient('http://localhost:4000/api/v1')

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`Assertion failed: ${msg}`)
}

async function runFullVerticalSlice() {
  console.log('🚀 ==============================================================')
  console.log('🚀 ECOTHREAD MVP FULL E2E VERTICAL SLICE TEST SUITE')
  console.log('🚀 ==============================================================')

  // Step 1: Admin Login
  const adminAuth = await adminClient.login('admin@ecothread.local', 'Password123!')
  assert(adminAuth.user.role === 'admin', 'Admin login successful')
  console.log('✅ STEP 1: Admin logged in (Super Admin EcoThread)')

  // Step 2: Admin creates Material Batch & Production Order
  const batch = await adminClient.createMaterialBatch({
    sourceName: 'Bank Sampah Majalaya E2E',
    materialType: '100% Upcycled Denim & Flannel',
    weightKg: 20.0
  })
  assert(batch.batchCode.startsWith('MAT-2026-'), 'Material batch created')

  const ecoKit = await prisma.ecoKit.findFirst()
  const order = await adminClient.createProductionOrder({
    ecoKitId: ecoKit!.id,
    agreedPayoutRate: 200000.0
  })
  assert(order.status === 'draft', 'Production order created in draft')
  console.log(`✅ STEP 2: Material batch (${batch.batchCode}) & Production order (${order.orderCode}) created`)

  // Step 3: Admin assigns Order to Mitra
  const mitraAuth = await mitraClient.login('mitra@ecothread.local', 'Password123!')
  const assignedOrder = await adminClient.assignOrder(order.id, mitraAuth.user.id)
  assert(assignedOrder.status === 'offered', 'Order status updated to offered')
  console.log(`✅ STEP 3: Order assigned to Mitra (${mitraAuth.user.name})`)

  // Step 4: Mitra accepts Order & updates progress
  const acceptedOrder = await mitraClient.acceptOrder(order.id)
  assert(acceptedOrder.status === 'accepted', 'Mitra accepted order')

  const progress = await mitraClient.updateProgress(order.id, {
    stepName: 'Finishing Jahit Kimono',
    percentage: 100.0,
    notes: 'Jahitan selesai 100%'
  })
  assert(progress.percentage === 100.0, 'Progress set to 100%')
  console.log('✅ STEP 4: Mitra accepted order & updated progress to 100%')

  // Step 5: Mitra submits QC evidence
  const qcEvidence = await mitraClient.submitQcEvidence(order.id, {
    frontPhoto: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600',
    backPhoto: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&q=80&w=600',
    detailPhoto: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=600',
    notes: 'Kualitas jahitan rapi, tanpa cacat',
    actualSize: 'L'
  })
  assert(qcEvidence.order.status === 'submitted_to_qc', 'Status updated to submitted_to_qc')
  console.log('✅ STEP 5: Mitra submitted front, back, detail QC photos')

  // Step 6: Admin reviews QC & approves
  const qcReview = await adminClient.submitQcDecision(order.id, {
    isApproved: true,
    decisionNotes: 'QC Lolos 100%. Sangat presisi.',
    checkFront: true,
    checkBack: true,
    checkStitching: true,
    checkMeasures: true
  })
  assert(qcReview.order.status === 'qc_approved', 'Order status updated to qc_approved')
  console.log('✅ STEP 6: Admin approved QC with 4-item checklist')

  // Step 7: Admin marks Payout as Paid
  const payout = await prisma.payout.findFirst({ where: { orderId: order.id } })
  assert(!!payout, 'Payout created automatically')
  const paidPayout = await adminClient.markPayoutPaid(payout!.id, 'PAY-BCA-E2E-2026')
  assert(paidPayout.status === 'paid', 'Payout marked paid')
  console.log(`✅ STEP 7: Payout paid (Rp ${payout?.amount.toLocaleString('id-ID')}, Ref: ${paidPayout.paymentReference})`)

  // Step 8: Admin creates Product & Publishes Dynamic DPP
  const product = await adminClient.createProduct({
    productionOrderId: order.id,
    name: 'EcoThread Kimono Denim Jacket (E2E Edition)',
    description: 'Edisi spesial hasil karya Mitra Ibu Ratna dari limbah garmen.',
    size: 'L',
    category: 'Outerwear',
    beforeImageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600',
    afterImageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600'
  })

  const dpp = await adminClient.publishDpp(product.id)
  assert(dpp.verificationState === 'database_verified', 'DPP verificationState is database_verified')
  console.log(`✅ STEP 8: Product created (${product.productCode}) & Dynamic DPP published`)

  // Step 9: User opens Public DPP
  const publicDpp = await publicClient.getDpp(product.productCode)
  assert(publicDpp.productCode === product.productCode, 'Public DPP code matches')
  assert(publicDpp.verificationState === 'database_verified', 'Verification state is database_verified')
  console.log(`✅ STEP 9: User scanned QR & opened public DPP (/dpp/${product.productCode})`)

  // Step 10: User places Pre-Order & uploads Deposit Payment Proof
  const userAuth = await userClient.login('user@ecothread.local', 'Password123!')
  const catalog = await publicClient.getCatalog()
  const targetItem = catalog.find((c: any) => c.productId === product.id) || catalog[0]

  const customerOrder = await userClient.createCustomerOrder({
    catalogItemId: targetItem.id,
    quantity: 1,
    shippingAddress: 'Jl. Ir. H. Juanda No. 123, Bandung'
  })
  assert(customerOrder.status === 'pending_payment', 'Pre-order status is pending_payment')

  const payment = await userClient.submitPaymentProof(customerOrder.id, {
    paymentProofUrl: 'https://images.unsplash.com/photo-1556742049-0a67daf40955?auto=format&fit=crop&q=80&w=600',
    amount: targetItem.depositAmount
  })
  assert(payment.order.status === 'payment_verified', 'Customer order updated to payment_verified')
  console.log(`✅ STEP 10: User placed pre-order (${customerOrder.orderCode}) & payment proof verified!`)

  console.log('🎉 ==============================================================')
  console.log('🎉 ECOTHREAD MVP FULL E2E VERTICAL SLICE PASSED 100% SUCCESSFULLY!')
  console.log('🎉 ==============================================================')

  await prisma.$disconnect()
}

runFullVerticalSlice().catch((e) => {
  console.error('❌ E2E Vertical Slice Test failed:', e)
  process.exit(1)
})
