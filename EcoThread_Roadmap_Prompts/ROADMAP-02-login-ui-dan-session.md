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

# Roadmap 02 — Login UI, Session, dan Role Guard

**Dependency:** Roadmap 01 lulus.  
**Branch:** `feature/roadmap-02-login-session`

## Scope

Backend:
- bcrypt/Argon2;
- JWT expiry;
- `/api/v1/me`;
- expired token → 401.

Frontend:
- `AuthProvider`;
- `useAuth`;
- `ProtectedRoute`;
- `RoleGuard`;
- session storage abstraction;
- logout;
- 401 interceptor;
- form login pada tiga app.

## Acceptance Criteria

- [ ] Admin, Mitra, User login dari UI.
- [ ] Session bertahan refresh.
- [ ] Logout bekerja.
- [ ] Expired token kembali ke login.
- [ ] Wrong-role UI dan API ditolak.
- [ ] Token tidak hard-coded.
- [ ] Password bukan SHA-256.
- [ ] JWT memiliki `exp`.
- [ ] Negative role tests lulus.

## Browser Test

Login → dashboard → refresh → tetap login → logout untuk ketiga role.
