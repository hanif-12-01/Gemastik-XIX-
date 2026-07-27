import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/feedback/Alert'
import { defaultTokenProvider } from '../../lib/api'

export const MitraLoginPage: React.FC = () => {
  const [email, setEmail] = useState('mitra@ecothread.local')
  const [password, setPassword] = useState('Password123!')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Email dan password wajib diisi.')
      return
    }

    defaultTokenProvider.setToken('demo_mitra_token_placeholder')
    navigate(ROUTES.PROTECTED.MITRA)
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: '0.25rem' }}>Login Mitra Penjahit</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Masuk ke portal kerja penjahit & konveksi
        </p>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Input
          label="Email Terdaftar"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="mitra@ecothread.local"
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

        <Button type="submit" variant="primary" style={{ width: '100%', marginBottom: '1.5rem' }}>
          Masuk Portal Mitra
        </Button>

        <div style={{ textAlign: 'center', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Belum punya akun Mitra? </span>
          <Link to={ROUTES.AUTH.MITRA_REGISTER} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Daftar Mitra Baru
          </Link>
        </div>
      </form>
    </div>
  )
}
