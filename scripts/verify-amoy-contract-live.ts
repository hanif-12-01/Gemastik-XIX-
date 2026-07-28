import { ethers } from 'ethers'
import * as fs from 'fs'
import * as path from 'path'

const contractAddress = '0x73f46FE2a87e158d4eDa6aa5cBC464B5fB71b220'
const expectedIssuer = '0xd338B2280AB7C054E00d0b78A6CB6D1d974d6b59'

const rpcs = [
  'https://polygon-amoy-bor-rpc.publicnode.com',
  'https://polygon-amoy.drpc.org'
]

async function main() {
  console.log(`=== Verifying Deployed Amoy Contract ${contractAddress} ===`)

  let provider: ethers.JsonRpcProvider | null = null

  for (const rpc of rpcs) {
    try {
      console.log(`Connecting to ${rpc}...`)
      const p = new ethers.JsonRpcProvider(rpc, undefined, { staticNetwork: true })
      const network = await p.getNetwork()
      console.log(`  Chain ID: ${network.chainId.toString()}`)
      provider = p
      break
    } catch (e: any) {
      console.log(`  Failed: ${e.message}`)
    }
  }

  if (!provider) {
    console.error('❌ Could not connect to RPC')
    process.exit(1)
  }

  // 1. eth_getCode bytecode check
  const code = await provider.getCode(contractAddress)
  console.log(`Bytecode length: ${code.length} hex chars`)
  if (code === '0x' || code === '0x0') {
    console.error('❌ Bytecode empty!')
    process.exit(1)
  }
  console.log('✅ Bytecode is NON-EMPTY and verified on-chain!')

  // 2. Owner check
  const abi = [
    'function owner() view returns (address)',
    'function getAnchor(bytes32,uint32) view returns (tuple(bytes32 metadataHash, uint64 anchoredAt, address issuer))'
  ]
  const contract = new ethers.Contract(contractAddress, abi, provider)
  const owner = await contract.owner()
  console.log(`On-chain contract owner: ${owner}`)
  if (owner.toLowerCase() !== expectedIssuer.toLowerCase()) {
    console.error(`❌ Owner mismatch! Expected ${expectedIssuer}, got ${owner}`)
    process.exit(1)
  }
  console.log('✅ Contract owner matches expected issuer 100%!')

  // Update .env
  const envPath = path.resolve(__dirname, '../.env')
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
  console.log(`✅ Updated .env with POLYGON_AMOY_CONTRACT_ADDRESS=${contractAddress}`)
}

main().catch(console.error)
