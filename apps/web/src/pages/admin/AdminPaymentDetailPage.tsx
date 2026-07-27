import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { Alert } from '../../components/feedback/Alert'
import { ArrowLeft, CheckCircle2, XCircle, Shield, ExternalLink, FileText } from 'lucide-react'

export const AdminPaymentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [payment, setPayment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function load() {
    try {
      setLoading(true); setError(null)
      const res = await apiClient.getAdminPaymentDetail(id || '')
      setPayment(res.data)
    } catch (e: any) {
      setError(e.message || "Gagal memuat detail bukti pembayaran")
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [id])

  if (loading) return <LoadingSpinner message="Memuat bukti pembayaran..." />
  if (error) return <Alert variant="error" message={error} onRetry={load} />
  if (!payment) return null

  const order = payment.customerOrder
  const isVerified = payment.isVerified
  const isRejected = !isVerified && payment.rejectionReason

  async function handleVerify(approve: boolean) {
    if (!approve && !rejectionReason.trim()) {
      setActionError("Alasan penolakan wajib diisi untuk menolak bukti pembayaran.")
      return
    }
    try {
      setSubmitting(true)
      setActionError(null)
      setSuccess(null)
      await apiClient.verifyPayment(payment.id, {
        approve,
        decision: approve ? 'approved' : 'rejected',
        rejectionReason: approve ? undefined : rejectionReason,
        notes: approve ? 'Verifikasi sukses admin' : rejectionReason
      })
      setSuccess(approve ? "Pembayaran berhasil diverifikasi!" : "Pembayaran ditolak.")
      await load()
    } catch (e: any) {
      setActionError(e.message || "Gagal memproses verifikasi pembayaran")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <button onClick={() => navigate("/admin/payments")} style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <ArrowLeft size={16} /> Kembali ke Antrian
        </button>
        <h1 style={{ fontSize: "1.5rem", color: "#FFF", margin: 0 }}>Review Bukti Pembayaran: {order?.orderCode}</h1>
        <Badge variant={isVerified ? "success" : isRejected ? "danger" : "warning"}>
          {isVerified ? "Diverifikasi" : isRejected ? "Ditolak" : "Menunggu Review"}
        </Badge>
      </div>

      {success && <Alert variant="success" message={success} />}
      {actionError && <Alert variant="error" message={actionError} />}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "1.5rem", alignItems: "start" }}>
        {/* Left Column Proof Preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <Card style={{ padding: "1.5rem" }}>
            <h3 style={{ color: "var(--color-primary)", fontSize: "0.9rem", marginBottom: "1rem", textTransform: "uppercase" }}>Bukti Transfer Yang Diunggah</h3>
            <div style={{ padding: "1rem", background: "var(--color-surface-2)", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.85rem" }}>
              <div style={{ color: "var(--color-text-muted)" }}>Path / Tautan File:</div>
              <strong style={{ color: "#FFF", wordBreak: "break-all" }}>{payment.paymentProofUrl}</strong>
            </div>

            {/* Proof Image Preview */}
            <div style={{ borderRadius: "8px", overflow: "hidden", background: "#000", textAlign: "center", padding: "1rem", border: "1px solid var(--color-border)" }}>
              {payment.paymentProofUrl?.match(/\.(jpg|jpeg|png|webp)/i) || payment.paymentProofUrl?.startsWith('/') ? (
                <img src={payment.paymentProofUrl} alt="Bukti Transfer" style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }} onError={(e: any) => { e.target.style.display = 'none' }} />
              ) : null}
              <div style={{ marginTop: "0.75rem" }}>
                <a href={payment.paymentProofUrl} target="_blank" rel="noreferrer" style={{ color: "var(--color-primary)", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                  <ExternalLink size={14} /> Buka File Asli di Tab Baru
                </a>
              </div>
            </div>
          </Card>

          <Card style={{ padding: "1.5rem" }}>
            <h3 style={{ color: "var(--color-primary)", fontSize: "0.9rem", marginBottom: "1rem", textTransform: "uppercase" }}>Rincian Tagihan Server vs Transfer</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.85rem" }}>
              <div><span style={{ color: "var(--color-text-muted)" }}>Nominal Yang Diunggah</span><br /><strong style={{ color: "var(--color-success)", fontSize: "1.1rem" }}>Rp {payment.amount?.toLocaleString("id-ID")}</strong></div>
              <div><span style={{ color: "var(--color-text-muted)" }}>Deposit Wajib Server</span><br /><strong style={{ color: "#FFF", fontSize: "1.1rem" }}>Rp {order?.depositPaid?.toLocaleString("id-ID")}</strong></div>
              <div><span style={{ color: "var(--color-text-muted)" }}>Total Tagihan Order</span><br /><strong style={{ color: "#FFF" }}>Rp {order?.totalAmount?.toLocaleString("id-ID")}</strong></div>
              <div><span style={{ color: "var(--color-text-muted)" }}>Metode Pembayaran</span><br /><strong style={{ color: "#FFF" }}>{payment.paymentMethod || 'bank_transfer'}</strong></div>
            </div>
          </Card>
        </div>

        {/* Right Decision Panel */}
        <div>
          <Card style={{ padding: "1.5rem", position: "sticky", top: "1.5rem" }}>
            <h3 style={{ color: "#FFF", fontSize: "1rem", marginBottom: "1rem" }}>Keputusan Verifikasi Admin</h3>

            {isVerified ? (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <CheckCircle2 size={40} color="var(--color-success)" style={{ marginBottom: "0.5rem" }} />
                <h4 style={{ color: "var(--color-success)", margin: "0 0 0.5rem" }}>Pembayaran Terverifikasi</h4>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>Diverifikasi oleh Admin pada {payment.verifiedAt ? new Date(payment.verifiedAt).toLocaleString("id-ID") : '-'}</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <button onClick={() => handleVerify(true)} disabled={submitting} className="btn btn-primary" style={{ padding: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <CheckCircle2 size={16} /> {submitting ? "Memproses..." : "Setujui Pembayaran"}
                </button>

                <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}>
                  <label style={{ display: "block", color: "var(--color-text-muted)", fontSize: "0.8rem", marginBottom: "0.4rem" }}>Alasan Penolakan (Jika Menolak) *</label>
                  <textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    placeholder="e.g. Gambar bukti tidak terbaca, nominal transfer tidak sesuai..."
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "#FFF", fontSize: "0.85rem", resize: "vertical", boxSizing: "border-box" }}
                  />
                  <button onClick={() => handleVerify(false)} disabled={submitting} className="btn" style={{ width: "100%", padding: "0.65rem", marginTop: "0.5rem", background: "rgba(239,68,68,0.2)", color: "#EF4444", border: "1px solid #EF4444", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <XCircle size={16} /> {submitting ? "Memproses..." : "Tolak Pembayaran"}
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
