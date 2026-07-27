import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { Alert } from '../../components/feedback/Alert'
import { EmptyState } from '../../components/ui/EmptyState'
import { ShoppingBag, Eye, CreditCard } from 'lucide-react'

const statusConfig: Record<string, { label: string; color: "warning" | "success" | "danger" | "info" }> = {
  pending_payment: { label: "Menunggu Pembayaran", color: "warning" },
  payment_proof_submitted: { label: "Menunggu Verifikasi Admin", color: "info" },
  payment_verified: { label: "Pembayaran Terverifikasi", color: "success" },
  payment_rejected: { label: "Pembayaran Ditolak", color: "danger" },
  processing: { label: "Dalam Pengerjaan", color: "info" },
  shipped: { label: "Dalam Pengiriman", color: "info" },
  delivered: { label: "Pesanan Selesai", color: "success" },
  cancelled: { label: "Dibatalkan", color: "danger" }
}

export const CustomerOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      setLoading(true); setError(null)
      const res = await apiClient.getMyCustomerOrders()
      setOrders(res.data || [])
    } catch (e: any) {
      setError(e.message || "Gagal memuat daftar pesanan Anda")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div style={{ padding: "2.5rem 1rem 4rem" }}>
      <div className="container" style={{ maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--color-primary)", fontWeight: 600, textTransform: "uppercase" }}>Riwayat Pesanan</span>
            <h1 style={{ color: "#FFF", fontSize: "1.75rem", margin: 0 }}>Daftar Pre-Order Saya</h1>
          </div>
          <Link to="/catalog" className="btn btn-primary" style={{ fontSize: "0.85rem" }}>
            + Pre-Order Baru
          </Link>
        </div>

        {error && <Alert variant="error" message={error} onRetry={load} />}
        {loading ? (
          <LoadingSpinner message="Memuat pesanan Anda..." />
        ) : orders.length === 0 ? (
          <EmptyState title="Belum Ada Pesanan" description="Anda belum membuat pre-order produk upcycle." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {orders.map((order: any) => {
              const cfg = statusConfig[order.status] || { label: order.status, color: "info" as const }
              const item = order.customerOrderItems?.[0]
              const requiresAction = order.status === "pending_payment" || order.status === "payment_rejected"

              return (
                <Card key={order.id} style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <h3 style={{ color: "#FFF", fontSize: "1.1rem", margin: 0 }}>{order.orderCode}</h3>
                        <Badge variant={cfg.color}>{cfg.label}</Badge>
                      </div>
                      <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                        Dibuat pada {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Total Tagihan</div>
                      <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--color-primary)" }}>Rp {order.totalAmount?.toLocaleString("id-ID")}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", background: "var(--color-surface-2)", padding: "0.85rem", borderRadius: "8px", marginBottom: "1rem" }}>
                    {item?.catalogItem?.product?.primaryImageUrl && (
                      <img src={item.catalogItem.product.primaryImageUrl} alt={item.catalogItem.title} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#FFF", fontWeight: 700, fontSize: "0.9rem" }}>{item?.catalogItem?.product?.name || item?.catalogItem?.title || "Produk Upcycle"}</div>
                      <div style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>Jumlah: {item?.quantity || 1} item | DP Wajib: Rp {order.depositPaid?.toLocaleString("id-ID")}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                      {requiresAction ? (
                        <span style={{ color: "var(--color-warning)", fontWeight: 600 }}>⚠️ Membutuhkan unggah bukti pembayaran</span>
                      ) : (
                        <span>Tujuan Pengiriman: {order.shippingAddress?.substring(0, 40)}...</span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {requiresAction && (
                        <Link to={'/account/orders/' + order.id} className="btn" style={{ background: "var(--color-warning)", color: "#000", fontWeight: 700, fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <CreditCard size={14} /> Upload Bukti DP
                        </Link>
                      )}
                      <Link to={'/account/orders/' + order.id} className="btn btn-primary" style={{ fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <Eye size={14} /> Lihat Detail & Tracking
                      </Link>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
