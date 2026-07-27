# ECOT-MVP-003 — Core Data dan API

**Prioritas:** P0  
**Timebox:** Selasa 11.00–18.00  
**Owner utama:** Tech Lead  
**Support:** Operations Lead  
**Dependency:** ECOT-MVP-002

## Tujuan

Membangun data inti yang diperlukan untuk vertical slice.

## Entitas Minimum

- users;
- mitra_profiles;
- material_batches;
- patterns;
- eco_kits;
- production_orders;
- production_progress;
- qc_reviews;
- payouts;
- products;
- dpp_records;
- customer_orders;
- payments;
- audit_logs.

## Endpoint Minimum

```text
POST /admin/material-batches
GET  /admin/material-batches
POST /admin/production-orders
POST /admin/production-orders/:id/assign
GET  /mitra/production-orders
POST /mitra/production-orders/:id/accept
POST /mitra/production-orders/:id/progress
```

## Acceptance Criteria

- Data tersimpan setelah refresh.
- Setiap entity memiliki UUID dan timestamp.
- Production order memiliki status yang tervalidasi.
- Audit log tercipta saat order dibuat dan di-assign.
- Validation error memiliki pesan yang jelas.
- Seed demo dapat dijalankan ulang tanpa duplikasi berbahaya.
