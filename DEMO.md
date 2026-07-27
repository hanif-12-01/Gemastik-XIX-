# EcoThread MVP — Panduan Demo & Presentasi 🎬

**Target:** GEMASTIK XIX — Divisi Bisnis TIK  
**Versi:** 1.0 Final MVP  
**Status Aplikasi:** Ready for Live Demo & Deployment  

---

## 🔑 Akun Demo Development & Staging

Semua role terhubung ke backend database Fastify + Prisma + PostgreSQL/SQLite yang sama:

| Role | Email | Password | Hak Akses & Fitur |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@ecothread.local` | `Password123!` | Kelola material batch, buat order, assign Mitra, checklist QC, approve payout, buat produk, publish DPP, monitor dashboard. |
| **Mitra Penjahit** | `mitra@ecothread.local` | `Password123!` | Lihat order khusus miliknya, accept/reject, update progres %, upload foto QC (depan, belakang, detail), lihat riwayat payout. |
| **Consumer (User)** | `user@ecothread.local` | `Password123!` | Lihat katalog produk hero, buka DPP publik via QR/link, buat pre-order/deposit, upload bukti bayar, lacak pesanan. |

> **Catatan Keamanan:** Password di atas hanya untuk lingkungan pengujian & demo local/staging.

---

## ⏱️ Panduan Skenario Demo (5–7 Menit End-to-End Vertical Slice)

### Langkah 1: Pengelolaan Material & Order oleh Admin (1.5 Menit)
1. Buka aplikasi **Admin Dashboard** (`http://localhost:5173`).
2. Login sebagai `admin@ecothread.local`.
3. Masuk ke menu **Material Batches**, tambahkan material limbah garmen baru (misal: `MAT-2026-0005`, 20 kg Cotton Denim daur ulang).
4. Masuk ke menu **Production Orders**, klik **Buat Production Order Baru** memilih Eco-Kit `KIT-2026-0001` dengan tarif pengerjaan `Rp 200.000`.
5. Klik **Assign Mitra**, pilih `Ibu Ratna (Mitra Penjahit Bandung)`. Status order berubah dari `draft` menjadi `offered`.

### Langkah 2: Pengerjaan & Pengiriman Bukti oleh Mitra (1.5 Menit)
1. Buka aplikasi **Mitra Portal** (`http://localhost:5174`).
2. Login sebagai `mitra@ecothread.local`.
3. Buka **Daftar Pesanan**, order `ORD-2026-0006` dari Admin terlihat. (Cobalah login sebagai `mitra2@ecothread.local` untuk membuktikan isolasi data: order tidak muncul di mitra lain).
4. Klik **Terima Pekerjaan** (Status berubah menjadi `accepted`).
5. Perbarui **Progres Produksi** secara bertahap hingga 100%.
6. Buka form **Submit QC Evidence**, unggah 3 foto wajib (Foto Depan, Foto Belakang, Foto Detail Jahitan) beserta ukuran aktual (`L`). Klik **Kirim ke QC**. Status berubah menjadi `submitted_to_qc`.

### Langkah 3: Quality Control, Payout, & Publikasi DPP oleh Admin (1.5 Menit)
1. Kembali ke **Admin Dashboard**, buka menu **QC Reviews**.
2. Buka detail pengajuan QC dari Ibu Ratna. Centang 4 item **QC Checklist** (Tampak Depan, Tampak Belakang, Kerapihan Jahitan, Presisi Ukuran).
3. Klik **Approve QC**.
   - Backend secara *idempotent* membuat record **Payout** baru senilai `Rp 200.000` (`pending`).
4. Masuk ke menu **Payouts**, klik **Tandai Lunas**, masukkan nomor referensi pembayaran (`PAY-BCA-E2E-2026`). Status order kini `completed`.
5. Masuk ke menu **Products**, klik **Buat Produk Final** (`PRD-2026-0003`) lalu klik **Publish Dynamic DPP**.
   - Sistem secara otomatis menerbitkan **Digital Product Passport (DPP)** dinamis berstatus `database_verified` beserta Kode QR unik.

### Langkah 4: Pemindaian DPP & Pre-Order oleh User (1.5 Menit)
1. Buka aplikasi **User Portal** (`http://localhost:5175`).
2. Buka halaman DPP publik: `http://localhost:5175/dpp/PRD-2026-0003` atau memindai QR Code.
   - User melihat foto *Before & After*, asal sumber material limbah (Bank Sampah Majalaya), profil Mitra pembuat (Ibu Ratna), timeline produksi, dan metrik dampak (Penghematan CO2 & Air) berlabel *Estimasi*.
3. Masuk ke **Katalog Pre-Order**, klik **Pre-Order Produk**.
4. Login sebagai `user@ecothread.local`, isi alamat pengiriman, lalu klik **Buat Pesanan**. Order tercatat berstatus `pending_payment`.
5. Unggah bukti transfer deposit (`Rp 150.000`). Status berubah menjadi `payment_verified` dan tercatat sebagai **Traction**.

---

## 🏷️ Klasifikasi Data Origin (Transparansi untuk Juri)

Dashboard EcoThread memisahkan data dengan transparan menjadi 3 kelompok:

1. **`actual` (Data Pilot Nyata)**  
   Data 1 batch limbah tekstil nyata, 1 produk jaket daur ulang aktual, 3 Mitra terdata, dan rincian HPP aktual (Material: Rp 25rb, Logistik: Rp 15rb, Fee Mitra: Rp 175rb, Aksesoris: Rp 20rb = Total HPP Rp 235.000 / Margin 52.9%).
2. **`demo` (Data Demo Simulasi)**  
   Data buatan untuk keperluan simulasi alur end-to-end multi-role secara cepat saat presentasi.
3. **`target` (Proyeksi Bisnis)**  
   Target 100 pcs/bulan dan omzet Rp 49.900.000/bulan pada fase skala penuh.

---

## 🗺️ Fitur Rilis MVP vs Roadmap Masa Depan

| Fitur | Status MVP (Saat Ini) | Roadmap (Fase Lanjutan) |
| :--- | :--- | :--- |
| **Arsitektur backend & RBAC** | ✅ Aktif (Fastify + Prisma + Node.js) | Microservices terpisah per domain |
| **DPP Verification** | ✅ Database Verified (`database_verified`) | Anchoring otomatis ke Polygon Amoy Testnet |
| **AI Digitalisasi Material** | ✅ Human-in-the-Loop Mask Review | Fully Automated Garment Segmentation (GarmageNet) |
| **Pembayaran Mitra** | ✅ Verifikasi Manual & Referensi Bank | Instant Payout via Payment Gateway API (Midtrans/Xendit) |
| **Sistem Logistik Eco-Kit** | ✅ Tracking Status Manual & Hub | Integrasi API Kurir Instant (GrabExpress / GoSend) |
