# LAPORAN TEKNIS PENGEMBANGAN FONDASI WEB SINGLE ROLE-BASED (ROADMAP 0)
## EcoThread — Platform Manufaktur Fashion Sirkular GEMASTIK XIX MVP

* **Tanggal Laporan:** 28 Juli 2026
* **Penyusun:** Lead Software Architect / Senior Full-Stack Engineer
* **Tujuan:** Tim IT / Developer EcoThread
* **Branch Git:** `feature/roadmap-00-web-foundation`
* **Status Implementasi:** SELESAI (COMPLETE) & LULUS VERIFIKASI BUILD

---

## 1. RINGKASAN EKSEKUTIF

Laporan ini menyajikan hasil implementasi **Roadmap 0** pada repositori monorepo EcoThread GEMASTIK XIX. Pada tahap ini, telah dilakukan refaktorisasi arsitektur frontend dari tiga aplikasi micro-frontend terpisah (`apps/admin`, `apps/mitra`, `apps/user`) menjadi satu **Single Role-Based Web Application** utama di **`apps/web`** berbasis **React 18 + Vite 6 + TypeScript + React Router 6**.

Aplikasi lama (`apps/admin`, `apps/mitra`, `apps/user`) tetap dipertahankan secara utuh sebagai referensi visual sementara dan telah di-inventory sebelum dilakukan penghapusan pada fase rilis mendatang. Seluruh pengujian *typecheck*, *build monorepo*, serta *browser smoke verification* pada 12 rute utama telah dinyatakan **PASS** dengan kondisi working tree Git yang bersih.

---

## 2. KEPUTUSAN ARSITEKTUR UTAMA (ADR-001)

Berdasarkan analisis audit teknis, pemisahan frontend sebelumnya menimbulkan masalah navigasi, duplikasi *design tokens*, dan kerumitan deployment di Vercel. Oleh karena itu, disepakati keputusan arsitektur **ADR-001** (*Single Role-Based Web Application Architecture*):

1. **Konsolidasi Entry Point:** Pengunjung publik mengakses satu domain utama melalui **Landing Page (`/`)** dan dapat memilih jalur operasional di **Portal Selection (`/portal`)**.
2. **Standardisasi Deployment Vercel:** Deployment frontend disederhanakan menjadi satu project Vercel (`ecothread-web`) di folder `apps/web` dengan konfigurasi *SPA Client-Side Rewrite* di `vercel.json`.
3. **Batas SDK API Client (`src/lib/api.ts`):** Seluruh komunikasi HTTP frontend diwajibkan menggunakan paket SDK `@ecothread/api-client` berbasis environment variable `VITE_API_BASE_URL` (tanpa *hardcoded URL* `localhost` produksi atau *mock alert*).

---

## 3. ALUR APLIKASI & ATURAN KEAMANAN PORTAL

### Alur Navigasi Utama:
```text
Landing Page (/)
├── Portal Selection (/portal)
│   ├── Admin Portal
│   │   ├── Login Admin (/auth/admin/login)
│   │   └── Registrasi Undangan (/auth/admin/invite/:token)
│   └── Mitra Portal
│       ├── Login Mitra (/auth/mitra/login)
│       └── Registrasi Publik Mitra (/auth/mitra/register)
└── Fitur Publik
    ├── Katalog Produk (/catalog)
    ├── Detail Produk (/catalog/:slug)
    └── Dynamic Digital Product Passport (/dpp/:productCode)
```

### Aturan Keamanan & Akses Peran:
* **Admin Access Policy:** Pendaftaran Admin **TIDAK BISA** dilakukan secara bebas oleh publik. Akun Admin hanya dapat dibuat melalui **Undangan Resmi Super Admin (`/auth/admin/invite/:token`)** atau *server-side provisioning*.
* **Mitra Status Verification:** Pendaftaran Mitra dibuka untuk publik, namun akun baru otomatis berstatus **`pending_verification`**. Akun Mitra yang belum diverifikasi oleh Admin **TIDAK DAPAT** menerima atau memproses *production order*.
* **Guarded Dashboard Shells:** Rute terproteksi (`/admin/*` dan `/mitra/*`) dibungkus oleh komponen `RouteGuard` yang secara eksplisit memeriksa ketersediaan token otentikasi.

---

## 4. STRUKTUR DIREKTORI REPOSITORI BARU (`apps/web`)

