import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { apiClient } from "../../lib/api"
import { Card } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { LoadingSpinner } from "../../components/feedback/LoadingSpinner"
import { Alert } from "../../components/feedback/Alert"
import { ArrowLeft, CheckSquare, Square, XCircle, RotateCcw, CheckCircle } from "lucide-react"

const CHECKLIST_CATEGORIES = [
  { key: "A", label: "A. Identitas Produk", items: [
    { field: "checkOrderCode", label: "Kode order sesuai" },
    { field: "checkPatternMatch", label: "Pola garment sesuai" },
    { field: "checkQuantity", label: "Kuantitas sesuai" }
  ]},
  { key: "B", label: "B. Kualitas Konstruksi", items: [
    { field: "checkFront", label: "Foto depan bagus" },
    { field: "checkBack", label: "Foto belakang bagus" },
    { field: "checkStitching", label: "Jahitan rapi & konsisten" },
    { field: "checkSeamConsistency", label: "Konsistensi sambungan" },
    { field: "checkAttachmentStrength", label: "Kekuatan attachment" }
  ]},
  { key: "C", label: "C. Penggunaan Material", items: [
    { field: "checkMaterial", label: "Batch material sesuai" },
    { field: "checkNoSubstitution", label: "Tidak ada substitusi tidak sah" }
  ]},
  { key: "D", label: "D. Dimensi & Bentuk", items: [
    { field: "checkMeasures", label: "Ukuran dalam toleransi" },
    { field: "checkDimensions", label: "Bentuk sesuai pola" }
  ]},
  { key: "E", label: "E. Kebersihan", items: [
    { field: "checkCleanliness", label: "Produk bersih" },
    { field: "checkReadyForPhotography", label: "Siap difoto resmi" }
  ]},
  { key: "F", label: "F. Kelengkapan Bukti", items: [
    { field: "checkFrontPhoto", label: "Foto depan tersedia" },
    { field: "checkBackPhoto", label: "Foto belakang tersedia" },
    { field: "checkDetailPhoto", label: "Foto detail tersedia" }
  ]}
]

const defaultChecklist: Record<string, boolean> = {}
CHECKLIST_CATEGORIES.forEach(cat => cat.items.forEach(item => { defaultChecklist[item.field] = true }))

