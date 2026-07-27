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

# Roadmap 01 — Integrasi API Client ke UI

**Branch:** `feature/roadmap-01-api-client-ui`

## Tujuan

Hubungkan Admin, Mitra, dan User ke backend nyata melalui `packages/api-client` dan `packages/contracts`.

## Scope

API client wajib mendukung base URL environment, bearer-token provider, typed error, timeout, request ID, JSON, dan interface multipart.

Admin:
- dashboard stats;
- material list/create;
- Mitra list;
- order list/create/assign;
- QC list;
- payout list;
- product list.

Mitra:
- order list/detail;
- accept/reject;
- update progress;
- payout history.

User:
- catalog list/detail;
- DPP public;
- customer order list.

## Hapus Setelah Pengganti Lulus

- hard-coded operational arrays;
- mutation lokal untuk aksi inti;
- tombol `alert()` inti;
- static DPP utama;
- ID order/product palsu.

## Acceptance Criteria

- [ ] Ketiga app memakai `@ecothread/api-client`.
- [ ] Core read berasal dari API.
- [ ] Core mutation mengirim HTTP request.
- [ ] Network tab menunjukkan request nyata.
- [ ] Data bertahan setelah refresh.
- [ ] Loading/error/empty/success state tersedia.
- [ ] Admin membuat order dari UI dan record muncul di DB.
- [ ] Mitra melihat order dari backend.
- [ ] User melihat katalog dan DPP dari backend.
- [ ] Build seluruh app lulus.
