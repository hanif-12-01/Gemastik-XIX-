import { ethers } from 'ethers'
import * as dotenv from 'dotenv'

dotenv.config()

const rpcUrl = process.env.POLYGON_AMOY_RPC_URL || 'https://polygon-amoy.drpc.org'
const privateKey = process.env.POLYGON_AMOY_PRIVATE_KEY

async function main() {
  console.log('--- Polygon Amoy Issuer Wallet Check ---')
  console.log(`RPC URL: ${rpcUrl}`)

  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const network = await provider.getNetwork()
  console.log(`Network Chain ID: ${network.chainId.toString()}`)

  let wallet: ethers.Wallet
  if (privateKey) {
    wallet = new ethers.Wallet(privateKey, provider)
    console.log(`Configured Issuer Address: ${wallet.address}`)
  } else {
    // Generate a new testnet wallet for Amoy
    wallet = ethers.Wallet.createRandom(provider)
    console.log('⚠️ No POLYGON_AMOY_PRIVATE_KEY found in .env.')
    console.log(`Generated New Amoy Wallet Address: ${wallet.address}`)
    console.log(`Private Key (save to .env): ${wallet.privateKey}`)
  }

  const balance = await provider.getBalance(wallet.address)
  console.log(`POL Balance: ${ethers.formatEther(balance)} POL`)
}

main().catch(console.error)
