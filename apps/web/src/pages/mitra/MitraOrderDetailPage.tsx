import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Alert } from '../../components/feedback/Alert'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { ArrowLeft, CheckCircle, XCircle, Upload, ShieldCheck, AlertTriangle } from 'lucide-react'

export const MitraOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Progress Form
  const [stepName, setStepName] = useState('Cutting & Sorting')
  const [percentage, setPercentage] = useState<number>(25)
  const [progressNotes, setProgressNotes] = useState('')
  const [progressSubmitting, setProgressSubmitting] = useState(false)

  // Issue Form
  const [issueType, setIssueType] = useState('material_shortage')
  const [severity, setSeverity] = useState('medium')
  const [issueDescription, setIssueDescription] = useState('')
  const [issueSubmitting, setIssueSubmitting] = useState(false)

  // QC Evidence Form
  const [frontPhoto, setFrontPhoto] = useState('https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600')
  const [backPhoto, setBackPhoto] = useState('https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600')
  const [detailPhoto, setDetailPhoto] = useState('https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600')
  const [qcNotes, setQcNotes] = useState('Jahitan rapi, sisa benang telah dibersihkan.')
  const [qcSubmitting, setQcSubmitting] = useState(false)

  // Reject Form
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  const fetchDetail = async () => {
    if (!id) return
    try {
      setLoading(true)
      const data = await apiClient.getMitraOrderDetail(id)
      setOrder(data)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat detail pesanan.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDetail()
  }, [id])

  const handleAccept = async () => {
    setError(null)
    setSuccessMessage(null)
    try {
      await apiClient.acceptOrder(id!)
      setSuccessMessage('Pesanan produksi berhasil diterima.')
      await fetchDetail()
    } catch (err: any) {
      setError(err.message || 'Gagal menerima pesanan.')
    }
  }

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    try {
      await apiClient.rejectOrder(id!, rejectionReason)
      setSuccessMessage('Pesanan ditolak.')
      setShowRejectForm(false)
      await fetchDetail()
    } catch (err: any) {
      setError(err.message || 'Gagal menolak pesanan.')
    }
  }

  const handleProgress = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    try {
      setProgressSubmitting(true)
      await apiClient.updateProgress(id!, {
        stepName,
        percentage: Number(percentage),
        notes: progressNotes
      })
      setSuccessMessage('Progress produksi berhasil diperbarui!')
      setProgressNotes('')
      await fetchDetail()
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui progress.')
    } finally {
      setProgressSubmitting(false)
    }
  }

  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    try {
      setIssueSubmitting(true)
      await apiClient.createProductionIssue(id!, {
        issueType,
        severity,
        description: issueDescription
      })
      setSuccessMessage('Kendala produksi berhasil dilaporkan ke Admin.')
      setIssueDescription('')
      await fetchDetail()
    } catch (err: any) {
      setError(err.message || 'Gagal melaporkan kendala.')
    } finally {
      setIssueSubmitting(false)
    }
  }

  const handleSubmitQc = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    try {
      setQcSubmitting(true)
      await apiClient.submitQcEvidence(id!, {
        frontPhoto,
        backPhoto,
        detailPhoto,
        notes: qcNotes
      })
      setSuccessMessage('Bukti QC berhasil dikirimkan ke Admin!')
      await fetchDetail()
    } catch (err: any) {
      setError(err.message || 'Gagal mengirimkan bukti QC.')
    } finally {
      setQcSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Memuat detail pesanan..." />
  }

  if (error || !order) {
    return (
      <div style={{ padding: '1.5rem 1rem' }}>
        <Alert type="danger" title="Pesanan Tidak Ditemukan">{error || 'Pesanan tidak ditemukan.'}</Alert>
        <Link to="/mitra/orders" className="btn btn-secondary">
          <ArrowLeft size={16} /> Kembali ke Pesanan
        </Link>
      </div>
    )
  }

  return (
    <div style={{ padding: '1.5rem 1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/mitra/orders" style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
          <ArrowLeft size={16} /> Kembali ke Pesanan Saya
        </Link>
      </div>

      {successMessage && <Alert type="success" title="Sukses">{successMessage}</Alert>}
      {error && <Alert type="danger" title="Error">{error}</Alert>}

      {/* Header Info */}
      <Card style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', color: '#FFF', margin: 0 }}>{order.orderCode}</h1>
            <p style={{ color: 'var(--color-warning)', fontSize: '0.9rem', marginTop: '2px', fontWeight: 600 }}>
              {order.ecoKit?.name}
            </p>
          </div>
          <Badge variant={order.status === 'offered' ? 'warning' : order.status === 'accepted' ? 'info' : 'success'}>
            {order.status}
          </Badge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          <div>Tarif Payout: <strong style={{ color: '#FFF' }}>Rp {order.agreedPayoutRate?.toLocaleString('id-ID')}</strong></div>
          <div>Pola: <strong style={{ color: '#FFF' }}>{order.ecoKit?.pattern?.name}</strong></div>
        </div>

        {/* Offered Actions */}
        {order.status === 'offered' && (
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
            <Button onClick={handleAccept} variant="primary" style={{ flex: 1 }}>
              <CheckCircle size={16} /> Terima Penugasan
            </Button>
            <Button onClick={() => setShowRejectForm(!showRejectForm)} variant="secondary" style={{ flex: 1, color: 'var(--color-status-danger)' }}>
              <XCircle size={16} /> Tolak Penugasan
            </Button>
          </div>
        )}

        {showRejectForm && (
          <form onSubmit={handleReject} style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Alasan Penolakan *</label>
            <Input value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Kapasitas jahit penuh" required />
            <Button type="submit" variant="secondary" style={{ width: '100%', marginTop: '0.75rem', color: 'var(--color-status-danger)' }}>
              Konfirmasi Tolak Order
            </Button>
          </form>
        )}
      </Card>

      {/* Progress & Submit QC Sections for Active Orders */}
      {['accepted', 'kit_received', 'in_progress', 'qc_revision'].includes(order.status) && (
        <>
          {/* Progress Update Form */}
          <Card style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '0.75rem' }}>Update Progress Jahit</h3>
            <form onSubmit={handleProgress} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Tahap Pengerjaan</label>
                <select
                  value={stepName}
                  onChange={(e) => setStepName(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.375rem', backgroundColor: '#0F172A', border: '1px solid var(--color-border)', color: '#FFF' }}
                >
                  <option value="Cutting & Sorting">Cutting & Sorting</option>
                  <option value="Sewing Body">Sewing Body Garment</option>
                  <option value="Finishing & Trimming">Finishing & Trimming</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Persentase Selesai (%)</label>
                <Input type="number" min={0} max={100} value={percentage} onChange={(e) => setPercentage(Number(e.target.value))} required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Catatan Progress</label>
                <Input value={progressNotes} onChange={(e) => setProgressNotes(e.target.value)} placeholder="Potongan kain denim telah disatukan" />
              </div>

              <Button type="submit" variant="primary" disabled={progressSubmitting} style={{ padding: '0.75rem' }}>
                {progressSubmitting ? 'Menyimpan...' : 'Simpan Progress'}
              </Button>
            </form>
          </Card>

          {/* Submit QC Evidence Form */}
          <Card style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '0.5rem' }}>Ajukan Bukti Quality Control (QC)</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Wajib melampirkan foto hasil jahit tampak depan, belakang, dan detail kelim.
            </p>

            <form onSubmit={handleSubmitQc} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>URL Foto Depan *</label>
                <Input value={frontPhoto} onChange={(e) => setFrontPhoto(e.target.value)} required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>URL Foto Belakang *</label>
                <Input value={backPhoto} onChange={(e) => setBackPhoto(e.target.value)} required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>URL Foto Detail Jahitan *</label>
                <Input value={detailPhoto} onChange={(e) => setDetailPhoto(e.target.value)} required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Catatan Hasil Jahit</label>
                <Input value={qcNotes} onChange={(e) => setQcNotes(e.target.value)} />
              </div>

              <Button type="submit" variant="primary" disabled={qcSubmitting} style={{ padding: '0.75rem' }}>
                <ShieldCheck size={16} /> {qcSubmitting ? 'Mengirim QC...' : 'Kirimkan Pengajuan QC'}
              </Button>
            </form>
          </Card>
        </>
      )}
    </div>
  )
}
