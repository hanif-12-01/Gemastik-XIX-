# EcoThread Database Schema & Entity Specification 🗄️

**Spesifikasi 28 Entitas Database Utama EcoThread**  
**ORM:** Prisma ORM  
**Database:** PostgreSQL / Supabase (Fallback: SQLite untuk local dev)  

---

## 📐 Daftar Entitas & Fungsi

1. **`users`**: Menyimpan kredensial autentikasi, hashed password (SHA-256), email, dan role (`admin`, `mitra`, `user`).
2. **`user_profiles`**: Informasi profil konsumen (nomor HP, alamat pengiriman, foto profil).
3. **`mitra_profiles`**: Spesifikasi sanggar/bengkel jahit Mitra (nama workshop, spesialisasi, kapasitas/minggu, rating, total payout, info rekening).
4. **`material_sources`**: Sumber asal limbah garmen (Bank Sampah, pabrik garmen, konveksi).
5. **`material_batches`**: Batch material limbah yang masuk (kode batch `MAT-2026-xxxx`, jenis kain, berat kg, warna, status sterilisasi).
6. **`sanitization_records`**: Rekam jejak sterilisasi & pembersihan kain (metode steam/wash, suhu °C, operator, hasil inspeksi).
7. **`patterns`**: Katalog pola fashion sirkular (kode pola `PAT-2026-xxxx`, kategori, deskripsi).
8. **`pattern_versions`**: Versi berkas pola & instruksi pengerjaan jahit (`v1.0`, file URL).
9. **`eco_kits`**: Paket produksi siap jahit (kode `KIT-2026-xxxx`, tingkat kesulitan, target jam pengerjaan).
10. **`eco_kit_items`**: Komponen material dalam Eco-Kit (rincian kain, jumlah kg, benang).
11. **`production_orders`**: Order produksi terdistribusi (kode `ORD-2026-xxxx`, tarif fee Mitra, status pengerjaan state machine).
12. **`production_progress`**: Rekam jejak persentase progres milestone jahit (0% - 100%).
13. **`production_evidence`**: Bukti fisik hasil produksi Mitra (Foto Depan, Foto Belakang, Foto Detail Jahitan, ukuran aktual).
14. **`qc_reviews`**: Hasil pengujian Quality Control oleh Admin (Status approve/revision, 4 checklist item).
15. **`qc_findings`**: Catatan khusus atau temuan cacat jahitan saat QC.
16. **`payouts`**: Catatan honorarium/payout Mitra (status `pending`, `approved`, `paid`, referensi transfer bank).
17. **`products`**: Produk fashion final yang siap dipasarkan (kode `PRD-2026-xxxx`, foto sebelum/sesudah).
18. **`product_materials`**: Pemetaan hubungan material batch ke produk final untuk keterlacakan sirkular.
19. **`dpp_records`**: Record Digital Product Passport (DPP) dinamis (status verifikasi `database_verified`, QR URL).
20. **`dpp_versions`**: Riwayat versi snapshot JSON data DPP.
21. **`impact_records`**: Metrik estimasi dampak lingkungan (Penghematan CO2 kg, Penghematan Air Liter, Limbah teralihkan kg).
22. **`catalog_items`**: Item dalam katalog e-commerce pre-order (slug URL, harga, deposit).
23. **`customer_orders`**: Pesanan pre-order dari konsumen (kode `CORD-2026-xxxx`, total harga, deposit, alamat).
24. **`customer_order_items`**: Item rincian pesanan konsumen.
25. **`payments`**: Bukti pembayaran deposit/pelunasan dari konsumen.
26. **`notifications`**: Notifikasi sistem ke user/Mitra/admin.
27. **`audit_logs`**: Log jejak audit operasi kritis (siapa, aksi apa, entity mana, kapan).
28. **`jobs`**: Antrean pekerjaan latar belakang (AI segmentation, DPP anchoring).
