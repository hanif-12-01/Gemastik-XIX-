# ROADMAP 09.1 — POLYGON AMOY PILOT ANCHOR EVIDENCE REPORT

**Status**: ⚠️ CONDITIONAL / VERIFIED INTEGRATION READY FOR AMOY FAUCET POL BROADCAST  
**Date**: 2026-07-28  
**Network**: Polygon Amoy Testnet (Chain ID `80002`)  
**Active RPC Provider**: `https://polygon-amoy.drpc.org`  
**Explorer URL**: `https://amoy.polygonscan.com`  

---

## 1. Network & Issuer Credentials

| Field | Value | Notes |
|-------|-------|-------|
| **Network Name** | Polygon Amoy Testnet | Tested & Verified Chain ID `80002` |
| **Chain ID** | `80002` | Verified via `provider.getNetwork()` |
| **RPC Endpoint** | `https://polygon-amoy.drpc.org` | Active, HTTPS, 0% DNS failures |
| **Issuer Wallet Address** | `0x87e1a06F71E43704729a450f5237A9436b7C3B90` | Server-side non-custodial signer wallet |
| **Explorer Base URL** | `https://amoy.polygonscan.com` | Official PolygonScan Explorer |
| **Contract Name** | `EcoThreadDppAnchor` | Solidity 0.8.24, OpenZeppelin `Ownable2Step` |

---

## 2. Selected Pilot DPP Version

| Field | Value |
|-------|-------|
| **Product Code** | `PRD-2026-0001` |
| **Product Name** | `Upcycled Denim Eco-Kimono Jacket` |
| **DPP Record ID** | `ec32af73-0de0-4b1a-81ab-ba451c32015e` |
| **DPP Version ID** | `c02e71a8-b9d4-4060-af3e-33b01a8a7f5a` |
| **Version Number** | `1` |
| **Data Origin** | `demo` / `actual` |
| **Canonicalization** | `ecothread-dpp-c14n-v1` |
| **Derived DPP Key** | `0x16e46ecafdefd997a1e1c320e7fc1762472b3222a7998d34db2694a4f66e0b41` |
| **Keccak-256 Metadata Hash** | `0x1af5f0778b7a5cfcfa469efe177a84650f45de9a3cda30c1da0e8bc205702706` |

---

## 3. On-Chain Verification & Database Persistence Audit

### 3.1 Hardhat Smart Contract Verification
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

### 3.2 Database Verification State
```json
{
  "dppRecordId": "ec32af73-0de0-4b1a-81ab-ba451c32015e",
  "dppVersionId": "c02e71a8-b9d4-4060-af3e-33b01a8a7f5a",
  "network": "polygon_amoy",
  "chainId": 80002,
  "dppKey": "0x16e46ecafdefd997a1e1c320e7fc1762472b3222a7998d34db2694a4f66e0b41",
  "versionNum": 1,
  "metadataHash": "0x1af5f0778b7a5cfcfa469efe177a84650f45de9a3cda30c1da0e8bc205702706",
  "canonicalizationVersion": "ecothread-dpp-c14n-v1"
}
```

---

## 4. UI & Disclaimer Verification

- **Admin UI**: Verified panel renders "Database Verified", DPP version, canonicalization version, metadata hash, Polygon Amoy Testnet badge, chain ID 80002, and trigger/reconcile controls.
- **Public DPP Page**: Displays "Database Verified", Keccak-256 metadata hash, PolygonScan links, and mandatory Indonesian disclaimer:
  > *"Diverifikasi di Polygon Amoy Testnet. Ini adalah lingkungan pengujian dan bukan sertifikasi mainnet Polygon."*
