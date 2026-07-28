# Secret Rotation Runbook

## Overview

EcoThread uses three categories of secrets that may need periodic rotation:
1. **JWT_SECRET** — Signs authentication tokens
2. **Database credentials** — PostgreSQL username/password in `DATABASE_URL`/`DIRECT_URL`
3. **Blob tokens** — `BLOB_READ_WRITE_TOKEN` and `PRIVATE_BLOB_READ_WRITE_TOKEN`

---

## 1. Rotate JWT_SECRET

> ⚠️ **Impact**: All active user sessions are immediately invalidated. Users must log in again.

### Steps

```powershell
# 1. Generate new secret
openssl rand -hex 64

# 2. Update on Vercel
#    Dashboard → ecothread-api → Settings → Environment Variables
#    Update JWT_SECRET for the target environment (Preview / Production)

# 3. Redeploy API to pick up the new secret
vercel deploy --project ecothread-api --prod   # for Production
# OR push a commit to trigger automatic deployment

# 4. Verify
curl -s https://<api-url>/api/v1/health/live | jq .
# Should return 200 OK

# 5. Monitor auth error rates in Vercel Function logs for 15 minutes
```

### Rollback

Set `JWT_SECRET` back to the old value and redeploy.

---

## 2. Rotate Database Credentials

> ⚠️ **Impact**: Brief API downtime (< 30 seconds) during credential switch.

### Steps

```powershell
# 1. Generate new password in Neon Dashboard
#    Neon Dashboard → Project → Settings → Roles → Reset password

# 2. Copy new pooled + direct connection strings

# 3. Update on Vercel
#    Dashboard → ecothread-api → Settings → Environment Variables
#    Update DATABASE_URL (pooled) and DIRECT_URL (direct)

# 4. Redeploy API immediately to minimize downtime
vercel deploy --project ecothread-api --prod

# 5. Verify
curl -s https://<api-url>/api/v1/health/ready | jq .
# Should return: { "checks": { "database": "ok" } }
```

### Rollback

If the new credentials don't work, revert to old values and redeploy.

---

## 3. Rotate Blob Token

> ⚠️ **Impact**: Uploads will fail between old token invalidation and new token deployment.

### Steps

```powershell
# 1. Create new token in Vercel Blob settings
#    Dashboard → ecothread-api → Storage → Blob → Settings → Tokens → Create

# 2. Update BLOB_READ_WRITE_TOKEN and/or PRIVATE_BLOB_READ_WRITE_TOKEN

# 3. Redeploy API
vercel deploy --project ecothread-api --prod

# 4. Verify upload works
#    Log in as a Mitra, upload a QC evidence photo
#    Verify the returned URL is a Vercel Blob URL

# 5. Revoke old token in Vercel Blob settings
```

### Important Notes

- **Existing blob URLs remain accessible** — they're served via Vercel's CDN and don't require the write token.
- Only the **write token** is rotated; reads are unaffected.

---

## Rotation Schedule (Recommended)

| Secret | Frequency | Trigger |
|--------|-----------|---------|
| JWT_SECRET | Every 90 days or on suspected compromise | Calendar reminder |
| Database credentials | Every 90 days or on suspected compromise | Calendar reminder |
| Blob token | Every 180 days or on suspected compromise | Calendar reminder |

---

## Emergency Rotation

If a secret is suspected to be compromised:

1. **Rotate immediately** — don't wait for a scheduled window.
2. **Rotate in Production first**, then Preview.
3. **Log the incident** in `docs/security/incident-log.md`.
4. **Review audit logs** (`audit_logs` table) for suspicious activity during the exposure window.
5. **Notify stakeholders** if user data may have been exposed.
