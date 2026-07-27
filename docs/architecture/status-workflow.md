# EcoThread Status Workflow & State Machines 🔄

**Dokumen Alur Transisi Status Sistem (State Machine Rules)**  

---

## 1. Production Order State Machine

Status Production Order dikontrol secara ketat oleh backend. Transisi yang tidak valid akan ditolak dengan HTTP 400.

```text
               ┌──────────┐
               │  draft   │
               └────┬─────┘
                    │ (Admin assign Mitra)
                    ▼
               ┌──────────┐
               │ offered  │◄─────────────────┐
               └────┬─────┴──────────────┐   │ (Re-offer)
                    │                    │   │
     (Mitra accept) │   (Mitra reject)   │   │
                    ▼                    ▼   │
               ┌──────────┐    ┌──────────────────┐
               │ accepted │    │ rejected_by_mitra│
               └────┬─────┘    └──────────────────┘
                    │ (Mulai jahit)
                    ▼
              ┌─────────────┐
              │ in_progress │
              └─────┬───────┘
                    │ (Submit 3 foto QC)
                    ▼
           ┌─────────────────┐
           │ submitted_to_qc │
           └────────┬────────┘
                    │
        ┌───────────┴───────────┐
        │ (Approve)             │ (Revision)
        ▼                       ▼
┌──────────────┐       ┌──────────────┐
│ qc_approved  │       │ qc_revision  │
└───────┬──────┘       └──────────────┘
        │ (Payout paid)
        ▼
┌──────────────┐
│  completed   │
└──────────────┘
```

### Valid Transition Rules:
- `draft` ➔ `offered`, `cancelled`
- `offered` ➔ `accepted`, `rejected_by_mitra`, `cancelled`
- `rejected_by_mitra` ➔ `offered`, `cancelled`
- `accepted` ➔ `kit_preparing`, `in_progress`, `cancelled`
- `in_progress` ➔ `submitted_to_qc`, `cancelled`
- `submitted_to_qc` ➔ `qc_approved`, `qc_revision`, `cancelled`
- `qc_revision` ➔ `submitted_to_qc`, `cancelled`
- `qc_approved` ➔ `payout_pending`, `paid`, `completed`
- `payout_pending` ➔ `paid`, `cancelled`
- `paid` ➔ `completed`

---

## 2. Payout Status Workflow

- `pending`: Dibuat otomatis (*idempotent*) setelah QC Approved.
- `approved`: Disetujui untuk pemrosesan transfer bank.
- `processing`: Dalam antrean transfer.
- `paid`: Pembayaran berhasil diverifikasi dengan nomor referensi transfer bank.

---

## 3. DPP Verification State Workflow

- `database_verified`: Verifikasi integritas data internal database EcoThread (Default State MVP).
- `anchoring_pending`: Transaksi anchoring ke Polygon Amoy sedang dalam antrean.
- `blockchain_verified`: Transaksi anchoring berhasil dan terverifikasi di Polygon Amoy testnet.
- `anchoring_failed`: Gagal melakukan anchoring (fallback aman ke `database_verified`).
