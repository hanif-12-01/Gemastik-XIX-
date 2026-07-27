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

# Roadmap 04 — Migrasi SQLite ke PostgreSQL

**Dependency:** Roadmap 01–03 stabil.  
**Branch:** `feature/roadmap-04-postgresql`

## Scope

- backup SQLite;
- audit schema Prisma;
- provider `postgresql`;
- migration;
- index dan constraint;
- seed idempotent;
- akun `mitra2`;
- staging/production DB terpisah;
- update `.env.example` dan docs.

## Acceptance Criteria

- [ ] Prisma memakai PostgreSQL.
- [ ] Migration berjalan dari DB kosong.
- [ ] Seed dua kali tidak membuat duplikasi berbahaya.
- [ ] Ketiga role membaca DB yang sama.
- [ ] Restart API tidak menghilangkan data.
- [ ] Tidak ada runtime dependency `dev.db`.
- [ ] Integration test memakai PostgreSQL test DB.
- [ ] Backup dan rollback terdokumentasi.
- [ ] `.env` tidak tracked.

Jika credential belum tersedia atau migration berisiko merusak data aktual, berhenti sebelum perubahan destruktif.
