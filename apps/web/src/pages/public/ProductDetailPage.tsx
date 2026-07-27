import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/feedback/Alert'

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to={ROUTES.PUBLIC.CATALOG} style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            &larr; Kembali ke Katalog
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
          {/* Gallery */}
          <div>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '400px', backgroundColor: '#000', marginBottom: '1rem' }}>
              <img
                src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80"
                alt="Product Detail"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '2px solid var(--color-primary)' }}>
                <img src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=200&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Thumb" />
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Badge variant="success">Upcycled Denim</Badge>
              <Badge variant="info">Kode Produk: PRD-DEMO</Badge>
            </div>

            <h1 style={{ fontSize: '2rem', color: '#FFF', marginBottom: '1rem' }}>
              Jaket Denim Upcycle Heritage Batch #1 ({slug || 'demo'})
            </h1>

            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
              Rp 450.000 <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>(Deposit Rp 150.000)</span>
            </div>

            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Jaket denim buatan tangan mitra penjahit lokal Bandung menggunakan 100% limbah pakaian garmen denim bekas. Dilengkapi stempel jejak produksi transparan.
            </p>

            <Card style={{ marginBottom: '1.5rem', backgroundColor: 'var(--color-bg-input)' }}>
              <h3 style={{ fontSize: '0.95rem', color: '#FFF', marginBottom: '0.75rem' }}>Metrik Dampak Lingkungan (Estimasi)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Penghematan CO2</span>
                  <strong style={{ color: 'var(--color-primary)', fontSize: '1.125rem' }}>12.4 kg</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Penghematan Air</span>
                  <strong style={{ color: 'var(--color-secondary)', fontSize: '1.125rem' }}>2,450 Liter</strong>
                </div>
              </div>
            </Card>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to={ROUTES.PUBLIC.getDpp('PRD-DEMO')} className="btn btn-primary" style={{ flex: 1 }}>
                Buka Digital Product Passport (DPP)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
