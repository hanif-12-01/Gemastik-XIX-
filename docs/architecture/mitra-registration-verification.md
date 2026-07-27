# Mitra Registration & Verification Lifecycle

## 1. Registration Policy
Public visitors can register as a Mitra partner at `/auth/mitra/register`.
The backend forces `role = mitra` and `verificationStatus = pending_verification`.

## 2. Access Control Lifecycle
```text
Mitra Registration (POST /api/v1/auth/mitra/register)
  └── User created with role = mitra, verificationStatus = pending_verification

Mitra Login (POST /api/v1/auth/login)
  ├── User authenticates successfully
  └── Route Guard checks verificationStatus:
        ├── pending_verification → Redirected to /mitra/verification-status
        ├── rejected / suspended → Redirected to /mitra/verification-status
        └── approved → Granted access to /mitra workbench

Admin Verification (POST /api/v1/admin/mitra-applications/:id/decision)
  ├── Admin reviews application details
  ├── Sets verificationStatus = approved OR rejected
  └── Writes AuditLog (APPROVE_MITRA / REJECT_MITRA)
```

## 3. Security Guarantee
Even if a pending Mitra bypasses frontend client routing, backend endpoint guards verify `mitraProfile.verificationStatus === 'approved'` before returning operational production order data.
