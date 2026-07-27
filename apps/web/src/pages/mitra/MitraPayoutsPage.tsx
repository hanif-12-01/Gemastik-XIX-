import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Alert } from '../../components/feedback/Alert'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { ArrowLeft, CreditCard, CheckCircle2 } from 'lucide-react'

export const MitraPayoutsPage: React.FC = () => {
  const [payouts, setPayouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPayouts() {
      try {
        setLoading(true)
        const data = await apiClient.getMitraPayouts()
        setPayouts(data)
      } catch (err: any) {
        setError(err.message || 'Gagal memuat riwayat payout.')
      } finally {
        setLoading(false)
      }
    }

    fetchPayouts()
  }, [])

  return (
    <div style={{ padding: '1.5rem 1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/mitra" style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
          <ArrowLeft size={16} /> Kembali ke Dashboard Mitra
        </Link>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <Badge variant="info" className="mb-2">Ledger Keuangan Mitra</Badge>
        <h1 style={{ fontSize: '1.5rem', color: '#FFF', margin: 0 }}>Riwayat Payouts & Honor Jahit</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          Catatan pencairan honor jahit dari pesanan produksi yang telah lolos verifikasi QC.
        </p>
      </div>

      {error && <Alert type="danger" title="Error">{error}</Alert>}

      {loading ? (
        <LoadingSpinner message="Memuat riwayat payout..." />
      ) : payouts.length === 0 ? (
        <EmptyState title="Belum Ada Riwayat Payout" description="Honor jahit akan tercatat di sini setelah pesanan produksi Anda disetujui QC Admin." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {payouts.map((p) => (
            <Card key={p.id} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: '#FFF', margin: 0 }}>Rp {p.amount?.toLocaleString('id-ID')}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    Order: {p.order?.orderCode} ({p.order?.ecoKit?.name})
                  </div>
                </div>
                <Badge variant={p.status === 'paid' ? 'success' : 'warning'}>
                  {p.status}
                </Badge>
              </div>

              {p.paymentReference && (
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                  Ref Transfer: {p.paymentReference} &bull; Tanggal: {p.paidAt ? new Date(p.paidAt).toLocaleDateString('id-ID') : '-'}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
