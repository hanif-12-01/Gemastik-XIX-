import { ethers } from 'ethers'

const rpc = 'https://polygon-amoy.drpc.org'

async function main() {
  const provider = new ethers.JsonRpcProvider(rpc, undefined, { staticNetwork: true })

  const addrs = [
    '0xd338B2280AB7C054E00d0b78A6CB6D1d974d6b59',
    '0x87e1a06F71E43704729a450f5237A9436b7C3B90'
  ]

  for (const addr of addrs) {
    const count = await provider.getTransactionCount(addr)
    const bal = await provider.getBalance(addr)
    console.log(`Address: ${addr}`)
    console.log(`  Tx Count: ${count}`)
    console.log(`  Balance: ${ethers.formatEther(bal)} POL`)
  }
}

main()
