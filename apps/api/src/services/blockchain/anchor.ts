import { PrismaClient } from '../../../generated/client'
import { ethers } from 'ethers'
import { getBlockchainConfig, buildExplorerTxUrl, buildExplorerContractUrl, CANONICAL_DISCLAIMER_ID, CANONICAL_DISCLAIMER_EN } from './config'
import { getBlockchainSigner } from './signer'
import { ECOTHREAD_DPP_ANCHOR_ABI, deriveDppKey, computeCanonicalKeccak256Hash } from './contract'

export interface AnchorOperationResult {
  success: boolean
  anchorRecord?: any
  error?: string
  errorCode?: string
}

/**
 * Anchor a published DPP version to Polygon Amoy Testnet.
 * Fully idempotent: if an anchor is already confirmed or verified, returns the existing record.
 */
export async function anchorDppVersionOnAmoy(
  prisma: PrismaClient,
  dppRecordId: string,
  versionNum?: number,
  userId?: string
): Promise<AnchorOperationResult> {
  const config = getBlockchainConfig()
  if (!config.enabled) {
    return { success: false, error: 'Fitur anchoring Polygon Amoy belum diaktifkan.', errorCode: 'FEATURE_DISABLED' }
  }

  // 1. Fetch DPP Record & target DPP Version
  const dppRecord = await prisma.dppRecord.findUnique({
    where: { id: dppRecordId },
    include: {
      product: true,
      dppVersions: { orderBy: { versionNum: 'desc' } },
      blockchainAnchors: { where: { network: 'polygon_amoy' } }
    }
  })

  if (!dppRecord) {
    return { success: false, error: 'Rekam DPP tidak ditemukan.', errorCode: 'DPP_NOT_FOUND' }
  }

  // Find targeted or latest version
  const targetVersion = versionNum
    ? dppRecord.dppVersions.find((v) => v.versionNum === versionNum)
    : dppRecord.dppVersions[0]

  if (!targetVersion || targetVersion.publicationStatus !== 'published') {
    return { success: false, error: 'Versi DPP harus dipublikasikan sebelum di-anchor.', errorCode: 'DPP_NOT_PUBLISHED' }
  }

  // Check if an anchor already exists for this version
  let anchor = await prisma.dppBlockchainAnchor.findUnique({
    where: { dppVersionId_network: { dppVersionId: targetVersion.id, network: 'polygon_amoy' } }
  })

  if (anchor && (anchor.status === 'verified' || anchor.status === 'confirmed')) {
    return { success: true, anchorRecord: anchor }
  }

  // 2. Derive DPP key and compute Keccak-256 metadata hash
  const dppKey = deriveDppKey(dppRecord.productCode)
  const metadataHash = computeCanonicalKeccak256Hash(targetVersion.payloadJson)

  // Verify hash matches stored metadataHash if present
  if (targetVersion.metadataHash && targetVersion.metadataHash.startsWith('0x') && targetVersion.metadataHash !== metadataHash) {
    console.warn(`Stored metadataHash ${targetVersion.metadataHash} vs recomputed ${metadataHash}`)
  }

  const contractAddress = config.contractAddress || '0x0000000000000000000000000000000000000000'

  // Upsert pending anchor record in PostgreSQL
  if (!anchor) {
    anchor = await prisma.dppBlockchainAnchor.create({
      data: {
        dppRecordId: dppRecord.id,
        dppVersionId: targetVersion.id,
        network: 'polygon_amoy',
        chainId: config.chainId,
        contractAddress,
        dppKey,
        versionNum: targetVersion.versionNum,
        metadataHash,
        canonicalizationVersion: 'ecothread-dpp-c14n-v1',
        status: 'pending',
        createdByUserId: userId || null
      }
    })
  }

  // 3. Connect to signer & contract
  const signerResult = await getBlockchainSigner()
  if (!signerResult.wallet || signerResult.error) {
    const failureCode = signerResult.error || 'SIGNER_UNAVAILABLE'
    const updated = await prisma.dppBlockchainAnchor.update({
      where: { id: anchor.id },
      data: { status: 'failed', failureCode, failureMessage: `Signer wallet error: ${failureCode}` }
    })
    await prisma.dppRecord.update({
      where: { id: dppRecord.id },
      data: { verificationState: 'anchoring_failed' }
    })
    return { success: false, anchorRecord: updated, error: 'Signer wallet tidak tersedia.', errorCode: failureCode }
  }

  // Update contract address if actual deployed address is available
  if (config.contractAddress && anchor.contractAddress !== config.contractAddress) {
    anchor = await prisma.dppBlockchainAnchor.update({
      where: { id: anchor.id },
      data: { contractAddress: config.contractAddress }
    })
  }

  if (!config.contractAddress) {
    const updated = await prisma.dppBlockchainAnchor.update({
      where: { id: anchor.id },
      data: { status: 'failed', failureCode: 'CONTRACT_NOT_DEPLOYED', failureMessage: 'POLYGON_AMOY_CONTRACT_ADDRESS belum dikonfigurasi.' }
    })
    await prisma.dppRecord.update({ where: { id: dppRecord.id }, data: { verificationState: 'anchoring_failed' } })
    return { success: false, anchorRecord: updated, error: 'Alamat smart contract belum dikonfigurasi.', errorCode: 'CONTRACT_NOT_DEPLOYED' }
  }

  const contract = new ethers.Contract(config.contractAddress, ECOTHREAD_DPP_ANCHOR_ABI, signerResult.wallet)

  // 4. On-chain check: read contract state first (avoid duplicate tx if already mined)
  try {
    const existingOnChain = await contract.getAnchor(dppKey, targetVersion.versionNum)
    if (existingOnChain && existingOnChain.metadataHash !== ethers.ZeroHash) {
      // Contract already contains anchor! Update DB to verified directly.
      const verified = await prisma.dppBlockchainAnchor.update({
        where: { id: anchor.id },
        data: {
          status: 'verified',
          metadataHash: existingOnChain.metadataHash,
          issuerAddress: existingOnChain.issuer,
          confirmedAt: new Date(Number(existingOnChain.anchoredAt) * 1000),
          lastCheckedAt: new Date()
        }
      })
      await prisma.dppRecord.update({
        where: { id: dppRecord.id },
        data: {
          verificationState: 'blockchain_verified',
          blockchainChainId: config.chainId,
          explorerUrl: buildExplorerContractUrl(config.contractAddress)
        }
      })
      return { success: true, anchorRecord: verified }
    }
  } catch (err) {
    console.warn('Contract pre-check warning:', err)
  }

  // 5. Broadcast transaction
  try {
    await prisma.dppBlockchainAnchor.update({
      where: { id: anchor.id },
      data: { status: 'submitting', submittedAt: new Date() }
    })

    const tx = await contract.anchorDpp(dppKey, targetVersion.versionNum, metadataHash)
    const txHash = tx.hash

    // Update status to transaction_submitted immediately (Submit-and-reconcile pattern)
    anchor = await prisma.dppBlockchainAnchor.update({
      where: { id: anchor.id },
      data: {
        status: 'transaction_submitted',
        transactionHash: txHash,
        issuerAddress: signerResult.wallet.address,
        submittedAt: new Date()
      }
    })

    await prisma.dppRecord.update({
      where: { id: dppRecord.id },
      data: {
        verificationState: 'anchoring_pending',
        blockchainTxHash: txHash,
        blockchainChainId: config.chainId,
        explorerUrl: buildExplorerTxUrl(txHash)
      }
    })

    // Bounded receipt wait (1 block confirmation)
    try {
      const receipt = await tx.wait(config.confirmations)
      if (receipt && receipt.status === 1) {
        anchor = await prisma.dppBlockchainAnchor.update({
          where: { id: anchor.id },
          data: {
            status: 'verified',
            blockNumber: receipt.blockNumber,
            blockHash: receipt.blockHash,
            confirmedAt: new Date(),
            lastCheckedAt: new Date()
          }
        })
        await prisma.dppRecord.update({
          where: { id: dppRecord.id },
          data: {
            verificationState: 'blockchain_verified',
            blockchainTxHash: txHash,
            blockchainChainId: config.chainId,
            explorerUrl: buildExplorerTxUrl(txHash)
          }
        })
      }
    } catch (receiptErr) {
      console.warn('Receipt wait timeout (reconciliation will verify asynchronously):', receiptErr)
    }

    return { success: true, anchorRecord: anchor }
  } catch (err: any) {
    console.error('Anchor transaction error:', err)
    const failureCode = err.code === 'INSUFFICIENT_FUNDS' ? 'INSUFFICIENT_TEST_POL' : 'TRANSACTION_REVERTED'
    const updated = await prisma.dppBlockchainAnchor.update({
      where: { id: anchor.id },
      data: {
        status: 'failed',
        failureCode,
        failureMessage: err.message || 'Transaksi gagal dikirim.',
        retryCount: { increment: 1 }
      }
    })
    await prisma.dppRecord.update({
      where: { id: dppRecord.id },
      data: { verificationState: 'anchoring_failed' }
    })
    return { success: false, anchorRecord: updated, error: err.message || 'Gagal mengirim transaksi.', errorCode: failureCode }
  }
}

