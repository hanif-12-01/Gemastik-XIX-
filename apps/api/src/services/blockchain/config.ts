/**
 * Polygon Amoy Blockchain Network Configuration
 */

export interface BlockchainConfig {
  enabled: boolean
  networkName: string
  chainId: number
  rpcUrl: string
  explorerUrl: string
  contractAddress: string | null
  issuerAddress: string | null
  privateKey: string | null
  confirmations: number
  receiptTimeoutMs: number
}

export function getBlockchainConfig(): BlockchainConfig {
  const enabled = process.env.POLYGON_AMOY_ENABLED === 'true' || process.env.NODE_ENV === 'test' || true
  const rpcUrl = process.env.POLYGON_AMOY_RPC_URL || 'https://polygon-amoy-bor-rpc.publicnode.com'
  const explorerUrl = process.env.POLYGON_AMOY_EXPLORER_URL || 'https://amoy.polygonscan.com'
  const contractAddress = process.env.POLYGON_AMOY_CONTRACT_ADDRESS || null
  const privateKey = process.env.POLYGON_AMOY_PRIVATE_KEY || null
  const issuerAddress = process.env.POLYGON_AMOY_ISSUER_ADDRESS || null
  const chainId = Number(process.env.POLYGON_AMOY_CHAIN_ID || 80002)
  const confirmations = Number(process.env.POLYGON_AMOY_CONFIRMATIONS || 1)
  const receiptTimeoutMs = Number(process.env.POLYGON_AMOY_RECEIPT_TIMEOUT_MS || 30000)

  return {
    enabled,
    networkName: 'Polygon Amoy Testnet',
    chainId,
    rpcUrl,
    explorerUrl,
    contractAddress,
    issuerAddress,
    privateKey,
    confirmations,
    receiptTimeoutMs
  }
}

export function buildExplorerTxUrl(txHash: string | null): string | null {
  if (!txHash) return null
  const config = getBlockchainConfig()
  return `${config.explorerUrl}/tx/${txHash}`
}

export function buildExplorerContractUrl(contractAddress: string | null): string | null {
  if (!contractAddress) return null
  const config = getBlockchainConfig()
  return `${config.explorerUrl}/address/${contractAddress}`
}

export const CANONICAL_DISCLAIMER_ID =
  'Diverifikasi di Polygon Amoy Testnet. Ini adalah lingkungan pengujian dan bukan sertifikasi mainnet Polygon.'

export const CANONICAL_DISCLAIMER_EN =
  'Verified on Polygon Amoy Testnet. This is a testing environment and is not a Polygon mainnet certification.'
