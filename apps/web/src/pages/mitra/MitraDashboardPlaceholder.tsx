import React from 'react'
import { useAuth } from '../../features/auth/AuthContext'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { LogOut, CheckCircle, Package } from 'lucide-react'

export const MitraDashboardPlaceholder: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Badge variant="success" className="mb-2">Portal Terproteksi (Mitra Terverifikasi)</Badge>
            <h1 style={{ fontSize: '2rem', color: '#FFF' }}>Konsol Kerja Mitra Penjahit</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Selamat datang, <strong>{user?.mitraProfile?.workshopName || user?.name}</strong> ({user?.email})
            </p>
          </div>

          <Button onClick={logout} variant="secondary">
            <LogOut size={16} /> Keluar (Logout)
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <CheckCircle color="var(--color-status-success)" size={20} />
              <h3 style={{ fontSize: '1.125rem', color: '#FFF' }}>Status Akun: Terverifikasi</h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Akun Mitra Anda telah diverifikasi oleh Admin. Anda berhak menerima alokasi paket Eco-Kit dan penugasan jahit.
            </p>
          </Card>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Package color="var(--color-primary)" size={20} />
              <h3 style={{ fontSize: '1.125rem', color: '#FFF' }}>Kapasitas Kerja Mingguan</h3>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              {user?.mitraProfile?.capacityPerWeek || 10} Pcs / Minggu
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              Lokasi: {user?.mitraProfile?.location || 'Bandung'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
