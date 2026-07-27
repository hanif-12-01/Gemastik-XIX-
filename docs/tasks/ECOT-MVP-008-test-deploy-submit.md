# ECOT-MVP-008 — Testing, Deployment, dan Pengumpulan

**Prioritas:** P0  
**Timebox:** Kamis 19.00–22.00 dan Jumat 08.00–17.00  
**Owner utama:** Seluruh tim  
**Dependency:** Semua P0

## Kamis Malam

- Deploy staging.
- Jalankan smoke test.
- Perbaiki blocker.
- Siapkan data demo stabil.

## Jumat 08.00–11.00

Jalankan E2E:

```text
Admin login
→ create order
→ assign
→ Mitra accept
→ progress
→ submit QC
→ Admin approve
→ payout
→ product
→ DPP
→ User pre-order
```

## Jumat 11.00–13.00

- Production deploy.
- Test dari laptop dan ponsel berbeda.
- Test koneksi seluler.
- Verifikasi QR.
- Verifikasi akun demo.

## Jumat 13.00–15.00

- Rekam video utama.
- Rekam backup screen recording tanpa narasi.
- Update README.
- Tambahkan arsitektur dan akun demo.
- Tulis fitur nyata dan fitur roadmap.

## Jumat 15.00–16.00

- Upload aplikasi/video/dokumen.
- Periksa nama file dan link.
- Download kembali file submission untuk validasi.

## Jumat 16.00–17.00

- Buffer saja.
- Tidak menambah fitur.
- Hanya memperbaiki blocker pengumpulan.

## Acceptance Criteria

- Seluruh app dapat dibuka tanpa local setup.
- Akun demo berfungsi.
- Tidak ada secret di repository.
- Tidak ada link 404.
- QR dapat dipindai.
- Data tidak hilang setelah refresh.
- Video menunjukkan perpindahan data antar-role.
- README menjelaskan batas MVP dengan jujur.
