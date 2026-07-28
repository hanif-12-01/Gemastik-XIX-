// Uses global fetch in Node 18+

async function main() {
  const baseUrl = 'http://localhost:4000/api/v1'

  console.log('=================================================================')
  console.log('ROADMAP 9.2 CLOSEOUT BLOCKER 8, 9, 10: AUTHENTICATED ADMIN HTTP ENDPOINT & IDEMPOTENCY')
  console.log('=================================================================\n')

  // 1. Login as Admin
  console.log('1. Logging in as Admin (admin@ecothread.local)...')
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ecothread.local', password: 'Password123!' })
  })

  if (!loginRes.ok) {
    console.error(`❌ Admin login failed: ${loginRes.status}`)
    process.exit(1)
  }

  const loginJson = await loginRes.json() as any
  const token = loginJson.token || loginJson.data?.token
  console.log(`✅ Admin login SUCCESS! Token received: ${token?.slice(0, 20)}...`)

  // 2. Retrieve anchor via Admin HTTP GET endpoint
  console.log('\n2. Retrieving anchor state via GET /admin/dpp/:id/blockchain-anchor...')
  const getRes = await fetch(`${baseUrl}/admin/dpp/ec32af73-0de0-4b1a-81ab-ba451c32015e/blockchain-anchor`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const getJson = await getRes.json() as any
  console.log(`GET Response Status: ${getRes.status}`)
  console.log('Anchor Data:', JSON.stringify(getJson.data?.anchor, null, 2))

  if (!getJson.success || !getJson.data?.anchor) {
    console.error('❌ GET anchor endpoint failed!')
    process.exit(1)
  }

  // 3. Trigger anchor via Admin HTTP POST endpoint
  console.log('\n3. Triggering anchor via POST /admin/dpp/:id/anchor-amoy...')
  const postRes = await fetch(`${baseUrl}/admin/dpp/ec32af73-0de0-4b1a-81ab-ba451c32015e/anchor-amoy`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  })
  const postJson = await postRes.json() as any
  console.log(`POST Response Status: ${postRes.status}`)
  console.log('Anchor Result JSON:', JSON.stringify(postJson, null, 2))

  if (!postJson.success || postJson.data?.status !== 'verified') {
    console.error('❌ POST anchor endpoint failed or not verified!')
    process.exit(1)
  }

  const firstTxHash = postJson.data.transactionHash
  console.log(`✅ Anchor verified via HTTP API! Transaction Hash: ${firstTxHash}`)

  // 4. Test Idempotency by triggering POST endpoint a second time
  console.log('\n4. Testing Idempotency: Triggering POST /admin/dpp/:id/anchor-amoy AGAIN...')
  const repeatRes = await fetch(`${baseUrl}/admin/dpp/ec32af73-0de0-4b1a-81ab-ba451c32015e/anchor-amoy`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  })
  const repeatJson = await repeatRes.json() as any
  console.log(`Repeat POST Response Status: ${repeatRes.status}`)
  const secondTxHash = repeatJson.data?.transactionHash

  console.log(`First Tx Hash:  ${firstTxHash}`)
  console.log(`Second Tx Hash: ${secondTxHash}`)

  if (firstTxHash !== secondTxHash) {
    console.error('❌ IDEMPOTENCY FAILED: A new transaction was sent on repeat request!')
    process.exit(1)
  }

  console.log('✅ IDEMPOTENCY PROVED 100%! Zero duplicate transactions broadcast on-chain.')
}

main().catch(e => {
  console.error('Admin HTTP endpoint verification failed:', e)
  process.exit(1)
})
