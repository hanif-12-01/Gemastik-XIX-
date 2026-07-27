import React from 'react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Alert } from '../../components/feedback/Alert'

export const MitraDashboardPlaceholder: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', color: '#FFF' }}>Portal Kerja Penjahit</h1>
          <Badge variant="success">Mitra Terverifikasi</Badge>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          Kelola pesanan produksi dan pengiriman bukti Quality Control
        </p>
      </div>

      <Alert type="info" title="Batas Fondasi Arsitektur Roadmap 0">
        Integrasi antarmuka Mitra lengkap (Penerimaan Job, Milestone Production Progress, Upload Foto QC, dan Wallet Payout) akan dihubungkan secara menyeluruh dengan API Client pada <strong>Roadmap 1–2</strong>.
      </Alert>

      <Card style={{ marginTop: '1rem', backgroundColor: 'var(--color-bg-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <Badge variant="warning">Order #ORD-2026-0001</Badge>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}>Fee: Rp 150.000</span>
        </div>

        <h3 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '0.5rem' }}>Jaket Denim Upcycle Heritage</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          Pattern: PAT-2026-0001 (Size L) | Target Deadline: 3 Hari
        </p>

        <div style={{ backgroundColor: 'var(--color-bg-input)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Progres Pengerjaan: <strong>in_progress (75%)</strong>
        </div>
      </Card>
    </div>
  )
}
