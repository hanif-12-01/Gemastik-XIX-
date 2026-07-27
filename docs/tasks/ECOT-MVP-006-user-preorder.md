# ECOT-MVP-006 — User Catalog dan Pre-Order

**Prioritas:** P0  
**Timebox:** Kamis 08.00–13.00  
**Owner utama:** Product/Marketing Lead  
**Support:** Tech Lead  
**Dependency:** ECOT-MVP-005

## Tujuan

Membuktikan bahwa User dapat menemukan produk dan menunjukkan willingness to pay.

## Scope

- Katalog minimum satu produk hero.
- Detail produk.
- Harga dan estimasi produksi.
- Pilihan ukuran sederhana.
- Pre-order.
- Deposit atau bukti transfer manual.
- Customer order tracking.
- Tautan DPP.

## Acceptance Criteria

- Produk berasal dari database.
- User dapat membuat order.
- Order berstatus `pending_payment`.
- Admin dapat memverifikasi deposit.
- Setelah diverifikasi, status menjadi `paid` atau `deposit_paid`.
- Transaksi terverifikasi dihitung sebagai traction.
- User dapat melihat status order miliknya.
