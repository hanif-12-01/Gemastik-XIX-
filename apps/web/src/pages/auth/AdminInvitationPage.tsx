import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { ROUTES } from '../../lib/routes'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Alert } from '../../components/feedback/Alert'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { ShieldCheck, ArrowLeft } from 'lucide-react'

export const AdminInvitationPage: React.FC = () => {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()

  const [validating, setValidating] = useState(true)
  const [invitationData, setInvitationData] = useState<{ email: string } | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function checkToken() {
      if (!token) {
        setValidationError('Token undangan tidak ditemukan.')
        setValidating(false)
        return
      }

      try {
        setValidating(true)
        const data = await apiClient.validateAdminInvitation(token)
        setInvitationData(data)
      } catch (err: any) {
        setValidationError(err.message || 'Token undangan Admin tidak valid atau kedaluwarsa.')
      } finally {
        setValidating(false)
      }
    }

    checkToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (password !== confirmPassword) {
      setSubmitError('Konfirmasi kata sandi tidak cocok.')
      return
    }

    if (password.length < 6) {
      setSubmitError('Kata sandi minimal 6 karakter.')
      return
    }

    try {
      setSubmitting(true)
      await apiClient.registerAdminFromInvitation(token || '', { password, name })
      setSuccess(true)
    } catch (err: any) {
      setSubmitError(err.message || 'Gagal mendaftar dari undangan.')
    } finally {
      setSubmitting(false)
    }
  }

  if (validating) {
    return <LoadingSpinner message="Memverifikasi token undangan Admin..." />
  }

  if (validationError) {
    return (
      <div style={{ maxWidth: '480px', margin: '3rem auto' }}>
        <Card style={{ padding: '2rem', textAlign: 'center' }}>
          <Badge variant="danger" className="mb-2">Undangan Tidak Valid</Badge>
          <h1 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: '1rem' }}>Gagal Menggunakan Undangan</h1>
          <Alert type="danger" title="Error Token">{validationError}</Alert>
          <div style={{ marginTop: '1.5rem' }}>
            <Link to={ROUTES.PUBLIC.PORTAL} className="btn btn-secondary">
              <ArrowLeft size={16} /> Kembali ke Portal Selection
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div style={{ maxWidth: '480px', margin: '3rem auto' }}>
        <Card style={{ padding: '2rem', textAlign: 'center' }}>
          <Badge variant="success" className="mb-2">Registrasi Admin Berhasil</Badge>
          <h1 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: '1rem' }}>Akun Admin Terbuat</h1>
          <Alert type="success" title="Sukses">
            Akun Admin untuk email <strong>{invitationData?.email}</strong> berhasil dibuat. Silakan login.
          </Alert>
          <div style={{ marginTop: '1.5rem' }}>
            <Link to={ROUTES.AUTH.ADMIN_LOGIN} className="btn btn-primary" style={{ width: '100%' }}>
              Masuk Login Admin
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '480px', margin: '3rem auto' }}>
      <Card style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Badge variant="success" className="mb-2">Undangan Resmi Super Admin</Badge>
          <h1 style={{ fontSize: '1.5rem', color: '#FFF' }}>Registrasi Akun Admin</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Undangan untuk: <strong>{invitationData?.email}</strong>
          </p>
        </div>

        {submitError && <Alert type="danger" title="Gagal Registrasi">{submitError}</Alert>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>Nama Lengkap Admin</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>Buat Kata Sandi</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>Konfirmasi Kata Sandi</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi"
              required
            />
          </div>

          <Button type="submit" variant="primary" disabled={submitting} style={{ width: '100%', padding: '0.75rem' }}>
            {submitting ? 'Membuat Akun Admin...' : 'Selesaikan Registrasi Admin'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
