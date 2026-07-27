import React from 'react'
import { useParams } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Alert } from '../../components/feedback/Alert'

export const PublicDppPage: React.FC = () => {
  const { productCode } = useParams<{ productCode: string }>()
  const code = productCode || 'PRD-DEMO'

  return (
    <div style={{ padding: '3rem 0', backgroundColor: 'var(--color-bg-main)' }}>
      <div className="container-narrow">
        {/* Header Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Badge variant="success" className="mb-2">Official Digital Product Passport</Badge>
          <h1 style={{ fontSize: '2.25rem', color: '#FFF', marginBottom: '0.5rem' }}>Passport Sirkular Produk</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Kode Identifikasi Produk: <strong style={{ color: 'var(--color-primary)' }}>{code}</strong>
          </p>
        </div>

        {/* Verification Card */}
        <Card style={{ marginBottom: '1.5rem', borderColor: 'var(--color-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Status Verifikasi</span>
              <h3 style={{ color: '#FFF', fontSize: '1.25rem' }}>Database Verified</h3>
            </div>
            <Badge variant="success">Tercatat di Ledger EcoThread</Badge>
          </div>
        </Card>

        {/* Product Identity */}
        <Card style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            1. Identitas & Visual Produk
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Material Limbah Asal (Before)</span>
              <div style={{ height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginTop: '0.5rem', backgroundColor: '#000' }}>
                <img src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80" alt="Material Before" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Hasil Upcycling (After)</span>
              <div style={{ height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginTop: '0.5rem', backgroundColor: '#000' }}>
                <img src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=400&q=80" alt="Product After" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Production Journey */}
        <Card style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            2. Jejak Rekam Produksi (Traceability)
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Sumber Limbah:</span>
              <strong style={{ color: '#FFF' }}>Bank Sampah Tekstil Bandung (MAT-2026-0001)</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Metode Sanitasi:</span>
              <strong style={{ color: '#FFF' }}>Steam & Ozone Wash 90°C</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Mitra Pembuat:</span>
              <strong style={{ color: 'var(--color-primary)' }}>Ibu Ratna (Mitra Penjahit Bandung)</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Quality Control:</span>
              <strong style={{ color: 'var(--color-status-success)' }}>LULUS INSPEKSI 4 CHECKLIST</strong>
            </li>
          </ul>
        </Card>

        {/* Environmental Impact */}
        <Card style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            3. Metrik Dampak Lingkungan
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', textAlign: 'center' }}>
            <div style={{ backgroundColor: 'var(--color-bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Emisi CO2 Dihemat</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>12.4 kg</div>
            </div>
            <div style={{ backgroundColor: 'var(--color-bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Air Dihemat</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-secondary)' }}>2,450 L</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
