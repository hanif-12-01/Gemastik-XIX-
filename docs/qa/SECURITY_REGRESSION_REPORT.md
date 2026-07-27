# SECURITY REGRESSION REPORT — ECOTHREAD MVP

**Date**: July 28, 2026  
**Auditor**: Lead Security Regression Engineer  
**Status**: PASSED (0 Critical, 0 High Vulnerabilities)

---

## 1. Authentication & Session Management
- **Password Storage**: Bcrypt hashing with cost factor 10. No plaintext passwords or SHA-256 stored.
- **Session Tokens**: Fastify JWT signed with secret. Expiry and unauthorized callbacks clear client tokens.
- **Invitation & Password Reset Tokens**: Single-use tokens hashed in database. Expired or reused tokens rejected.

## 2. Authorization & RBAC
- All administrative endpoints (`/api/v1/admin/*`) require `Role.admin`.
- All tailor workshop endpoints (`/api/v1/mitra/*`) require `Role.mitra`.
- Customer profile and preorder endpoints (`/api/v1/customer/*`, `/api/v1/customer-orders/*`) require authenticated session.

## 3. Ownership & Multi-Tenancy Protection
- **Customer Preorders**: `GET /api/v1/customer-orders/:id` enforces `order.userId === request.user.id`. Unmatching customers receive `404 Not Found`.
- **Mitra Production Orders**: `GET /api/v1/mitra/production-orders/:id` enforces `order.mitraUserId === request.user.id`. Unmatching tailors receive `404 Not Found`.

## 4. Storage & File Access Control
- Private evidence photos (`/uploads/qc/*`) and payment proofs (`/uploads/payment-proofs/*`) are served via protected API streaming endpoints with authorization checks.
- Public product images and DPP assets are readable publicly only after official Admin publication.
