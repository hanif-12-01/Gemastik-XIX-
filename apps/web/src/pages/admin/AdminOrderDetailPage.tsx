import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Alert } from '../../components/feedback/Alert'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { ArrowLeft, FileCheck, Layers, Scissors, UserCheck, ShieldAlert, Clock } from 'lucide-react'

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDetail() {
      if (!id) return
      try {
        setLoading(true)
        const data = await apiClient.getAdminProductionOrder(id)
        setOrder(data)
      } catch (err: any) {
        setError(err.message || 'Gagal memuat detail Production Order.')
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [id])

  if (loading) {
    return <LoadingSpinner message="Memuat detail Production Order..." />
  }

  if (error || !order) {
    return (
      <div style={{ padding: '2rem 1.5rem' }}>
        <Alert type="danger" title="Order Tidak Ditemukan">{error || 'Detail order tidak dapat ditemukan.'}</Alert>
        <Link to="/admin/orders" className="btn btn-secondary">
          <ArrowLeft size={16} /> Kembali ke Production Orders
        </Link>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/admin/orders" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
          <ArrowLeft size={16} /> Kembali ke Daftar Production Orders
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <h1 style={{ fontSize: '2rem', color: '#FFF', margin: 0 }}>{order.orderCode}</h1>
            <Badge variant="warning">{order.status}</Badge>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Dibuat pada: {new Date(order.createdAt).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Order Info & Mitra */}
        <Card>
          <h2 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            Informasi Penugasan Mitra
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>Mitra Penjahit: </span>
              {order.mitraUser ? (
                <strong style={{ color: 'var(--color-primary)' }}>{order.mitraUser.mitraProfile?.workshopName || order.mitraUser.name} ({order.mitraUser.email})</strong>
              ) : (
                <span style={{ color: 'var(--color-status-danger)' }}>Belum ditugaskan</span>
              )}
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>Tarif Payout Disetujui: </span>
              <strong style={{ color: '#FFF' }}>Rp {order.agreedPayoutRate?.toLocaleString('id-ID')}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>Prioritas: </span>
              <strong style={{ color: 'var(--color-warning)' }}>{order.priority?.toUpperCase()}</strong>
            </div>
          </div>
        </Card>

        {/* Eco-Kit & Material Specs */}
        <Card>
          <h2 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            Spesifikasi Eco-Kit & Material
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>Nama Paket: </span>
              <strong style={{ color: '#FFF' }}>{order.ecoKit?.name}</strong> (<code>{order.ecoKit?.kitCode}</code>)
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>Pola Terverifikasi: </span>
              <strong style={{ color: '#FFF' }}>{order.ecoKit?.pattern?.name}</strong>
            </div>

            <div style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
              <div style={{ color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Bahan Limbah Tekstil Teralokasi:</div>
              {order.ecoKit?.ecoKitItems?.map((item: any) => (
                <div key={item.id} style={{ color: '#FFF', fontSize: '0.85rem' }}>
                  &bull; {item.batch?.materialType} - {item.quantity} {item.unit} ({item.batch?.color})
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Progress & Issues Timeline */}
      <div style={{ marginTop: '2rem' }}>
        <Card>
          <h2 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            Riwayat Progres & Kendala Lapangan
          </h2>

          {order.productionProgress?.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Belum ada pembaharuan progres dari Mitra.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {order.productionProgress?.map((p: any) => (
                <div key={p.id} style={{ padding: '0.75rem', backgroundColor: '#0F172A', borderRadius: '0.375rem', borderLeft: '3px solid var(--color-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: '#FFF' }}>{p.stepName} ({p.percentage}%)</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>{new Date(p.updatedAt).toLocaleString('id-ID')}</span>
                  </div>
                  {p.notes && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px', margin: 0 }}>{p.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
