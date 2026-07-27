# PRD v1.1 Change Note — EcoThread MVP Architecture Refinement

* **Document:** `PRD_EcoThread_v1.1-change-note.md`
* **Parent Document:** `docs/prd/PRD_EcoThread_v1.0.md`
* **Status:** Approved Target Revision for MVP Implementation
* **Date:** 2026-07-28

---

## Summary of Refinements

This change note documents specific adjustments to entry flow, registration mechanics, frontend application topology, and deployment targets for the EcoThread GEMASTIK XIX MVP. Unrelated PRD sections remain intact.

---

### 1. Landing Page as Main Application Entry Point
* **Previous PRD Description:** Separate micro-applications accessed via different local ports/URLs.
* **Revised Requirement:** The single unified web application (`apps/web`) serves the **Landing Page (`/`)** as the primary public entry point for all visitors.

---

### 2. Portal Selection Page (`/portal`)
* **Revised Requirement:** Public visitors can access `/portal` to choose their operational entry path:
  * **Admin Portal**
  * **Mitra Portal**

---

### 3. Invitation-Only Admin Account Creation
* **Revised Requirement:** Visitors selecting the Admin portal **must not** be permitted to self-register freely. Admin account creation is strictly restricted to:
  * Super Admin invitation link with a valid token (`/auth/admin/invite/:token`); or
  * Direct server-side administrative account creation.

---

### 4. Open Mitra Registration with Verification Workflow
* **Revised Requirement:** Mitra tailors and workshops may register publicly (`/auth/mitra/register`).
* **Security & Operational Rule:** Upon registration, new Mitra accounts default to status `pending_verification`. A pending Mitra **cannot** view, accept, or process production orders until explicitly verified and activated by an Admin.

---

### 5. Single Role-Based Web Application Target (`apps/web`)
* **Refinement:** Frontends `apps/admin`, `apps/mitra`, and `apps/user` are consolidated into a single React + Vite + TypeScript application in `apps/web` (see **ADR-001**). Role-based views and protected dashboards are governed by client-side route guards and server-side RBAC validation.

---

### 6. Phased Customer Implementation
* **Refinement:** The Customer domain in MVP prioritizes public browsing (Landing Page, Catalog, Product Detail, Dynamic DPP) and pre-order/deposit submission. Advanced marketplace features (Eco-Trade credits trading, secondary social reviews) will be enabled in subsequent roadmap phases.

---

### 7. Vercel Deployment Target
* **Refinement:** Frontend deployment is standardized on **Vercel** targeting `apps/web` (`ecothread-web`) with SPA client-side rewrite rules enabled.
