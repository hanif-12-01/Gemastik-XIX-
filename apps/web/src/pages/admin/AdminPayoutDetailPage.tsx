import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { Alert } from '../../components/feedback/Alert'
import { ArrowLeft, CreditCard } from 'lucide-react'

export const AdminPayoutDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [payout, setPayout] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ paymentReference: '', paymentMethod: 'bank_transfer', notes: '' })
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function load() {
    try {
      setLoading(true)
      setError(null)
      const res = await apiClient.get('/admin/payouts/' + id)
      setPayout(res.data)
    } catch (e: any) { setError(e.message || 'Gagal memuat payout') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [id])

  async function handleMarkPaid(e: React.FormEvent) {
    e.preventDefault()
    if (!form.paymentReference.trim()) { setFormError('Referensi pembayaran wajib diisi.'); return }
    try {
      setSubmitting(true)
      setFormError(null)
      await apiClient.post('/admin/payouts/' + id + '/mark-paid', form)
      setSuccess('Pembayaran berhasil dicatat.')
      await load()
    } catch (e: any) { setFormError(e.message || 'Gagal mencatat pembayaran') }
    finally { setSubmitting(false) }
  }

  if (loading) return <LoadingSpinner message="Memuat detail payout..." />
  if (error) return <Alert variant="error" message={error} onRetry={load} />
  if (!payout) return null

  const isPaid = payout.status === 'paid'

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/admin/payouts')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={16} />Kembali
        </button>
        <h1 style={{ fontSize: '1.5rem', color: '#FFF', margin: 0 }}>Payout: {payout.payoutCode || payout.id.substring(0, 8)}</h1>
        <Badge variant={isPaid ? 'success' : 'warning'}>{isPaid ? 'Dibayar' : 'Menunggu Pembayaran'}</Badge>
      </div>

      {success && <Alert variant="success" message={success} />}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card style={{ padding: '1.25rem' }}>
            <h3 style={{ color: 'var(--color-primary)', fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Detail Payout</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1.5rem', fontSize: '0.85rem' }}>
              <div><span style={{ color: 'var(--color-text-muted)' }}>Kode Payout</span><br /><strong style={{ color: '#FFF' }}>{payout.payoutCode || '-'}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)' }}>Jumlah</span><br /><strong style={{ color: 'var(--color-success)', fontSize: '1.1rem' }}>Rp {payout.amount.toLocaleString('id-ID')}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)' }}>Order</span><br /><strong style={{ color: '#FFF' }}>{payout.order?.orderCode}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)' }}>Mitra</span><br /><strong style={{ color: '#FFF' }}>{payout.mitraUser?.mitraProfile?.workshopName || payout.mitraUser?.name || '-'}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)' }}>Eligible Sejak</span><br /><strong style={{ color: '#FFF' }}>{payout.eligibleAt ? new Date(payout.eligibleAt).toLocaleDateString('id-ID') : '-'}</strong></div>
              {isPaid && (
                <>
                  <div><span style={{ color: 'var(--color-text-muted)' }}>Dibayar Pada</span><br /><strong style={{ color: 'var(--color-success)' }}>{new Date(payout.paidAt).toLocaleDateString('id-ID')}</strong></div>
                  <div><span style={{ color: 'var(--color-text-muted)' }}>Referensi</span><br /><strong style={{ color: '#FFF' }}>{payout.paymentReference}</strong></div>
                  <div><span style={{ color: 'var(--color-text-muted)' }}>Metode</span><br /><strong style={{ color: '#FFF' }}>{payout.paymentMethod}</strong></div>
                </>
              )}
            </div>
            {payout.notes && <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--color-surface-2)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--color-text-dim)' }}>Catatan: {payout.notes}</div>}
          </Card>

          <Card style={{ padding: '1.25rem' }}>
            <h3 style={{ color: 'var(--color-primary)', fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Detail Order</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem', fontSize: '0.85rem' }}>
              <div><span style={{ color: 'var(--color-text-muted)' }}>Eco-Kit</span><br /><strong style={{ color: '#FFF' }}>{payout.order?.ecoKit?.name || '-'}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)' }}>Pola</span><br /><strong style={{ color: '#FFF' }}>{payout.order?.ecoKit?.pattern?.name || '-'}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)' }}>QC Review Terakhir</span><br /><strong style={{ color: payout.order?.qcReviews?.[0]?.isApproved ? 'var(--color-success)' : 'var(--color-text-dim)' }}>{payout.order?.qcReviews?.[0]?.decision?.toUpperCase() || '-'}</strong></div>
            </div>
          </Card>
        </div>

        {!isPaid ? (
          <Card style={{ padding: '1.5rem', position: 'sticky', top: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <CreditCard size={20} color="var(--color-primary)" />
              <h3 style={{ color: '#FFF', margin: 0, fontSize: '1rem' }}>Rekam Pembayaran</h3>
            </div>
            <div style={{ background: 'var(--color-surface-2)', borderRadius: '8px', padding: '0.75rem', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              ⚠️ Aksi ini mencatat bahwa pembayaran eksternal telah terjadi.
            </div>
            {formError && <Alert variant="error" message={formError} />}
            <form onSubmit={handleMarkPaid}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Referensi Pembayaran *</label>
                <input type="text" value={form.paymentReference} onChange={e => setForm(f => ({ ...f, paymentReference: e.target.value }))}
                  placeholder="e.g. TRF-20260728-001"
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: '#FFF', fontSize: '0.875rem', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Metode Pembayaran</label>
                <select value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: '#FFF', fontSize: '0.875rem' }}>
                  <option value="bank_transfer">Transfer Bank</option>
                  <option value="cash">Tunai</option>
                  <option value="ewallet">E-Wallet</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Catatan (Opsional)</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: '#FFF', fontSize: '0.85rem', resize: 'vertical', boxSizing: 'border-box' }}
                  placeholder="Catatan opsional..." />
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(16,185,129,0.1)', borderRadius: '8px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Jumlah yang direkam:</span>
                <strong style={{ color: 'var(--color-success)' }}>Rp {payout.amount.toLocaleString('id-ID')}</strong>
              </div>
              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                {submitting ? 'Merekam...' : 'Rekam Pembayaran'}
              </button>
            </form>
          </Card>
        ) : (
          <Card style={{ padding: '1.5rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
              <h3 style={{ color: 'var(--color-success)', margin: '0 0 0.5rem' }}>Pembayaran Telah Dicatat</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Ref: {payout.paymentReference}</p>
              <p style={{ color: 'var(--color-text-dim)', fontSize: '0.8rem' }}>{new Date(payout.paidAt).toLocaleString('id-ID')}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
