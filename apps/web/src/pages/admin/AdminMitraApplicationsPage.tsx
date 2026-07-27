import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { ROUTES } from '../../lib/routes'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Alert } from '../../components/feedback/Alert'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { CheckCircle, XCircle, ArrowLeft, Shield } from 'lucide-react'

export const AdminMitraApplicationsPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  const [decisionNotes, setDecisionNotes] = useState<Record<string, string>>({})
  const [processingId, setProcessingId] = useState<string | null>(null)

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const data = await apiClient.listMitraApplications()
      setApplications(data)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat aplikasi Mitra.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleDecision = async (id: string, approve: boolean) => {
    setProcessingId(id)
    setActionMessage(null)
    setError(null)

    try {
      const notes = decisionNotes[id] || ''
      const res = await apiClient.decideMitraApplication(id, approve, notes)
      setActionMessage(res.message || `Aplikasi Mitra ${approve ? 'disetujui' : 'ditolak'}.`)
      await fetchApplications()
    } catch (err: any) {
      setError(err.message || 'Gagal memproses keputusan.')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to={ROUTES.ADMIN.DASHBOARD} style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <ArrowLeft size={16} /> Kembali ke Dashboard Admin
          </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Badge variant="warning" className="mb-2">Admin Management Console</Badge>
            <h1 style={{ fontSize: '2rem', color: '#FFF' }}>Manajemen Verifikasi Aplikasi Mitra</h1>
          </div>
          <Button onClick={fetchApplications} variant="secondary">
            Refresh Data
          </Button>
        </div>

        {error && <Alert type="danger" title="Error">{error}</Alert>}
        {actionMessage && <Alert type="success" title="Sukses">{actionMessage}</Alert>}

        {loading ? (
          <LoadingSpinner message="Memuat daftar permohonan Mitra..." />
        ) : applications.length === 0 ? (
          <EmptyState title="Belum Ada Aplikasi Mitra" description="Belum ada pendaftaran Mitra yang perlu diverifikasi saat ini." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {applications.map((app) => (
              <Card key={app.id} style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h3 style={{ fontSize: '1.25rem', color: '#FFF' }}>{app.workshopName}</h3>
                      <Badge
                        variant={
                          app.verificationStatus === 'approved'
                            ? 'success'
                            : app.verificationStatus === 'rejected'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {app.verificationStatus}
                      </Badge>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                      Pemilik: <strong>{app.user?.name}</strong> ({app.user?.email}) &bull; Lokasi: <strong>{app.location}</strong>
                    </p>

                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.825rem', color: 'var(--color-text-dim)' }}>
                      <span>Kapasitas: {app.capacityPerWeek} pcs/minggu</span>
                      <span>Spesialisasi: {app.specialization || 'Umum'}</span>
                    </div>
                  </div>

                  {app.verificationStatus === 'pending_verification' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '240px' }}>
                      <Input
                        placeholder="Catatan verifikasi Admin..."
                        value={decisionNotes[app.id] || ''}
                        onChange={(e) => setDecisionNotes({ ...decisionNotes, [app.id]: e.target.value })}
                        style={{ fontSize: '0.8rem' }}
                      />

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                          onClick={() => handleDecision(app.id, true)}
                          disabled={processingId === app.id}
                          variant="primary"
                          style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                        >
                          <CheckCircle size={14} /> Setujui
                        </Button>
                        <Button
                          onClick={() => handleDecision(app.id, false)}
                          disabled={processingId === app.id}
                          variant="secondary"
                          style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: 'var(--color-status-danger)' }}
                        >
                          <XCircle size={14} /> Tolak
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
