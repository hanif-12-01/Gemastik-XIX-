# ECOTHREAD MVP RELEASE CANDIDATE CHECKLIST

**Version**: 1.0.0-rc1  
**Target Release**: GEMASTIK XIX Final  
**Date**: July 28, 2026

- [x] **Monorepo Build**: `pnpm build` succeeds with 0 errors across 9 packages.
- [x] **Typecheck & Lint**: `pnpm verify` passes with 0 TypeScript compilation errors.
- [x] **Backend Integration Tests**: All 6 test suites in `apps/api/test/` pass 100%.
- [x] **Browser E2E Automation**: Playwright test suite passes in Chromium.
- [x] **Deterministic DB Reset**: Safety-guarded reset & seed scripts executed.
- [x] **Authentication & Session**: Bcrypt password hashing, Fastify JWT session persistence, logout verified.
- [x] **Role Access (RBAC)**: Admin, Mitra, and Customer routes strictly isolated.
- [x] **Ownership Isolation**: Cross-Mitra & Cross-Customer access returns 404 Not Found.
- [x] **Server-Authoritative Pricing**: Checkout prices and deposit amounts calculated strictly on backend.
- [x] **QC & Payout Flow**: 4-point QC checklist, atomic payout generation, mark-paid recording verified.
- [x] **Product & DPP Publication**: Final product creation, SHA-256 canonical metadata hashing, public DPP page verified.
- [x] **Customer Preorder & Payments**: Preorder checkout, private payment proof upload, admin approval verified.
- [x] **No Core Mocks**: Zero fake payment gateways or fake blockchain anchoring in production code.
- [x] **Accessibility**: Form labels, heading hierarchy, aria attributes verified.
- [x] **Responsive Layouts**: 360px to 1440px viewports render cleanly without horizontal overflow.
- [x] **Deployment Readiness**: Ready for Roadmap 8 Vercel deployment.
