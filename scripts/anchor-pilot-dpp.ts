import { PrismaClient } from '../apps/api/generated/client'
import { anchorDppVersionOnAmoy } from '../apps/api/src/services/blockchain/anchor'
import { getBlockchainConfig } from '../apps/api/src/services/blockchain/config'

const prisma = new PrismaClient()

async function main() {
  console.log('--- EcoThread Roadmap 9 Pilot DPP Anchoring ---')
  const config = getBlockchainConfig()
  console.log(`Network: ${config.networkName} (Chain ID ${config.chainId})`)
  console.log(`Contract: ${config.contractAddress || 'Not set (will fail if missing)'}`)

  // Find published DPP Record
  const dppRecord = await prisma.dppRecord.findFirst({
    include: { product: true, dppVersions: { orderBy: { versionNum: 'desc' } } }
  })

  if (!dppRecord) {
    console.error('❌ No DPP record found in database. Seed database first (pnpm db:seed).')
    process.exit(1)
  }

  console.log(`Found DPP Record for Product Code: ${dppRecord.productCode} (ID: ${dppRecord.id})`)
  const result = await anchorDppVersionOnAmoy(prisma, dppRecord.id)

  console.log('Anchoring Result:', JSON.stringify(result, null, 2))

  if (result.success) {
    console.log('✅ Pilot DPP version anchored successfully!')
  } else {
    console.log('⚠️ Anchoring process finished with notice:', result.error)
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
