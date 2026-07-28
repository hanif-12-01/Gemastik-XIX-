# ROADMAP 09 — POLYGON AMOY TESTNET DPP HASH ANCHORING REPORT

**Status**: ✅ IMPLEMENTED & VERIFIED  
**Branch**: `feature/roadmap-09-polygon-amoy`  
**Base Commit**: `be965fd`  
**Date**: 2026-07-28  
**Role**: Lead Blockchain Integration Engineer & Senior Full-Stack Engineer  

---

## 1. Executive Summary

Roadmap 9 introduces on-chain tamper-evident metadata hash anchoring for EcoThread Digital Product Passports (DPP) to the **Polygon Amoy Testnet (Chain ID 80002)**.

PostgreSQL remains the primary system of record. The blockchain stores only a compact 32-byte Keccak-256 metadata hash commitment alongside the version number and normalized product key. Zero PII, zero customer wallet requirements, and zero token minting exist on-chain.

### Key Deliverables Implemented

| Category | Deliverable | Status |
|----------|-------------|--------|
| **Smart Contract** | `EcoThreadDppAnchor.sol` (Solidity 0.8.24, OpenZeppelin `Ownable2Step`) in `apps/blockchain` | ✅ Done |
| **Contract Tests** | 11/11 Hardhat unit tests covering authorization, zero checks, duplicates, multi-versioning, events | ✅ Done (100% Pass) |
| **Database Schema** | `DppBlockchainAnchor` model in `prisma/schema.prisma` with unique constraints | ✅ Done |
| **API Contracts** | Zod schemas & TypeScript types in `@ecothread/contracts` | ✅ Done |
| **API Client** | Typed SDK methods in `@ecothread/api-client` | ✅ Done |
| **Backend Services** | `apps/api/src/services/blockchain/` (`config.ts`, `signer.ts`, `contract.ts`, `anchor.ts`) | ✅ Done |
| **Fastify Endpoints** | Admin anchor, anchor status, reconcile, retry & public verification views in `apps/api/src/app.ts` | ✅ Done |
| **Admin Controls** | Polygon Amoy Anchoring Panel in `AdminProductDetailPage.tsx` | ✅ Done |
| **Public UI** | Public On-Chain Verification Card, PolygonScan links, Keccak-256 hash, and Indonesian disclaimer in `PublicDppPage.tsx` | ✅ Done |
| **E2E Testing** | Playwright test suite `tests/e2e/roadmap-09-dpp-anchoring.spec.ts` | ✅ Done (3/3 Pass) |

---

## 2. Technical Architecture & Security Model

```
PostgreSQL Published DPP Snapshot (DppVersion)
       │
       ▼
Keccak-256 Canonical Metadata Hash (0x...)
       │
       ▼
Server-side Wallet Signer (POLYGON_AMOY_PRIVATE_KEY)
       │
       ▼
Polygon Amoy Testnet Contract (EcoThreadDppAnchor.sol - Chain ID 80002)
       │
       ▼
On-Chain Event (DppAnchored) & State Storage (dppKey, version => metadataHash)
       │
       ▼
Transaction Receipt Verification & PostgreSQL Persistence (DppBlockchainAnchor)
       │
       ▼
Public DPP Verification Display with PolygonScan Link & Indonesian Disclaimer
```

### Security & Privacy Controls

1. **Zero PII On-Chain**: The contract stores strictly `(bytes32 dppKey, uint32 version) => Anchor(bytes32 metadataHash, uint64 anchoredAt, address issuer)`.
2. **Server-Only Signer Custody**: Private keys are stored in server environment variables (`POLYGON_AMOY_PRIVATE_KEY`). Never exposed to Vite client bundles, API responses, or logs.
3. **Submit-and-Reconcile Pattern**: Serverless requests broadcast transactions asynchronously, avoiding HTTP timeouts and preventing duplicate broadcasts via PostgreSQL locks and on-chain state pre-checks (`getAnchor`).
4. **Owner Access Control**: Contract uses `Ownable2Step` for safe two-step ownership transfer. Only the authorized server issuer wallet can call `anchorDpp`.

---

## 3. Test & Verification Evidence

### 3.1 Hardhat Smart Contract Unit Tests

```
  EcoThreadDppAnchor
    Deployment
      ✔ should set the initial owner correctly
    anchoring
      ✔ should allow the owner to anchor a valid DPP hash
      ✔ should emit a DppAnchored event on successful anchor
      ✔ should reject anchoring by non-owner
      ✔ should reject zero dppKey
      ✔ should reject zero version
      ✔ should reject zero metadataHash
      ✔ should reject duplicate anchor for same dppKey and version
      ✔ should allow multiple versions for the same dppKey
      ✔ should allow different dppKeys for the same version
    Ownable2Step ownership transfer
      ✔ should handle two-step ownership transfer

  11 passing (722ms)
```

### 3.2 Playwright Browser E2E Tests

```
Running 3 tests using 1 worker

  ok 1 [chromium] › tests\e2e\roadmap-09-dpp-anchoring.spec.ts:5:7 › Public DPP page displays verification & testnet disclaimer (1.9s)
  ok 2 [chromium] › tests\e2e\roadmap-09-dpp-anchoring.spec.ts:21:7 › Public API endpoint returns valid contract structure (62ms)
  ok 3 [chromium] › tests\e2e\roadmap-09-dpp-anchoring.spec.ts:33:7 › Security: Web bundle contains no private key secrets (1.1s)

  3 passed (6.6s)
```

---

## 4. User-Facing Labels & Mandatory Disclaimer

### Public Label Policy
- **Primary Status**: `Database Verified` (PostgreSQL System of Record)
- **Secondary Status**: `Polygon Amoy Testnet` (On-Chain Hash Integrity Commitment)

### Mandatory Disclaimer Displayed
> **Indonesian**: "Diverifikasi di Polygon Amoy Testnet. Ini adalah lingkungan pengujian dan bukan sertifikasi mainnet Polygon."
> **English**: "Verified on Polygon Amoy Testnet. This is a testing environment and is not a Polygon mainnet certification."

---

## 5. Summary of Files Added & Modified

### New Workspace & Files (10)
- `apps/blockchain/package.json`
- `apps/blockchain/tsconfig.json`
- `apps/blockchain/hardhat.config.ts`
- `apps/blockchain/contracts/EcoThreadDppAnchor.sol`
- `apps/blockchain/test/EcoThreadDppAnchor.test.ts`
- `apps/blockchain/scripts/deploy-amoy.ts`
- `apps/blockchain/scripts/anchor-smoke.ts`
- `apps/blockchain/README.md`
- `apps/api/src/services/blockchain/` (`config.ts`, `signer.ts`, `contract.ts`, `anchor.ts`)
- `tests/e2e/roadmap-09-dpp-anchoring.spec.ts`

### Modified Files (6)
- `prisma/schema.prisma` (Added `DppBlockchainAnchor` model)
- `packages/contracts/src/index.ts` (Added Zod schemas & types)
- `packages/api-client/src/index.ts` (Added typed SDK methods)
- `apps/api/src/app.ts` (Added Admin & Public blockchain endpoints)
- `apps/web/src/pages/admin/AdminProductDetailPage.tsx` (Added Amoy Anchoring Panel)
- `apps/web/src/pages/public/PublicDppPage.tsx` (Added On-Chain Verification Card & Disclaimer)
