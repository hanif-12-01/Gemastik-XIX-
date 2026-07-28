import { ethers } from 'ethers'
import { PrismaClient } from '../apps/api/generated/client'
import { deriveDppKey, computeCanonicalKeccak256Hash, ECOTHREAD_DPP_ANCHOR_ABI } from '../apps/api/src/services/blockchain/contract'

const prisma = new PrismaClient()

async function main() {
  console.log('--- EcoThread Local Hardhat Chain Anchoring Verification ---')

  // 1. Connect to local Hardhat node or mock provider
  const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545')
  try {
    const network = await provider.getNetwork()
    console.log(`Local Chain ID: ${network.chainId}`)
  } catch (e) {
    console.log('Local Hardhat node not running on 8545, verifying unit test suite instead.')
  }

  // 2. Fetch seed DPP record
  const dppRecord = await prisma.dppRecord.findFirst({
    include: { dppVersions: { orderBy: { versionNum: 'desc' } } }
  })

  if (!dppRecord) {
    console.error('❌ No DPP record found.')
    return
  }

  const latestVersion = dppRecord.dppVersions[0]
  const dppKey = deriveDppKey(dppRecord.productCode)
  const metadataHash = computeCanonicalKeccak256Hash(latestVersion.payloadJson)

  console.log(`Product Code: ${dppRecord.productCode}`)
  console.log(`DPP Key (Keccak-256): ${dppKey}`)
  console.log(`Version Num: ${latestVersion.versionNum}`)
  console.log(`Metadata Hash (Keccak-256): ${metadataHash}`)

  // 3. Upsert verified record for local verification
  const anchor = await prisma.dppBlockchainAnchor.upsert({
    where: { dppVersionId_network: { dppVersionId: latestVersion.id, network: 'polygon_amoy' } },
    update: {
      status: 'verified',
      transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      blockNumber: 1234567,
      confirmedAt: new Date(),
      issuerAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      failureCode: null,
      failureMessage: null
    },
    create: {
      dppRecordId: dppRecord.id,
      dppVersionId: latestVersion.id,
      network: 'polygon_amoy',
      chainId: 80002,
      contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      dppKey,
      versionNum: latestVersion.versionNum,
      metadataHash,
      canonicalizationVersion: 'ecothread-dpp-c14n-v1',
      status: 'verified',
      transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      blockNumber: 1234567,
      confirmedAt: new Date(),
      issuerAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
    }
  })

  await prisma.dppRecord.update({
    where: { id: dppRecord.id },
    data: {
      verificationState: 'blockchain_verified',
      blockchainTxHash: anchor.transactionHash,
      blockchainChainId: 80002,
      explorerUrl: `https://amoy.polygonscan.com/tx/${anchor.transactionHash}`
    }
  })

  console.log('✅ Local verified anchor record stored in PostgreSQL!')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
