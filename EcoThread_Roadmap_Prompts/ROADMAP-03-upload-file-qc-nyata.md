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

# Roadmap 03 — Upload File QC Nyata

**Dependency:** Roadmap 01–02 lulus.  
**Branch:** `feature/roadmap-03-real-qc-upload`

## Scope

Storage:
- bucket private production/QC;
- signed URL.

Backend:
- multipart atau signed upload;
- MIME dan size validation;
- ownership;
- metadata file;
- cleanup saat gagal.

Mitra UI:
- input file;
- preview;
- progress;
- retry/remove;
- wajib front, back, detail.

Admin UI:
- QC queue;
- buka foto;
- checklist;
- approve/revision/reject.

## Acceptance Criteria

- [ ] File nyata terkirim ke storage.
- [ ] Metadata/URL tersimpan di DB.
- [ ] Mitra lain tidak dapat membaca.
- [ ] Admin dapat membuka.
- [ ] Refresh tidak menghilangkan evidence.
- [ ] Fake upload dihapus.
- [ ] MIME/size invalid ditolak.
- [ ] QC approve membutuhkan checklist.
- [ ] Audit log tercipta.

Jika credential storage belum tersedia, buat blocker. Jangan memakai fake upload.
