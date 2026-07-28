import { ethers } from 'ethers'

const rpc = 'https://polygon-amoy.drpc.org'
const oldAddress = '0x87e1a06F71E43704729a450f5237A9436b7C3B90'
const newAddress = '0xd338B2280AB7C054E00d0b78A6CB6D1d974d6b59'

async function main() {
  const provider = new ethers.JsonRpcProvider(rpc, undefined, { staticNetwork: true })

  const oldBal = await provider.getBalance(oldAddress)
  const newBal = await provider.getBalance(newAddress)

  console.log(`Old Address (${oldAddress}): ${ethers.formatEther(oldBal)} POL`)
  console.log(`New Address (${newAddress}): ${ethers.formatEther(newBal)} POL`)
}

main()
