# ROADMAP 09 & 09.1 — POLYGON AMOY TESTNET DPP HASH ANCHORING REPORT

**Status**: ⚠️ CONDITIONAL (REAL AMOY INTEGRATION COMPLETE; ACTIVE RPC & ISSUER CONFIGURED; AWAITING FAUCET POL FOR ON-CHAIN TRANSACTION MINING)  
**Branch**: `fix/roadmap-09-real-amoy-verification`  
**Base Commit**: `605f4b7`  
**Final Commit**: `fix/roadmap-09-real-amoy-verification`  
**Date**: 2026-07-28  
**Role**: Lead Blockchain Release Engineer & Senior Full-Stack Engineer  

---

## 1. Executive Summary & Remediation (Roadmap 9.1)

This report details the implementation and release verification of **Polygon Amoy Testnet (Chain ID 80002)** Digital Product Passport (DPP) metadata hash anchoring for EcoThread.

### Execution Distinction

1. **Smart Contract**: `EcoThreadDppAnchor.sol` (Solidity 0.8.24, OpenZeppelin `Ownable2Step`) in `apps/blockchain`. 11/11 Hardhat unit tests pass (`100% PASS`).
2. **Database Schema**: `DppBlockchainAnchor` model in `prisma/schema.prisma`. Schema synchronized and migration ready.
3. **API Integration**: Fastify backend endpoints (`apps/api/src/services/blockchain/`), Zod contracts (`@ecothread/contracts`), and SDK (`@ecothread/api-client`) fully built and typecheck clean (`100% PASS`).
4. **RPC Connectivity Remediation**: Updated default RPC endpoint from offline `rpc-amoy.polygon.technology` to active, tested `https://polygon-amoy.drpc.org` (Chain ID `80002`, Block `#43421601+`). RPC connection verified.
5. **Issuer Wallet**: Server-side signer wallet created (`0x87e1a06F71E43704729a450f5237A9436b7C3B90`).
6. **Live On-Chain Transaction**: Pending test POL faucet broadcast. Database gracefully handles `CONTRACT_NOT_DEPLOYED` / `INSUFFICIENT_TEST_POL` errors without crashing, maintaining `Database Verified` as system of record.

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

  11 passing (982ms)
```

### 3.2 Playwright Browser E2E Tests
```
  ok 1 [chromium] › tests/e2e/roadmap-09-dpp-anchoring.spec.ts:5:7 › Public DPP page displays verification & testnet disclaimer
  ok 2 [chromium] › tests/e2e/roadmap-09-dpp-anchoring.spec.ts:21:7 › Public API endpoint returns valid contract structure
  ok 3 [chromium] › tests/e2e/roadmap-09-dpp-anchoring.spec.ts:33:7 › Security: Web bundle contains no private key secrets

  3 passed (6.6s)
```

---

## 4. User-Facing Labels & Mandatory Disclaimer

### Public Label Policy
- **Primary Status**: `Database Verified` (PostgreSQL System of Record)
- **Secondary Status**: `Polygon Amoy Testnet` (On-Chain Hash Integrity Commitment)

### Mandatory Disclaimer Displayed
> **Indonesian**: "Diverifikasi di Polygon Amoy Testnet. Ini adalah lingkungan pengujian dan bukan sertifikasi mainnet Polygon."

---

## 5. Release Decision

**Decision**: **CONDITIONAL**

**Rationale**: Smart contract code, unit tests, RPC provider connection, API services, database models, Admin UI, public UI, and Playwright tests are 100% complete and verified. Final live testnet block inclusion requires test POL dispenser funding on `0x87e1a06F71E43704729a450f5237A9436b7C3B90`. The application gracefully falls back to `Database Verified` status without breaking.
