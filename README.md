# EcoThread

EcoThread adalah platform manufaktur fashion sirkular yang menghubungkan City Hub, Mitra UMKM penjahit, dan pelanggan. Limbah tekstil diproses menjadi produk upcycled bernilai, sementara asal bahan, pembuat, pemeriksaan kualitas, dan perjalanan produk dicatat melalui Digital Product Passport (DPP).

Proyek ini dikembangkan untuk GEMASTIK XIX — Divisi Bisnis TIK.

## Nilai bisnis

- Penjualan D2C dan pre-order produk upcycled dalam jumlah terbatas.
- Pemberdayaan Mitra UMKM melalui pekerjaan jahit dan upah yang transparan.
- Pengelolaan limbah tekstil untuk mitra bisnis dan City Hub.
- DPP sebagai bukti asal bahan dan proses produksi, bukan sekadar klaim pemasaran.
- Arsitektur database-first dengan opsi anchoring hash DPP ke Polygon Amoy.

## Pengalaman aplikasi

### Publik dan pelanggan

- Landing page product-first dengan identitas visual EcoThread.
- Katalog dengan variasi jaket, overshirt, tas tote, dan bucket hat.
- Detail harga, deposit, stok, dan cerita produk.
- Pre-order, unggah bukti pembayaran, riwayat pesanan, dan profil pelanggan.
- DPP publik dengan penandaan transparan untuk data aktual, demo, dan estimasi.

### Mitra UMKM

Portal Mitra dirancang mobile-first untuk pengguna yang belum terbiasa memakai aplikasi:

- Bahasa sehari-hari tanpa istilah teknis seperti *payout*, *QC*, atau *milestone*.
- Beranda hanya menampilkan tindakan berikutnya.
- Pembaruan pekerjaan cukup dengan memilih tahap jahitan.
- Foto hasil jahitan dipilih langsung dari kamera atau galeri.
- Upah, tanggal selesai, dan status pemeriksaan ditampilkan dengan jelas.
- Area sentuh besar, warna lembut, dan navigasi empat menu.

### Admin City Hub

- Pengelolaan sumber dan batch material.
- Pola, Eco-Kit, penugasan produksi, dan Mitra.
- Pemeriksaan kualitas dan pembayaran upah.
- Pembuatan produk, katalog, DPP, serta anchoring Polygon Amoy.
- Role-based access control dan audit trail.

## Akun demo

Jalankan `pnpm db:seed` sebelum memakai akun berikut.

| Peran | Email | Password | Halaman masuk |
| --- | --- | --- | --- |
| Admin | `admin@ecothread.local` | `Password123!` | `/auth/admin/login` |
| Mitra UMKM | `mitra@ecothread.local` | `Password123!` | `/auth/mitra/login` |
| Pelanggan / Dewan Juri | `pelanggan@ecothread.local` | `DemoPelanggan2026!` | `/auth/customer/login` |

Akun pelanggan demo memiliki satu pesanan contoh yang sedang diproses sehingga alur akun dan riwayat pesanan dapat langsung dicoba.

## Arsitektur

```text
apps/
├── web/          React + Vite + TypeScript (port 3000)
├── api/          Fastify + TypeScript (port 4000)
├── ai-worker/    layanan AI pendukung
├── admin/        aplikasi lama, hanya referensi
├── mitra/        aplikasi lama, hanya referensi
└── user/         aplikasi lama, hanya referensi

packages/
├── contracts/    schema Zod, kontrak, dan state machine
└── api-client/   SDK API bersama untuk frontend

prisma/
├── schema.prisma
└── seed.ts
```

Alur utama aplikasi:

```text
Material → Eco-Kit → Mitra → Pemeriksaan → Produk → Katalog → DPP
```

Teknologi utama:

- React 18, Vite, dan TypeScript.
- Fastify, Prisma, dan PostgreSQL.
- JWT, RBAC, serta audit log.
- Human-in-the-loop untuk alur AI.
- Keccak-256 dan Polygon Amoy untuk bukti anchoring DPP.
- Playwright untuk pengujian end-to-end.

## Menjalankan secara lokal

Prasyarat:

- Node.js 20 atau 22 LTS.
- pnpm 10+.
- PostgreSQL, atau Docker untuk menjalankan database lokal.

```bash
git clone https://github.com/hanif-12-01/Gemastik-XIX-.git
cd Gemastik-XIX-
git switch main

pnpm install
cp .env.example .env
docker compose up -d

pnpm db:generate
pnpm prisma db push
pnpm db:seed
```

Jalankan API dan web pada dua terminal:

```bash
pnpm --filter @ecothread/api dev
```

```bash
pnpm --filter @ecothread/web dev
```

Buka:

- Web: `http://localhost:3000`
- API: `http://localhost:4000`

## Validasi

```bash
pnpm --filter @ecothread/web build
pnpm --filter @ecothread/api build
pnpm test:e2e
```

Seed bersifat idempoten dan dapat dijalankan kembali untuk mengembalikan akun serta katalog demo utama.

## Identitas visual

Warna diadaptasi dari pitch deck EcoThread dengan saturasi yang dilembutkan agar nyaman digunakan dalam waktu lama. Logo resmi disimpan di `apps/web/public/ecothread-logo.png`, sedangkan foto produk lokal berada di `apps/web/public/products/`.

Hak cipta © 2026 Tim EcoThread.
