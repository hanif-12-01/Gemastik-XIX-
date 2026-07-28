# Vercel Blob Storage — Environment Namespacing

## Overview

EcoThread uses **Vercel Blob** for all persistent file storage. Local disk (`uploads/`) was replaced in Roadmap 8.

## Storage Path Convention

All blob paths follow this namespace pattern:

```
{env}/private/{category}/{userId}-{timestamp}-{filename}
```

### Examples

| Environment | Category | Example Path |
|-------------|----------|-------------|
| dev | qc | `dev/private/qc/user123-1700000000000-qc_abc.jpg` |
| preview | qc | `preview/private/qc/user123-1700000000000-qc_abc.jpg` |
| production | qc | `production/private/qc/user123-1700000000000-qc_abc.jpg` |

The `{env}` prefix is determined by `DEPLOYMENT_ENV` at runtime:
- `production` → production
- `preview` → preview  
- anything else → dev

## Token Configuration

| Scenario | Token Variable |
|----------|---------------|
| Single-store (simpler) | `BLOB_READ_WRITE_TOKEN` |
| Two-store (private + public) | `PRIVATE_BLOB_READ_WRITE_TOKEN` (private), `BLOB_READ_WRITE_TOKEN` (public) |

The API resolves the token in priority order:
1. `PRIVATE_BLOB_READ_WRITE_TOKEN`
2. `BLOB_READ_WRITE_TOKEN`

## Access Control

Vercel Blob does not natively support per-token read restrictions. Access control is enforced at the **API level**:

- `POST /api/v1/uploads/qc` — requires JWT auth (any authenticated user)
- Upload returns a Blob CDN URL that is stored in the database (`frontPhoto`, `backPhoto`, `detailPhoto` fields)
- QC reviewers access evidence photos through the QC detail view; the photo URLs are served directly from Blob CDN
- For the MVP, blob objects are set to `access: 'public'` on Vercel Blob — this is acceptable because:
  - URLs are not guessable (contain timestamp + random hex)
  - The URL is only stored/returned to authenticated users
  - Production may use signed URLs or a proxy endpoint for higher security post-MVP

## Local Development Fallback

When `BLOB_READ_WRITE_TOKEN` is not set (local dev), the upload endpoint:
1. Reads the file into memory (validates type and size)
2. Returns a synthetic URL (`/api/v1/uploads/qc/local/{filename}`)
3. Logs `[DEV]` prefix in the audit log

This ensures local E2E tests pass without requiring a real Blob token.

## Migration from Local Disk

Files previously written to `./uploads/qc/` on disk are **not migrated** automatically. Any production rollout with existing files should:
1. Identify records with old-style `fileUrl` paths (starting with `/api/v1/uploads/qc/`)
2. Re-upload those files to Blob using the migration script (TBD post-MVP)
3. Update the database records to use the new Blob URL