/**
 * Reconcile anchor status by inspecting transaction receipt and contract state on-chain.
 */
export async function reconcileDppAnchor(
  prisma: PrismaClient,
  dppRecordId: string
): Promise<AnchorOperationResult> {
  const config = getBlockchainConfig()
  const dppRecord = await prisma.dppRecord.findUnique({
    where: { id: dppRecordId },
    include: { dppVersions: { orderBy: { versionNum: 'desc' } } }
  })
  if (!dppRecord) return { success: false, error: 'DPP tidak ditemukan.', errorCode: 'DPP_NOT_FOUND' }

  const latestVersion = dppRecord.dppVersions[0]
  if (!latestVersion) return { success: false, error: 'Versi DPP tidak ditemukan.', errorCode: 'DPP_NOT_FOUND' }

  const anchor = await prisma.dppBlockchainAnchor.findUnique({
    where: { dppVersionId_network: { dppVersionId: latestVersion.id, network: 'polygon_amoy' } }
  })

  if (!anchor) {
    return { success: false, error: 'Belum ada rekam pengiriman ke blockchain untuk versi ini.', errorCode: 'ANCHOR_NOT_FOUND' }
  }

  const signerResult = await getBlockchainSigner()
  if (!signerResult.provider || !config.contractAddress) {
    return { success: false, error: 'Koneksi RPC atau alamat contract tidak tersedia.', errorCode: 'RPC_UNAVAILABLE' }
  }

  const contract = new ethers.Contract(config.contractAddress, ECOTHREAD_DPP_ANCHOR_ABI, signerResult.provider)

  try {
    // 1. Inspect on-chain state via getAnchor
    const dppKey = anchor.dppKey
    const onChainAnchor = await contract.getAnchor(dppKey, anchor.versionNum)

    if (onChainAnchor && onChainAnchor.metadataHash !== ethers.ZeroHash) {
      const isHashMatch = onChainAnchor.metadataHash.toLowerCase() === anchor.metadataHash.toLowerCase()
      if (!isHashMatch) {
        const updated = await prisma.dppBlockchainAnchor.update({
          where: { id: anchor.id },
          data: { status: 'failed', failureCode: 'CONTRACT_STATE_MISMATCH', failureMessage: 'Hash on-chain tidak cocok dengan database.' }
        })
        return { success: false, anchorRecord: updated, error: 'Hash metadata on-chain tidak cocok.', errorCode: 'CONTRACT_STATE_MISMATCH' }
      }

      // If txHash is present, try to fetch block number
      let blockNum = anchor.blockNumber
      if (anchor.transactionHash && !blockNum) {
        try {
          const receipt = await signerResult.provider.getTransactionReceipt(anchor.transactionHash)
          if (receipt) blockNum = receipt.blockNumber
        } catch (_) {}
      }

      const updated = await prisma.dppBlockchainAnchor.update({
        where: { id: anchor.id },
        data: {
          status: 'verified',
          blockNumber: blockNum || anchor.blockNumber,
          issuerAddress: onChainAnchor.issuer,
          confirmedAt: anchor.confirmedAt || new Date(Number(onChainAnchor.anchoredAt) * 1000),
          lastCheckedAt: new Date()
        }
      })

      await prisma.dppRecord.update({
        where: { id: dppRecord.id },
        data: {
          verificationState: 'blockchain_verified',
          blockchainTxHash: anchor.transactionHash,
          blockchainChainId: config.chainId,
          explorerUrl: buildExplorerTxUrl(anchor.transactionHash)
        }
      })

      return { success: true, anchorRecord: updated }
    }

    // 2. If contract anchor is zero but we have txHash, check receipt
    if (anchor.transactionHash) {
      const receipt = await signerResult.provider.getTransactionReceipt(anchor.transactionHash)
      if (receipt && receipt.status === 0) {
        const updated = await prisma.dppBlockchainAnchor.update({
          where: { id: anchor.id },
          data: { status: 'failed', failureCode: 'TRANSACTION_REVERTED', failureMessage: 'Transaksi direvert pada rantai.', lastCheckedAt: new Date() }
        })
        await prisma.dppRecord.update({ where: { id: dppRecord.id }, data: { verificationState: 'anchoring_failed' } })
        return { success: false, anchorRecord: updated, error: 'Transaksi gagal pada blockchain.', errorCode: 'TRANSACTION_REVERTED' }
      }
    }

    return { success: true, anchorRecord: anchor }
  } catch (err: any) {
    console.error('Reconciliation error:', err)
    return { success: false, error: err.message || 'Gagal merekonsiliasi transaksi.', errorCode: 'RPC_ERROR' }
  }
}

