# EcoThread - Gemastik XIX 🚀

Repositori ini berisi keseluruhan ekosistem proyek **EcoThread** yang diajukan untuk perlombaan **Gemastik XIX**. Proyek ini terdiri dari aplikasi web berbasis React (Vite) beserta dokumen PRD, arsitektur sistem, tugas implementasi MVP, riset, perencanaan, proposal, dan naskah presentasi yang terstruktur dengan rapi.

---

## 📂 Struktur Proyek

```text
Gemastik-XIX-/
├── docs/                             # Dokumen & Perencanaan Proyek
│   ├── prd/                          # Product Requirement Document (PRD)
│   │   └── PRD_EcoThread_v1.0.md
│   ├── architecture/                 # Arsitektur & Spesifikasi Sistem
│   │   └── system-architecture.md
│   ├── tasks/                        # Task List & Rincian Modul MVP (ECOT-MVP)
│   │   ├── ECOT-MVP-001-foundation.md
│   │   ├── ECOT-MVP-002-auth-rbac.md
│   │   ├── ECOT-MVP-003-core-data-api.md
│   │   ├── ECOT-MVP-004-admin-mitra-flow.md
│   │   ├── ECOT-MVP-005-qc-payout-dpp.md
│   │   ├── ECOT-MVP-006-user-preorder.md
│   │   ├── ECOT-MVP-007-pilot-evidence.md
│   │   └── ECOT-MVP-008-test-deploy-submit.md
│   ├── proposal/                     # Proposal, Business Plan & Analisa Sistem
│   │   ├── Proposal_Analisa_Mendalam.md
│   │   ├── EcoThread_Business_Plan.md
│   │   ├── EcoThread_Validasi_BMC.md
│   │   ├── EcoThread_Arsitektur_ICT.md
│   │   └── EcoThread_Studi_Kasus_PO.md
│   ├── plans/                        # Rencana MVP & Storyboard UI
│   │   ├── EcoThread_MVP_Plan.md
│   │   ├── EcoThread_MVP4_Customer_Plan.md
│   │   └── ECOTHREAD_STORYBOARD.md
│   └── scripts/                      # Naskah Video & Presentasi
│       ├── Naskah_Video_Presentasi_EcoThread.txt
│       └── Naskah_Hanif_Superadmin_Customer.txt
├── echothread-superadmin-app/        # App Web Dashboard Superadmin (React + Vite + Tailwind)
├── ecothread-dpp-customer/           # App Web DPP / Customer Portal (React + Vite)
├── ecothread-mitra-react/            # App Web Portal Mitra (React + Vite)
├── ecothread-animation-demo/         # Demo Animasi Interaktif (React + Vite)
└── README.md                         # Dokumentasi Utama Repositori
```

---

## 💻 Aplikasi Web EcoThread

1. **`echothread-superadmin-app/`**  
   Dashboard utama pemantauan dan pengelolaan operasional superadmin EcoThread.
2. **`ecothread-dpp-customer/`**  
   Aplikasi portal customer & Digital Product Passport (DPP) EcoThread.
3. **`ecothread-mitra-react/`**  
   Aplikasi web interaktif khusus mitra daur ulang & pengepul limbah tekstil.
4. **`ecothread-animation-demo/`**  
   Demo animasi interaktif mengenai proses daur ulang & alur kerja EcoThread.

---

## 🛠️ Prasyarat (Prerequisites)

Pastikan lingkungan kerja Anda sudah terpasang:
* [Node.js](https://nodejs.org/) (v18+ atau versi LTS direkomendasikan)
* [npm](https://www.npmjs.com/) / [yarn](https://yarnpkg.com/)
* [Git](https://git-scm.com/)

---

## 🚀 Cara Menjalankan Aplikasi Secara Lokal

Masing-masing aplikasi dapat dijalankan secara terpisah menggunakan Vite.

### 1. Kloning Repositori
```bash
git clone https://github.com/hanif-12-01/Gemastik-XIX-.git
cd Gemastik-XIX-
```

### 2. Menjalankan Sub-Proyek (Contoh: Dashboard Superadmin)
```bash
# 1. Pindah ke direktori sub-proyek yang ingin dijalankan
cd echothread-superadmin-app

# 2. Instal semua dependensi
npm install

# 3. Jalankan server lokal
npm run dev
```

*Catatan: Ulangi langkah di atas pada direktori aplikasi lain (`ecothread-dpp-customer`, `ecothread-mitra-react`, atau `ecothread-animation-demo`) sesuai kebutuhan.*

---

## 📄 Lisensi
Hak Cipta © 2026 Tim EcoThread. Dibuat untuk Gemastik XIX.
