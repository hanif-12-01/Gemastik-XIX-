import { ethers } from 'hardhat'

async function main() {
  const [signer] = await ethers.getSigners()
  console.log('--- EcoThread DPP Anchor Smoke Test ---')
  console.log(`Signer: ${signer.address}`)

  const contractAddress = process.env.POLYGON_AMOY_CONTRACT_ADDRESS
  if (!contractAddress) {
    console.error('❌ POLYGON_AMOY_CONTRACT_ADDRESS is not set.')
    process.exit(1)
  }

  const contract = await ethers.getContractAt('EcoThreadDppAnchor', contractAddress, signer)

  const productCode = 'PRD-2026-PILOT'
  const dppKey = ethers.keccak256(ethers.toUtf8Bytes(productCode.trim().toUpperCase()))
  const version = 1
  const canonicalMetadataJson = JSON.stringify({
    _version: '1',
    productCode,
    name: 'EcoThread Pilot Upcycled Jacket',
    impact: { co2SavedKg: 12.5, waterSavedLiters: 450 }
  })
  const metadataHash = ethers.keccak256(ethers.toUtf8Bytes(canonicalMetadataJson))

  console.log(`Product Code: ${productCode}`)
  console.log(`DPP Key: ${dppKey}`)
  console.log(`Version: ${version}`)
  console.log(`Metadata Hash: ${metadataHash}`)

  // Check if already anchored
  const existing = await contract.getAnchor(dppKey, version)
  if (existing.metadataHash !== ethers.ZeroHash) {
    console.log('✅ Anchor already exists on-chain!')
    console.log(`   Anchored At: ${new Date(Number(existing.anchoredAt) * 1000).toISOString()}`)
    console.log(`   Issuer: ${existing.issuer}`)
    return
  }

  console.log('Submitting anchor transaction...')
  const tx = await contract.anchorDpp(dppKey, version, metadataHash)
  console.log(`Tx broadcasted: ${tx.hash}`)

  const receipt = await tx.wait(1)
  console.log(`✅ Transaction mined in block ${receipt?.blockNumber}`)

  const anchor = await contract.getAnchor(dppKey, version)
  console.log('On-chain anchor verified:')
  console.log(`   Metadata Hash: ${anchor.metadataHash}`)
  console.log(`   Issuer: ${anchor.issuer}`)
  console.log(`   Anchored At: ${new Date(Number(anchor.anchoredAt) * 1000).toISOString()}`)
}

main().catch((err) => {
  console.error('❌ Smoke test failed:', err)
  process.exitCode = 1
})
