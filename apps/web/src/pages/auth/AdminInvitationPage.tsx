import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/feedback/Alert'
import { Badge } from '../../components/ui/Badge'
import { defaultTokenProvider } from '../../lib/api'

export const AdminInvitationPage: React.FC = () => {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    // In Roadmap 0: Safe invitation registration shell boundary
    defaultTokenProvider.setToken('invited_admin_token_placeholder')
    setTimeout(() => {
      navigate(ROUTES.PROTECTED.ADMIN)
    }, 1000)
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <Badge variant="warning" className="mb-2">Undangan Admin Khusus</Badge>
        <h2 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: '0.25rem' }}>Aktivasi Akun Admin</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Token Undangan: <code style={{ color: 'var(--color-primary)' }}>{token || 'demo-token'}</code>
        </p>
      </div>

      {submitted ? (
        <Alert type="success" title="Registrasi Undangan Berhasil">
          Akun Admin berhasil diaktifkan melalui token undangan resmi. Mengalihkan ke dashboard...
        </Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            label="Nama Lengkap Admin"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Pengelola Hub Bandung"
            required
          />

          <Input
            label="Email Terdaftar Undangan"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin.hub@ecothread.local"
            required
          />

          <Input
            label="Password Baru"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 8 karakter"
            required
          />

          <Button type="submit" variant="primary" style={{ width: '100%' }}>
            Aktivasi & Masuk Admin
          </Button>
        </form>
      )}
    </div>
  )
}
