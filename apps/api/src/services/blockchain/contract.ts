import { ethers } from 'ethers'

/**
 * Minimal ABI for EcoThreadDppAnchor contract.
 * Strictly non-payable, owner-controlled DPP hash anchoring.
 */
export const ECOTHREAD_DPP_ANCHOR_ABI = [
  {
    type: 'constructor',
    inputs: [{ name: 'initialOwner', type: 'address', internalType: 'address' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'anchorDpp',
    inputs: [
      { name: 'dppKey', type: 'bytes32', internalType: 'bytes32' },
      { name: 'version', type: 'uint32', internalType: 'uint32' },
      { name: 'metadataHash', type: 'bytes32', internalType: 'bytes32' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'getAnchor',
    inputs: [
      { name: 'dppKey', type: 'bytes32', internalType: 'bytes32' },
      { name: 'version', type: 'uint32', internalType: 'uint32' }
    ],
    outputs: [
      { name: 'metadataHash', type: 'bytes32', internalType: 'bytes32' },
      { name: 'anchoredAt', type: 'uint64', internalType: 'uint64' },
      { name: 'issuer', type: 'address', internalType: 'address' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'event',
    name: 'DppAnchored',
    inputs: [
      { name: 'dppKey', type: 'bytes32', indexed: true, internalType: 'bytes32' },
      { name: 'version', type: 'uint32', indexed: true, internalType: 'uint32' },
      { name: 'metadataHash', type: 'bytes32', indexed: false, internalType: 'bytes32' },
      { name: 'issuer', type: 'address', indexed: true, internalType: 'address' },
      { name: 'timestamp', type: 'uint256', indexed: false, internalType: 'uint256' }
    ],
    anonymous: false
  },
  {
    type: 'error',
    name: 'AnchorAlreadyExists',
    inputs: [
      { name: 'dppKey', type: 'bytes32', internalType: 'bytes32' },
      { name: 'version', type: 'uint32', internalType: 'uint32' }
    ]
  },
  { type: 'error', name: 'InvalidDppKey', inputs: [] },
  { type: 'error', name: 'InvalidMetadataHash', inputs: [] },
  { type: 'error', name: 'InvalidVersion', inputs: [] }
] as const

/**
 * Derive deterministic 32-byte DPP Key from normalized product code.
 * Example: keccak256("PRD-2026-0001") -> 0x...
 */
export function deriveDppKey(productCode: string): string {
  const normalized = productCode.trim().toUpperCase()
  if (!normalized) throw new Error('Product code cannot be empty')
  return ethers.keccak256(ethers.toUtf8Bytes(normalized))
}

/**
 * Compute Keccak-256 hash of canonical snapshot payload JSON.
 * Example: keccak256(toUtf8Bytes(payloadJson)) -> 0x...
 */
export function computeCanonicalKeccak256Hash(payloadJson: string | object): string {
  const jsonStr = typeof payloadJson === 'string' ? payloadJson : JSON.stringify(payloadJson)
  return ethers.keccak256(ethers.toUtf8Bytes(jsonStr))
}
