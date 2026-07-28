import { EcoThreadApiClient } from '@ecothread/api-client'
import { PrismaClient } from '../generated/client'

const prisma = new PrismaClient()
const adminClient = new EcoThreadApiClient('http://localhost:4000/api/v1')
const mitra1Client = new EcoThreadApiClient('http://localhost:4000/api/v1')
const mitra2Client = new EcoThreadApiClient('http://localhost:4000/api/v1')
const userClient = new EcoThreadApiClient('http://localhost:4000/api/v1')

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`Assertion failed: ${msg}`)
}

async function testBackendHardeningMutations() {
  console.log('🧪 Starting ECOT-HARDEN-001 Backend Mutation Hardening Tests...')

  // 1. Logins
  await adminClient.login('admin@ecothread.local', 'Password123!')
  const mitra1Auth = await mitra1Client.login('mitra@ecothread.local', 'Password123!')
  await mitra2Client.login('mitra2@ecothread.local', 'Password123!')
  await userClient.login('user@ecothread.local', 'Password123!')
  console.log('  ✓ Admin, Mitra 1, Mitra 2, and User logged in successfully')

  // 2. Admin creates order for Mitra 1
  const ecoKit = await prisma.ecoKit.findFirst()
  assert(!!ecoKit, 'EcoKit must exist in DB')

  const order1 = await adminClient.createProductionOrder({
    ecoKitId: ecoKit!.id,
    agreedPayoutRate: 180000.0
  })
  await adminClient.assignOrder(order1.id, mitra1Auth.user.id)
  console.log(`  ✓ Order ${order1.orderCode} assigned to Mitra 1`)

  // 3. Ownership Guard Tests for Mitra 2 on Mitra 1's Order
  // 3a. Accept non-owned order -> 404
  try {
    await mitra2Client.acceptOrder(order1.id)
    throw new Error('Mitra 2 should not be able to accept Mitra 1 order')
  } catch (e: any) {
    assert(e.message.includes('404') || e.message.includes('tidak ditemukan'), 'Mitra 2 accept on Mitra 1 order rejected with 404')
    console.log('  ✓ Mitra 2 accept order Mitra 1 rejected with 404')
  }

  // 3b. Reject non-owned order -> 404
  try {
    await mitra2Client.rejectOrder(order1.id, 'Bukan milik saya')
    throw new Error('Mitra 2 should not be able to reject Mitra 1 order')
  } catch (e: any) {
    assert(e.message.includes('404') || e.message.includes('tidak ditemukan'), 'Mitra 2 reject on Mitra 1 order rejected with 404')
    console.log('  ✓ Mitra 2 reject order Mitra 1 rejected with 404')
  }

  // 3c. Progress non-owned order -> 404
  try {
    await mitra2Client.updateProgress(order1.id, { stepName: 'Intrusive Progress', percentage: 50 })
    throw new Error('Mitra 2 should not be able to update progress on Mitra 1 order')
  } catch (e: any) {
    assert(e.message.includes('404') || e.message.includes('tidak ditemukan'), 'Mitra 2 progress on Mitra 1 order rejected with 404')
    console.log('  ✓ Mitra 2 progress update on Mitra 1 order rejected with 404')
  }

  // 3d. Submit QC non-owned order -> 404
  try {
    await mitra2Client.submitQcEvidence(order1.id, {
      frontPhoto: '/uploads/front.jpg',
      backPhoto: '/uploads/back.jpg',
      detailPhoto: '/uploads/detail.jpg'
    })
    throw new Error('Mitra 2 should not be able to submit QC for Mitra 1 order')
  } catch (e: any) {
    assert(e.message.includes('404') || e.message.includes('tidak ditemukan'), 'Mitra 2 QC submit on Mitra 1 order rejected with 404')
    console.log('  ✓ Mitra 2 submit QC on Mitra 1 order rejected with 404')
  }

  // 4. Invalid State Guard Test
  // Mitra 1 attempts to submit QC before accepting/progressing (when status is offered)
  try {
    await mitra1Client.submitQcEvidence(order1.id, {
      frontPhoto: '/uploads/front.jpg',
      backPhoto: '/uploads/back.jpg',
      detailPhoto: '/uploads/detail.jpg'
    })
    throw new Error('Should not allow submit QC on offered status')
  } catch (e: any) {
    assert(e.message.includes('400') || e.message.includes('tidak diizinkan'), 'Submit QC on offered order rejected with 400')
    console.log('  ✓ Submit QC on offered status rejected with 400')
  }

  // Mitra 1 accepts order
  await mitra1Client.acceptOrder(order1.id)
  console.log('  ✓ Mitra 1 accepted order successfully')

  // Mitra 1 attempts reject AFTER accepted -> 400 (hanya offered yang boleh reject)
  try {
    await mitra1Client.rejectOrder(order1.id, 'Terlambat menolak')
    throw new Error('Should not allow reject on accepted status')
  } catch (e: any) {
    assert(e.message.includes('400') || e.message.includes('offered'), 'Reject on accepted order rejected with 400')
    console.log('  ✓ Reject on accepted status rejected with 400')
  }

  // 5. Payment Validation & Protection Tests
  const catalogItem = await prisma.catalogItem.findFirst()
  assert(!!catalogItem, 'Catalog item must exist')

  const customerOrder = await userClient.createCustomerOrder({
    catalogItemId: catalogItem!.id,
    quantity: 1,
    shippingAddress: 'Jl. Pemuda No. 10, Bandung'
  })
  console.log(`  ✓ Customer created order ${customerOrder.orderCode} with total ${customerOrder.totalAmount}`)

  // 5a. Payment with wrong amount -> 400
  try {
    await userClient.submitPaymentProof(customerOrder.id, {
      paymentProofUrl: '/uploads/receipt-fake.jpg',
      amount: 1000 // Wrong amount!
    })
    throw new Error('Should reject payment proof with invalid amount')
  } catch (e: any) {
    assert(e.message.includes('400') || e.message.includes('tidak sesuai'), 'Payment proof with invalid amount rejected with 400')
    console.log('  ✓ Payment proof with invalid amount rejected with 400')
  }

  // 5b. Valid payment proof submission
  const validPaymentRes = await userClient.submitPaymentProof(customerOrder.id, {
    paymentProofUrl: '/uploads/receipt-valid.jpg',
    amount: customerOrder.totalAmount
  })
  assert(validPaymentRes.order.status === 'payment_proof_submitted', 'Customer order status updated to payment_proof_submitted')
  console.log('  ✓ Valid payment proof submitted, order status is payment_proof_submitted')

  // 5c. Resubmission on payment_proof_submitted status -> 400
  try {
    await userClient.submitPaymentProof(customerOrder.id, {
      paymentProofUrl: '/uploads/receipt-duplicate.jpg',
      amount: customerOrder.totalAmount
    })
    throw new Error('Should not allow upload when already proof submitted')
  } catch (e: any) {
    assert(e.message.includes('400') || e.message.includes('tidak dapat diunggah'), 'Duplicate payment proof upload rejected with 400')
    console.log('  ✓ Resubmission when already proof submitted rejected with 400')
  }

  // 5d. Admin Verifies Payment
  const verifyRes = await adminClient.verifyPayment(validPaymentRes.payment.id, true)
  assert(verifyRes.order.status === 'payment_verified', 'Order status updated to payment_verified by Admin')
  assert(verifyRes.payment.isVerified === true, 'Payment marked verified by Admin')
  console.log('  ✓ Admin verified payment successfully, order status updated to payment_verified')

  // 5e. Re-verifying already verified payment -> 400
  try {
    await adminClient.verifyPayment(validPaymentRes.payment.id, true)
    throw new Error('Should not allow re-verifying already verified payment')
  } catch (e: any) {
    assert(e.message.includes('400') || e.message.includes('sudah diverifikasi'), 'Re-verification rejected with 400')
    console.log('  ✓ Re-verification of verified payment rejected with 400')
  }

  console.log('✅ All ECOT-HARDEN-001 Mutation Hardening Tests PASSED successfully!')
  await prisma.$disconnect()
}

testBackendHardeningMutations().catch((e) => {
  console.error('❌ Mutation Hardening Test Error:', e)
  process.exit(1)
})
