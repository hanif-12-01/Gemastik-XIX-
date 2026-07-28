import { ethers } from 'ethers'

const rpcs = [
  'https://polygon-amoy.drpc.org',
  'https://polygon-amoy-bor-rpc.publicnode.com'
]

const address = '0xd338B2280AB7C054E00d0b78A6CB6D1d974d6b59'

async function main() {
  console.log(`Checking balance for ${address} across RPC nodes...`)

  for (const rpc of rpcs) {
    try {
      const provider = new ethers.JsonRpcProvider(rpc, undefined, { staticNetwork: true })
      const network = await provider.getNetwork()
      const blockNum = await provider.getBlockNumber()
      const balance = await provider.getBalance(address)
      console.log(`\nRPC: ${rpc}`)
      console.log(`  Chain ID: ${network.chainId.toString()}`)
      console.log(`  Block Number: #${blockNum}`)
      console.log(`  Balance: ${ethers.formatEther(balance)} POL (${balance.toString()} wei)`)
    } catch (e: any) {
      console.log(`RPC Error (${rpc}): ${e.message}`)
    }
  }
}

main()
