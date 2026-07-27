# EcoThread MVP — Deployment & Operations Guide 🚀

**Dokumen Panduan Deployment Staging & Production**  
**Versi:** 1.0 Final MVP  

---

## 🏗️ Monorepo Architecture Overview

EcoThread menggunakan `pnpm workspaces` monorepo:

```text
Gemastik-XIX-/
├── apps/
│   ├── admin/             # React + Vite (Dashboard Superadmin, Port 5173)
│   ├── mitra/             # React + Vite (Portal Mitra Penjahit, Port 5174)
│   ├── user/              # React + Vite (Customer & DPP Portal, Port 5175)
│   ├── explainer/         # React + Vite (Demo Animasi Interaktif, Port 5176)
│   ├── api/               # Node.js + Fastify + TypeScript Core API (Port 4000)
│   └── ai-worker/         # FastAPI Python AI Service (Port 8000)
├── packages/
│   ├── contracts/         # Zod schemas, state machine, TS types
│   └── api-client/        # Frontend API SDK Client
└── prisma/
    ├── schema.prisma      # Schema 28 Entitas
    └── seed.ts            # Seed Users & Demo Data
```

---

## 🛠️ Menjalankan Secara Lokal (Local Development)

### 1. Install Dependensi Monorepo
```bash
pnpm install
```

### 2. Konfigurasi Environment File
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

### 3. Inisialisasi Database & Seeding
```bash
pnpm prisma generate
pnpm prisma db push
pnpm db:seed
```

### 4. Menjalankan Seluruh Aplikasi & Backend API
```bash
# Menjalankan backend Fastify API (Port 4000)
pnpm --filter "@ecothread/api" dev

# Menjalankan frontend Admin (Port 5173)
pnpm --filter "@ecothread/admin" dev

# Menjalankan frontend Mitra (Port 5174)
pnpm --filter "@ecothread/mitra" dev

# Menjalankan frontend User (Port 5175)
pnpm --filter "@ecothread/user" dev
```

---

## 🌐 Build & Deployment Staging / Production

### 1. Menguji Build Seluruh Aplikasi
```bash
pnpm build
```

### 2. Opsi Deployment Backend & Database
- **Backend API (`apps/api`)**: Deploy ke Render / Railway / Railway / VPS dengan `NODE_ENV=production` dan `npm run start`.
- **Database**: PostgreSQL di Supabase / NeonDB. Set `DATABASE_URL` pada environment provider.
- **Frontend Single Web Application (`apps/web`)**: Deploy ke Vercel (ADR-001)
  - Vercel Project: `ecothread-web`
  - Root Directory: `apps/web`
  - Framework Preset: `Vite`
  - Build Command: `pnpm --filter @ecothread/web build`
  - Output Directory: `dist`

### 3. Docker Deployment (Optional Single Container)
```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 4000
CMD ["pnpm", "--filter", "@ecothread/api", "start"]
```
