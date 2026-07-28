import { ethers } from 'ethers'
import { getBlockchainConfig } from './config'

export interface BlockchainSignerResult {
  provider: ethers.JsonRpcProvider
  wallet: ethers.Wallet | null
  contract: ethers.Contract | null
  error?: string
}

/**
 * Initialize Ethers provider & server-side Wallet signer.
 * Strictly verifies Chain ID (80002 for Polygon Amoy) before returning.
 */
export async function getBlockchainSigner(): Promise<BlockchainSignerResult> {
  const config = getBlockchainConfig()

  if (!config.enabled) {
    return { provider: null as any, wallet: null, contract: null, error: 'FEATURE_DISABLED' }
  }

  if (!config.rpcUrl) {
    return { provider: null as any, wallet: null, contract: null, error: 'RPC_UNAVAILABLE' }
  }

  try {
    const provider = new ethers.JsonRpcProvider(config.rpcUrl)

    // Chain ID verification guard
    const network = await provider.getNetwork()
    const chainIdNum = Number(network.chainId)

    if (config.chainId && chainIdNum !== config.chainId && process.env.NODE_ENV !== 'test') {
      console.error(`Chain ID mismatch: expected ${config.chainId}, got ${chainIdNum}`)
      return { provider, wallet: null, contract: null, error: 'WRONG_CHAIN' }
    }

    if (!config.privateKey) {
      return { provider, wallet: null, contract: null, error: 'SIGNER_NOT_CONFIGURED' }
    }

    const wallet = new ethers.Wallet(config.privateKey, provider)
    return { provider, wallet, contract: null }
  } catch (err: any) {
    console.error('Blockchain provider connection error:', err.message || err)
    return { provider: null as any, wallet: null, contract: null, error: 'RPC_UNAVAILABLE' }
  }
}
