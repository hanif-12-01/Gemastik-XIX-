# LEGACY FRONTEND INVENTORY & MIGRATION STATUS

**Status**: MIGRATION COMPLETE TO `apps/web` (ADR-001 Single Role-Based Web Application)

---

## Legacy App Inventory

| App Directory | Original Role | Migration Status | Recommendation |
| :--- | :--- | :--- | :--- |
| `apps/admin` | Admin Dashboard | 100% Migrated to `apps/web/src/pages/admin/` | Retain as reference; exclude from release build. |
| `apps/mitra` | Tailor Portal | 100% Migrated to `apps/web/src/pages/mitra/` | Retain as reference; exclude from release build. |
| `apps/user` | Consumer App | 100% Migrated to `apps/web/src/pages/customer/` | Retain as reference; exclude from release build. |
