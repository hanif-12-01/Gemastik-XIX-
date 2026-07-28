import { ethers } from 'ethers'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

dotenv.config()

const AMOY_RPC_URL = process.env.POLYGON_AMOY_RPC_URL || 'https://polygon-amoy.drpc.org'
const AMOY_PRIVATE_KEY = process.env.POLYGON_AMOY_PRIVATE_KEY
const EXPECTED_ISSUER = '0xd338B2280AB7C054E00d0b78A6CB6D1d974d6b59'

if (!AMOY_PRIVATE_KEY) {
  console.error('❌ POLYGON_AMOY_PRIVATE_KEY missing in .env')
  process.exit(1)
}

async function main() {
  console.log('=== Step 2-6: Deploy EcoThreadDppAnchor to Polygon Amoy Testnet ===')

  const provider = new ethers.JsonRpcProvider(AMOY_RPC_URL, undefined, { staticNetwork: true })
  const wallet = new ethers.Wallet(AMOY_PRIVATE_KEY, provider)

  console.log(`RPC Provider: ${AMOY_RPC_URL}`)
  const network = await provider.getNetwork()
  console.log(`Chain ID: ${network.chainId.toString()}`)
  if (network.chainId !== 80002n) {
    console.error(`❌ Expected Chain ID 80002, got ${network.chainId}`)
    process.exit(1)
  }

  console.log(`Deployer / Issuer Address: ${wallet.address}`)
  if (wallet.address.toLowerCase() !== EXPECTED_ISSUER.toLowerCase()) {
    console.error(`❌ Deployer wallet mismatch! Expected ${EXPECTED_ISSUER}, got ${wallet.address}`)
    process.exit(1)
  }

  const balance = await provider.getBalance(wallet.address)
  console.log(`Issuer Balance: ${ethers.formatEther(balance)} POL`)

  // Load compiled artifact
  const artifactPath = path.resolve(__dirname, '../apps/blockchain/artifacts/contracts/EcoThreadDppAnchor.sol/EcoThreadDppAnchor.json')
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'))

  const Factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet)

  console.log('\nBroadcasting contract deployment transaction to Polygon Amoy...')
  const contract = await Factory.deploy(wallet.address)
  const txHash = contract.deploymentTransaction()?.hash
  console.log(`Deployment Transaction Hash: ${txHash}`)
  console.log(`PolygonScan Tx Link: https://amoy.polygonscan.com/tx/${txHash}`)

  console.log('\nWaiting for deployment block confirmation...')
  await contract.waitForDeployment()
  const contractAddress = await contract.getAddress()
  console.log(`\n🎉 EcoThreadDppAnchor deployed to Address: ${contractAddress}`)
  console.log(`PolygonScan Contract Link: https://amoy.polygonscan.com/address/${contractAddress}`)

  // Verify bytecode using eth_getCode
  console.log('\nVerifying deployed bytecode via eth_getCode...')
  const bytecode = await provider.getCode(contractAddress)
  if (!bytecode || bytecode === '0x' || bytecode === '0x0') {
    console.error('❌ FAILURE: Contract address contains no bytecode!')
    process.exit(1)
  }
  console.log(`✅ Bytecode verified! Length: ${bytecode.length} hex chars (non-empty).`)

  // Verify contract owner
  console.log('\nVerifying contract owner on-chain...')
  const contractInstance = new ethers.Contract(contractAddress, artifact.abi, provider)
  const ownerOnChain = await contractInstance.owner()
  console.log(`Owner on-chain: ${ownerOnChain}`)
  if (ownerOnChain.toLowerCase() !== wallet.address.toLowerCase()) {
    console.error(`❌ Owner mismatch! Expected ${wallet.address}, got ${ownerOnChain}`)
    process.exit(1)
  }
  console.log('✅ Contract owner matches expected issuer wallet 100%!')

  // Update .env file with contract address
  const envPath = path.resolve(__dirname, '../.env')
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8')
    if (envContent.includes('POLYGON_AMOY_CONTRACT_ADDRESS=')) {
      envContent = envContent.replace(
        /POLYGON_AMOY_CONTRACT_ADDRESS=.*/,
        `POLYGON_AMOY_CONTRACT_ADDRESS=${contractAddress}`
      )
    } else {
      envContent += `\nPOLYGON_AMOY_CONTRACT_ADDRESS=${contractAddress}\n`
    }
    fs.writeFileSync(envPath, envContent, 'utf8')
    console.log(`\n✅ Updated local .env with POLYGON_AMOY_CONTRACT_ADDRESS=${contractAddress}`)
  }

  // Save deployment summary artifact
  const deploymentInfo = {
    network: 'polygon_amoy',
    chainId: 80002,
    contractAddress,
    deployerAddress: wallet.address,
    ownerAddress: ownerOnChain,
    deploymentTxHash: txHash,
    deployedAt: new Date().toISOString()
  }
  fs.writeFileSync(
    path.resolve(__dirname, '../docs/qa/amoy-deployment-live-info.json'),
    JSON.stringify(deploymentInfo, null, 2)
  )
  console.log('✅ Saved deployment info to docs/qa/amoy-deployment-live-info.json')
}

main().catch((e) => {
  console.error('Deployment error:', e)
  process.exit(1)
})
