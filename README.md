# EcoThread - Gemastik XIX 🚀

Repositori ini berisi keseluruhan proyek **EcoThread** yang diajukan untuk perlombaan **Gemastik XIX**. Proyek ini terdiri dari beberapa aplikasi web berbasis React (Vite) beserta dokumen riset/perencanaan.

## 📂 Struktur Proyek

Proyek ini dipisahkan menjadi tiga aplikasi utama:
1. **`echothread-superadmin-app/`** - Dashboard untuk pemantauan superadmin.
2. **`ecothread-mitra-react/`** - Aplikasi web untuk mitra.
3. **`ecothread-animation-demo/`** - Demo animasi proyek.

Selain direktori aplikasi, terdapat juga dokumen-dokumen pendukung jalannya proyek seperti Arsitektur ICT, Business Plan, MVP Plan, Storyboard, Studi Kasus, dan Validasi BMC yang tersedia dalam format Markdown (`.md`).

## 🛠️ Prasyarat (Prerequisites)

Pastikan lingkungan kerja Anda sudah terpasang:
* [Node.js](https://nodejs.org/) (versi LTS direkomendasikan)
* [Git](https://git-scm.com/)

## 🚀 Cara Menjalankan Aplikasi Secara Lokal

Masing-masing aplikasi dapat dijalankan secara terpisah menggunakan Vite. Berikut adalah langkah-langkahnya:

### 1. Kloning Repositori
Buka terminal/command prompt dan jalankan perintah berikut:
```bash
git clone https://github.com/hanif-12-01/Gemastik-XIX-.git
cd Gemastik-XIX-
```

### 2. Menjalankan Aplikasi (Contoh: Aplikasi Mitra)
Gunakan terminal untuk masuk ke folder aplikasi yang ingin dijalankan, kemudian instal dependensi dan mulai server pengembangan (*development server*):

```bash
# 1. Pindah ke direktori sub-proyek
cd ecothread-mitra-react

# 2. Instal semua dependensi
npm install
# atau jika menggunakan yarn: yarn install

# 3. Jalankan server lokal
npm run dev
# atau jika menggunakan yarn: yarn dev
```

*Catatan: Ulangi langkah `cd <nama_folder>`, `npm install`, dan `npm run dev` pada direktori `echothread-superadmin-app` atau `ecothread-animation-demo` untuk menjalankan aplikasi lainnya.*

## 📄 Lisensi
Hak Cipta © 2026 Tim EcoThread. Dibuat untuk Gemastik XIX.