import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/feedback/Alert'
import { defaultTokenProvider } from '../../lib/api'

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@ecothread.local')
  const [password, setPassword] = useState('Password123!')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Email dan password wajib diisi.')
      return
    }

    // In Roadmap 0: Safe route shell placeholder boundary
    // Token initialization placeholder (real authentication API integration in Roadmap 2)
    defaultTokenProvider.setToken('demo_admin_token_placeholder')
    navigate(ROUTES.PROTECTED.ADMIN)
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: '0.25rem' }}>Login Admin City Hub</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Masuk ke konsol operasional City Hub
        </p>
      </div>

      <Alert type="warning" title="Batas Keamanan Akun Admin">
        Pendaftaran Admin baru <strong>hanya dapat dilakukan melalui undangan resmi Super Admin</strong>.
      </Alert>

      {error && <Alert type="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Input
          label="Email Admin"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@ecothread.local"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
          <Link to={ROUTES.AUTH.FORGOT_PASSWORD} style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Lupa password?
          </Link>
        </div>

        <Button type="submit" variant="primary" style={{ width: '100%' }}>
          Masuk Konsol Admin
        </Button>
      </form>
    </div>
  )
}
