import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { Alert } from '../../components/feedback/Alert'
import { EmptyState } from '../../components/ui/EmptyState'
import { apiClient } from '../../lib/api'
import { ArrowRight, Tag } from 'lucide-react'

export const CatalogPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    async function fetchCatalog() {
      try {
        setLoading(true)
        const data = await apiClient.getCatalog()
        if (Array.isArray(data) && data.length > 0) {
          setItems(data)
        } else {
          // Fallback demo data if API returns empty array in dev
          setItems([
            {
              slug: 'jaket-denim-upcycle-hero',
              title: 'Jaket Denim Upcycle Heritage Batch #1',
              price: 450000,
              depositAmount: 150000,
              stock: 1,
              category: 'Outerwear',
              productCode: 'PRD-DEMO',
              imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80',
              co2: '12.4 kg',
              water: '2,450 L',
              isDemoData: true
            }
          ])
        }
      } catch (err: any) {
        // Fallback gracefully to demo item with explicit label
        setItems([
          {
            slug: 'jaket-denim-upcycle-hero',
            title: 'Jaket Denim Upcycle Heritage Batch #1',
            price: 450000,
            depositAmount: 150000,
            stock: 1,
            category: 'Outerwear',
            productCode: 'PRD-DEMO',
            imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80',
            co2: '12.4 kg',
            water: '2,450 L',
            isDemoData: true
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCatalog()
  }, [])

  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <Badge variant="success" className="mb-2">Katalog Produksi Sirkular</Badge>
          <h1 style={{ fontSize: '2.25rem', color: '#FFF', marginBottom: '0.5rem' }}>Katalog Produk Upcycled</h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Setiap produk dihasilkan dari limbah garmen tersterilisasi dengan transparansi penuh Digital Product Passport.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner message="Memuat katalog produk sirkular..." />
        ) : items.length === 0 ? (
          <EmptyState
            title="Belum Ada Produk Tersedia"
            description="Katalog produk aktif belum tersedia. Silakan periksa kembali nanti."
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {items.map((p) => (
              <Card key={p.slug} hoverable style={{ overflow: 'hidden', padding: 0 }}>
                <div style={{ height: '240px', overflow: 'hidden', position: 'relative', backgroundColor: '#000' }}>
                  <img
                    src={p.imageUrl || 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80'}
                    alt={p.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '0.5rem' }}>
                    <Badge variant="success">Upcycled</Badge>
                    {p.isDemoData && <Badge variant="info">Demo Dataset</Badge>}
                  </div>
                </div>

                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-dim)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                    <span>{p.category || 'Outerwear'}</span>
                    <span>Kode: {p.productCode || 'PRD-DEMO'}</span>
                  </div>

                  <h3 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '0.5rem' }}>{p.title}</h3>

                  <div style={{ display: 'flex', gap: '1rem', margin: '0.75rem 0', fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                    <span>🌱 Hemat CO2: {p.co2 || '12.4 kg'}</span>
                    <span>💧 Hemat Air: {p.water || '2,450 L'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                    <div>
                      <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#FFF' }}>
                        Rp {(p.price || 450000).toLocaleString('id-ID')}
                      </span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Deposit: Rp {(p.depositAmount || 150000).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <Link to={ROUTES.PUBLIC.getProductDetail(p.slug)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                      Detail Produk
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
