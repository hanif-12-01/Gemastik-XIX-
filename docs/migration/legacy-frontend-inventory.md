# Legacy Frontend Applications Inventory & Migration Roadmap

This inventory documents the existing legacy prototype applications (`apps/admin`, `apps/mitra`, `apps/user`), mapping their visual elements, components, mock data, and migration target in the new consolidated single application `apps/web`.

---

## 1. Inventory Summary

| App Path | Original Role / Purpose | Tech Stack | Status in Roadmap 0 | Migration Target in `apps/web` |
| :--- | :--- | :--- | :--- | :--- |
| `apps/admin` | Super Admin Dashboard | React + Vite (JS/JSX) | Preserved reference | `apps/web/src/pages/admin/` & `features/admin/` |
| `apps/mitra` | Mitra Penjahit Portal | React + Vite (JS/JSX) | Preserved reference | `apps/web/src/pages/mitra/` & `features/mitra/` |
| `apps/user` | Public Consumer & DPP Portal | React + Vite (JS/JSX) | Preserved reference | `apps/web/src/pages/public/` & `features/catalog/` |

---

## 2. Application Audit & Migration Matrix

### 2.1 `apps/admin` (Super Admin)
* **Reusable Visual Components:** Navigation sidebar, stat cards, status badge styling, order table layout.
* **Reusable Content:** Explanatory text for material batch registration, Eco-Kit creation, and QC checklist requirements.
* **Functionality to Rebuild:** Real API client integration for material batches, production orders, Mitra assignment, QC approval, payout recording, product creation, and DPP publishing.
* **Mock-Only / Do Not Migrate:**
  * Hardcoded `useState` arrays (`ORD-001`, `ECO-0089`).
  * Fake `alert()` dialogs ("Order Produksi baru berhasil diteruskan...", "MINTING BERHASIL!").
  * Hardcoded static CO2 / water saving metrics.
  * Orphan scripts at root (`apps/admin/fix*.js`, `apps/admin/patch*.js`, `apps/admin/do_replace.py`).

### 2.2 `apps/mitra` (Mitra Portal)
* **Reusable Visual Components:** Mobile-first action cards, progress bar indicators, photo upload placeholder boxes, earnings breakdown ledger view.
* **Reusable Content:** Step-by-step garment assembly instructions, QC photo submission tips.
* **Functionality to Rebuild:** Real `@ecothread/api-client` integration for loading assigned orders, accept/reject actions, step milestone progress updates, and multipart file upload for QC photo evidence.
* **Mock-Only / Do Not Migrate:**
  * Hardcoded `orders` array.
  * `simulatePhotoUpload()` function pushing fake `{id, name}` objects without actual files.
  * `alert()` popups for job accept/reject.

### 2.3 `apps/user` (Customer & DPP)
* **Reusable Visual Components:** Product hero gallery, before/after comparison layout, impact statistics badges, timeline view for garment journey.
* **Reusable Content:** Upcycling process storytelling, care & repair recommendations.
* **Functionality to Rebuild:** Real public API fetch for `/catalog`, `/catalog/:slug`, `/dpp/:productCode`, customer checkout, deposit payment proof upload, and order tracking.
* **Mock-Only / Do Not Migrate:**
  * Static hardcoded product data.
  * Decorative non-functional "Blockchain Verified" badge with hardcoded hashes.

---

## 3. Strict Rules for `apps/web`

1. **No Source Imports:** Code in `apps/web` **must never** import source files from `apps/admin`, `apps/mitra`, or `apps/user`.
2. **Type Safety:** All newly migrated code in `apps/web` must be strictly typed TypeScript (`.tsx` / `.ts`).
3. **SDK Boundary:** All network calls in `apps/web` must use `@ecothread/api-client`.

---

## 4. Legacy Application Deletion Roadmap

* **Roadmap 0 (Current):** Preserve legacy folders as migration references. `apps/web` established.
* **Roadmap 1-2:** Wire real API client to `apps/web` auth and core flows.
* **Roadmap 3:** Verify feature parity between `apps/web` and legacy apps.
* **Roadmap 4:** Formally delete `apps/admin`, `apps/mitra`, and `apps/user` folders from monorepo.
