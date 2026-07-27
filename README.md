# EcoThread — Platform Manufaktur Fashion Sirkular Terdesentralisasi 🚀

**Solusi Fashion Technology & Circular Economy berbasis Digital Product Passport (DPP)**  
**Target:** GEMASTIK XIX — Divisi Bisnis TIK  

---

## 📂 Struktur Monorepo Repository

```text
Gemastik-XIX-/
├── apps/
│   ├── web/                          # Single Role-Based Web App (React + Vite + TS, Port 3000 - ADR-001)
│   ├── admin/                        # Legacy Reference (Superadmin Dashboard, Port 5173)
│   ├── mitra/                        # Legacy Reference (Portal Mitra Penjahit, Port 5174)
│   ├── user/                         # Legacy Reference (Consumer & DPP Portal, Port 5175)
│   ├── explainer/                    # Demo Animasi Alur Sirkular (React + Vite, Port 5176)
│   ├── api/                          # Node.js + Fastify + TypeScript Core API (Port 4000)
│   └── ai-worker/                    # FastAPI Python AI Microservice (Port 8000)
├── packages/
│   ├── contracts/                    # Zod Schemas, State Machine & TS Contracts
│   └── api-client/                   # Shared API SDK Client untuk Frontend
```

---

## 🔑 Akun Demo Development & Staging

| Role | Email | Password | Aplikasi |
| :--- | :--- | :--- | :--- |
| **Public Visitor / Catalog / DPP** | Public Access | - | [EcoThread Web App](http://localhost:3000) |
| **Super Admin (Invitation Only)** | `admin@ecothread.local` | `Password123!` | [Admin Portal via Web App](http://localhost:3000/auth/admin/login) |
| **Mitra Penjahit (Verification)** | `mitra@ecothread.local` | `Password123!` | [Mitra Portal via Web App](http://localhost:3000/auth/mitra/login) |

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

# 2. Checkout Branch Roadmap 1
git checkout feature/roadmap-01-landing-portal

# 3. Instal Seluruh Dependensi Monorepo
pnpm install

# 4. Inisialisasi Database SQLite/PostgreSQL & Seeding Data Wajib
pnpm prisma generate
pnpm prisma db push
pnpm db:seed

# 5. Jalankan Backend API Server (Port 4000)
pnpm --filter "@ecothread/api" dev

# 6. Jalankan Single Web App (Port 3000 - Landing Page & Portal Selection)
pnpm --filter "@ecothread/web" dev
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
