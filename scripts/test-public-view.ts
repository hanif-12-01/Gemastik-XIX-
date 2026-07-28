import { PrismaClient } from '../apps/api/generated/client'
import { getPublicBlockchainVerificationView } from '../apps/api/src/services/blockchain/anchor'

const prisma = new PrismaClient()

async function main() {
  const res = await getPublicBlockchainVerificationView(prisma, 'PRD-2026-0001')
  console.log('getPublicBlockchainVerificationView for PRD-2026-0001:')
  console.log(JSON.stringify(res, null, 2))
}

main().finally(() => prisma.$disconnect())
