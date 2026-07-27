import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Alert } from '../../components/feedback/Alert'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { apiClient } from '../../lib/api'
import { ArrowLeft, QrCode, ShieldCheck, ShoppingBag } from 'lucide-react'

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [loading, setLoading] = useState<boolean>(true)
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true)
        if (slug) {
          const data = await apiClient.getCatalogDetail(slug)
          if (data) {
            setProduct(data)
          }
        }
      } catch (err) {
        // Fallback to example product shell
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [slug])

  const p = product || {
    title: 'Jaket Denim Upcycle Heritage Batch #1',
    category: 'Outerwear',
    productCode: 'PRD-DEMO',
    price: 450000,
    depositAmount: 150000,
    description: 'Jaket denim buatan tangan mitra penjahit lokal Bandung menggunakan 100% limbah pakaian garmen denim bekas yang telah melewati sterilisasi penuh. Dilengkapi stempel jejak produksi transparan.',
    co2SavedKg: 12.4,
    waterSavedLiters: 2450,
    isExample: true
  }

  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to={ROUTES.PUBLIC.CATALOG} style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <ArrowLeft size={16} /> Kembali ke Katalog
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Memuat detail produk..." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
            {/* Gallery */}
            <div>
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '420px', backgroundColor: '#000', marginBottom: '1rem', position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80"
                  alt={p.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {p.isExample && (
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <Badge variant="info">Contoh Produk (Demo Dataset)</Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <Badge variant="success">Upcycled Denim</Badge>
                <Badge variant="info">Kode Produk: {p.productCode}</Badge>
              </div>

              <h1 style={{ fontSize: '2rem', color: '#FFF', marginBottom: '1rem' }}>
                {p.title}
              </h1>

              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
                Rp {p.price.toLocaleString('id-ID')} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>(Deposit Rp {p.depositAmount.toLocaleString('id-ID')})</span>
              </div>

              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                {p.description}
              </p>

              <Card style={{ marginBottom: '1.5rem', backgroundColor: 'var(--color-bg-input)' }}>
                <h3 style={{ fontSize: '0.95rem', color: '#FFF', marginBottom: '0.75rem' }}>Metrik Dampak Lingkungan (Estimasi Formula)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Penghematan CO2</span>
                    <strong style={{ color: 'var(--color-primary)', fontSize: '1.125rem' }}>{p.co2SavedKg} kg</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Penghematan Air</span>
                    <strong style={{ color: 'var(--color-secondary)', fontSize: '1.125rem' }}>{p.waterSavedLiters.toLocaleString('id-ID')} Liter</strong>
                  </div>
                </div>
              </Card>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to={`/checkout/${p.slug}`} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', background: 'var(--color-primary)', color: '#000', fontWeight: 800 }}>
                  <ShoppingBag size={18} /> Pre-Order Sekarang
                </Link>
                <Link to={ROUTES.PUBLIC.getDpp(p.productCode)} className="btn" style={{ flex: 1, justifyContent: 'center', background: 'var(--color-surface-2)', color: '#FFF', border: '1px solid var(--color-border)' }}>
                  <QrCode size={18} /> Buka Digital Product Passport (DPP)
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
