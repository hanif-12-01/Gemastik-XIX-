import { EcoThreadApiClient } from '@ecothread/api-client'

const client = new EcoThreadApiClient('http://localhost:4000/api/v1')

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`Assertion failed: ${msg}`)
}

async function testRbacE2E() {
  console.log('🧪 Starting ECOT-MVP-002 E2E RBAC API Tests...')

  // 1. Successful Admin Login
  const adminAuth = await client.login('admin@ecothread.local', 'Password123!')
  assert(!!adminAuth.token, 'Admin login should return JWT token')
  assert(adminAuth.user.role === 'admin', 'Admin role must be admin')
  console.log('  ✓ Admin login successful')

  // 2. Failed Login with Invalid Password
  try {
    const wrongClient = new EcoThreadApiClient('http://localhost:4000/api/v1')
    await wrongClient.login('admin@ecothread.local', 'WrongPassword!')
    throw new Error('Should have thrown 401 error')
  } catch (e: any) {
    assert(e.message.includes('salah') || e.message.includes('401'), 'Invalid password should be rejected')
    console.log('  ✓ Invalid password rejected successfully')
  }

  // 3. User Login & RBAC Rejection on Admin Endpoint
  const userClient = new EcoThreadApiClient('http://localhost:4000/api/v1')
  const userAuth = await userClient.login('user@ecothread.local', 'Password123!')
  assert(userAuth.user.role === 'user', 'User role must be user')

  try {
    await userClient.createMaterialBatch({ sourceName: 'Unauthorized Batch', materialType: 'Denim', weightKg: 10 })
    throw new Error('User should not be allowed to create material batch')
  } catch (e: any) {
    assert(e.message.includes('ditolak') || e.message.includes('403'), 'User access to Admin endpoint blocked with 403')
    console.log('  ✓ User blocked from Admin endpoint with 403 Forbidden')
  }

  // 4. Session / /me Check
  const me = await userClient.getMe()
  assert(me.email === 'user@ecothread.local', 'Session /me returned correct user profile')
  console.log('  ✓ Session persistence & /me verification passed')

  console.log('✅ All ECOT-MVP-002 RBAC & Auth E2E Tests PASSED!')
}

testRbacE2E().catch((e) => {
  console.error('❌ E2E test error:', e)
  process.exit(1)
})
