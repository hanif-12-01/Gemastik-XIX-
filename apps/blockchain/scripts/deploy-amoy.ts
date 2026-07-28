import { ethers } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('--- EcoThread DPP Anchor Deployment ---')
  console.log(`Deployer address: ${deployer.address}`)

  const balance = await ethers.provider.getBalance(deployer.address)
  console.log(`Deployer POL balance: ${ethers.formatEther(balance)} POL`)

  const network = await ethers.provider.getNetwork()
  console.log(`Connected Chain ID: ${network.chainId.toString()}`)

  if (network.chainId !== 80002n && network.chainId !== 31337n) {
    console.warn(`⚠️ Warning: Expected Polygon Amoy (80002) or Hardhat (31337), got ${network.chainId}`)
  }

  const Factory = await ethers.getContractFactory('EcoThreadDppAnchor')
  const contract = await Factory.deploy(deployer.address)

  await contract.waitForDeployment()
  const contractAddress = await contract.getAddress()

  console.log(`✅ EcoThreadDppAnchor deployed to: ${contractAddress}`)
  console.log(`Owner set to: ${await contract.owner()}`)
  console.log(`Deployment transaction hash: ${contract.deploymentTransaction()?.hash}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
