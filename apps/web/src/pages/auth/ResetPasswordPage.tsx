import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { ROUTES } from '../../lib/routes'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Alert } from '../../components/feedback/Alert'

export const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.')
      return
    }

    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.')
      return
    }

    try {
      setLoading(true)
      await apiClient.resetPassword(token || '', password)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Gagal mereset kata sandi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '440px', margin: '3rem auto' }}>
      <Card style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Badge variant="info" className="mb-2">Reset Kata Sandi</Badge>
          <h1 style={{ fontSize: '1.5rem', color: '#FFF' }}>Buat Kata Sandi Baru</h1>
        </div>

        {success ? (
          <div>
            <Alert type="success" title="Berhasil">
              Kata sandi Anda berhasil diperbarui. Silakan login.
            </Alert>
            <div style={{ marginTop: '1.5rem' }}>
              <Link to={ROUTES.PUBLIC.PORTAL} className="btn btn-primary" style={{ width: '100%' }}>
                Masuk ke Portal Selection
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && <Alert type="danger" title="Gagal">{error}</Alert>}

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>Kata Sandi Baru</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>Konfirmasi Kata Sandi Baru</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi"
                required
              />
            </div>

            <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%', padding: '0.75rem' }}>
              {loading ? 'Memperbarui...' : 'Simpan Kata Sandi Baru'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  )
}
