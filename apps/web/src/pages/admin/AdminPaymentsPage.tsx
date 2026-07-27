import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { Alert } from '../../components/feedback/Alert'
import { EmptyState } from '../../components/ui/EmptyState'
import { CreditCard, Eye, CheckCircle2, XCircle } from 'lucide-react'

export const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending')

  async function load() {
    try {
      setLoading(true); setError(null)
      const res = await apiClient.getAdminPayments()
      setPayments(res.data || [])
    } catch (e: any) {
      setError(e.message || "Gagal memuat antrian pembayaran pelanggan")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = payments.filter((p: any) => {
    if (filter === 'pending') return !p.isVerified && !p.rejectionReason
    if (filter === 'verified') return p.isVerified
    if (filter === 'rejected') return !p.isVerified && p.rejectionReason
    return true
  })

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <CreditCard size={28} color="var(--color-primary)" />
          <div>
            <h1 style={{ fontSize: "1.5rem", color: "#FFF", margin: 0 }}>Verifikasi Pembayaran Pelanggan</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", margin: 0 }}>Tinjau dan konfirmasi bukti pembayaran pre-order pelanggan</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: "flex", gap: "0.5rem", background: "var(--color-surface)", padding: "0.25rem", borderRadius: "8px", border: "1px solid var(--color-border)" }}>
          <button onClick={() => setFilter('pending')} style={{ padding: "0.4rem 0.8rem", borderRadius: "6px", border: "none", background: filter === 'pending' ? "var(--color-primary)" : "transparent", color: filter === 'pending' ? "#000" : "#FFF", fontWeight: filter === 'pending' ? 700 : 400, fontSize: "0.8rem", cursor: "pointer" }}>
            Menunggu Review ({payments.filter(p => !p.isVerified && !p.rejectionReason).length})
          </button>
          <button onClick={() => setFilter('verified')} style={{ padding: "0.4rem 0.8rem", borderRadius: "6px", border: "none", background: filter === 'verified' ? "var(--color-primary)" : "transparent", color: filter === 'verified' ? "#000" : "#FFF", fontWeight: filter === 'verified' ? 700 : 400, fontSize: "0.8rem", cursor: "pointer" }}>
            Terverifikasi
          </button>
          <button onClick={() => setFilter('rejected')} style={{ padding: "0.4rem 0.8rem", borderRadius: "6px", border: "none", background: filter === 'rejected' ? "var(--color-primary)" : "transparent", color: filter === 'rejected' ? "#000" : "#FFF", fontWeight: filter === 'rejected' ? 700 : 400, fontSize: "0.8rem", cursor: "pointer" }}>
            Ditolak
          </button>
          <button onClick={() => setFilter('all')} style={{ padding: "0.4rem 0.8rem", borderRadius: "6px", border: "none", background: filter === 'all' ? "var(--color-primary)" : "transparent", color: filter === 'all' ? "#000" : "#FFF", fontWeight: filter === 'all' ? 700 : 400, fontSize: "0.8rem", cursor: "pointer" }}>
            Semua
          </button>
        </div>
      </div>

      {error && <Alert variant="error" message={error} onRetry={load} />}
      {loading ? (
        <LoadingSpinner message="Memuat antrian verifikasi pembayaran..." />
      ) : filtered.length === 0 ? (
        <EmptyState title="Tidak Ada Bukti Pembayaran" description="Tidak ada data pembayaran yang sesuai dengan filter saat ini." />
      ) : (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)", borderBottom: "1px solid var(--color-border)" }}>
                <th style={{ padding: "0.85rem 1.25rem" }}>TANGGAL SUBMIT</th>
                <th style={{ padding: "0.85rem 1.25rem" }}>ORDER CODE</th>
                <th style={{ padding: "0.85rem 1.25rem" }}>PELANGGAN</th>
                <th style={{ padding: "0.85rem 1.25rem" }}>NOMINAL DITRANSFER</th>
                <th style={{ padding: "0.85rem 1.25rem" }}>STATUS</th>
                <th style={{ padding: "0.85rem 1.25rem", textAlign: "right" }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p: any) => {
                const order = p.customerOrder
                const isVerified = p.isVerified
                const isRejected = !isVerified && p.rejectionReason

                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "0.85rem 1.25rem", color: "var(--color-text-muted)" }}>
                      {new Date(p.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td style={{ padding: "0.85rem 1.25rem", fontWeight: 700, color: "#FFF" }}>
                      {order?.orderCode || "-"}
                    </td>
                    <td style={{ padding: "0.85rem 1.25rem", color: "#FFF" }}>
                      {order?.user?.name || "Pelanggan"} <br />
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{order?.user?.email}</span>
                    </td>
                    <td style={{ padding: "0.85rem 1.25rem", fontWeight: 700, color: "var(--color-success)" }}>
                      Rp {p.amount?.toLocaleString("id-ID")}
                    </td>
                    <td style={{ padding: "0.85rem 1.25rem" }}>
                      <Badge variant={isVerified ? "success" : isRejected ? "danger" : "warning"}>
                        {isVerified ? "Diverifikasi" : isRejected ? "Ditolak" : "Menunggu Review"}
                      </Badge>
                    </td>
                    <td style={{ padding: "0.85rem 1.25rem", textAlign: "right" }}>
                      <Link to={'/admin/payments/' + p.id} style={{ color: "var(--color-primary)", fontWeight: 600, fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                        <Eye size={14} /> Review Bukti
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
