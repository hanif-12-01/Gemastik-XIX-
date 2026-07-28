import { PrismaClient } from '../apps/api/generated/client'

const prisma = new PrismaClient()

async function main() {
  const anchors = await prisma.dppBlockchainAnchor.findMany({
    include: { dppRecord: true, dppVersion: true }
  })
  console.log(JSON.stringify(anchors, null, 2))
}

main().finally(() => prisma.$disconnect())
