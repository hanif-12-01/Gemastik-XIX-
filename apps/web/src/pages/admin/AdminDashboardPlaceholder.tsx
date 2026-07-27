import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'
import { apiClient } from '../../lib/api'
import { ROUTES } from '../../lib/routes'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Alert } from '../../components/feedback/Alert'
import { LogOut, UserCheck, Shield, Key } from 'lucide-react'

export const AdminDashboardPlaceholder: React.FC = () => {
  const { user, logout } = useAuth()
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteResult, setInviteResult] = useState<any>(null)
  const [inviteError, setInviteError] = useState<string | null>(null)

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteError(null)
    setInviteResult(null)

    try {
      setInviteLoading(true)
      const data = await apiClient.createAdminInvitation({ email: inviteEmail })
      setInviteResult(data)
      setInviteEmail('')
    } catch (err: any) {
      setInviteError(err.message || 'Gagal membuat undangan.')
    } finally {
      setInviteLoading(false)
    }
  }

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        {/* Dashboard Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Badge variant="warning" className="mb-2">Portal Terproteksi (Admin)</Badge>
            <h1 style={{ fontSize: '2rem', color: '#FFF' }}>Konsol Operasional Admin City Hub</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Selamat datang, <strong>{user?.name}</strong> ({user?.email})
            </p>
          </div>

          <Button onClick={logout} variant="secondary">
            <LogOut size={16} /> Keluar (Logout)
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Quick Actions Card */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <UserCheck color="var(--color-primary)" size={24} />
              <h2 style={{ fontSize: '1.25rem', color: '#FFF' }}>Manajemen Verifikasi Mitra</h2>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Tinjau pendaftaran Mitra baru, periksa spesialisasi tempat jahit, serta berikan persetujuan atau penolakan.
            </p>

            <Link to={ROUTES.ADMIN.MITRA_APPLICATIONS} className="btn btn-primary" style={{ width: '100%' }}>
              Buka Kelola Aplikasi Mitra &rarr;
            </Link>
          </Card>

          {/* Invitation Generator Card */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Key color="var(--color-warning)" size={24} />
              <h2 style={{ fontSize: '1.25rem', color: '#FFF' }}>Buat Undangan Admin Baru</h2>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Pendaftaran Admin membutuhkan token undangan resmi dari Super Admin.
            </p>

            {inviteError && <Alert type="danger" title="Gagal">{inviteError}</Alert>}
            {inviteResult && (
              <Alert type="success" title="Undangan Berhasil Dibuat">
                URL Undangan: <code style={{ wordBreak: 'break-all', display: 'block', marginTop: '4px' }}>{inviteResult.inviteUrl}</code>
              </Alert>
            )}

            <form onSubmit={handleCreateInvite} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <Input
                type="email"
                placeholder="email_admin_baru@ecothread.local"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" disabled={inviteLoading} style={{ padding: '0.6rem' }}>
                {inviteLoading ? 'Membuat Token...' : 'Generate Undangan Admin'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
