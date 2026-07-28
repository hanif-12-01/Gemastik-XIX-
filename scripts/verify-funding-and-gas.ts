import { ethers } from 'ethers'
import * as dotenv from 'dotenv'

dotenv.config()

const rpcs = [
  'https://polygon-amoy.drpc.org',
  'https://polygon-amoy-bor-rpc.publicnode.com'
]

const issuerAddress = '0xd338B2280AB7C054E00d0b78A6CB6D1d974d6b59'

async function main() {
  console.log('=== Step 1: Pre-flight Verification & Gas Estimation ===')

  let provider: ethers.JsonRpcProvider | null = null

  for (const rpc of rpcs) {
    try {
      console.log(`\nVerifying RPC: ${rpc}`)
      const p = new ethers.JsonRpcProvider(rpc, undefined, { staticNetwork: true })
      const network = await p.getNetwork()
      const block = await p.getBlockNumber()
      console.log(`  ✅ Chain ID: ${network.chainId.toString()}`)
      console.log(`  ✅ Block Number: #${block}`)

      if (network.chainId !== 80002n) {
        throw new Error(`Chain ID mismatch! Expected 80002, got ${network.chainId}`)
      }
      if (!provider) provider = p
    } catch (e: any) {
      console.error(`  ❌ RPC Error: ${e.message}`)
    }
  }

  if (!provider) {
    console.error('❌ All RPC providers failed!')
    process.exit(1)
  }

  // 2. Issuer balance in wei & POL
  const balanceWei = await provider.getBalance(issuerAddress)
  const balancePol = ethers.formatEther(balanceWei)
  console.log(`\nIssuer Address: ${issuerAddress}`)
  console.log(`  Balance (wei): ${balanceWei.toString()}`)
  console.log(`  Balance (POL): ${balancePol} POL`)

  // 3. Faucet transaction verification
  const txCount = await provider.getTransactionCount(issuerAddress)
  console.log(`  Transaction Count (nonce): ${txCount}`)

  // 4 & 5. Gas Estimation
  const feeData = await provider.getFeeData()
  const maxFeePerGas = feeData.maxFeePerGas || ethers.parseUnits('30', 'gwei')
  const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas || ethers.parseUnits('30', 'gwei')

  console.log(`\nCurrent Fee Data:`)
  console.log(`  Gas Price: ${feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : 'N/A'} gwei`)
  console.log(`  Max Fee Per Gas: ${ethers.formatUnits(maxFeePerGas, 'gwei')} gwei`)
  console.log(`  Max Priority Fee: ${ethers.formatUnits(maxPriorityFeePerGas, 'gwei')} gwei`)

  // Contract Deployment Gas Estimate (~500,000 gas units for EcoThreadDppAnchor)
  const estimatedDeployGas = 550_000n
  const deployCostWei = estimatedDeployGas * maxFeePerGas

  // Anchor Transaction Gas Estimate (~80,000 gas units for anchorDpp)
  const estimatedAnchorGas = 90_000n
  const anchorCostWei = estimatedAnchorGas * maxFeePerGas

  // Total required = Deploy + 2 x Anchor (for retry) + 20% safety margin
  const totalEstimatedWei = (deployCostWei + anchorCostWei * 2n) * 120n / 100n
  const totalEstimatedPol = ethers.formatEther(totalEstimatedWei)

  console.log(`\nGas Estimation Breakdown:`)
  console.log(`  Contract Deployment (~550,000 gas): ${ethers.formatEther(deployCostWei)} POL`)
  console.log(`  Single Anchor Tx (~90,000 gas): ${ethers.formatEther(anchorCostWei)} POL`)
  console.log(`  Total Estimated (Deploy + 2x Anchor + 20% Margin): ${totalEstimatedPol} POL`)

  if (balanceWei < totalEstimatedWei) {
    const shortfallWei = totalEstimatedWei - balanceWei
    const shortfallPol = ethers.formatEther(shortfallWei)
    console.log(`\n⚠️ Insufficient Balance Warning: Current ${balancePol} POL < Required ${totalEstimatedPol} POL`)
    console.log(`Shortfall: ${shortfallPol} POL`)
  } else {
    console.log(`\n✅ SUFFICIENT BALANCE! ${balancePol} POL >= Required ${totalEstimatedPol} POL`)
  }
}

main().catch(console.error)
