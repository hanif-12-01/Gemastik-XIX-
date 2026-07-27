import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'
import { apiClient } from '../../lib/api'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/feedback/Alert'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { Scissors, Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'

export const MitraDashboardPage: React.FC = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getMitraOrders()
      setOrders(data)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat pesanan produksi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const offeredCount = orders.filter((o) => o.status === 'offered').length
  const activeCount = orders.filter((o) => ['accepted', 'kit_received', 'in_progress'].includes(o.status)).length
  const submittedQcCount = orders.filter((o) => o.status === 'submitted_to_qc').length
  const completedCount = orders.filter((o) => ['qc_approved', 'completed', 'paid'].includes(o.status)).length

  if (loading) {
    return <LoadingSpinner message="Memuat konsol kerja Mitra..." />
  }

  return (
    <div style={{ padding: '1.5rem 1rem' }}>
      {/* Header Profile Summary */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Badge variant="success" className="mb-2">Bengkel Jahit Terverifikasi</Badge>
          <h1 style={{ fontSize: '1.5rem', color: '#FFF', margin: 0 }}>
            {user?.mitraProfile?.workshopName || user?.name}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
            Lokasi: {user?.mitraProfile?.location || 'Bandung'} &bull; Kapasitas: {user?.mitraProfile?.capacityPerWeek || 10} pcs/minggu
          </p>
        </div>
        <Button onClick={fetchOrders} variant="secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}>
          <RefreshCw size={14} /> Refresh
        </Button>
      </div>

      {error && <Alert type="danger" title="Error">{error}</Alert>}

      {/* Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <Card style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Clock color="var(--color-warning)" size={18} />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Tawaran Baru</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-warning)' }}>
            {offeredCount} Order
          </div>
        </Card>

        <Card style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Scissors color="var(--color-primary)" size={18} />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Proses Jahit</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {activeCount} Order
          </div>
        </Card>

        <Card style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <AlertCircle color="#60A5FA" size={18} />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Proses QC</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#60A5FA' }}>
            {submittedQcCount} Order
          </div>
        </Card>

        <Card style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <CheckCircle2 color="#34D399" size={18} />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Selesai</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34D399' }}>
            {completedCount} Order
          </div>
        </Card>
      </div>

      {/* Quick Action Navigation */}
      <Card style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '0.5rem' }}>Daftar Pesanan Produksi</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          Lihat detail instruksi jahit, terima penugasan baru, dan upload foto bukti QC.
        </p>
        <Link to="/mitra/orders" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
          Kelola Pesanan Produksi &rarr;
        </Link>
      </Card>
    </div>
  )
}
