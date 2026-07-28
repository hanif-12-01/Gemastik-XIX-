import { ethers } from 'ethers'

const rpcs = [
  'https://rpc-amoy.polygon.technology',
  'https://polygon-amoy.drpc.org',
  'https://polygon-amoy-bor-rpc.publicnode.com'
]

async function main() {
  console.log('Testing Polygon Amoy RPC endpoints...')
  for (const rpc of rpcs) {
    try {
      console.log(`\nTesting ${rpc}...`)
      const provider = new ethers.JsonRpcProvider(rpc, undefined, { staticNetwork: true })
      const network = await Promise.race([
        provider.getNetwork(),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout after 5s')), 5000))
      ])
      const blockNum = await provider.getBlockNumber()
      console.log(`✅ Success! Chain ID: ${network.chainId.toString()}, Block: #${blockNum}`)
    } catch (e: any) {
      console.log(`❌ Failed: ${e.message}`)
    }
  }
}

main()
