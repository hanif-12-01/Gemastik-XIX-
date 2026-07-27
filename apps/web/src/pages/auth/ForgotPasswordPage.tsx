import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/feedback/Alert'

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: '0.25rem' }}>Pemulihan Kata Sandi</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Masukkan email terdaftar untuk menerima petunjuk reset password
        </p>
      </div>

      {sent ? (
        <div>
          <Alert type="success" title="Instruksi Dikirim">
            Instruksi pemulihan password telah dikirim ke <strong>{email}</strong> (Simulasi Roadmap 0).
          </Alert>
          <Link to={ROUTES.PUBLIC.PORTAL} className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>
            Kembali ke Pemilihan Portal
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            label="Email Terdaftar"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@ecothread.local"
            required
          />

          <Button type="submit" variant="primary" style={{ width: '100%', marginBottom: '1.5rem' }}>
            Kirim Link Pemulihan
          </Button>
        </form>
      )}
    </div>
  )
}
