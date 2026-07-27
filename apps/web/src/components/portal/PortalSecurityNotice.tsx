import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { ShieldCheck, Lock, UserCheck } from 'lucide-react'

export const PortalSecurityNotice: React.FC = () => {
  return (
    <Card style={{ backgroundColor: 'var(--color-bg-card)', marginTop: '2.5rem', border: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <ShieldCheck color="var(--color-primary)" size={20} />
        <h3 style={{ fontSize: '1.125rem', color: '#FFF' }}>Ringkasan Aturan Keamanan Akses Portal</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', fontSize: '0.875rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Lock color="var(--color-status-warning)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#FFF', display: 'block', marginBottom: '0.25rem' }}>Akses Admin Terpadu &amp; Terbatas</strong>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Pendaftaran akun Admin tidak dibuka untuk umum. Pendaftaran hanya melalui token undangan Super Admin resmi.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <UserCheck color="var(--color-secondary)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#FFF', display: 'block', marginBottom: '0.25rem' }}>Verifikasi Mitra Penjahit</strong>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Mitra baru dapat mendaftar secara bebas, namun memerlukan verifikasi Admin sebelum dapat menerima pesanan jahit.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
