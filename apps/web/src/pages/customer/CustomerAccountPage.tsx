import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { useAuth } from '../../features/auth/AuthContext'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { Alert } from '../../components/feedback/Alert'
import { User, ShoppingBag, LogOut } from 'lucide-react'

export const CustomerAccountPage: React.FC = () => {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [profRes, ordRes] = await Promise.all([
          apiClient.getCustomerProfile(),
          apiClient.getMyCustomerOrders()
        ])
        setProfile(profRes.data)
        setOrders(ordRes.data || [])
      } catch (e: any) {
        setError(e.message || 'Gagal memuat profil pelanggan')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return <LoadingSpinner message="Memuat akun Anda..." />

  const pendingPaymentOrders = orders.filter(o => o.status === 'pending_payment' || o.status === 'payment_rejected')
  const verifiedOrders = orders.filter(o => o.status === 'payment_verified' || o.status === 'processing')

  return (
    <div style={{ padding: '2.5rem 1rem 4rem' }}>
      <div className="container" style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600, textTransform: 'uppercase' }}>Portal Pelanggan</span>
            <h1 style={{ color: '#FFF', fontSize: '1.75rem', margin: 0 }}>Halo, {user?.name || 'Pelanggan'} 👋</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/account/profile" className="btn" style={{ background: 'var(--color-surface-2)', color: '#FFF', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
              Edit Profil
            </Link>
            <button onClick={logout} className="btn" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid #EF4444', fontSize: '0.85rem' }}>
              <LogOut size={14} style={{ marginRight: '4px' }} /> Keluar
            </button>
          </div>
        </div>

        {error && <Alert variant="error" message={error} />}

        {pendingPaymentOrders.length > 0 && (
          <Alert variant="warning" title="Perhatian Pembayaran">
            Anda memiliki <strong>{pendingPaymentOrders.length} pesanan</strong> yang membutuhkan unggah atau perbaikan bukti pembayaran.
            <div style={{ marginTop: '0.5rem' }}>
              <Link to={'/account/orders/' + pendingPaymentOrders[0].id} style={{ color: 'var(--color-warning)', fontWeight: 700 }}>
                Upload Bukti Pembayaran Sekarang →
              </Link>
            </div>
          </Alert>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <Card style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Total Pre-Order</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFF', marginTop: '0.25rem' }}>{orders.length}</div>
          </Card>
          <Card style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Pesanan Terverifikasi</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '0.25rem' }}>{verifiedOrders.length}</div>
          </Card>
          <Card style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Menunggu Verifikasi/Bayar</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-warning)', marginTop: '0.25rem' }}>{pendingPaymentOrders.length}</div>
          </Card>
        </div>

        <Card style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="var(--color-primary)" />
              <h3 style={{ color: '#FFF', margin: 0, fontSize: '1rem' }}>Informasi Akun</h3>
            </div>
            <Link to="/account/profile" style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>Kelola Profil</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
            <div><span style={{ color: 'var(--color-text-muted)' }}>Nama</span><br /><strong style={{ color: '#FFF' }}>{user?.name}</strong></div>
            <div><span style={{ color: 'var(--color-text-muted)' }}>Email</span><br /><strong style={{ color: '#FFF' }}>{user?.email}</strong></div>
            <div><span style={{ color: 'var(--color-text-muted)' }}>Telepon</span><br /><strong style={{ color: '#FFF' }}>{profile?.profile?.phone || '-'}</strong></div>
            <div><span style={{ color: 'var(--color-text-muted)' }}>Alamat Pengiriman</span><br /><strong style={{ color: '#FFF' }}>{profile?.profile?.address || '-'}</strong></div>
          </div>
        </Card>

        <Card style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={18} color="var(--color-primary)" />
              <h3 style={{ color: '#FFF', margin: 0, fontSize: '1rem' }}>Riwayat Pre-Order Terakhir</h3>
            </div>
            <Link to="/account/orders" style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>Lihat Semua Pesanan</Link>
          </div>

          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-muted)' }}>
              <p style={{ margin: '0 0 1rem' }}>Anda belum memiliki pesanan.</p>
              <Link to="/catalog" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>Lihat Katalog Produk</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {orders.slice(0, 3).map((order: any) => {
                const item = order.customerOrderItems?.[0]
                return (
                  <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem', borderRadius: '8px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.9rem' }}>{order.orderCode}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {item?.catalogItem?.product?.name || item?.catalogItem?.title || 'Produk Upcycle'} (x{item?.quantity || 1})
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.9rem' }}>Rp {order.totalAmount?.toLocaleString('id-ID')}</div>
                        <Badge variant={order.status === 'payment_verified' ? 'success' : order.status === 'payment_rejected' ? 'danger' : 'warning'}>
                          {order.status.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <Link to={'/account/orders/' + order.id} className="btn btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                        Detail
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
