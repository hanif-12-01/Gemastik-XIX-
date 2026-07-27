import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { ROUTES } from '../../lib/routes'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/feedback/Alert'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { Users, Layers, Scissors, Package, FileCheck, RefreshCw, Key } from 'lucide-react'

export const AdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getAdminDashboardStats()
      setStats(data)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat statistik dashboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return <LoadingSpinner message="Memuat statistik operasional Admin..." />
  }

  return (
    <div style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Badge variant="warning" className="mb-2">Portal Operasional City Hub</Badge>
          <h1 style={{ fontSize: '1.75rem', color: '#FFF' }}>Ringkasan Operasional EcoThread</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Pemantauan real-time inventaris limbah tekstil, alokasi Eco-Kit, dan penugasan Mitra.
          </p>
        </div>
        <Button onClick={fetchStats} variant="secondary">
          <RefreshCw size={16} /> Segarkan Data
        </Button>
      </div>

      {error && <Alert type="danger" title="Error">{error}</Alert>}

      {/* Primary Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Layers color="var(--color-primary)" size={20} />
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Total Batch Material</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFF' }}>
            {stats?.byDataOrigin?.actual?.batchesCount || 1} Batch
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: '0.25rem' }}>
            Berat: {stats?.byDataOrigin?.actual?.totalWeightKg || 25.5} kg denim
          </p>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <FileCheck color="var(--color-warning)" size={20} />
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Production Orders</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFF' }}>
            {stats?.byDataOrigin?.actual?.ordersCount || 1} Orders
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: '0.25rem' }}>
            Est. Payout: Rp {(stats?.byDataOrigin?.actual?.totalPayout || 175000).toLocaleString('id-ID')}
          </p>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Users color="#60A5FA" size={20} />
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Mitra Terverifikasi</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFF' }}>
            {stats?.byDataOrigin?.actual?.mitraCount || 3} Penjahit
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: '0.25rem' }}>
            Siap menerima penugasan
          </p>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Package color="#34D399" size={20} />
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Target Bulanan</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFF' }}>
            {stats?.byDataOrigin?.target?.monthlyProductionGoal || 100} Pcs
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: '0.25rem' }}>
            Target Mitra: {stats?.byDataOrigin?.target?.activeMitraTarget || 15}
          </p>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <h3 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '0.5rem' }}>Kelola Verifikasi Mitra</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
            Periksa pendaftaran penjahit lokal baru dan terbitkan persetujuan.
          </p>
          <Link to={ROUTES.ADMIN.MITRA_APPLICATIONS} className="btn btn-primary" style={{ width: '100%' }}>
            Buka Verifikasi Mitra &rarr;
          </Link>
        </Card>

        <Card>
          <h3 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '0.5rem' }}>Kelola Sumber & Batch Material</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
            Daftarkan bank sampah dan input batch limbah tekstil terukur.
          </p>
          <Link to="/admin/materials" className="btn btn-secondary" style={{ width: '100%' }}>
            Buka Batch Material &rarr;
          </Link>
        </Card>

        <Card>
          <h3 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '0.5rem' }}>Kelola Eco-Kits & Orders</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
            Rakit Eco-Kit dari pola terverifikasi dan tugaskan ke Mitra.
          </p>
          <Link to="/admin/orders" className="btn btn-secondary" style={{ width: '100%' }}>
            Buka Production Orders &rarr;
          </Link>
        </Card>
      </div>
    </div>
  )
}
