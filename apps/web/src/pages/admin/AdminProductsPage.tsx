import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { apiClient } from "../../lib/api"
import { Card } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { LoadingSpinner } from "../../components/feedback/LoadingSpinner"
import { Alert } from "../../components/feedback/Alert"
import { EmptyState } from "../../components/ui/EmptyState"
import { Package, Plus, Eye } from "lucide-react"

const statusConfig: Record<string, { label: string; color: "warning" | "success" | "danger" | "info" }> = {
  draft: { label: "Draft", color: "warning" },
  ready: { label: "Siap", color: "info" },
  published: { label: "Dipublikasikan", color: "success" },
  archived: { label: "Diarsipkan", color: "danger" }
}

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      setLoading(true); setError(null)
      const res = await apiClient.get("/admin/products")
      setProducts(res.data || [])
    } catch (e: any) { setError(e.message || "Gagal memuat produk") }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  return (
    <div style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Package size={28} color="var(--color-primary)" />
          <div>
            <h1 style={{ fontSize: "1.5rem", color: "#FFF", margin: 0 }}>Produk Final</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", margin: 0 }}>Buat & publikasikan produk dari order yang sudah QC approved</p>
          </div>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Plus size={16} />Buat Produk
        </Link>
      </div>

      {error && <Alert variant="error" message={error} onRetry={load} />}
      {loading ? <LoadingSpinner message="Memuat produk..." /> : products.length === 0 ? (
        <EmptyState title="Belum Ada Produk" description="Buat produk pertama dari order yang sudah QC approved." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {products.map((p: any) => {
            const cfg = statusConfig[p.status] || { label: p.status, color: "info" as const }
            return (
              <Card key={p.id} hoverable style={{ padding: "1.25rem" }}>
                {p.primaryImageUrl && (
                  <div style={{ height: "140px", borderRadius: "8px", overflow: "hidden", marginBottom: "1rem", background: "var(--color-surface-2)" }}>
                    <img src={p.primaryImageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <Badge variant={cfg.color}>{cfg.label}</Badge>
                  <Badge variant="info">{p.dataOrigin}</Badge>
                </div>
                <h3 style={{ color: "#FFF", fontSize: "1rem", marginBottom: "0.25rem" }}>{p.name}</h3>
                <p style={{ color: "var(--color-text-muted)", fontSize: "0.8rem", marginBottom: "0.5rem" }}>{p.productCode}</p>
                <p style={{ color: "var(--color-text-dim)", fontSize: "0.8rem" }}>{p.shortDescription || p.description?.substring(0, 80)}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--color-border)" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-dim)" }}>DPP: {p.dppRecord ? "✅" : "⬜"}</span>
                  <Link to={`/admin/products/${p.id}`} style={{ color: "var(--color-primary)", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Eye size={14} />Detail
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
