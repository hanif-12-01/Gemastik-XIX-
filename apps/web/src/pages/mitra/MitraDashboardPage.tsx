import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ClipboardList, RefreshCw } from 'lucide-react'
import { Alert } from '../../components/feedback/Alert'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { useAuth } from '../../features/auth/AuthContext'
import { apiClient } from '../../lib/api'

export const MitraDashboardPage: React.FC = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getMitraOrders()
      setOrders(data)
    } catch (err: any) {
      setError(err.message || 'Daftar pekerjaan belum bisa dimuat.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  if (loading) {
    return <LoadingSpinner message="Menyiapkan ruang kerja Ibu..." />
  }

  const offeredCount = orders.filter((order) => order.status === 'offered').length
  const activeCount = orders.filter((order) =>
    ['accepted', 'kit_received', 'in_progress', 'qc_revision'].includes(order.status)
  ).length
  const checkingCount = orders.filter((order) => order.status === 'submitted_to_qc').length
  const completedCount = orders.filter((order) =>
    ['qc_approved', 'payout_pending', 'completed', 'paid'].includes(order.status)
  ).length

  const firstName = (user?.name || 'Ibu').split(' ')[0] === 'Ibu'
    ? (user?.name || 'Ibu').split(' ').slice(0, 2).join(' ')
    : user?.name?.split(' ')[0]

  let nextTitle = 'Belum ada pekerjaan baru'
  let nextDescription = 'Tidak perlu melakukan apa pun sekarang. EcoThread akan memberi kabar saat ada pekerjaan.'
  let nextButton = 'Lihat semua pekerjaan'

  if (offeredCount > 0) {
    nextTitle = `Ada ${offeredCount} tawaran pekerjaan baru`
    nextDescription = 'Buka tawaran, baca jenis jahitan dan upahnya, lalu pilih apakah Ibu dapat mengerjakannya.'
    nextButton = 'Buka tawaran pekerjaan'
  } else if (activeCount > 0) {
    nextTitle = `Lanjutkan ${activeCount} pekerjaan`
    nextDescription = 'Kabarkan tahap pekerjaan atau kirim foto hasil jahitan jika sudah selesai.'
    nextButton = 'Lanjutkan pekerjaan'
  } else if (checkingCount > 0) {
    nextTitle = 'Hasil jahitan sedang diperiksa'
    nextDescription = 'Foto sudah diterima. Ibu dapat beristirahat sambil menunggu kabar dari EcoThread.'
    nextButton = 'Lihat status pemeriksaan'
  }

  return (
    <div className="mitra-page">
      <div className="mitra-page-header">
        <h1>Selamat datang, {firstName || 'Ibu'} 👋</h1>
        <p>Di sini Ibu cukup mengikuti satu langkah pada satu waktu.</p>
      </div>

      {error && (
        <Alert type="danger" title="Belum bisa memuat data">
          {error}
        </Alert>
      )}

      <section className="mitra-next" aria-labelledby="mitra-next-title">
        <div className="mitra-next__eyebrow">Yang perlu dilakukan sekarang</div>
        <h2 id="mitra-next-title">{nextTitle}</h2>
        <p>{nextDescription}</p>
        <Link to="/mitra/orders" className="btn btn-primary">
          <ClipboardList size={19} aria-hidden="true" />
          {nextButton}
        </Link>
      </section>

      <section className="mitra-stat-grid" aria-label="Ringkasan pekerjaan">
        <div className="mitra-stat">
          <strong>{offeredCount}</strong>
          <span>Tawaran baru</span>
        </div>
        <div className="mitra-stat">
          <strong>{activeCount + checkingCount}</strong>
          <span>Sedang berjalan</span>
        </div>
        <div className="mitra-stat">
          <strong>{completedCount}</strong>
          <span>Sudah selesai</span>
        </div>
      </section>

      <button type="button" className="btn btn-secondary" onClick={fetchOrders} style={{ width: '100%' }}>
        <RefreshCw size={18} aria-hidden="true" />
        Periksa kabar terbaru
      </button>

      <section className="mitra-help-card" aria-labelledby="cara-mudah-title">
        <h2 id="cara-mudah-title" style={{ fontSize: '1.1rem' }}>Cara mudah memakai aplikasi</h2>
        <div className="mitra-help-step">
          <b>1</b>
          <span>Buka menu <strong>Pekerjaan</strong> saat ada tawaran baru.</span>
        </div>
        <div className="mitra-help-step">
          <b>2</b>
          <span>Tekan tombol sesuai tahap jahitan yang sedang Ibu kerjakan.</span>
        </div>
        <div className="mitra-help-step">
          <b>3</b>
          <span>Jika sudah selesai, pilih tiga foto dari kamera lalu kirim.</span>
        </div>
        <div className="mitra-help-step">
          <b><CheckCircle2 size={17} /></b>
          <span>Tidak apa-apa jika salah tekan. Data dapat diperiksa kembali oleh tim EcoThread.</span>
        </div>
      </section>
    </div>
  )
}
