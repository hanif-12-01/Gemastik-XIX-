import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { apiClient } from "../../lib/api"
import { Card } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { LoadingSpinner } from "../../components/feedback/LoadingSpinner"
import { Alert } from "../../components/feedback/Alert"
import { EmptyState } from "../../components/ui/EmptyState"
import { Wallet, Eye } from "lucide-react"

const statusConfig: Record<string, { label: string; color: "warning" | "success" | "danger" | "info" }> = {
  pending: { label: "Menunggu", color: "warning" },
  approved: { label: "Disetujui", color: "info" },
  processing: { label: "Diproses", color: "info" },
  paid: { label: "Dibayar", color: "success" },
  failed: { label: "Gagal", color: "danger" },
  cancelled: { label: "Dibatalkan", color: "danger" }
}

export const AdminPayoutsPage: React.FC = () => {
  const [payouts, setPayouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      setLoading(true)
      setError(null)
      const res = await apiClient.get("/admin/payouts")
      setPayouts(res.data || [])
    } catch (e: any) { setError(e.message || "Gagal memuat payouts") }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const totalEligible = payouts.filter((p: any) => p.status === "pending").reduce((s: number, p: any) => s + p.amount, 0)
  const totalPaid = payouts.filter((p: any) => p.status === "paid").reduce((s: number, p: any) => s + p.amount, 0)

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
        <Wallet size={28} color="var(--color-primary)" />
        <div>
          <h1 style={{ fontSize: "1.5rem", color: "#FFF", margin: 0 }}>Manajemen Payout</h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", margin: 0 }}>Rekam pembayaran ke Mitra setelah QC disetujui</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <Card style={{ padding: "1.25rem" }}>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.75rem", margin: 0 }}>Total Menunggu</p>
          <p style={{ color: "var(--color-warning)", fontSize: "1.25rem", fontWeight: 800, margin: "0.25rem 0 0" }}>Rp {totalEligible.toLocaleString("id-ID")}</p>
        </Card>
        <Card style={{ padding: "1.25rem" }}>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.75rem", margin: 0 }}>Total Dibayarkan</p>
          <p style={{ color: "var(--color-success)", fontSize: "1.25rem", fontWeight: 800, margin: "0.25rem 0 0" }}>Rp {totalPaid.toLocaleString("id-ID")}</p>
        </Card>
        <Card style={{ padding: "1.25rem" }}>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.75rem", margin: 0 }}>Total Payout</p>
          <p style={{ color: "#FFF", fontSize: "1.25rem", fontWeight: 800, margin: "0.25rem 0 0" }}>{payouts.length}</p>
        </Card>
      </div>

      {error && <Alert variant="error" message={error} onRetry={load} />}
      {loading ? <LoadingSpinner message="Memuat daftar payout..." /> : payouts.length === 0 ? (
        <EmptyState title="Belum Ada Payout" description="Payout akan muncul setelah QC disetujui." />
      ) : (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ background: "var(--color-surface-2)" }}>
                  {["Kode Payout", "Order", "Mitra", "Jumlah", "Status", "Eligible", "Dibayar", "Aksi"].map(h => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: "var(--color-text-muted)", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payouts.map((p: any, i: number) => {
                  const cfg = statusConfig[p.status] || { label: p.status, color: "info" as const }
                  return (
                    <tr key={p.id} style={{ borderTop: "1px solid var(--color-border)", background: i % 2 === 0 ? "transparent" : "var(--color-surface-2)" }}>
                      <td style={{ padding: "0.75rem 1rem", color: "var(--color-primary)", fontWeight: 600 }}>{p.payoutCode || "-"}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "var(--color-text-dim)" }}>{p.order?.orderCode || "-"}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "var(--color-text-dim)" }}>{p.mitraUser?.mitraProfile?.workshopName || p.mitraUser?.name || "-"}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "#FFF", fontWeight: 700 }}>Rp {p.amount.toLocaleString("id-ID")}</td>
                      <td style={{ padding: "0.75rem 1rem" }}><Badge variant={cfg.color}>{cfg.label}</Badge></td>
                      <td style={{ padding: "0.75rem 1rem", color: "var(--color-text-dim)" }}>{p.eligibleAt ? new Date(p.eligibleAt).toLocaleDateString("id-ID") : "-"}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "var(--color-text-dim)" }}>{p.paidAt ? new Date(p.paidAt).toLocaleDateString("id-ID") : "-"}</td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <Link to={`/admin/payouts/${p.id}`} style={{ color: "var(--color-primary)", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <Eye size={14} />Detail
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
