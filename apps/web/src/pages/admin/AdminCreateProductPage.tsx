import React, { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { apiClient } from "../../lib/api"
import { Card } from "../../components/ui/Card"
import { LoadingSpinner } from "../../components/feedback/LoadingSpinner"
import { Alert } from "../../components/feedback/Alert"
import { ArrowLeft, Package } from "lucide-react"

export const AdminCreateProductPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const prefilledOrderId = searchParams.get("orderId") || ""
  const [approvedOrders, setApprovedOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [form, setForm] = useState({ productionOrderId: prefilledOrderId, name: "", shortDescription: "", description: "", size: "L", category: "Outerwear", beforeImageUrl: "", afterImageUrl: "" })

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await apiClient.get("/admin/production-orders")
        const eligible = (res.data || []).filter((o: any) =>
          ["qc_approved","payout_pending","paid","completed"].includes(o.status) && (!o.products || o.products.length === 0)
        )
        setApprovedOrders(eligible)
      } catch (e: any) { setError(e.message || "Gagal memuat order QC approved") }
      finally { setLoading(false) }
    }
    loadOrders()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.productionOrderId) { setFormError("Pilih production order terlebih dahulu."); return }
    if (!form.name.trim()) { setFormError("Nama produk wajib diisi."); return }
    if (!form.description.trim()) { setFormError("Deskripsi produk wajib diisi."); return }
    try {
      setSubmitting(true); setFormError(null)
      const res = await apiClient.post("/admin/products", form)
      navigate(`/admin/products/${res.data.id}`)
    } catch (e: any) { setFormError(e.message || "Gagal membuat produk") }
    finally { setSubmitting(false) }
  }

  if (loading) return <LoadingSpinner message="Memuat order yang tersedia..." />

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <button onClick={() => navigate("/admin/products")} style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <ArrowLeft size={16} />Kembali
        </button>
        <h1 style={{ fontSize: "1.5rem", color: "#FFF", margin: 0 }}>Buat Produk Final</h1>
      </div>

      {error && <Alert variant="error" message={error} />}

      <div style={{ maxWidth: "680px" }}>
        <Card style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <Package size={20} color="var(--color-primary)" />
            <h3 style={{ color: "#FFF", margin: 0 }}>Formulir Produk Baru</h3>
          </div>
          <div style={{ background: "var(--color-surface-2)", borderRadius: "8px", padding: "0.75rem", marginBottom: "1.25rem", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
            ℹ️ Hanya order dengan status QC Approved yang belum memiliki produk yang dapat dipilih.
          </div>
          {formError && <Alert variant="error" message={formError} />}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>Production Order *</label>
              <select value={form.productionOrderId} onChange={e => setForm(f => ({ ...f, productionOrderId: e.target.value }))}
                style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "#FFF", fontSize: "0.875rem" }}>
                <option value="">-- Pilih Order QC Approved --</option>
                {approvedOrders.map((o: any) => (
                  <option key={o.id} value={o.id}>{o.orderCode} — {o.ecoKit?.name} ({o.mitraUser?.mitraProfile?.workshopName || o.mitraUser?.name})</option>
                ))}
              </select>
              {approvedOrders.length === 0 && <p style={{ color: "var(--color-text-muted)", fontSize: "0.75rem", margin: "0.4rem 0 0" }}>Tidak ada order yang memenuhi syarat saat ini.</p>}
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>Nama Produk *</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Jaket Denim Upcycle Batch #1"
                style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "#FFF", fontSize: "0.875rem", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>Deskripsi Singkat</label>
              <input type="text" value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} placeholder="Max 200 karakter..."
                style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "#FFF", fontSize: "0.875rem", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>Deskripsi Lengkap *</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} placeholder="Cerita produk, metode, dampak..."
                style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "#FFF", fontSize: "0.875rem", resize: "vertical", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>Ukuran</label>
                <select value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "#FFF" }}>
                  {["XS","S","M","L","XL","XXL","Free Size"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>Kategori</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "#FFF" }}>
                  {["Outerwear","Tops","Bottoms","Accessories","Bags","Other"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>URL Foto Sebelum</label>
              <input type="text" value={form.beforeImageUrl} onChange={e => setForm(f => ({ ...f, beforeImageUrl: e.target.value }))} placeholder="https://..."
                style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "#FFF", fontSize: "0.875rem", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>URL Foto Sesudah</label>
              <input type="text" value={form.afterImageUrl} onChange={e => setForm(f => ({ ...f, afterImageUrl: e.target.value }))} placeholder="https://..."
                style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "#FFF", fontSize: "0.875rem", boxSizing: "border-box" }} />
            </div>
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: "0.75rem", fontSize: "0.95rem" }}>
              {submitting ? "Membuat Produk..." : "Buat Produk"}
            </button>
          </form>
        </Card>
      </div>
    </div>
  )
}
