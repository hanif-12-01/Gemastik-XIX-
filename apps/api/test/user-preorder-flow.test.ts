import { EcoThreadApiClient } from '@ecothread/api-client'
import { PrismaClient } from '../generated/client'

const prisma = new PrismaClient()
const userClient = new EcoThreadApiClient('http://localhost:4000/api/v1')
const publicClient = new EcoThreadApiClient('http://localhost:4000/api/v1')

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`Assertion failed: ${msg}`)
}

async function testUserPreorderFlow() {
  console.log('🧪 Starting ECOT-MVP-006 User Catalog & Pre-Order Integration Tests...')

  // 1. User Logins
  await userClient.login('user@ecothread.local', 'Password123!')
  console.log('  ✓ User logged in (user@ecothread.local)')

  // 2. Public Catalog Fetch
  const catalog = await publicClient.getCatalog()
  assert(Array.isArray(catalog) && catalog.length > 0, 'Catalog items returned from database')
  const heroItem = catalog[0]
  assert(!!heroItem.id, 'Hero catalog item has ID')
  console.log(`  ✓ Fetched catalog, hero item: "${heroItem.title}" (Price: Rp ${heroItem.price.toLocaleString('id-ID')}, Deposit: Rp ${heroItem.depositAmount.toLocaleString('id-ID')})`)

  // 3. Public Catalog Detail Fetch by Slug
  const itemDetail = await publicClient.getCatalogDetail(heroItem.slug)
  assert(itemDetail.slug === heroItem.slug, 'Catalog detail slug matches')
  assert(!!itemDetail.product.dppRecord, 'DPP record linked to product')
  console.log(`  ✓ Fetched catalog detail by slug "${heroItem.slug}" with DPP link`)

  // 4. User Places Customer Pre-Order
  const customerOrder = await userClient.createCustomerOrder({
    catalogItemId: heroItem.id,
    quantity: 1,
    shippingAddress: 'Jl. Dipatiukur No. 88, Bandung'
  })
  assert(customerOrder.orderCode.startsWith('CORD-2026-'), 'Customer order code generated')
  assert(customerOrder.status === 'pending_payment', 'Order starts in pending_payment status')
  console.log(`  ✓ User created customer order ${customerOrder.orderCode} (Status: pending_payment)`)

  // 5. User Uploads Payment Proof (Manual Deposit)
  const paymentSubmission = await userClient.submitPaymentProof(customerOrder.id, {
    paymentProofUrl: 'https://images.unsplash.com/photo-1556742049-0a67daf40955?auto=format&fit=crop&q=80&w=600',
    amount: heroItem.depositAmount
  })
  assert(paymentSubmission.payment.isVerified === false, 'Payment proof starts unverified')
  assert(paymentSubmission.order.status === 'payment_proof_submitted', 'Customer order status updated to payment_proof_submitted')
  console.log(`  ✓ Payment proof submitted by customer (Order status: ${paymentSubmission.order.status})`)

  // 5b. Admin Verifies Payment
  const adminClient = new EcoThreadApiClient('http://localhost:4000/api/v1')
  await adminClient.login('admin@ecothread.local', 'Password123!')
  const adminVerifyRes = await adminClient.verifyPayment(paymentSubmission.payment.id, true)
  assert(adminVerifyRes.payment.isVerified === true, 'Payment marked verified by Admin')
  assert(adminVerifyRes.order.status === 'payment_verified', 'Customer order status updated to payment_verified by Admin')
  console.log(`  ✓ Payment verified by Admin (Order status: ${adminVerifyRes.order.status})`)

  // 6. User Views Personal Order History
  const myOrders = await userClient.request('/me/customer-orders')
  assert(Array.isArray(myOrders) && myOrders.length > 0, 'User order history returned')
  const foundOrder = myOrders.find((o: any) => o.id === customerOrder.id)
  assert(!!foundOrder, 'Created order found in user order history')
  console.log(`  ✓ User order history verified (${myOrders.length} total orders)`)

  console.log('✅ All ECOT-MVP-006 User Catalog & Pre-Order Tests PASSED!')
  await prisma.$disconnect()
}

testUserPreorderFlow().catch((e) => {
  console.error('❌ User Pre-Order test error:', e)
  process.exit(1)
})
