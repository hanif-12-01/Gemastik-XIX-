# Rollback Runbook

## Quick Reference

| Scenario | Action |
|----------|--------|
| Deployment broke web UX | `vercel rollback --project ecothread-web` |
| Deployment broke API | `vercel rollback --project ecothread-api` |
| Both broke | Roll back API first, then web |
| Migration broke schema | Restore Neon snapshot, then roll back deployments |

---

## Vercel Deployment Rollback

### Rollback via CLI

```powershell
# Roll back API to previous production deployment
vercel rollback --project ecothread-api

# Roll back Web to previous production deployment
vercel rollback --project ecothread-web
```

### Rollback via Dashboard

1. Vercel Dashboard → ecothread-api → Deployments
2. Find the last known-good deployment
3. Click ⋯ → Promote to Production

---

## Database Rollback (Neon Snapshot)

Before any production migration, create a Neon snapshot:

```
Neon Dashboard → Branches → production → Create Branch (snapshot)
Name: pre-migration-YYYY-MM-DD
```

If rollback needed:
1. Note the snapshot branch connection strings
2. Update `DATABASE_URL` and `DIRECT_URL` env vars on Vercel to point to the snapshot branch
3. Redeploy API
4. Investigate migration failure
5. Write corrective migration and test in Preview

---

## Secret Rotation Runbook

### Rotate JWT_SECRET

Rotating JWT_SECRET **immediately invalidates all active sessions**.

1. Generate new secret: `openssl rand -hex 64`
2. Set new `JWT_SECRET` on Vercel (Preview and Production separately)
3. Redeploy API
4. All users will need to log in again (expected behavior)
5. Monitor error logs for unexpected auth failures

### Rotate Database Credentials

1. Generate new password in Neon Dashboard
2. Update `DATABASE_URL` and `DIRECT_URL` in Vercel env vars
3. Redeploy API (no downtime if done quickly)
4. Verify `/api/v1/health/ready` returns `database: ok`

### Rotate Blob Token

1. Create new token in Vercel Blob settings
2. Set new `BLOB_READ_WRITE_TOKEN` on Vercel
3. Redeploy API
4. Old tokens are immediately invalid — upload flow should work with new token
5. Existing blob URLs remain accessible (CDN URL, not token-dependent)

---

## Monitoring

After any rollback:
1. Check `GET /api/v1/health/live` → 200
2. Check `GET /api/v1/health/ready` → 200, `database: ok`
3. Verify admin login succeeds
4. Check Vercel Function logs for error spikes
