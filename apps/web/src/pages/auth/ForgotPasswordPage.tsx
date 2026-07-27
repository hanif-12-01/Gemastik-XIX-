import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { ROUTES } from '../../lib/routes'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Alert } from '../../components/feedback/Alert'
import { ArrowLeft } from 'lucide-react'

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await apiClient.forgotPassword(email)
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim instruksi pemulihan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '440px', margin: '3rem auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to={ROUTES.PUBLIC.PORTAL} style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
          <ArrowLeft size={16} /> Kembali ke Portal Selection
        </Link>
      </div>

      <Card style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Badge variant="warning" className="mb-2">Pemulihan Akun</Badge>
          <h1 style={{ fontSize: '1.5rem', color: '#FFF' }}>Lupa Kata Sandi</h1>
        </div>

        {submitted ? (
          <Alert type="success" title="Instruksi Dikirim">
            Jika email <strong>{email}</strong> terdaftar di sistem EcoThread, instruksi pemulihan kata sandi telah dikirimkan.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && <Alert type="danger" title="Gagal">{error}</Alert>}

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>Email Terdaftar</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@domain.com"
                required
              />
            </div>

            <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%', padding: '0.75rem' }}>
              {loading ? 'Mengirim...' : 'Kirim Instruksi Pemulihan'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  )
}
