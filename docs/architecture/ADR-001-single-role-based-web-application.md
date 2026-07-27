# ADR-001: Single Role-Based Web Application Architecture

* **Status:** Approved
* **Date:** 2026-07-28
* **Deciders:** Lead Software Architect, EcoThread Engineering Team
* **Target Release:** Roadmap 0 (EcoThread GEMASTIK XIX MVP)

---

## 1. Context

During initial prototype development, the frontend was split into three separate React + Vite micro-applications:
* `apps/admin` (running on port 5173)
* `apps/mitra` (running on port 5174)
* `apps/user` (running on port 5175)

While this separation cleanly isolated visual code during early UI prototyping, it introduced significant architectural drawbacks for a production-grade MVP:
1. **Broken User Experience & Navigation:** Public visitors had no unified entry point to explore EcoThread product catalog, dynamic Digital Product Passports (DPP), or select between Admin and Mitra portals.
2. **Duplicated Design System & Foundations:** Components, CSS tokens, and layout logic were duplicated across three packages.
3. **Deployment Complexity:** Operating three separate Vercel/Netlify project deployments for frontends complicated environment configuration, CORS policy, cookie handling, and SPA client-side routing.
4. **Hardcoded URLs & Auth Fragility:** Cross-portal transitions required opening new browser ports or external URLs instead of client-side React Router navigation.

---

## 2. Approved Decision

We consolidate all frontend portals into a **single, role-based Web Application** located at `apps/web` built with **React, Vite, TypeScript, Tailwind CSS / Vanilla Design Tokens, and React Router**.

The single application entry flow is defined as:
```text
Landing Page (/)
├── Portal Selection (/portal)
│   ├── Admin Portal
│   │   ├── Login (/auth/admin/login)
│   │   └── Registration strictly via invitation (/auth/admin/invite/:token)
│   └── Mitra Portal
│       ├── Login (/auth/mitra/login)
│       └── Registration (/auth/mitra/register)
└── Public Features (accessible to all visitors)
    ├── Catalog (/catalog)
    ├── Product Detail (/catalog/:slug)
    └── Dynamic Digital Product Passport (/dpp/:productCode)
```

Protected application routes (`/admin/*`, `/mitra/*`) are protected by unified frontend `RouteGuard` wrappers and server-side RBAC validation.

---

## 3. Key Rules & Security Constraints

1. **Admin Registration Rule:** Visitors selecting the Admin portal **must not** be allowed to freely self-register as Admin. Admin creation is restricted to Super Admin invitations (`/auth/admin/invite/:token`) or server-side provisioning.
2. **Mitra Verification Rule:** Public Mitra registration is permitted, but new Mitra accounts default to `pending_verification`. Pending Mitra accounts cannot view or accept production orders.
3. **API SDK Boundary:** All frontend API calls must flow through the typed `@ecothread/api-client` package using `VITE_API_BASE_URL`.

---

## 4. Consequences

### Positive
* Single Vercel deployment target (`ecothread-web` at root `apps/web`).
* Shared design system tokens, typography, and base UI components in one place.
* Smooth client-side navigation between Landing, Public Catalog, DPP, Auth, Admin, and Mitra areas.
* Simplifies authentication state management and token storage.

### Negative / Technical Debt
* `apps/admin`, `apps/mitra`, `apps/user` are retained as legacy references during migration, requiring clear deprecation inventory documentation (`docs/migration/legacy-frontend-inventory.md`).

---

## 5. Migration Strategy

1. **Phase 0 (Current):** Initialize `apps/web` with route shells, guards, shared tokens, and API client boundaries. Preserve legacy apps (`apps/admin`, `apps/mitra`, `apps/user`) unchanged for visual reference.
2. **Phase 1-2 (Roadmaps 1-2):** Wire `@ecothread/api-client` authentication, session state, and real API integrations into `apps/web`.
3. **Phase 3+:** Deprecate and remove legacy frontend application folders once `apps/web` full functional parity is verified.

---

## 6. Vercel Deployment Implications

* **Project Name:** `ecothread-web`
* **Root Directory:** `apps/web`
* **Framework Preset:** Vite
* **Build Command:** `pnpm --filter @ecothread/web build`
* **Output Directory:** `dist`
* **SPA Rewrite Configuration (`vercel.json`):** Directs all non-file requests to `/index.html` to support nested React Router URLs on page refresh.
