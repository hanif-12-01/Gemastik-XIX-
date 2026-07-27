import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { ArrowRight, Tag } from 'lucide-react'

export const ProductPreviewSection: React.FC = () => {
  return (
    <section style={{ padding: '5rem 0', backgroundColor: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Badge variant="success" className="mb-2">Pratinjau Hasil Produksi</Badge>
            <h2 style={{ fontSize: '2.25rem', color: '#FFF', marginBottom: '0.25rem' }}>Produk Fashion Upcycled Hero</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Contoh karya busana sirkular terverifikasi dari mitra penjahit lokal.</p>
          </div>

          <Link to={ROUTES.PUBLIC.CATALOG} className="btn btn-outline">
            Lihat Seluruh Katalog <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <Card hoverable style={{ overflow: 'hidden', padding: 0 }}>
            <div style={{ height: '260px', overflow: 'hidden', position: 'relative', backgroundColor: '#000' }}>
              <img
                src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80"
                alt="Jaket Denim Upcycle"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '0.5rem' }}>
                <Badge variant="success">Upcycled Denim</Badge>
                <Badge variant="info">Demo Dataset</Badge>
              </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                <span>Outerwear</span>
                <span>Kode: PRD-DEMO</span>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '0.5rem' }}>
                Jaket Denim Upcycle Heritage Batch #1
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Dibuat oleh Ibu Ratna dari 100% limbah garmen denim bekas dengan sterilisasi penuh dan stempel jejak DPP.
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                <div>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>Rp 450.000</span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Deposit: Rp 150.000</span>
                </div>

                <Link to={ROUTES.PUBLIC.getProductDetail('jaket-denim-upcycle-hero')} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  Lihat Detail
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
