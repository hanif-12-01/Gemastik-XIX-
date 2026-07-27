import { EcoThreadApiClient } from '@ecothread/api-client'

const adminClient = new EcoThreadApiClient('http://localhost:4000/api/v1')

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`Assertion failed: ${msg}`)
}

async function testPilotEvidence() {
  console.log('🧪 Starting ECOT-MVP-007 Pilot Evidence & HPP Integration Tests...')

  await adminClient.login('admin@ecothread.local', 'Password123!')
  console.log('  ✓ Admin logged in')

  const stats = await adminClient.request('/admin/dashboard-stats')
  assert(!!stats.byDataOrigin.actual, 'Actual pilot data metrics present')
  assert(!!stats.byDataOrigin.demo, 'Demo data metrics present')
  assert(!!stats.byDataOrigin.target, 'Target projection metrics present')
  console.log('  ✓ Dashboard stats clearly differentiate Actual vs Demo vs Target origins')

  assert(stats.actualHpp.totalHppPerPiece === 235000.0, 'Actual HPP breakdown calculated (Rp 235.000)')
  assert(stats.actualHpp.grossMarginPercent === 52.9, 'Gross margin verified (52.9%)')
  console.log(`  ✓ Pilot HPP verified (HPP: Rp ${stats.actualHpp.totalHppPerPiece.toLocaleString('id-ID')}, Gross Margin: ${stats.actualHpp.grossMarginPercent}%)`)

  assert(!!stats.learningLog.keyFinding, 'Learning finding recorded')
  assert(!!stats.learningLog.productIteration, 'Product iteration recorded ("Kami belajar dan mengubah...")')
  console.log(`  ✓ Product iteration & learning log verified: "${stats.learningLog.productIteration}"`)

  console.log('✅ All ECOT-MVP-007 Pilot Evidence Tests PASSED!')
}

testPilotEvidence().catch((e) => {
  console.error('❌ Pilot Evidence test error:', e)
  process.exit(1)
})
