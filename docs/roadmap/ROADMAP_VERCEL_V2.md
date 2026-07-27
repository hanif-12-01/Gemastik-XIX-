# EcoThread Roadmap V2: Single Web Application & Deployment Strategy

## Overview

Following **ADR-001**, EcoThread GEMASTIK XIX transitions from three fragmented frontend applications to a **single role-based web application (`apps/web`)**.

This document outlines the phased roadmap and the updated Vercel single-frontend deployment setup.

---

## 1. Single Application Route Structure

* **Public Routes:**
  * `/` — Landing Page
  * `/portal` — Portal Selection (Admin vs Mitra)
  * `/catalog` — Public Product Catalog
  * `/catalog/:slug` — Product Detail Page
  * `/dpp/:productCode` — Dynamic Digital Product Passport Page

* **Authentication Routes:**
  * `/auth/admin/login` — Admin Login
  * `/auth/admin/invite/:token` — Admin Registration (Invitation-Only)
  * `/auth/mitra/login` — Mitra Login
  * `/auth/mitra/register` — Public Mitra Registration (`pending_verification`)
  * `/auth/forgot-password` — Password Recovery Shell

* **Protected Role Dashboards:**
  * `/admin/*` — Guarded Admin Dashboard (Requires `Role.admin`)
  * `/mitra/*` — Guarded Mitra Dashboard (Requires `Role.mitra` & verified status)

* **Error Handling:**
  * `/403` — Access Forbidden Page
  * `/*` — 404 Not Found Page

---

## 2. Vercel Deployment Configuration

### Project Target: `ecothread-web`

| Parameter | Configuration |
| :--- | :--- |
| **Vercel Project Name** | `ecothread-web` |
| **Root Directory** | `apps/web` |
| **Framework Preset** | `Vite` |
| **Build Command** | `pnpm --filter @ecothread/web build` |
| **Output Directory** | `dist` |
| **Node.js Version** | `20.x` or `22.x` |

### Environment Variables on Vercel
```env
VITE_API_BASE_URL=https://api.ecothread.id/api/v1
VITE_APP_URL=https://web.ecothread.id
VITE_ENVIRONMENT=production
```

---

## 3. Phased Execution Roadmap

### Roadmap 0: Web Foundation (CURRENT PHASE)
* Establish `apps/web` React + Vite + TypeScript application shell.
* Implement design tokens, global styles, and base UI components.
* Build route shells for Public, Auth, Protected Admin/Mitra, and Error pages.
* Initialize API client boundary (`src/lib/api.ts`) and environment validation (`src/lib/env.ts`).
* Create ADR-001 and legacy migration inventory.

### Roadmap 1: Typed API Client & State Boundary Wiring
* Connect `apps/web` UI components directly to `@ecothread/api-client`.
* Remove all legacy alert-only simulations.

### Roadmap 2: Auth UI & Session Management
* Implement real login/logout with Supabase/JWT session handling in `apps/web`.
* Enforce backend-verified route guards.

### Roadmap 3: Multipart QC File Uploads
* Real file upload handling for production evidence photos.

### Roadmap 4: Database Infrastructure (PostgreSQL Migration)
* Finalize production PostgreSQL connection on Supabase.

### Roadmap 5: End-to-End Browser Testing
* Implement Playwright test suite validating Admin–Mitra–Customer flows in `apps/web`.

### Roadmap 6: Production Staging Deployment
* Deploy `apps/web` to Vercel and API to production server.

### Roadmap 7: Polygon Amoy Testnet Integration
* Optional on-chain verification anchoring for DPP records.
