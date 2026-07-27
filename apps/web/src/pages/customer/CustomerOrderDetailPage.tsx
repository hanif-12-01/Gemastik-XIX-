import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { Alert } from '../../components/feedback/Alert'
import { ArrowLeft, Upload, CheckCircle2, AlertTriangle, Clock, ShieldCheck, FileText } from 'lucide-react'

export const CustomerOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [proofUrl, setProofUrl] = useState('')
  const [amount, setAmount] = useState<number>(0)
  const [submittingProof, setSubmittingProof] = useState(false)
  const [proofError, setProofError] = useState<string | null>(null)
  const [proofSuccess, setProofSuccess] = useState<string | null>(null)

  async function load() {
    try {
      setLoading(true); setError(null)
      const res = await apiClient.getCustomerOrderDetail(id || '')
      const data = res.data
      setOrder(data)
      setAmount(data.depositPaid || data.totalAmount || 0)
    } catch (e: any) {
      setError(e.message || "Gagal memuat detail pesanan")
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [id])

  if (loading) return <LoadingSpinner message="Memuat detail pesanan..." />
  if (error) return <Alert variant="error" message={error} onRetry={load} />
  if (!order) return null

  const item = order.customerOrderItems?.[0]
  const product = item?.catalogItem?.product
  const payments = order.payments || []
  const latestPayment = payments[0]

  const isPendingUpload = order.status === "pending_payment" || order.status === "payment_rejected"
  const isUnderReview = order.status === "payment_proof_submitted"
  const isVerified = order.status === "payment_verified" || order.status === "processing"

  async function handleUploadProof(e: React.FormEvent) {
    e.preventDefault()
    if (!proofUrl.trim()) {
      setProofError("Tautan atau referensi bukti pembayaran wajib diisi.")
      return
    }
    try {
      setSubmittingProof(true)
      setProofError(null)
      setProofSuccess(null)
      await apiClient.submitPaymentProof(order.id, {
        paymentProofUrl: proofUrl,
        amount: Number(amount)
      })
      setProofSuccess("Bukti pembayaran berhasil diunggah! Menunggu verifikasi Admin.")
      setProofUrl('')
      await load()
    } catch (e: any) {
      setProofError(e.message || "Gagal mengunggah bukti pembayaran")
    } finally {
      setSubmittingProof(false)
    }
  }

  return (
    <div style={{ padding: "2.5rem 1rem 4rem" }}>
      <div className="container" style={{ maxWidth: "960px", margin: "0 auto" }}>
        <button onClick={() => navigate("/account/orders")} style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          <ArrowLeft size={16} /> Kembali ke Daftar Pesanan
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--color-primary)", fontWeight: 600, textTransform: "uppercase" }}>Detail Pre-Order</span>
            <h1 style={{ color: "#FFF", fontSize: "1.75rem", margin: 0 }}>{order.orderCode}</h1>
          </div>
          <Badge variant={isVerified ? "success" : order.status === "payment_rejected" ? "danger" : "warning"}>
            {order.status.replace(/_/g, " ").toUpperCase()}
          </Badge>
        </div>

        {proofSuccess && <Alert variant="success" message={proofSuccess} />}
        {order.status === "payment_rejected" && latestPayment?.rejectionReason && (
          <Alert variant="error" title="Bukti Pembayaran Ditolak Admin">
            Alasan: <strong>{latestPayment.rejectionReason}</strong>. Silakan periksa kembali dan unggah bukti pembayaran yang valid.
          </Alert>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "1.5rem", alignItems: "start" }}>
          {/* Main Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Timeline */}
            <Card style={{ padding: "1.5rem" }}>
              <h3 style={{ color: "var(--color-primary)", fontSize: "0.9rem", marginBottom: "1.25rem", textTransform: "uppercase" }}>Status Workflow Pesanan</h3>
              <div style={{ display: "flex", justifyContent: "space-between", position: "relative", gap: "0.5rem" }}>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--color-success)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.4rem", fontWeight: 700 }}>1</div>
                  <span style={{ fontSize: "0.75rem", color: "#FFF" }}>Pre-Order Dibuat</span>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: isUnderReview || isVerified ? "var(--color-success)" : "var(--color-surface-2)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.4rem", fontWeight: 700 }}>2</div>
                  <span style={{ fontSize: "0.75rem", color: isUnderReview || isVerified ? "#FFF" : "var(--color-text-muted)" }}>Bukti Diunggah</span>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: isVerified ? "var(--color-success)" : "var(--color-surface-2)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.4rem", fontWeight: 700 }}>3</div>
                  <span style={{ fontSize: "0.75rem", color: isVerified ? "#FFF" : "var(--color-text-muted)" }}>Pembayaran Terverifikasi</span>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: order.status === "processing" || order.status === "completed" ? "var(--color-success)" : "var(--color-surface-2)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.4rem", fontWeight: 700 }}>4</div>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Produksi Upcycle</span>
                </div>
              </div>
            </Card>

            {/* Product Summary */}
            <Card style={{ padding: "1.5rem" }}>
              <h3 style={{ color: "#FFF", fontSize: "1rem", marginBottom: "1rem" }}>Rincian Produk</h3>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                {product?.primaryImageUrl && (
                  <img src={product.primaryImageUrl} alt={product.name} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", background: "var(--color-surface-2)" }} />
                )}
                <div>
                  <h4 style={{ color: "#FFF", margin: "0 0 0.25rem", fontSize: "1.1rem" }}>{product?.name || item?.catalogItem?.title}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Jumlah: {item?.quantity} unit</div>
                  {product?.dppRecord && (
                    <Link to={'/dpp/' + product.productCode} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--color-primary)', marginTop: '0.4rem' }}>
                      <FileText size={14} /> Lihat Digital Product Passport (DPP) →
                    </Link>
                  )}
                </div>
              </div>
            </Card>

            {/* Payment History */}
            <Card style={{ padding: "1.5rem" }}>
              <h3 style={{ color: "#FFF", fontSize: "1rem", marginBottom: "1rem" }}>Riwayat Upload Pembayaran</h3>
              {payments.length === 0 ? (
                <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Belum ada bukti pembayaran yang diunggah.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {payments.map((p: any) => (
                    <div key={p.id} style={{ padding: "0.85rem", background: "var(--color-surface-2)", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                        <span style={{ color: "#FFF", fontWeight: 700 }}>Nominal: Rp {p.amount?.toLocaleString("id-ID")}</span>
                        <Badge variant={p.isVerified ? "success" : p.rejectionReason ? "danger" : "warning"}>
                          {p.isVerified ? "Verifikasi Berhasil" : p.rejectionReason ? "Ditolak Admin" : "Menunggu Review"}
                        </Badge>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.25rem" }}>
                        Diunggah: {new Date(p.createdAt).toLocaleString("id-ID")}
                      </div>
                      {p.rejectionReason && (
                        <div style={{ fontSize: "0.8rem", color: "#EF4444", marginTop: "0.4rem" }}>
                          Alasan Penolakan: {p.rejectionReason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right Column Action */}
          <div>
            {isPendingUpload ? (
              <Card style={{ padding: "1.5rem", position: "sticky", top: "1.5rem" }}>
                <h3 style={{ color: "#FFF", fontSize: "1rem", marginBottom: "0.5rem" }}>Upload Bukti Pembayaran</h3>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.8rem", marginBottom: "1rem" }}>
                  Transfer sesuai deposit (Rp {order.depositPaid?.toLocaleString("id-ID")}) ke rekening bank resmi EcoThread dan lampirkan buktinya.
                </p>

                <div style={{ background: "var(--color-surface-2)", padding: "0.85rem", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.8rem" }}>
                  <div style={{ color: "var(--color-text-muted)" }}>Bank Tujuan Transfer:</div>
                  <strong style={{ color: "#FFF" }}>Bank Mandiri 137-00-1234567-8</strong>
                  <div style={{ color: "var(--color-text-dim)", marginTop: "0.25rem" }}>a.n. EcoThread Indonesia</div>
                </div>

                {proofError && <Alert variant="error" message={proofError} />}

                <form onSubmit={handleUploadProof}>
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>Tautan / Path File Bukti *</label>
                    <input
                      type="text"
                      required
                      value={proofUrl}
                      onChange={e => setProofUrl(e.target.value)}
                      placeholder="e.g. /uploads/proofs/bukti-transfer.jpg"
                      style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "#FFF", fontSize: "0.85rem", boxSizing: "border-box" }}
                    />
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>Nominal Yang Ditransfer (Rp) *</label>
                    <input
                      type="number"
                      required
                      value={amount}
                      onChange={e => setAmount(Number(e.target.value))}
                      style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "#FFF", fontSize: "0.85rem", boxSizing: "border-box" }}
                    />
                  </div>

                  <button type="submit" disabled={submittingProof} className="btn btn-primary" style={{ width: "100%", padding: "0.75rem", fontSize: "0.9rem" }}>
                    {submittingProof ? "Mengirim..." : "Kirim Bukti Pembayaran"}
                  </button>
                </form>
              </Card>
            ) : isUnderReview ? (
              <Card style={{ padding: "1.5rem", textAlign: "center" }}>
                <Clock size={36} color="var(--color-warning)" style={{ marginBottom: "0.75rem" }} />
                <h3 style={{ color: "#FFF", fontSize: "1.1rem", margin: "0 0 0.5rem" }}>Menunggu Verifikasi Admin</h3>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", margin: 0 }}>
                  Bukti pembayaran Anda sedang ditinjau oleh Admin EcoThread. Status akan otomatis diperbarui setelah diverifikasi.
                </p>
              </Card>
            ) : (
              <Card style={{ padding: "1.5rem", textAlign: "center" }}>
                <CheckCircle2 size={36} color="var(--color-success)" style={{ marginBottom: "0.75rem" }} />
                <h3 style={{ color: "var(--color-success)", fontSize: "1.1rem", margin: "0 0 0.5rem" }}>Pembayaran Terverifikasi</h3>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", margin: 0 }}>
                  Pembayaran deposit Anda telah disetujui. Pesanan kini memasuki tahap persiapan dan jadwal produksi mitra.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