export const AdminQcDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ decision: "approved", decisionNotes: "", revisionInstructions: "", rejectionReason: "", ...defaultChecklist })
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function load() {
    try {
      setLoading(true)
      setError(null)
      const res = await apiClient.get(`/admin/qc/${id}`)
      setOrder(res.data)
    } catch (e: any) {
      setError(e.message || "Gagal memuat detail QC")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  async function handleDecision(e: React.FormEvent) {
    e.preventDefault()
    if (!form.decisionNotes.trim()) { setFormError("Catatan keputusan wajib diisi."); return }
    if (form.decision === "revision_required" && !form.revisionInstructions.trim()) { setFormError("Instruksi revisi wajib diisi."); return }
    if (form.decision === "rejected" && !form.rejectionReason.trim()) { setFormError("Alasan penolakan wajib diisi."); return }
    try {
      setSubmitting(true)
      setFormError(null)
      await apiClient.post(`/admin/qc/${id}/decision`, form)
      setSuccess(`Keputusan QC "${form.decision}" berhasil disimpan.`)
      await load()
    } catch (e: any) {
      setFormError(e.message || "Gagal menyimpan keputusan QC")
    } finally {
      setSubmitting(false)
    }
  }

  function toggle(field: string) { setForm(f => ({ ...f, [field]: !f[field as keyof typeof f] })) }

  if (loading) return <LoadingSpinner message="Memuat detail QC..." />
  if (error) return <Alert variant="error" message={error} onRetry={load} />
  if (!order) return null

  const latestEvidence = (order.productionEvidence || [])[0]
  const latestQcReview = (order.qcReviews || [])[0]
  const canDecide = ["submitted_to_qc", "qc_revision"].includes(order.status)

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <button onClick={() => navigate("/admin/qc")} style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <ArrowLeft size={16} />Kembali
        </button>
        <h1 style={{ fontSize: "1.5rem", color: "#FFF", margin: 0 }}>Review QC: {order.orderCode}</h1>
        <Badge variant={order.status === "qc_approved" ? "success" : order.status === "qc_revision" ? "danger" : "warning"}>
          {order.status.replace(/_/g, " ").toUpperCase()}
        </Badge>
      </div>

      {success && <Alert variant="success" message={success} />}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "1.5rem", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Order Identity */}
          <Card style={{ padding: "1.25rem" }}>
            <h3 style={{ color: "var(--color-primary)", fontSize: "0.9rem", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Identitas Order</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem 1.5rem", fontSize: "0.85rem" }}>
              <div><span style={{ color: "var(--color-text-muted)" }}>Order Code</span><br /><strong style={{ color: "#FFF" }}>{order.orderCode}</strong></div>
              <div><span style={{ color: "var(--color-text-muted)" }}>Eco-Kit</span><br /><strong style={{ color: "#FFF" }}>{order.ecoKit?.name}</strong></div>
              <div><span style={{ color: "var(--color-text-muted)" }}>Pola</span><br /><strong style={{ color: "#FFF" }}>{order.ecoKit?.pattern?.name || "-"}</strong></div>
              <div><span style={{ color: "var(--color-text-muted)" }}>Mitra</span><br /><strong style={{ color: "#FFF" }}>{order.mitraUser?.mitraProfile?.workshopName || order.mitraUser?.name}</strong></div>
            </div>
          </Card>

          {/* Evidence */}
          <Card style={{ padding: "1.25rem" }}>
            <h3 style={{ color: "var(--color-primary)", fontSize: "0.9rem", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Bukti Produksi</h3>
            {!latestEvidence ? (
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>Belum ada bukti yang diupload Mitra.</p>
            ) : (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                  {[{ label: "Depan", url: latestEvidence.frontPhoto }, { label: "Belakang", url: latestEvidence.backPhoto }, { label: "Detail", url: latestEvidence.detailPhoto }].map(img => (
                    <div key={img.label}>
                      <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>{img.label}</p>
                      <div style={{ background: "var(--color-surface-2)", borderRadius: "8px", height: "140px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px solid var(--color-border)" }}>
                        {img.url ? (
                          <a href={img.url} target="_blank" rel="noopener noreferrer">
                            <img src={img.url} alt={img.label} style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px" }} />
                          </a>
                        ) : <span style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>Tidak ada</span>}
                      </div>
                    </div>
                  ))}
                </div>
                {latestEvidence.notes && <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>Catatan Mitra: {latestEvidence.notes}</p>}
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-dim)" }}>Disubmit: {new Date(latestEvidence.submittedAt).toLocaleString("id-ID")}</p>
              </div>
            )}
          </Card>

          {/* Progress */}
          {order.productionProgress?.length > 0 && (
            <Card style={{ padding: "1.25rem" }}>
              <h3 style={{ color: "var(--color-primary)", fontSize: "0.9rem", marginBottom: "1rem", textTransform: "uppercase" }}>Progress Produksi</h3>
              {order.productionProgress.map((p: any) => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid var(--color-border)", fontSize: "0.85rem" }}>
                  <span style={{ color: "var(--color-text-dim)" }}>{p.stepName}</span>
                  <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>{p.percentage}%</span>
                </div>
              ))}
            </Card>
          )}

          {/* Previous QC Reviews */}
          {order.qcReviews?.length > 0 && (
            <Card style={{ padding: "1.25rem" }}>
              <h3 style={{ color: "var(--color-primary)", fontSize: "0.9rem", marginBottom: "1rem", textTransform: "uppercase" }}>Riwayat QC</h3>
              {order.qcReviews.map((review: any, i: number) => (
                <div key={review.id} style={{ padding: "0.75rem", background: "var(--color-surface-2)", borderRadius: "8px", marginBottom: "0.75rem", border: `1px solid ${review.isApproved ? "var(--color-success)" : "var(--color-danger)"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <Badge variant={review.decision === "approved" ? "success" : "danger"}>{review.decision?.replace(/_/g, " ").toUpperCase()}</Badge>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-dim)" }}>{new Date(review.reviewedAt).toLocaleDateString("id-ID")}</span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-dim)", margin: "0.25rem 0" }}>{review.decisionNotes}</p>
                  {review.revisionInstructions && <p style={{ fontSize: "0.8rem", color: "var(--color-warning)", margin: "0.25rem 0" }}>Instruksi: {review.revisionInstructions}</p>}
                  {review.rejectionReason && <p style={{ fontSize: "0.8rem", color: "var(--color-danger)", margin: "0.25rem 0" }}>Alasan: {review.rejectionReason}</p>}
                </div>
              ))}
            </Card>
          )}
        </div>

        {/* QC Decision Panel */}
        <div>
          {canDecide ? (
            <Card style={{ padding: "1.5rem", position: "sticky", top: "1rem" }}>
              <h3 style={{ color: "var(--color-primary)", fontSize: "0.9rem", marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Keputusan QC</h3>
              {formError && <Alert variant="error" message={formError} />}
              <form onSubmit={handleDecision}>
                {/* Checklist */}
                {CHECKLIST_CATEGORIES.map(cat => (
                  <div key={cat.key} style={{ marginBottom: "1rem" }}>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 700, marginBottom: "0.4rem", textTransform: "uppercase" }}>{cat.label}</p>
                    {cat.items.map(item => (
                      <label key={item.field} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", padding: "0.3rem 0", fontSize: "0.8rem", color: "var(--color-text-dim)" }}>
                        <button type="button" onClick={() => toggle(item.field)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: (form as any)[item.field] ? "var(--color-success)" : "var(--color-border)" }}>
                          {(form as any)[item.field] ? <CheckSquare size={16} /> : <Square size={16} />}
                        </button>
                        {item.label}
                      </label>
                    ))}
                  </div>
                ))}

                {/* Decision */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>Keputusan *</label>
                  <select value={form.decision} onChange={e => setForm(f => ({ ...f, decision: e.target.value }))}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "#FFF", fontSize: "0.875rem" }}>
                    <option value="approved">✅ Setujui QC</option>
                    <option value="revision_required">🔄 Minta Revisi</option>
                    <option value="rejected">❌ Tolak Submission</option>
                  </select>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>Catatan Keputusan *</label>
                  <textarea value={form.decisionNotes} onChange={e => setForm(f => ({ ...f, decisionNotes: e.target.value }))} rows={3}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "#FFF", fontSize: "0.85rem", resize: "vertical", boxSizing: "border-box" }}
                    placeholder="Catatan keputusan QC..." />
                </div>

                {form.decision === "revision_required" && (
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>Instruksi Revisi *</label>
                    <textarea value={form.revisionInstructions} onChange={e => setForm(f => ({ ...f, revisionInstructions: e.target.value }))} rows={3}
                      style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "#FFF", fontSize: "0.85rem", resize: "vertical", boxSizing: "border-box" }}
                      placeholder="Jelaskan apa yang harus diperbaiki Mitra..." />
                  </div>
                )}

                {form.decision === "rejected" && (
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>Alasan Penolakan *</label>
                    <textarea value={form.rejectionReason} onChange={e => setForm(f => ({ ...f, rejectionReason: e.target.value }))} rows={2}
                      style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "#FFF", fontSize: "0.85rem", resize: "vertical", boxSizing: "border-box" }}
                      placeholder="Alasan penolakan..." />
                  </div>
                )}

                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: "100%", padding: "0.75rem", fontSize: "0.9rem" }}>
                  {submitting ? "Menyimpan..." : form.decision === "approved" ? "✅ Setujui QC" : form.decision === "revision_required" ? "🔄 Minta Revisi" : "❌ Tolak Submission"}
                </button>
              </form>
            </Card>
          ) : (
            <Card style={{ padding: "1.25rem" }}>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", textAlign: "center" }}>
                {order.status === "qc_approved" ? "✅ QC sudah disetujui." : "Status order tidak memerlukan review QC saat ini."}
              </p>
              {order.status === "qc_approved" && (
                <div style={{ marginTop: "1rem" }}>
                  <p style={{ color: "var(--color-text-dim)", fontSize: "0.8rem", marginBottom: "0.75rem" }}>Langkah Selanjutnya:</p>
                  <a href={`/admin/products/new?orderId=${order.id}`} className="btn btn-primary" style={{ display: "block", textAlign: "center", padding: "0.6rem", fontSize: "0.85rem" }}>
                    + Buat Produk Final
                  </a>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
