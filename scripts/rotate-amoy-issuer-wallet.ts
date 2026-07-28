import { ethers } from 'ethers'
import * as fs from 'fs'
import * as path from 'path'

async function main() {
  console.log('--- EcoThread Amoy Issuer Wallet Rotation ---')

  const wallet = ethers.Wallet.createRandom()
  console.log(`✅ Generated New Fresh Amoy Issuer Address: ${wallet.address}`)

  const envPath = path.resolve(__dirname, '../.env')
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8')

    // Replace or add issuer address & private key
    if (envContent.includes('POLYGON_AMOY_ISSUER_ADDRESS=')) {
      envContent = envContent.replace(
        /POLYGON_AMOY_ISSUER_ADDRESS=.*/,
        `POLYGON_AMOY_ISSUER_ADDRESS=${wallet.address}`
      )
    } else {
      envContent += `\nPOLYGON_AMOY_ISSUER_ADDRESS=${wallet.address}\n`
    }

    if (envContent.includes('POLYGON_AMOY_PRIVATE_KEY=')) {
      envContent = envContent.replace(
        /POLYGON_AMOY_PRIVATE_KEY=.*/,
        `POLYGON_AMOY_PRIVATE_KEY=${wallet.privateKey}`
      )
    } else {
      envContent += `POLYGON_AMOY_PRIVATE_KEY=${wallet.privateKey}\n`
    }

    fs.writeFileSync(envPath, envContent, 'utf8')
    console.log('✅ Updated local .env with rotated issuer credentials safely.')
  }
}

main().catch(console.error)
