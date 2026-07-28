import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ChevronRight } from 'lucide-react'
import { Alert } from '../../components/feedback/Alert'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { apiClient } from '../../lib/api'
import { formatRupiah, getMitraStatus } from '../../lib/mitra-ui'

export const MitraOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [acceptingId, setAcceptingId] = useState<string | null>(null)

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

  const handleAccept = async (id: string) => {
    setActionMessage(null)
    setError(null)
    setAcceptingId(id)

    try {
      await apiClient.acceptOrder(id)
      setActionMessage('Pekerjaan berhasil diterima. Terima kasih, Ibu!')
      await fetchOrders()
    } catch (err: any) {
      setError(err.message || 'Pekerjaan belum berhasil diterima. Silakan coba lagi.')
    } finally {
      setAcceptingId(null)
    }
  }

  return (
    <div className="mitra-page">
      <div className="mitra-page-header">
        <h1>Pekerjaan Saya</h1>
        <p>Pilih satu pekerjaan untuk melihat langkah yang perlu dilakukan.</p>
      </div>

      {error && <Alert type="danger" title="Belum berhasil">{error}</Alert>}
      {actionMessage && <Alert type="success" title="Berhasil">{actionMessage}</Alert>}

      {loading ? (
        <LoadingSpinner message="Membuka daftar pekerjaan..." />
      ) : orders.length === 0 ? (
        <EmptyState
          title="Belum ada pekerjaan"
          description="EcoThread akan memberi tahu Ibu saat ada tawaran jahitan baru."
        />
      ) : (
        <div className="mitra-job-list">
          {orders.map((order) => {
            const status = getMitraStatus(order.status)
            const targetDate = order.targetCompletion
              ? new Date(order.targetCompletion).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long'
                })
              : 'Belum ditentukan'

            return (
              <article className="mitra-job-card" key={order.id}>
                <div className="mitra-job-card__top">
                  <div>
                    <h2>{order.ecoKit?.name || 'Pekerjaan jahit EcoThread'}</h2>
                    <p>Nomor pekerjaan: {order.orderCode}</p>
                  </div>
                  <span className={`mitra-status mitra-status--${status.tone}`}>
                    {status.label}
                  </span>
                </div>

                <div className="mitra-money-row">
                  <div>
                    <span>Upah yang diterima</span>
                    <strong>{formatRupiah(order.agreedPayoutRate)}</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span>Selesai sebelum</span>
                    <strong style={{ fontSize: '0.95rem' }}>{targetDate}</strong>
                  </div>
                </div>

                <p style={{ marginBottom: '1rem' }}>{status.help}</p>

                <div className={`mitra-job-actions ${order.status !== 'offered' ? 'mitra-job-actions--single' : ''}`}>
                  {order.status === 'offered' && (
                    <button
                      type="button"
                      onClick={() => handleAccept(order.id)}
                      className="btn btn-primary"
                      disabled={acceptingId === order.id}
                    >
                      <CheckCircle2 size={18} aria-hidden="true" />
                      {acceptingId === order.id ? 'Menyimpan...' : 'Saya terima'}
                    </button>
                  )}
                  <Link to={`/mitra/orders/${order.id}`} className="btn btn-secondary">
                    Lihat langkah
                    <ChevronRight size={18} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
