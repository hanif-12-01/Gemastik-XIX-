# Instruksi Umum

Anda adalah Lead Engineer EcoThread. Bekerjalah langsung di repository aktif dan implementasikan tahap ini sampai dapat diuji.

## Wajib Dibaca Sebelum Coding

Baca lengkap:

```text
docs/prd/PRD_EcoThread_v1.0.md
docs/architecture/system-architecture.md
docs/tasks/README.md
seluruh docs/tasks/ECOT-MVP-*.md
docs/qa/QC_REPORT_ECOTHREAD_MVP.md
README.md
DEMO.md
DEPLOYMENT.md
```

Sebelum mengubah kode, rangkum kebutuhan PRD, keputusan arsitektur, task terkait, temuan QC, file yang akan diubah, dan risiko.

## Aturan

- Backend adalah source of truth.
- Role dan ownership diperiksa backend.
- Jangan memakai data palsu, `alert()`, atau `setTimeout()` sebagai proses bisnis.
- Jangan menyimpan data inti hanya di React state.
- Jangan commit `.env` atau secret.
- Jangan force push atau menghapus data tanpa backup.
- Gunakan branch khusus roadmap.
- Jalankan lint, typecheck, test, build, dan browser verification.
- Hapus kode mock terkait hanya setelah penggantinya lulus.
- Jangan menyatakan selesai hanya karena API test lulus.

## Laporan Akhir

Laporkan status, dokumen yang dibaca, branch, file added/modified/deleted, perubahan frontend/backend/database/security, perintah test dan hasil, bukti browser, acceptance criteria, limitation, commit hash, dan roadmap berikutnya.

# Roadmap 07 — Polygon Amoy Testnet untuk DPP

**Dependency:** FE–BE, PostgreSQL, DPP database, staging, dan browser E2E lulus.  
**Branch:** `feature/roadmap-07-polygon-amoy`

## Tujuan

Catat hash versi DPP ke Polygon Amoy Testnet secara nyata.

## Scope

Smart contract registry:
- `dppVersionKey`;
- `metadataHash`;
- `anchoredAt`;
- issuer;
- OpenZeppelin access control.

Backend/worker:
- canonical JSON;
- Keccak-256;
- submit transaksi;
- tunggu receipt;
- simpan chainId, contractAddress, txHash, blockNumber, explorerUrl, anchoredAt;
- retry, idempotency, failure state.

Status:
- `database_verified`;
- `anchoring_pending`;
- `testnet_verified`;
- `anchoring_failed`.

Admin UI:
- tombol anchor;
- progress;
- success/failure;
- explorer link.

User DPP:
- database verification;
- Amoy verification;
- hash;
- transaction;
- explorer;
- testnet disclaimer;
- verifikasi hash DB vs on-chain.

## Larangan

Tidak boleh ada random tx hash, alert palsu, label mainnet, NFT palsu, private key di frontend, atau data pribadi on-chain.

## Acceptance Criteria

- [ ] Contract deployed ke Amoy.
- [ ] Satu produk menghasilkan transaksi nyata.
- [ ] Explorer URL terbuka.
- [ ] Receipt sukses.
- [ ] Hash DB cocok dengan on-chain.
- [ ] Anchor versi sama idempotent.
- [ ] Failure tidak merusak DPP database.
- [ ] Private key hanya backend/worker.
- [ ] UI jelas menyebut testnet.
- [ ] Dokumentasi chain ID dan contract address tersedia.

Jika wallet, RPC, atau token testnet belum tersedia, pertahankan `database_verified` dan laporkan blocker. Jangan membuat simulasi palsu.
