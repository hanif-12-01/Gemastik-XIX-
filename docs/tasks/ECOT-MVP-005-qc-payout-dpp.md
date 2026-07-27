# ECOT-MVP-005 — QC, Payout, Product, dan DPP

**Prioritas:** P0  
**Timebox:** Rabu 13.00–22.00  
**Owner utama:** Tech Lead  
**Support:** Operations Lead  
**Dependency:** ECOT-MVP-004

## Tujuan

Menyelesaikan alur dari hasil produksi sampai produk dapat dipindai.

## Scope Mitra

- Upload minimal foto depan, belakang, dan detail.
- Submit ke QC.
- Melihat hasil approve atau revisi.

## Scope Admin

- QC checklist.
- Approve atau revision.
- Payout record setelah approve.
- Upload bukti pembayaran manual.
- Buat product record.
- Generate product code dan QR.
- Publish DPP.

## DPP Minimum

- nama dan kode produk;
- before/after;
- sumber material;
- profil Mitra;
- timeline produksi;
- hasil QC;
- impact berlabel estimasi;
- status verifikasi database.

## Acceptance Criteria

- QC tidak dapat approve tanpa checklist.
- Payout hanya dibuat setelah QC approved.
- Status `paid` membutuhkan payment reference/bukti.
- Product code unik.
- QR membuka `/dpp/:productCode`.
- Dua product code menampilkan data berbeda.
- Badge blockchain tidak tampil jika belum ada transaksi nyata.
