# ECOT-MVP-004 — Integrasi Admin dan Mitra

**Prioritas:** P0  
**Timebox:** Selasa 19.00–22.00 dan Rabu 08.00–12.00  
**Owner utama:** Tech Lead  
**Support:** Operations Lead  
**Dependency:** ECOT-MVP-003

## Tujuan

Membuktikan bahwa Admin dan Mitra terhubung melalui data nyata.

## Alur

```text
Admin membuat material
→ membuat Eco-Kit
→ membuat production order
→ assign Mitra
→ Mitra melihat order
→ Mitra menerima
→ Mitra memperbarui progres
```

## Scope Admin

- Form material sederhana.
- Form production order.
- Pemilihan Mitra.
- Assign order.
- Monitoring status.

## Scope Mitra

- Daftar order.
- Detail fee, deadline, material, pola.
- Accept/reject.
- Update milestone.
- Upload foto progres.

## Acceptance Criteria

- Order yang di-assign muncul pada akun Mitra tanpa data hard-coded.
- Mitra lain tidak dapat melihat order tersebut.
- Accept dari Mitra mengubah status di Admin.
- Progress dari Mitra tampil di Admin.
- Data tetap tersedia setelah logout/login.
- Tidak ada `setTimeout` sebagai proses bisnis.
