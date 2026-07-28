import React, { useEffect, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { apiClient } from '../../lib/api'
import { ROUTES } from '../../lib/routes'

const fallbackItems = [
  {
    slug: 'upcycled-denim-eco-kimono-jacket',
    title: 'Upcycled Denim Eco-Kimono Jacket',
    price: 499000,
    depositAmount: 150000,
    stock: 5,
    category: 'Outerwear',
    productCode: 'PRD-2026-0001',
    imageUrl: '/ecothread-denim-hero.webp',
    isDemoData: true
  },
  {
    slug: 'denim-patchwork-overshirt',
    title: 'Denim Patchwork Overshirt',
    price: 429000,
    depositAmount: 130000,
    stock: 4,
    category: 'Outerwear',
    productCode: 'PRD-2026-0002',
    imageUrl: '/products/denim-overshirt.webp',
    isDemoData: true
  },
  {
    slug: 'tas-tote-patchwork-denim',
    title: 'Tas Tote Patchwork Denim',
    price: 279000,
    depositAmount: 85000,
    stock: 8,
    category: 'Aksesori',
    productCode: 'PRD-2026-0003',
    imageUrl: '/products/patchwork-tote.webp',
    isDemoData: true
  },
  {
    slug: 'bucket-hat-patchwork-denim',
    title: 'Bucket Hat Patchwork Denim',
    price: 169000,
    depositAmount: 50000,
    stock: 12,
    category: 'Aksesori',
    productCode: 'PRD-2026-0004',
    imageUrl: '/products/patchwork-bucket-hat.webp',
    isDemoData: true
  }
]

export const CatalogPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    async function fetchCatalog() {
      try {
        setLoading(true)
        const data = await apiClient.getCatalog()
        setItems(Array.isArray(data) && data.length > 0 ? data : fallbackItems)
      } catch {
        setItems(fallbackItems)
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
          <h1 style={{ fontSize: '2.25rem', color: '#FFF', marginBottom: '0.5rem' }}>
            Produk Upcycled, Dibuat dalam Jumlah Terbatas
          </h1>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '620px', margin: '0 auto' }}>
            Setiap produk membawa jejak bahan dan proses pembuatannya melalui Digital Product Passport.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner message="Memuat koleksi EcoThread..." />
        ) : items.length === 0 ? (
          <EmptyState
            title="Belum Ada Produk Tersedia"
            description="Koleksi aktif belum tersedia. Silakan periksa kembali nanti."
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {items.map((item) => {
              const product = item.product || {}
              const impact = product.impactRecords?.[0]
              const imageUrl =
                item.imageUrl ||
                product.primaryImageUrl ||
                product.afterImageUrl ||
                '/ecothread-denim-hero.webp'
              const category = item.category || product.category || 'Produk sirkular'
              const productCode = item.productCode || product.productCode || 'DPP tersedia'
              const isDemo =
                item.isDemoData ||
                item.dataOrigin === 'demo' ||
                product.dataOrigin === 'demo'

              return (
                <Card key={item.slug} hoverable style={{ overflow: 'hidden', padding: 0 }}>
                  <div style={{ height: '280px', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--color-surface-2)' }}>
                    <img
                      src={imageUrl}
                      alt={item.title}
                      onError={(event) => {
                        event.currentTarget.onerror = null
                        event.currentTarget.src = '/ecothread-denim-hero.webp'
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '0.5rem' }}>
                      <Badge variant="success">Upcycled</Badge>
                      {isDemo && <Badge variant="info">Data Demo</Badge>}
                    </div>
                  </div>

                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', color: 'var(--color-text-dim)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                      <span>{category}</span>
                      <span>{productCode}</span>
                    </div>

                    <h2 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '0.5rem' }}>
                      {item.title}
                    </h2>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', margin: '0.75rem 0', fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                      <ShieldCheck size={16} />
                      <span>
                        {impact
                          ? 'Dampak terukur tersedia di DPP'
                          : 'Asal bahan dan proses tersedia di DPP'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                      <div>
                        <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#FFF' }}>
                          Rp {Number(item.price || 0).toLocaleString('id-ID')}
                        </span>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          Deposit Rp {Number(item.depositAmount || 0).toLocaleString('id-ID')}
                        </span>
                      </div>

                      <Link
                        to={ROUTES.PUBLIC.getProductDetail(item.slug)}
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      >
                        Lihat
                      </Link>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
