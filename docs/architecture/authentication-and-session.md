# Authentication and Session Architecture (ADR-002)

## 1. Overview
EcoThread employs a stateless JWT bearer token authentication model with backend RBAC enforcement across all protected API routes.

## 2. Password Security & Hashing
- **Algorithm:** Bcrypt (`bcryptjs` with salt rounds 10).
- **Legacy Hashes:** Direct SHA-256 password strings are explicitly rejected by `verifyPassword`.

## 3. JWT Token Architecture
- **Header:** `Alg: HS256`, `Type: JWT`.
- **Payload Claims:**
  - `id`: User UUID
  - `email`: User email address
  - `role`: Role enum (`admin`, `mitra`, `user`)
  - `name`: Display name
  - `mitraVerificationStatus`: Verification status for Mitra users (`pending_verification`, `approved`, `rejected`, `suspended`)
  - `iat`: Issued at timestamp
  - `exp`: Expiration timestamp (`expiresIn: 8h`)
- **Validation:** Every protected request is verified by Fastify `request.jwtVerify()`.

## 4. Frontend Session Persistence & Storage
- **Token Provider:** `AuthStorage` reads and writes token to `localStorage` (`ecothread_access_token`).
- **Initialization:** On app startup, `AuthProvider` reads stored token and validates it via `/api/v1/me`.
- **401 Handling:** Any 401 response from the API triggers `onUnauthorized()` which clears storage and sets state to `anonymous`.

## 5. Security Controls
- **Rate Limiting:** Auth endpoints enforce rate limits.
- **Audit Logging:** Successful logins, registrations, and password changes record entries in `audit_logs`.
- **No Plaintext Tokens in Logs:** Tokens are never logged to console or database plaintexts.