```text
apps/web/
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Root Component & Provider Wrapper
│   │   ├── router.tsx                 # Konfigurasi React Router 6
│   │   ├── providers.tsx              # Application Context Providers
│   │   ├── route-guards.tsx           # Boundary Otentikasi & Role Guard
│   │   └── layouts/                   # PublicLayout, AuthLayout, AdminLayout, MitraLayout
│   ├── pages/
│   │   ├── public/                    # LandingPage, PortalSelectionPage, CatalogPage, ProductDetailPage, PublicDppPage
│   │   ├── auth/                      # AdminLoginPage, AdminInvitationPage, MitraLoginPage, MitraRegistrationPage, ForgotPasswordPage
│   │   ├── admin/                     # AdminDashboardPlaceholder (Guarded)
│   │   ├── mitra/                     # MitraDashboardPlaceholder (Guarded)
│   │   └── errors/                    # NotFoundPage (404), ForbiddenPage (403), UnexpectedErrorPage (500)
│   ├── components/
│   │   ├── navigation/                # Navbar, Footer
│   │   ├── feedback/                  # Alert, LoadingSpinner
│   │   └── ui/                        # Button, Card, Badge, Input, EmptyState
│   ├── lib/
│   │   ├── api.ts                     # Inisialisasi SDK @ecothread/api-client
│   │   ├── env.ts                     # Validasi Environment Variables
│   │   └── routes.ts                  # Konstanta Rute Aplikasi
│   ├── styles/
│   │   ├── tokens.css                 # CSS Design Tokens (Warna HSL, Spacing, Typography)
│   │   └── globals.css                # Style Reset & Utility Classes
│   ├── main.tsx                       # Entry Point React DOM
│   └── vite-env.d.ts                  # TypeScript Environment Types
├── package.json                       # Package Manifest @ecothread/web
├── tsconfig.json                      # Konfigurasi Strict TypeScript
├── vite.config.ts                     # Konfigurasi Vite Dev Server (Port 3000)
└── vercel.json                        # Konfigurasi Vercel SPA Rewrite
```

---

## 5. HASIL AUDIT & VERIFIKASI TEKNIS

| Jenis Pengujian | Perintah | Status | Catatan / Evidence |
| :--- | :--- | :--- | :--- |
| **TypeScript Check** | `pnpm --filter @ecothread/web typecheck` | **PASS** | 0 Type Errors pada rute, komponen, & SDK |
| **Linter Check** | `pnpm --filter @ecothread/web lint` | **PASS** | Tidak ada pelanggaran aturan sintaksis |
| **Web Build** | `pnpm --filter @ecothread/web build` | **PASS** | Bundle `dist/` terbentuk sukses dalam 2.69 detik |
| **Monorepo Build** | `pnpm build` | **PASS** | Seluruh 9 paket & aplikasi monorepo berhasil di-build |
| **Browser Smoke Test** | Visual Playwright Subagent | **PASS** | 12 rute diverifikasi (tidak ada blank page / error konsol) |

---

## 6. DOKUMENTASI TERKAIT YANG DIHASILKAN

1. **[ADR-001-single-role-based-web-application.md](file:///d:/LOMBA/GEMASTIK/docs/architecture/ADR-001-single-role-based-web-application.md)** — Catatan keputusan arsitektur konsolidasi web app.
2. **[legacy-frontend-inventory.md](file:///d:/LOMBA/GEMASTIK/docs/migration/legacy-frontend-inventory.md)** — Inventarisasi komponen & rencana migrasi aplikasi lama.
3. **[ROADMAP_VERCEL_V2.md](file:///d:/LOMBA/GEMASTIK/docs/roadmap/ROADMAP_VERCEL_V2.md)** — Panduan roadmap deployment Vercel terkini.
4. **[PRD_EcoThread_v1.1-change-note.md](file:///d:/LOMBA/GEMASTIK/docs/prd/PRD_EcoThread_v1.1-change-note.md)** — Catatan perubahan fitur entry point & pendaftaran.
5. Update **[system-architecture.md](file:///d:/LOMBA/GEMASTIK/docs/architecture/system-architecture.md)** & **[DEPLOYMENT.md](file:///d:/LOMBA/GEMASTIK/DEPLOYMENT.md)**.

---

## 7. RIWAYAT COMMIT GIT (BRANCH: `feature/roadmap-00-web-foundation`)

```text
55a067a chore(vercel): prepare Vite SPA deployment configuration
32d46aa docs(migration): inventory legacy frontend applications
1a1c1ea refactor(ui): establish shared design system foundations
bc1cdc8 feat(web): add public auth and protected route shells
6977b2d feat(web): initialize role-based EcoThread web application
dfe980c docs(architecture): record single web application decision
```

---

## 8. REKOMENDASI LANGKAH SELANJUTNYA UNTUK TIM IT

1. **Review & Merge Branch:** Lakukan peninjauan (*code review*) pada branch `feature/roadmap-00-web-foundation` sebelum digabungkan (*merge*) ke branch utama.
2. **Persiapan Roadmap 1 (API Client Integration):** Hubungkan form dan tampilan di `apps/web` secara langsung ke endpoint backend Fastify menggunakan SDK `@ecothread/api-client`.
3. **Konfigurasi Vercel Staging:** Daftarkan project Vercel baru dengan nama `ecothread-web`, set *Root Directory* ke `apps/web`, dan masukkan environment variable `VITE_API_BASE_URL`.
