import React, { useEffect, useState } from 'react'
import { CheckCircle2, Clock3 } from 'lucide-react'
import { Alert } from '../../components/feedback/Alert'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { apiClient } from '../../lib/api'
import { formatRupiah } from '../../lib/mitra-ui'

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
        setError(err.message || 'Catatan upah belum bisa dimuat.')
      } finally {
        setLoading(false)
      }
    }

    fetchPayouts()
  }, [])

  const paidTotal = payouts
    .filter((payout) => payout.status === 'paid')
    .reduce((total, payout) => total + Number(payout.amount || 0), 0)

  return (
    <div className="mitra-page">
      <div className="mitra-page-header">
        <h1>Upah Saya</h1>
        <p>Catatan upah dari pekerjaan yang sudah diperiksa EcoThread.</p>
      </div>

      {error && <Alert type="danger" title="Belum bisa memuat">{error}</Alert>}

      <section className="mitra-next" style={{ marginBottom: '1rem' }}>
        <div className="mitra-next__eyebrow">Total upah yang sudah dikirim</div>
        <h2 style={{ fontSize: '1.8rem' }}>{formatRupiah(paidTotal)}</h2>
        <p>Nomor bukti transfer dapat dilihat pada setiap catatan di bawah.</p>
      </section>

      {loading ? (
        <LoadingSpinner message="Membuka catatan upah..." />
      ) : payouts.length === 0 ? (
        <EmptyState
          title="Belum ada catatan upah"
          description="Upah akan muncul di sini setelah hasil jahitan disetujui."
        />
      ) : (
        <div className="mitra-job-list">
          {payouts.map((payout) => {
            const paid = payout.status === 'paid'

            return (
              <article className="mitra-job-card" key={payout.id}>
                <div className="mitra-job-card__top">
                  <div>
                    <p>{payout.order?.ecoKit?.name || 'Pekerjaan jahit EcoThread'}</p>
                    <h2 style={{ marginTop: '0.2rem', fontSize: '1.35rem' }}>
                      {formatRupiah(payout.amount)}
                    </h2>
                  </div>
                  <span className={`mitra-status mitra-status--${paid ? 'success' : 'warning'}`}>
                    {paid ? (
                      <><CheckCircle2 size={14} /> Sudah dikirim</>
                    ) : (
                      <><Clock3 size={14} /> Sedang diproses</>
                    )}
                  </span>
                </div>

                <div className="mitra-detail-grid" style={{ marginTop: '1rem' }}>
                  <div>
                    <span>Nomor pekerjaan</span>
                    <strong>{payout.order?.orderCode || '-'}</strong>
                  </div>
                  <div>
                    <span>Tanggal dikirim</span>
                    <strong>
                      {payout.paidAt
                        ? new Date(payout.paidAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })
                        : 'Menunggu proses'}
                    </strong>
                  </div>
                </div>

                {payout.paymentReference && (
                  <p style={{ marginTop: '0.8rem', fontSize: '0.82rem' }}>
                    Bukti transfer: <strong>{payout.paymentReference}</strong>
                  </p>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
