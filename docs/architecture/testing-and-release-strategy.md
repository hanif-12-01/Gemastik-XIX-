# TESTING AND RELEASE STRATEGY — ECOTHREAD MVP

## Overview
EcoThread employs a multi-layered testing strategy combining:
1. **Contracts & API-Client Unit Tests**: Type-safe schema validation with Zod.
2. **Backend Integration Tests**: High-speed Fastify + Prisma database testing.
3. **Playwright E2E Automation**: End-to-end browser user journey validation.
4. **Deterministic DB Reset**: Safety-guarded reset and seed scripts.

## CI Release Gate (`pnpm release:check`)
Before any pull request or deployment to Vercel (Roadmap 8), the release check script executes:
- Monorepo build (`pnpm build`)
- Typecheck & Lint (`pnpm verify`)
- Test Database Reset & Seed (`pnpm test:db:reset && pnpm test:db:seed`)
- Playwright E2E Suite (`pnpm test:e2e`)
