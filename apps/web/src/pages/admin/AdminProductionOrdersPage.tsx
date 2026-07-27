import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Alert } from '../../components/feedback/Alert'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { Plus, ArrowLeft, FileCheck, UserPlus, Eye } from 'lucide-react'

export const AdminProductionOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([])
  const [kits, setKits] = useState<any[]>([])
  const [assignableMitras, setAssignableMitras] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  // Create Order Form
  const [ecoKitId, setEcoKitId] = useState('')
  const [selectedMitraId, setSelectedMitraId] = useState('')
  const [agreedPayoutRate, setAgreedPayoutRate] = useState<number>(175000)
  const [priority, setPriority] = useState('normal')
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [orderData, kitData, mitraData] = await Promise.all([
        apiClient.listAdminProductionOrders(),
        apiClient.listEcoKits(),
        apiClient.getAssignableMitra()
      ])
      setOrders(orderData)
      setKits(kitData)
      setAssignableMitras(mitraData)
      if (kitData.length > 0) setEcoKitId(kitData[0].id)
      if (mitraData.length > 0) setSelectedMitraId(mitraData[0].user?.id || '')
    } catch (err: any) {
      setError(err.message || 'Gagal memuat daftar Production Order.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await apiClient.createProductionOrder({
        ecoKitId,
        mitraUserId: selectedMitraId || undefined,
        agreedPayoutRate: Number(agreedPayoutRate),
        priority
      })
      setShowCreateModal(false)
      await fetchData()
    } catch (err: any) {
      setError(err.message || 'Gagal membuat Production Order.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAssignOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrderId || !selectedMitraId) return

    try {
      setSubmitting(true)
      await apiClient.assignOrder(selectedOrderId, selectedMitraId)
      setShowAssignModal(false)
      setSelectedOrderId(null)
      await fetchData()
    } catch (err: any) {
      setError(err.message || 'Gagal menugaskan order ke Mitra.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/admin" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
          <ArrowLeft size={16} /> Kembali ke Dashboard Admin
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Badge variant="warning" className="mb-2">Manajemen Work Order</Badge>
          <h1 style={{ fontSize: '1.75rem', color: '#FFF' }}>Production Orders & Penugasan Mitra</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Buat order produksi dan tugaskan secara eksplisit ke Mitra Penjahit terverifikasi.
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} variant="primary">
          <Plus size={16} /> Buat Production Order Baru
        </Button>
      </div>

      {error && <Alert type="danger" title="Error">{error}</Alert>}

      {loading ? (
        <LoadingSpinner message="Memuat daftar Production Order..." />
      ) : orders.length === 0 ? (
        <EmptyState title="Belum Ada Production Order" description="Buat Production Order pertama Anda dari Eco-Kit yang tersedia." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((o) => (
            <Card key={o.id} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <FileCheck color="var(--color-primary)" size={20} />
                    <h3 style={{ fontSize: '1.2rem', color: '#FFF', margin: 0 }}>{o.orderCode}</h3>
                    <Badge variant={o.status === 'offered' ? 'warning' : o.status === 'accepted' ? 'info' : 'success'}>
                      {o.status}
                    </Badge>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                    Eco-Kit: <strong>{o.ecoKit?.name}</strong> &bull; Estimasi Payout: <strong>Rp {o.agreedPayoutRate?.toLocaleString('id-ID')}</strong>
                  </p>

                  <div style={{ fontSize: '0.825rem', color: 'var(--color-text-dim)' }}>
                    {o.mitraUser ? (
                      <span>Ditugaskan ke: <strong style={{ color: 'var(--color-primary)' }}>{o.mitraUser.mitraProfile?.workshopName || o.mitraUser.name}</strong></span>
                    ) : (
                      <span style={{ color: 'var(--color-status-danger)' }}>Belum ada Mitra terikat</span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!o.mitraUserId && (
                    <Button
                      onClick={() => {
                        setSelectedOrderId(o.id)
                        setShowAssignModal(true)
                      }}
                      variant="primary"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      <UserPlus size={14} /> Tugaskan Mitra
                    </Button>
                  )}
                  <Link to={`/admin/orders/${o.id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                    <Eye size={14} /> Detail Order
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Order Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <Card style={{ maxWidth: '520px', width: '100%', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '1rem' }}>Buat Production Order Baru</h2>
            <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Pilih Eco-Kit *</label>
                <select
                  value={ecoKitId}
                  onChange={(e) => setEcoKitId(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.375rem', backgroundColor: '#0F172A', border: '1px solid var(--color-border)', color: '#FFF' }}
                  required
                >
                  {kits.map((k) => (
                    <option key={k.id} value={k.id}>{k.name} ({k.kitCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Tugaskan ke Mitra (Opsional)</label>
                <select
                  value={selectedMitraId}
                  onChange={(e) => setSelectedMitraId(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.375rem', backgroundColor: '#0F172A', border: '1px solid var(--color-border)', color: '#FFF' }}
                >
                  <option value="">-- Draf (Belum Ditugaskan) --</option>
                  {assignableMitras.map((m) => (
                    <option key={m.user?.id} value={m.user?.id}>{m.workshopName} - {m.location} ({m.user?.name})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Tarif Payout (Rp) *</label>
                  <Input type="number" value={agreedPayoutRate} onChange={(e) => setAgreedPayoutRate(Number(e.target.value))} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Prioritas Order</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '0.375rem', backgroundColor: '#0F172A', border: '1px solid var(--color-border)', color: '#FFF' }}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <Button type="button" onClick={() => setShowCreateModal(false)} variant="secondary" style={{ flex: 1 }}>Batal</Button>
                <Button type="submit" variant="primary" disabled={submitting} style={{ flex: 1 }}>{submitting ? 'Membuat...' : 'Buat Order'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <Card style={{ maxWidth: '460px', width: '100%', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '1rem' }}>Pilih Mitra Terverifikasi</h2>
            <form onSubmit={handleAssignOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Mitra Terverifikasi (Status Approved) *</label>
                <select
                  value={selectedMitraId}
                  onChange={(e) => setSelectedMitraId(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.375rem', backgroundColor: '#0F172A', border: '1px solid var(--color-border)', color: '#FFF' }}
                  required
                >
                  {assignableMitras.map((m) => (
                    <option key={m.user?.id} value={m.user?.id}>{m.workshopName} - {m.location} ({m.capacityPerWeek} pcs/mg)</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <Button type="button" onClick={() => setShowAssignModal(false)} variant="secondary" style={{ flex: 1 }}>Batal</Button>
                <Button type="submit" variant="primary" disabled={submitting} style={{ flex: 1 }}>{submitting ? 'Menugaskan...' : 'Tugaskan Order'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