/**
 * Format public verification view for customer DPP page.
 */
export async function getPublicBlockchainVerificationView(
  prisma: PrismaClient,
  productCode: string
) {
  const config = getBlockchainConfig()
  const dppRecord = await prisma.dppRecord.findUnique({
    where: { productCode },
    include: {
      dppVersions: { where: { publicationStatus: 'published' }, orderBy: { versionNum: 'desc' }, take: 1, include: { blockchainAnchors: { where: { network: 'polygon_amoy' } } } }
    }
  })

  if (!dppRecord || !dppRecord.dppVersions[0]) {
    return {
      isVerifiedOnChain: false,
      verificationState: 'database_verified',
      networkName: config.networkName,
      chainId: config.chainId,
      contractAddress: null,
      transactionHash: null,
      blockNumber: null,
      confirmedAt: null,
      dppKey: null,
      metadataHash: null,
      canonicalizationVersion: null,
      explorerTransactionUrl: null,
      explorerContractUrl: null,
      disclaimer: CANONICAL_DISCLAIMER_ID,
      disclaimerEn: CANONICAL_DISCLAIMER_EN
    }
  }

  const latestVersion = dppRecord.dppVersions[0]
  const anchor = latestVersion.blockchainAnchors[0]

  const isVerified = Boolean(anchor && (anchor.status === 'verified' || anchor.status === 'confirmed'))

  return {
    isVerifiedOnChain: isVerified,
    verificationState: isVerified ? 'blockchain_verified' : dppRecord.verificationState,
    networkName: config.networkName,
    chainId: anchor?.chainId || config.chainId,
    contractAddress: anchor?.contractAddress || config.contractAddress,
    transactionHash: anchor?.transactionHash || dppRecord.blockchainTxHash || null,
    blockNumber: anchor?.blockNumber || null,
    confirmedAt: anchor?.confirmedAt ? anchor.confirmedAt.toISOString() : null,
    dppKey: anchor?.dppKey || deriveDppKey(productCode),
    metadataHash: anchor?.metadataHash || latestVersion.metadataHash || null,
    canonicalizationVersion: anchor?.canonicalizationVersion || 'ecothread-dpp-c14n-v1',
    explorerTransactionUrl: buildExplorerTxUrl(anchor?.transactionHash || dppRecord.blockchainTxHash || null),
    explorerContractUrl: buildExplorerContractUrl(anchor?.contractAddress || config.contractAddress),
    disclaimer: CANONICAL_DISCLAIMER_ID,
    disclaimerEn: CANONICAL_DISCLAIMER_EN
  }
}
