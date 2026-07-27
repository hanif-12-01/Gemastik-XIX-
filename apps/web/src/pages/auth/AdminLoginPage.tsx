import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'
import { ROUTES } from '../../lib/routes'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Alert } from '../../components/feedback/Alert'
import { ArrowLeft, Shield, Eye, EyeOff } from 'lucide-react'

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('admin@ecothread.local')
  const [password, setPassword] = useState('Password123!')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const user = await login(email, password)
      if (user.role !== 'admin') {
        setError('Akun ini bukan akun Admin City Hub.')
        return
      }
      navigate(ROUTES.ADMIN.DASHBOARD)
    } catch (err: any) {
      setError(err.message || 'Email atau kata sandi tidak valid.')
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
          <Badge variant="warning" className="mb-2">Portal Admin City Hub</Badge>
          <h1 style={{ fontSize: '1.5rem', color: '#FFF' }}>Masuk Login Admin</h1>
        </div>

        {error && <Alert type="danger" title="Gagal Masuk">{error}</Alert>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>Email Admin</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ecothread.local"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>Kata Sandi</label>
            <div style={{ position: 'relative' }}>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <Link to={ROUTES.AUTH.FORGOT_PASSWORD} style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Lupa kata sandi?
            </Link>
          </div>

          <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%', padding: '0.75rem' }}>
            {loading ? 'Memverifikasi Kredensial...' : 'Masuk Portal Admin'}
          </Button>
        </form>

        <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '1.5rem', paddingTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-dim)', textAlign: 'center' }}>
          Pendaftaran Admin hanya melalui undangan resmi Super Admin.
        </div>
      </Card>
    </div>
  )
}
