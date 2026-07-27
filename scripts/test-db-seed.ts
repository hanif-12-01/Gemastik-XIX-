import { main as seedMain } from '../prisma/seed'

async function runSeed() {
  console.log('🌱 Executing Idempotent Test Seed...')
  await seedMain()
}

runSeed().catch((e) => {
  console.error('❌ Test seed failed:', e)
  process.exit(1)
})
