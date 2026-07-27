# ECOT-MVP-001 — Foundation dan Repository

**Prioritas:** P0  
**Timebox:** Senin 18.30–22.30  
**Owner utama:** Tech Lead

## Tujuan

Menyiapkan fondasi agar seluruh aplikasi memakai konfigurasi dan backend yang sama.

## Scope

- Tag/freeze commit prototype.
- Buat struktur `apps/admin`, `apps/mitra`, `apps/user`, `apps/api`.
- Siapkan PostgreSQL/Supabase.
- Tambahkan `.env.example`.
- Tambahkan Prisma dan migration awal.
- Tambahkan akun seed Admin, Mitra, User.
- Pastikan tiga frontend dan API dapat dijalankan.

## Output

- Repository rapi.
- API hidup.
- Database tersambung.
- Tiga akun demo tersedia.
- Seluruh aplikasi berhasil build.

## Acceptance Criteria

- `pnpm install` berhasil.
- `pnpm build` berhasil untuk seluruh app.
- API health check mengembalikan `200`.
- Migration dapat dijalankan dari kondisi database kosong.
- Secret tidak masuk Git.
- README menjelaskan cara menjalankan project.

## Tidak Dikerjakan

- Redesign UI.
- AI.
- Blockchain.
- Payment gateway.
