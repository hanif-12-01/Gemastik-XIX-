# EcoThread — Platform Manufaktur Fashion Sirkular Terdesentralisasi 🚀

**Solusi Fashion Technology & Circular Economy berbasis Digital Product Passport (DPP)**  
**Target:** GEMASTIK XIX — Divisi Bisnis TIK  

---

## 📂 Struktur Monorepo Repository

```text
Gemastik-XIX-/
├── apps/
│   ├── admin/                        # App Web Dashboard Superadmin (React + Vite, Port 5173)
│   ├── mitra/                        # App Web Portal Mitra Penjahit (React + Vite, Port 5174)
│   ├── user/                         # App Web Consumer & DPP Portal (React + Vite, Port 5175)
│   ├── explainer/                    # Demo Animasi Alur Sirkular (React + Vite, Port 5176)
│   ├── api/                          # Node.js + Fastify + TypeScript Core API (Port 4000)
│   └── ai-worker/                    # FastAPI Python AI Microservice (Port 8000)
├── packages/
│   ├── contracts/                    # Zod Schemas, State Machine & TS Contracts
│   └── api-client/                   # Shared API SDK Client untuk Frontend
├── prisma/
│   ├── schema.prisma                 # Schema 28 Entitas Database
│   └── seed.ts                       # Seed 3 Akun Wajib & Demo Dataset
├── docs/                             # Dokumentasi Teknis & Perencanaan
│   ├── prd/                          # Product Requirement Document (PRD v1.0)
│   ├── architecture/                 # System Architecture & Database Specifications
│   └── tasks/                        # Task List ECOT-MVP-001 hingga ECOT-MVP-008
├── DEMO.md                           # Panduan Demo 5-7 Menit & Kredensial Akun
├── DEPLOYMENT.md                     # Panduan Deployment Staging & Production
└── README.md                         # Dokumentasi Utama Repository
```

---

## 🔑 Akun Demo Development & Staging

| Role | Email | Password | Aplikasi |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@ecothread.local` | `Password123!` | [Admin Dashboard](http://localhost:5173) |
| **Mitra Penjahit** | `mitra@ecothread.local` | `Password123!` | [Mitra Portal](http://localhost:5174) |
| **Consumer (User)** | `user@ecothread.local` | `Password123!` | [User & DPP Portal](http://localhost:5175) |

---

## 🛠️ Prasyarat (Prerequisites)

* **Node.js** v20+ atau v22+ LTS
* **pnpm** v10+ (`npm install -g pnpm`)
* **Git**

---

## 🚀 Cara Menjalankan Aplikasi Secara Lokal

```bash
# 1. Kloning Repositori & Masuk ke Folder Proyek
git clone https://github.com/hanif-12-01/Gemastik-XIX-.git
cd Gemastik-XIX-

# 2. Checkout Branch MVP Final
git checkout feature/ecothread-mvp-final

# 3. Instal Seluruh Dependensi Monorepo
pnpm install

# 4. Inisialisasi Database SQLite/PostgreSQL & Seeding Data Wajib
pnpm prisma generate
pnpm prisma db push
pnpm db:seed

# 5. Jalankan Backend API Server (Port 4000)
pnpm --filter "@ecothread/api" dev

# 6. Jalankan Frontend App (di Terminal Baru)
pnpm --filter "@ecothread/admin" dev   # Open http://localhost:5173
pnpm --filter "@ecothread/mitra" dev   # Open http://localhost:5174
pnpm --filter "@ecothread/user" dev    # Open http://localhost:5175
```

---

## 🧪 Menjalankan Automated Test Suite

```bash
# 1. Menjalankan Unit Tests (State Machine & Validasi)
npx tsx packages/contracts/test/contracts.test.ts

# 2. Menjalankan E2E Vertical Slice Test (Memastikan 10 Step Utama Berhasil)
npx tsx apps/api/test/e2e-vertical-slice.test.ts
```

---

## 📄 Dokumentasi Terkait
- [DEMO.md](file:///d:/LOMBA/GEMASTIK/DEMO.md) — Panduan Skenario Presentasi & Demo 5-7 Menit
- [DEPLOYMENT.md](file:///d:/LOMBA/GEMASTIK/DEPLOYMENT.md) — Instruksi Deployment Staging & Production
- [PRD_EcoThread_v1.0.md](file:///d:/LOMBA/GEMASTIK/docs/prd/PRD_EcoThread_v1.0.md) — Product Requirement Document
- [system-architecture.md](file:///d:/LOMBA/GEMASTIK/docs/architecture/system-architecture.md) — Arsitektur Teknis Sistem

---

## 📄 Lisensi
Hak Cipta © 2026 Tim EcoThread. Dibuat untuk Gemastik XIX — Divisi Bisnis TIK.
