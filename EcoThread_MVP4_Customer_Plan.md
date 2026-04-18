# Rencana Pengembangan MVP 4: EcoThread Customer Web App (Digital Product Passport)

## 1. Konsep Utama & Tujuan
Aplikasi ini berwujud **Mobile Web App** (diakses melalui browser smartphone tanpa perlu mengunduh aplikasi di PlayStore/AppStore). Skenario penggunaannya adalah: Pelanggan (seperti Nadia) melakukan *tap* NFC atau memindai QR Code pada label baju EcoThread, lalu browser akan langsung membuka halaman Digital Product Passport (DPP) dari baju spesifik tersebut.

Tujuan utama MVP ini adalah memvalidasi **Rantai Nilai Terakhir (End-Point)** untuk menyelesaikan kelemahan di bagian *Customer Relationships* dan *Retention* (fase pasca-pembelian Gen-Z) yang sempat dibahas pada dokumen *Validasi BMC*.

## 2. Struktur Tampilan (User Interface)
Desain akan menggunakan pendekatan *Vertical Scrolling* (menggulir ke bawah) layaknya aplikasi sosial media masa kini yang sangat disukai Gen-Z. Tampilan harus bersih (*clean*), ramah lingkungan, dengan dominasi warna cerah (Light Mode) dipadu aksen hijau alam (Nature Green) dan elemen membumi (Earth Tones).

### A. Bagian 1: Hero Section (Identitas Produk)
* **Visual:** Foto produk (misal: "Jaket Denim Upcycle") yang estetik.
* **Informasi:** Nama produk, Harga beli (Rp 349.000), dan ID Unik Paspor (misal: `ECO-8924-NFC`).
* **Lencana Kepercayaan (Trust Badge):** Terdapat lencana *"100% Traceable"* dan tombol kecil/link yang mengarah pada status verifikasi di *Jaringan Blockchain Polygon*.

### B. Bagian 2: The Journey (Ketertelusuran / Traceability)
* **Visual:** Garis waktu (*Timeline*) vertikal atau horizontal interaktif.
* **Isi Timeline:** 
  1. *Sourcing:* Asal limbah (Misal: "Gudang Limbah A, 12 April 2026").
  2. *Treatment:* Sterilisasi Ozon 100%.
  3. *AI Design:* Dirancang menggunakan GarmageNet.
  4. *Crafting:* Dijahit oleh mitra lokal.
  5. *Quality Control:* Lulus uji standar di City Hub.

### C. Bagian 3: Meet the Maker (Dampak Sosial)
* **Visual:** Foto avatar pembuat (Ibu Siti) dan lokasi penjahitan (Bandung).
* **Informasi:** Cerita singkat pembuatnya ("Penjahit dengan 25 tahun pengalaman").
* **Fitur Interaktif:** Tombol *"Beri Tip/Apresiasi"* atau *"Kirim Pesan Terima Kasih"* sscara virtual (meningkatkan ikatan emosional).

### D. Bagian 4: Impact Tracker (Metrik Lingkungan)
* Menampilkan panel *Dashboard* mini untuk produk ini.
* **Metrik:** 
  * 💧 Menghemat 1.500 Liter Air.
  * ☁️ Mencegah 2.3 kg Emisi Karbon (CO2).
  * ♻️ Mengalihkan 850 gram Limbah dari TPA.

### E. Bagian 5: Gamifikasi & "Eco-Trade" (Siklus Tertutup / Retensi)
* **Status Gamifikasi Pemilik:** Ditampilkan bahwa pembeli (Nadia) saat ini berada di level *"Circular Artisan"*.
* **CTA (Call to Action) Utama - Eco-Trade:** Tombol besar bertuliskan *"Tukarkan Pakaian Ini"*. Jika pakaian sudah bosan dipakai, tombol ini akan memunculkan popup yang menjanjikan saldo **Eco-Credits sebesar Rp 50.000** jika baju dikembalikan ke City Hub. (Sangat ampuh memicu *Repeat Order* tanpa biaya iklan).

## 3. Tumpukan Teknologi (Tech Stack) Prototipe
* **Framework:** React + Vite.
* **Styling:** Tailwind CSS (untuk desain modern, responsif, dan animasi mulus).
* **Ikon:** Lucide-React (konsisten dengan aplikasi Superadmin dan Mitra).
* **Ilustrasi/Grafik:** Recharts untuk menampilkan grafik dampak lingkungan.

## 4. Alur Presentasi Juri (Simulasi)
Dalam video, bagian ini sangat cocok dijadikan cuplikan tambahan atau epilog ketika Tata/Stella memegang HP dan men-scan baju. Browser otomatis membuka halaman DPP ini. Juri akan langsung terkesima karena teori Blockchain dan Transparansi Lingkungan yang ada di awal presentasi **benar-benar memiliki wujud produk nyata yang interaktif**.