import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/feedback/Alert'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { Scissors, ArrowLeft, Eye, CheckCircle, XCircle } from 'lucide-react'

export const MitraOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getMitraOrders()
      setOrders(data)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat pesanan.')
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
    try {
      await apiClient.acceptOrder(id)
      setActionMessage('Pesanan produksi berhasil diterima!')
      await fetchOrders()
    } catch (err: any) {
      setError(err.message || 'Gagal menerima pesanan.')
    }
  }

  return (
    <div style={{ padding: '1.5rem 1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/mitra" style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
          <ArrowLeft size={16} /> Kembali ke Dashboard Mitra
        </Link>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', color: '#FFF', margin: 0 }}>Pesanan Produksi Saya</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          Daftar alokasi Eco-Kit dan penugasan jahit yang diberikan Admin.
        </p>
      </div>

      {error && <Alert type="danger" title="Gagal">{error}</Alert>}
      {actionMessage && <Alert type="success" title="Sukses">{actionMessage}</Alert>}

      {loading ? (
        <LoadingSpinner message="Memuat daftar pesanan Anda..." />
      ) : orders.length === 0 ? (
        <EmptyState title="Belum Ada Pesanan Ditugaskan" description="Saat ini belum ada penugasan Eco-Kit baru untuk bengkel jahit Anda." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((o) => (
            <Card key={o.id} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: '#FFF', margin: 0 }}>{o.orderCode}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-warning)', marginTop: '2px' }}>
                    {o.ecoKit?.name}
                  </div>
                </div>
                <Badge variant={o.status === 'offered' ? 'warning' : o.status === 'accepted' ? 'info' : 'success'}>
                  {o.status}
                </Badge>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.5rem 0' }}>
                Estimasi Payout: <strong style={{ color: '#FFF' }}>Rp {o.agreedPayoutRate?.toLocaleString('id-ID')}</strong>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                {o.status === 'offered' && (
                  <Button onClick={() => handleAccept(o.id)} variant="primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}>
                    <CheckCircle size={14} /> Terima Pesanan
                  </Button>
                )}
                <Link to={`/mitra/orders/${o.id}`} className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', textAlign: 'center' }}>
                  <Eye size={14} /> Lihat Detail
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
