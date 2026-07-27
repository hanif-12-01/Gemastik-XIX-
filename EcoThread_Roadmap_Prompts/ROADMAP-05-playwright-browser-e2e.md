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

# Roadmap 05 — Playwright Browser E2E

**Dependency:** Roadmap 01–04 lulus.  
**Branch:** `test/roadmap-05-playwright-e2e`

## Scenario Wajib

Admin:
login → create material → create/assign order → logout.

Mitra:
login → order terlihat → accept → progress → upload front/back/detail → submit QC → logout.

Admin:
login → review QC → checklist → approve → payout → mark paid → create product → publish DPP → logout.

User:
login → catalog → preorder → upload payment proof → logout.

Admin:
login → verify payment → logout.

User:
login → status verified → DPP → refresh → data tetap ada.

## Negative Test

- User membaca Mitra order → 403/404.
- Mitra 2 membaca Mitra 1 → 403/404.
- User membuka Admin endpoint → 403.
- QC tanpa checklist ditolak.
- Payout tanpa reference ditolak.
- User self-verify payment ditolak.
- Expired token → 401.
- Invalid file ditolak.

## Acceptance Criteria

- [ ] Chromium digunakan.
- [ ] Semua aksi inti lewat UI.
- [ ] Tidak ada manipulasi DB manual di tengah test.
- [ ] Screenshot/trace/video failure tersedia.
- [ ] Test repeatable dari seed bersih.
- [ ] Refresh persistence lulus.
- [ ] Negative tests lulus.
- [ ] Root build lulus.
- [ ] Laporan dibuat di `docs/qa/PLAYWRIGHT_E2E_REPORT.md`.
