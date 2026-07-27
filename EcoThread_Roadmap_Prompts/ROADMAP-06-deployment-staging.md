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

# Roadmap 06 — Deployment Staging

**Dependency:** Playwright lokal lulus.  
**Branch:** `release/roadmap-06-staging`

## Scope

- deploy Admin, Mitra, User, API;
- PostgreSQL dan Storage staging;
- HTTPS;
- CORS allowlist;
- environment variables;
- migration dan seed staging;
- logging/monitoring;
- DPP public base URL;
- QR publik;
- smoke test perangkat berbeda.

## Acceptance Criteria

- [ ] Semua URL publik dapat dibuka.
- [ ] Tidak ada localhost.
- [ ] API health 200.
- [ ] HTTPS aktif.
- [ ] CORS hanya origin resmi.
- [ ] DB persisten.
- [ ] Upload file bekerja.
- [ ] Akun demo bekerja.
- [ ] QR terbuka dari ponsel.
- [ ] Playwright lulus terhadap staging.
- [ ] Secret memakai secret manager.
- [ ] `DEPLOYMENT.md` dan `DEMO.md` berisi URL aktual.

Jika credential deployment tidak tersedia, buat blocker. Dokumentasi saja bukan deployment.
