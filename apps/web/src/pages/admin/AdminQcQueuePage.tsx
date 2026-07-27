import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { apiClient } from "../../lib/api"
import { Card } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { LoadingSpinner } from "../../components/feedback/LoadingSpinner"
import { Alert } from "../../components/feedback/Alert"
import { EmptyState } from "../../components/ui/EmptyState"
import { ClipboardList, RotateCcw, Eye } from "lucide-react"

const statusConfig: Record<string, { label: string; color: "warning" | "success" | "danger" | "info" }> = {
  submitted_to_qc: { label: "Menunggu Review", color: "warning" },
  qc_revision: { label: "Revisi Diminta", color: "danger" },
  qc_approved: { label: "QC Disetujui", color: "success" }
}

export const AdminQcQueuePage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all")

  async function load() {
    try {
      setLoading(true)
      setError(null)
      const res = await apiClient.get("/admin/qc")
      setOrders(res.data || [])
    } catch (e: any) {
      setError(e.message || "Gagal memuat antrian QC")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = filter === "all" ? orders : orders.filter((o: any) => o.status === filter)

  return (
    <div>
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <ClipboardList size={28} color="var(--color-primary)" />
          <div>
            <h1 style={{ fontSize: "1.5rem", color: "#FFF", margin: 0 }}>Antrian QC</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", margin: 0 }}>Review bukti produksi Mitra dan buat keputusan QC</p>
          </div>
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "#FFF", fontSize: "0.875rem" }}>
          <option value="all">Semua Status</option>
          <option value="submitted_to_qc">Menunggu Review</option>
          <option value="qc_revision">Revisi Diminta</option>
          <option value="qc_approved">QC Disetujui</option>
        </select>
      </div>
      {error && <Alert variant="error" message={error} onRetry={load} />}
      {loading ? <LoadingSpinner message="Memuat antrian QC..." /> : filtered.length === 0 ? (
        <EmptyState title="Tidak Ada Item di Antrian QC" description="Belum ada order yang disubmit ke QC." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filtered.map((order: any) => {
            const latestEvidence = (order.productionEvidence || [])[0]
            const reviewCount = order.qcReviews?.length || 0
            const statusCfg = statusConfig[order.status] || { label: order.status, color: "info" as const }
            return (
              <Card key={order.id} style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, color: "#FFF", fontSize: "1rem" }}>{order.orderCode}</span>
                      <Badge variant={statusCfg.color}>{statusCfg.label}</Badge>
                      {reviewCount > 0 && <Badge variant="info"><RotateCcw size={11} style={{ marginRight: "3px" }} />{reviewCount}x review</Badge>}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.5rem 1.5rem", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                      <span><strong style={{ color: "var(--color-text-dim)" }}>Eco-Kit:</strong> {order.ecoKit?.name || "-"}</span>
                      <span><strong style={{ color: "var(--color-text-dim)" }}>Pola:</strong> {order.ecoKit?.pattern?.name || "-"}</span>
                      <span><strong style={{ color: "var(--color-text-dim)" }}>Mitra:</strong> {order.mitraUser?.mitraProfile?.workshopName || order.mitraUser?.name || "-"}</span>
                      <span><strong style={{ color: "var(--color-text-dim)" }}>Bukti:</strong> {latestEvidence ? <span style={{ color: "var(--color-success)" }}>✓ Ada</span> : <span style={{ color: "var(--color-danger)" }}>✗ Belum</span>}</span>
                      <span><strong style={{ color: "var(--color-text-dim)" }}>Diupdate:</strong> {new Date(order.updatedAt).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                  <Link to={`/admin/qc/${order.id}`} className="btn btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap" }}>
                    <Eye size={14} />Review QC
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
