import React, { useEffect, useState } from 'react'
import { ArrowLeft, QrCode, ShieldCheck, ShoppingBag } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Alert } from '../../components/feedback/Alert'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { apiClient } from '../../lib/api'
import { ROUTES } from '../../lib/routes'

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [loading, setLoading] = useState(true)
  const [catalogItem, setCatalogItem] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true)
        setError(null)
        if (!slug) throw new Error('Alamat produk tidak lengkap.')
        const data = await apiClient.getCatalogDetail(slug)
        setCatalogItem(data)
      } catch (err: any) {
        setError(err.message || 'Detail produk belum bisa dimuat.')
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [slug])

  const product = catalogItem?.product
  const impact = product?.impactRecords?.[0]
  const productCode = product?.productCode
  const imageUrl =
    product?.primaryImageUrl ||
    product?.afterImageUrl ||
    '/ecothread-denim-hero.webp'

  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to={ROUTES.PUBLIC.CATALOG}
            style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
          >
            <ArrowLeft size={16} /> Kembali ke Katalog
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Memuat detail produk..." />
        ) : error || !catalogItem || !product ? (
          <Alert
            variant="error"
            message={error || 'Produk tidak ditemukan.'}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            <div>
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: '440px', backgroundColor: 'var(--color-surface-2)', marginBottom: '1rem', position: 'relative' }}>
                <img
                  src={imageUrl}
                  alt={catalogItem.title}
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = '/ecothread-denim-hero.webp'
                  }}
                  style={{ width: '100%', height: '100%', minHeight: '440px', objectFit: 'cover' }}
                />
                {(catalogItem.dataOrigin === 'demo' || product.dataOrigin === 'demo') && (
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <Badge variant="info">Data Demo</Badge>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <Badge variant="success">Upcycled</Badge>
                <Badge variant="info">Kode: {productCode}</Badge>
              </div>

              <h1 style={{ fontSize: '2rem', color: '#FFF', marginBottom: '1rem' }}>
                {catalogItem.title}
              </h1>

              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
                Rp {Number(catalogItem.price).toLocaleString('id-ID')}
                <span style={{ display: 'block', marginTop: '0.25rem', fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>
                  Deposit Rp {Number(catalogItem.depositAmount).toLocaleString('id-ID')}
                </span>
              </div>

              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                {product.description || product.shortDescription}
              </p>

              <Card style={{ marginBottom: '1.5rem', backgroundColor: 'var(--color-bg-input)' }}>
                {impact ? (
                  <>
                    <h2 style={{ fontSize: '0.95rem', color: '#FFF', marginBottom: '0.75rem' }}>
                      Dampak lingkungan
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                      <div>
                        <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Penghematan CO₂</span>
                        <strong style={{ color: 'var(--color-primary)', fontSize: '1.125rem' }}>
                          {Number(impact.co2SavedKg || 0).toLocaleString('id-ID')} kg
                        </strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Penghematan air</span>
                        <strong style={{ color: 'var(--color-secondary)', fontSize: '1.125rem' }}>
                          {Number(impact.waterSavedLiters || 0).toLocaleString('id-ID')} liter
                        </strong>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <ShieldCheck size={23} color="var(--color-primary)" />
                    <div>
                      <h2 style={{ fontSize: '0.95rem', color: '#FFF', marginBottom: '0.35rem' }}>
                        Transparansi tersedia
                      </h2>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                        Asal bahan, Mitra pembuat, dan tahapan produksi tersedia di Digital Product Passport. Angka dampak tidak ditampilkan sebelum memiliki data terverifikasi.
                      </p>
                    </div>
                  </div>
                )}
              </Card>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  to={`/checkout/${catalogItem.id}`}
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <ShoppingBag size={18} /> Pre-order sekarang
                </Link>
                {productCode && (
                  <Link
                    to={ROUTES.PUBLIC.getDpp(productCode)}
                    className="btn btn-secondary"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    <QrCode size={18} /> Buka DPP
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
