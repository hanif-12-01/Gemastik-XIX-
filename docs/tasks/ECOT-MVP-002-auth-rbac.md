# ECOT-MVP-002 — Authentication dan RBAC

**Prioritas:** P0  
**Timebox:** Selasa 08.00–11.00  
**Owner utama:** Tech Lead  
**Dependency:** ECOT-MVP-001

## Tujuan

Menyediakan login dan pembatasan akses untuk Admin, Mitra, dan User.

## Scope

- Login email/password.
- Session setelah refresh.
- Role `admin`, `mitra`, `user`.
- Status Mitra `active`.
- Route guard frontend.
- Permission guard backend.
- Endpoint `/me`.

## Acceptance Criteria

- Admin hanya dapat membuka route Admin.
- Mitra hanya dapat membuka order miliknya.
- User tidak dapat mengakses endpoint Admin.
- Role diverifikasi backend.
- Session tetap aktif setelah refresh.
- Logout menghapus session.

## Test Minimum

- Login benar.
- Password salah.
- User mencoba endpoint Admin.
- Mitra mencoba membaca order Mitra lain.
