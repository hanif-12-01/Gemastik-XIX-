import { expect } from 'chai'
import { ethers } from 'hardhat'
import { EcoThreadDppAnchor } from '../typechain-types'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'

describe('EcoThreadDppAnchor', () => {
  let contract: EcoThreadDppAnchor
  let owner: HardhatEthersSigner
  let nonOwner: HardhatEthersSigner

  const sampleDppKey = ethers.keccak256(ethers.toUtf8Bytes('PRD-2026-0001'))
  const sampleVersion = 1
  const sampleMetadataHash = ethers.keccak256(ethers.toUtf8Bytes('{"canonical":"data"}'))

  beforeEach(async () => {
    ;[owner, nonOwner] = await ethers.getSigners()
    const Factory = await ethers.getContractFactory('EcoThreadDppAnchor')
    contract = (await Factory.deploy(owner.address)) as EcoThreadDppAnchor
    await contract.waitForDeployment()
  })

  describe('Deployment', () => {
    it('should set the initial owner correctly', async () => {
      expect(await contract.owner()).to.equal(owner.address)
    })
  })

  describe('anchoring', () => {
    it('should allow the owner to anchor a valid DPP hash', async () => {
      const tx = await contract.anchorDpp(sampleDppKey, sampleVersion, sampleMetadataHash)
      const receipt = await tx.wait()
      expect(receipt?.status).to.equal(1)

      const anchor = await contract.getAnchor(sampleDppKey, sampleVersion)
      expect(anchor.metadataHash).to.equal(sampleMetadataHash)
      expect(anchor.issuer).to.equal(owner.address)
      expect(anchor.anchoredAt).to.be.gt(0)
    })

    it('should emit a DppAnchored event on successful anchor', async () => {
      await expect(contract.anchorDpp(sampleDppKey, sampleVersion, sampleMetadataHash))
        .to.emit(contract, 'DppAnchored')
        .withArgs(sampleDppKey, sampleVersion, sampleMetadataHash, owner.address, (val: any) => val > 0)
    })

    it('should reject anchoring by non-owner', async () => {
      await expect(
        contract.connect(nonOwner).anchorDpp(sampleDppKey, sampleVersion, sampleMetadataHash)
      ).to.be.revertedWithCustomError(contract, 'OwnableUnauthorizedAccount')
    })

    it('should reject zero dppKey', async () => {
      await expect(
        contract.anchorDpp(ethers.ZeroHash, sampleVersion, sampleMetadataHash)
      ).to.be.revertedWithCustomError(contract, 'InvalidDppKey')
    })

    it('should reject zero version', async () => {
      await expect(
        contract.anchorDpp(sampleDppKey, 0, sampleMetadataHash)
      ).to.be.revertedWithCustomError(contract, 'InvalidVersion')
    })

    it('should reject zero metadataHash', async () => {
      await expect(
        contract.anchorDpp(sampleDppKey, sampleVersion, ethers.ZeroHash)
      ).to.be.revertedWithCustomError(contract, 'InvalidMetadataHash')
    })

    it('should reject duplicate anchor for same dppKey and version', async () => {
      await contract.anchorDpp(sampleDppKey, sampleVersion, sampleMetadataHash)

      await expect(
        contract.anchorDpp(sampleDppKey, sampleVersion, sampleMetadataHash)
      ).to.be.revertedWithCustomError(contract, 'AnchorAlreadyExists')
    })

    it('should allow multiple versions for the same dppKey', async () => {
      const v1Hash = ethers.keccak256(ethers.toUtf8Bytes('{"v":1}'))
      const v2Hash = ethers.keccak256(ethers.toUtf8Bytes('{"v":2}'))

      await contract.anchorDpp(sampleDppKey, 1, v1Hash)
      await contract.anchorDpp(sampleDppKey, 2, v2Hash)

      const anchorV1 = await contract.getAnchor(sampleDppKey, 1)
      const anchorV2 = await contract.getAnchor(sampleDppKey, 2)

      expect(anchorV1.metadataHash).to.equal(v1Hash)
      expect(anchorV2.metadataHash).to.equal(v2Hash)
    })

    it('should allow different dppKeys for the same version', async () => {
      const key2 = ethers.keccak256(ethers.toUtf8Bytes('PRD-2026-0002'))

      await contract.anchorDpp(sampleDppKey, 1, sampleMetadataHash)
      await contract.anchorDpp(key2, 1, sampleMetadataHash)

      const anchor1 = await contract.getAnchor(sampleDppKey, 1)
      const anchor2 = await contract.getAnchor(key2, 1)

      expect(anchor1.metadataHash).to.equal(sampleMetadataHash)
      expect(anchor2.metadataHash).to.equal(sampleMetadataHash)
    })
  })

  describe('Ownable2Step ownership transfer', () => {
    it('should handle two-step ownership transfer', async () => {
      await contract.transferOwnership(nonOwner.address)
      expect(await contract.owner()).to.equal(owner.address)
      expect(await contract.pendingOwner()).to.equal(nonOwner.address)

      await contract.connect(nonOwner).acceptOwnership()
      expect(await contract.owner()).to.equal(nonOwner.address)
    })
  })
})
