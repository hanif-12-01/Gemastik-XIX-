import { PrismaClient } from '../apps/api/generated/client'
import { anchorDppVersionOnAmoy, reconcileDppAnchor } from '../apps/api/src/services/blockchain/anchor'
import { getBlockchainConfig, buildExplorerTxUrl, buildExplorerContractUrl } from '../apps/api/src/services/blockchain/config'
import { deriveDppKey, computeCanonicalKeccak256Hash, ECOTHREAD_DPP_ANCHOR_ABI } from '../apps/api/src/services/blockchain/contract'
import { ethers } from 'ethers'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('=== Step 10-20: Real Polygon Amoy Pilot DPP Anchor Execution ===')

  const config = getBlockchainConfig()
  console.log(`RPC Provider: ${config.rpcUrl}`)
  console.log(`Chain ID: ${config.chainId}`)
  console.log(`Contract Address: ${config.contractAddress}`)

  if (!config.contractAddress) {
    console.error('❌ POLYGON_AMOY_CONTRACT_ADDRESS is missing!')
    process.exit(1)
  }

  // 10. Load immutable published DPP version for PRD-2026-0001
  const dppRecord = await prisma.dppRecord.findUnique({
    where: { productCode: 'PRD-2026-0001' },
    include: { dppVersions: { orderBy: { versionNum: 'desc' } } }
  })

  if (!dppRecord || !dppRecord.dppVersions[0]) {
    console.error('❌ DPP record for PRD-2026-0001 not found!')
    process.exit(1)
  }

  const latestVersion = dppRecord.dppVersions[0]
  console.log(`\nSelected Pilot DPP Snapshot:`)
  console.log(`  Product Code: ${dppRecord.productCode}`)
  console.log(`  DPP Record ID: ${dppRecord.id}`)
  console.log(`  DPP Version ID: ${latestVersion.id}`)
  console.log(`  Version Number: ${latestVersion.versionNum}`)

  // 11. Recompute canonical metadata hash and verify match
  const recomputedHash = computeCanonicalKeccak256Hash(latestVersion.payloadJson)
  console.log(`\n  Recomputed Keccak-256 Metadata Hash: ${recomputedHash}`)

  // 12. Recompute deterministic DPP key
  const dppKey = deriveDppKey(dppRecord.productCode)
  console.log(`  Derived DPP Key: ${dppKey}`)

  // 13. Reconcile existing failed anchor record prior to retry
  console.log('\nReconciling existing database anchor record prior to retry...')
  await reconcileDppAnchor(prisma, dppRecord.id)

  // 14 & 15. Submit real anchor through backend service (anchorDppVersionOnAmoy)
  console.log('\nSubmitting REAL anchor transaction to Polygon Amoy Testnet...')
  const result = await anchorDppVersionOnAmoy(prisma, dppRecord.id)

  console.log('\nAnchoring Result:', JSON.stringify(result, null, 2))

  if (!result.success || !result.anchorRecord) {
    console.error(`❌ Anchoring failed: ${result.error}`)
    process.exit(1)
  }

  const record = result.anchorRecord
  console.log(`\n🎉 TRANSACTION CONFIRMED & VERIFIED ON POLYGON AMOY!`)
  console.log(`  Database Anchor Record ID: ${record.id}`)
  console.log(`  Status: ${record.status}`)
  console.log(`  Transaction Hash: ${record.transactionHash}`)
  console.log(`  Block Number: #${record.blockNumber}`)
  console.log(`  Confirmed At: ${record.confirmedAt}`)
  console.log(`  PolygonScan Tx Link: ${buildExplorerTxUrl(record.transactionHash!)}`)
  console.log(`  PolygonScan Contract Link: ${buildExplorerContractUrl(config.contractAddress!)}`)

  // 17 & 18. On-Chain contract state verification via getAnchor
  console.log('\nVerifying on-chain state directly via contract.getAnchor()...')
  const provider = new ethers.JsonRpcProvider(config.rpcUrl, undefined, { staticNetwork: true })
  const contract = new ethers.Contract(config.contractAddress, ECOTHREAD_DPP_ANCHOR_ABI, provider)

  const onChainData = await contract.getAnchor(dppKey, latestVersion.versionNum)
  console.log('On-Chain getAnchor Result:')
  console.log(`  Metadata Hash: ${onChainData.metadataHash}`)
  console.log(`  Anchored At: ${new Date(Number(onChainData.anchoredAt) * 1000).toISOString()}`)
  console.log(`  Issuer: ${onChainData.issuer}`)

  if (onChainData.metadataHash.toLowerCase() !== recomputedHash.toLowerCase()) {
    console.error('❌ On-chain metadata hash mismatch!')
    process.exit(1)
  }
  console.log('✅ On-chain metadata hash MATCHES recomputed hash 100%!')

  // 20. Verify Idempotency: Repeat anchor request and prove no duplicate tx is sent
  console.log('\nTesting Idempotency (repeating anchor request for PRD-2026-0001)...')
  const repeatResult = await anchorDppVersionOnAmoy(prisma, dppRecord.id)
  console.log(`Repeat Anchor Result Success: ${repeatResult.success}`)
  console.log(`Repeat Anchor Status: ${repeatResult.anchorRecord?.status}`)
  console.log(`Tx Hash unchanged: ${repeatResult.anchorRecord?.transactionHash === record.transactionHash}`)

  if (repeatResult.anchorRecord?.transactionHash !== record.transactionHash) {
    console.error('❌ Idempotency failed! A new transaction was broadcast for an already anchored version.')
    process.exit(1)
  }
  console.log('✅ IDEMPOTENCY VERIFIED! Zero duplicate transactions broadcast on-chain.')

  // Save evidence json
  const evidence = {
    sourceCommit: 'release/roadmap-09-2-live-amoy',
    network: 'Polygon Amoy Testnet',
    chainId: 80002,
    rpcProvider: config.rpcUrl,
    issuerAddress: record.issuerAddress,
    contractAddress: config.contractAddress,
    deploymentTxHash: '0x5b49eb1fdada5804888af2e2f9e67c2606b1e55ff2c7d1580dfa13de5202359b',
    productCode: dppRecord.productCode,
    dppRecordId: dppRecord.id,
    dppVersionId: latestVersion.id,
    versionNum: latestVersion.versionNum,
    canonicalizationVersion: record.canonicalizationVersion,
    metadataHash: recomputedHash,
    dppKey: dppKey,
    anchorTransactionHash: record.transactionHash,
    anchorBlockNumber: record.blockNumber,
    anchorConfirmedAt: record.confirmedAt,
    getAnchorMetadataHash: onChainData.metadataHash,
    getAnchorIssuer: onChainData.issuer,
    databaseStatus: record.status,
    explorerTxUrl: buildExplorerTxUrl(record.transactionHash!),
    explorerContractUrl: buildExplorerContractUrl(config.contractAddress!)
  }

  fs.writeFileSync(
    path.resolve(__dirname, '../docs/qa/amoy-pilot-anchor-live-evidence.json'),
    JSON.stringify(evidence, null, 2)
  )
  console.log('\n✅ Saved evidence JSON to docs/qa/amoy-pilot-anchor-live-evidence.json')
}

main()
  .catch((e) => {
    console.error('Anchoring error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
