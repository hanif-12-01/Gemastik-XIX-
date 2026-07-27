import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { useAuth } from '../../features/auth/AuthContext'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { Alert } from '../../components/feedback/Alert'
import { ArrowLeft, ShoppingBag, ShieldCheck, CreditCard, Truck } from 'lucide-react'

export const CheckoutPage: React.FC = () => {
  const { catalogItemId } = useParams<{ catalogItemId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAuthenticated = Boolean(user)

  const [catalogItem, setCatalogItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [quantity, setQuantity] = useState(1)
  const [shippingAddress, setShippingAddress] = useState('')
  const [customerNotes, setCustomerNotes] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    async function loadItem() {
      try {
        setLoading(true)
        setError(null)
        const res = await apiClient.getCatalogDetail(catalogItemId || '')
        setCatalogItem(res.data)
      } catch (e: any) {
        try {
          const listRes = await apiClient.getCatalog()
          const items = listRes.data || []
          const found = items.find((i: any) => i.id === catalogItemId || i.slug === catalogItemId)
          if (found) {
            setCatalogItem(found)
          } else {
            setError('Produk tidak ditemukan atau belum dipublikasikan.')
          }
        } catch (err: any) {
          setError(e.message || 'Gagal memuat detail produk untuk checkout')
        }
      } finally {
        setLoading(false)
      }
    }
    if (catalogItemId) loadItem()
  }, [catalogItemId])

  useEffect(() => {
    if (isAuthenticated) {
      apiClient.getCustomerProfile().then(res => {
        if (res.data?.profile?.address) {
          setShippingAddress(res.data.profile.address)
        }
      }).catch(() => {})
    }
  }, [isAuthenticated])

  if (loading) return <LoadingSpinner message="Memuat detail checkout..." />
  if (error) return (
    <div style={{ padding: '3rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
      <Alert variant="error" message={error} />
      <Link to="/catalog" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Kembali ke Katalog</Link>
    </div>
  )
  if (!catalogItem) return null

  const unitPrice = catalogItem.price || 499000
  const depositUnit = catalogItem.depositAmount || 150000
  const subtotal = unitPrice * quantity
  const totalDeposit = depositUnit * quantity

  async function handleCreatePreorder(e: React.FormEvent) {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate(`/auth/customer/login?redirect=${encodeURIComponent('/checkout/' + catalogItemId)}`)
      return
    }
    if (!shippingAddress.trim() || shippingAddress.length < 5) {
      setFormError('Alamat pengiriman wajib diisi minimal 5 karakter.')
      return
    }
    if (!acceptedTerms) {
      setFormError('Anda wajib menyetujui ketentuan pre-order.')
      return
    }

    try {
      setSubmitting(true)
      setFormError(null)
      const res = await apiClient.createCustomerOrder({
        catalogItemId: catalogItem.id,
        quantity,
        shippingAddress,
        customerNotes
      })

      const newOrder = res.data
      navigate(`/account/orders/${newOrder.id}`)
    } catch (e: any) {
      setFormError(e.message || 'Gagal membuat pre-order')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding: '2.5rem 1rem 4rem' }}>
      <div className="container" style={{ maxWidth: '960px', margin: '0 auto' }}>
        <button onClick={() => navigate('/catalog')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Kembali ke Katalog
        </button>

        <h1 style={{ color: '#FFF', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Pre-Order Produk Upcycle</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Tinjau ringkasan tagihan server-authoritative dan isi alamat pengiriman</p>

        {!isAuthenticated && (
          <Alert variant="warning" title="Belum Masuk Akun">
            Anda harus masuk atau mendaftar akun pelanggan untuk menyelesaikan pre-order ini.{' '}
            <Link to={`/auth/customer/login?redirect=${encodeURIComponent('/checkout/' + catalogItemId)}`} style={{ fontWeight: 700, color: 'var(--color-warning)' }}>
              Masuk / Daftar Sekarang →
            </Link>
          </Alert>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card style={{ padding: '1.5rem' }}>
              <h3 style={{ color: '#FFF', fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>1. Item Pesanan</h3>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {catalogItem.product?.primaryImageUrl && (
                  <img src={catalogItem.product.primaryImageUrl} alt={catalogItem.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', background: 'var(--color-surface-2)' }} />
                )}
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: '#FFF', margin: '0 0 0.25rem', fontSize: '1rem' }}>{catalogItem.title || catalogItem.product?.name}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Kode DPP: {catalogItem.product?.productCode || '-'}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 700, marginTop: '0.25rem' }}>
                    Rp {unitPrice.toLocaleString('id-ID')} / unit
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Jumlah</label>
                  <input
                    type="number"
                    min={1}
                    max={catalogItem.stock || 5}
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{ width: '60px', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: '#FFF', textAlign: 'center' }}
                  />
                </div>
              </div>
            </Card>

            <Card style={{ padding: '1.5rem' }}>
              <h3 style={{ color: '#FFF', fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>2. Alamat Pengiriman</h3>
              {formError && <Alert variant="error" message={formError} />}
              <form onSubmit={handleCreatePreorder}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Alamat Lengkap *</label>
                  <textarea
                    required
                    rows={3}
                    value={shippingAddress}
                    onChange={e => setShippingAddress(e.target.value)}
                    placeholder="Jl. Raya No. 45, RT 01/RW 02, Kelurahan, Kecamatan, Kota/Kabupaten, Kode Pos..."
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: '#FFF', fontSize: '0.875rem', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Catatan untuk Tim Produksi (Opsional)</label>
                  <input
                    type="text"
                    value={customerNotes}
                    onChange={e => setCustomerNotes(e.target.value)}
                    placeholder="e.g. Ukuran disesuaikan sedikit lebih longgar..."
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: '#FFF', fontSize: '0.875rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ padding: '0.85rem', background: 'var(--color-surface-2)', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} style={{ marginTop: '2px' }} />
                    <span>Saya memahami bahwa pre-order membutuhkan pembayaran deposit dan bukti pembayaran harus diverifikasi manual oleh Admin EcoThread sebelum pesanan diproses.</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !isAuthenticated}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
                >
                  {submitting ? 'Membuat Pesanan...' : 'Konfirmasi & Buat Pre-Order'}
                </button>
              </form>
            </Card>
          </div>

          <Card style={{ padding: '1.5rem', position: 'sticky', top: '1.5rem' }}>
            <h3 style={{ color: 'var(--color-primary)', fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Ringkasan Rincian Tagihan</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Harga Unit</span>
                <span style={{ color: '#FFF' }}>Rp {unitPrice.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Jumlah</span>
                <span style={{ color: '#FFF' }}>{quantity} item</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span style={{ color: '#FFF' }}>Total Tagihan Akhir</span>
                <span style={{ color: '#FFF' }}>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div style={{ background: 'rgba(16,185,129,0.1)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--color-success)', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Deposit Wajib Pertama (DP):</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-success)' }}>Rp {totalDeposit.toLocaleString('id-ID')}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: '0.25rem' }}>Jumlah ini yang harus Anda transfer dan unggah buktinya setelah pesanan dibuat.</div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={16} color="var(--color-primary)" /> Data Harga Terverifikasi Server
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Truck size={16} color="var(--color-primary)" /> Estimasi Pengerjaan: 5 - 7 Hari
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
