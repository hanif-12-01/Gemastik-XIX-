import React from 'react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Alert } from '../../components/feedback/Alert'

export const AdminDashboardPlaceholder: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: '#FFF', marginBottom: '0.25rem' }}>Dashboard Operasional City Hub</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Konsol pusat manajemen material, penugasan Mitra, QC, dan penerbitan DPP
          </p>
        </div>
        <Badge variant="success">Fondasi Roadmap 0 Active</Badge>
      </div>

      <Alert type="info" title="Batas Fondasi Arsitektur Roadmap 0">
        Modul antarmuka Admin lengkap (CRUD Material, Manajemen Eco-Kit, Checklist QC, Release Payout, dan Minting DPP) akan dihubungkan secara menyeluruh dengan API Client pada <strong>Roadmap 1–2</strong>.
      </Alert>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        <Card>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Material Batches Intake</span>
          <h3 style={{ fontSize: '1.75rem', color: '#FFF', margin: '0.5rem 0' }}>1 Batch</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>100% Sanitized</span>
        </Card>

        <Card>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Production Orders Aktif</span>
          <h3 style={{ fontSize: '1.75rem', color: '#FFF', margin: '0.5rem 0' }}>1 Order</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-status-warning)' }}>In Progress</span>
        </Card>

        <Card>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Pengajuan QC Pending</span>
          <h3 style={{ fontSize: '1.75rem', color: '#FFF', margin: '0.5rem 0' }}>0 Review</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Semua telah diproses</span>
        </Card>

        <Card>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Digital Product Passports</span>
          <h3 style={{ fontSize: '1.75rem', color: '#FFF', margin: '0.5rem 0' }}>1 Published</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>Database Verified</span>
        </Card>
      </div>
    </div>
  )
}
