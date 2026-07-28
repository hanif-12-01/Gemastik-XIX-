export const mitraStatus: Record<string, { label: string; tone: string; help: string }> = {
  draft: {
    label: 'Sedang disiapkan',
    tone: 'neutral',
    help: 'EcoThread sedang menyiapkan bahan dan petunjuk kerja.'
  },
  offered: {
    label: 'Tawaran baru',
    tone: 'warning',
    help: 'Silakan baca pekerjaan ini, lalu pilih Terima atau Tidak bisa.'
  },
  accepted: {
    label: 'Sudah diterima',
    tone: 'info',
    help: 'Pekerjaan sudah Ibu terima. Mulai saat bahan sudah sampai.'
  },
  kit_received: {
    label: 'Bahan diterima',
    tone: 'info',
    help: 'Bahan sudah diterima dan pekerjaan dapat dimulai.'
  },
  in_progress: {
    label: 'Sedang dikerjakan',
    tone: 'info',
    help: 'Lanjutkan jahitan dan kabarkan tahap pengerjaannya.'
  },
  qc_revision: {
    label: 'Perlu diperbaiki',
    tone: 'warning',
    help: 'Ada bagian yang perlu dirapikan sebelum foto dikirim kembali.'
  },
  submitted_to_qc: {
    label: 'Sedang diperiksa',
    tone: 'neutral',
    help: 'Foto hasil jahitan sudah diterima dan sedang diperiksa EcoThread.'
  },
  qc_approved: {
    label: 'Lolos pemeriksaan',
    tone: 'success',
    help: 'Hasil jahitan sudah disetujui. Upah akan diproses.'
  },
  payout_pending: {
    label: 'Upah diproses',
    tone: 'success',
    help: 'Upah sedang disiapkan untuk dikirim.'
  },
  paid: {
    label: 'Upah dibayar',
    tone: 'success',
    help: 'Pekerjaan selesai dan upah sudah dikirim.'
  },
  completed: {
    label: 'Selesai',
    tone: 'success',
    help: 'Pekerjaan ini sudah selesai.'
  },
  rejected: {
    label: 'Tidak diambil',
    tone: 'neutral',
    help: 'Pekerjaan ini tidak dilanjutkan.'
  },
  rejected_by_mitra: {
    label: 'Tidak diambil',
    tone: 'neutral',
    help: 'Pekerjaan ini tidak Ibu ambil.'
  },
  cancelled: {
    label: 'Dibatalkan',
    tone: 'danger',
    help: 'Pekerjaan ini dibatalkan.'
  }
}

export function getMitraStatus(status?: string) {
  if (!status) return { label: 'Belum diketahui', tone: 'neutral', help: '' }
  return mitraStatus[status] || {
    label: status.replace(/_/g, ' '),
    tone: 'neutral',
    help: 'Status pekerjaan terbaru.'
  }
}

export function formatRupiah(value?: number) {
  return `Rp${Number(value || 0).toLocaleString('id-ID')}`
}
