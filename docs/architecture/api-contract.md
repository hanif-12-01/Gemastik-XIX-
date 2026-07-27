# EcoThread API Contract & Endpoint Specification 🌐

**Spesifikasi RESTful API Endpoints EcoThread (Prefix: `/api/v1`)**  

---

## 🔒 Authentication & Session
- `POST /api/v1/auth/login` — Login email & password, mengembalikan JWT Token & User Profile.
- `GET /api/v1/me` — Mengembalikan profil user aktif berdasarkan JWT Bearer token.

---

## 🛠️ Admin Endpoints (Role: `admin`)
- `GET /api/v1/admin/dashboard-stats` — Statistik dashboard dipisah berdasarkan `actual`, `demo`, dan `target`.
- `POST /api/v1/admin/material-batches` — Menambah batch material limbah baru.
- `GET /api/v1/admin/material-batches` — Mengambil seluruh daftar batch material.
- `POST /api/v1/admin/production-orders` — Membuat production order baru dari Eco-Kit.
- `POST /api/v1/admin/production-orders/:id/assign` — Menugaskan order ke Mitra tertentu.
- `GET /api/v1/admin/qc-reviews` — Mengambil daftar order yang siap/sedang dalam tahap QC.
- `POST /api/v1/admin/qc-reviews/:id/decision` — Memproses keputusan QC (Approve / Revision) dengan checklist.
- `POST /api/v1/admin/payouts/:id/mark-paid` — Memverifikasi pembayaran honorarium Mitra.
- `POST /api/v1/admin/products` — Mendaftarkan produk final baru.
- `POST /api/v1/admin/products/:id/publish-dpp` — Mempublikasikan Digital Product Passport (DPP).

---

## 🪡 Mitra Endpoints (Role: `mitra`)
- `GET /api/v1/mitra/production-orders` — Mengambil daftar order khusus milik Mitra terautentikasi.
- `GET /api/v1/mitra/production-orders/:id` — Mengambil rincian detail order & instruksi pola.
- `POST /api/v1/mitra/production-orders/:id/accept` — Menerima penawaran order jahit.
- `POST /api/v1/mitra/production-orders/:id/reject` — Menolak penawaran order jahit dengan alasan.
- `POST /api/v1/mitra/production-orders/:id/progress` — Memperbarui persentase & catatan milestone pengerjaan.
- `POST /api/v1/mitra/production-orders/:id/submit-qc` — Mengunggah foto bukti QC (Depan, Belakang, Detail).

---

## 📲 Public DPP & Consumer Commerce (Role: `user` & Public)
- `GET /api/v1/dpp/:productCode` — Mengambil data transparan Digital Product Passport publik.
- `GET /api/v1/catalog` — Mengambil daftar item produk hero di katalog.
- `GET /api/v1/catalog/:slug` — Mengambil rincian detail item katalog berdasarkan slug.
- `POST /api/v1/customer-orders` — Membuat pesanan pre-order/deposit konsumen.
- `POST /api/v1/customer-orders/:id/payment-proof` — Mengunggah bukti transfer deposit.
- `GET /api/v1/me/customer-orders` — Mengambil riwayat pesanan konsumen aktif.
