import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'
import { Card } from '../../components/ui/Card'
import { Alert } from '../../components/feedback/Alert'
import { Mail, Lock, ArrowRight, UserRoundCheck } from 'lucide-react'

export const CustomerLoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/account'
  const isRegistered = searchParams.get('registered') === 'true'
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      await login(email, password)
      navigate(redirect)
    } catch (err: any) {
      setError(err.message || 'Login gagal. Periksa kembali email dan password Anda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '3rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#FFF', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Masuk Akun Pelanggan</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Masuk untuk melanjutkan pre-order dan kelola pesanan Anda</p>
        </div>

        <Card style={{ padding: '2rem' }}>
          {isRegistered && <Alert variant="success" message="Pendaftaran berhasil! Silakan masuk dengan akun Anda." />}
          {error && <Alert variant="error" message={error} />}

          <div style={{ marginBottom: '1.25rem', padding: '1rem', background: 'var(--color-primary-light)', border: '1px solid var(--color-border-active)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
              <UserRoundCheck size={19} color="var(--color-primary)" />
              <strong style={{ color: '#FFF' }}>Akun demo dewan juri</strong>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
              Berisi contoh pesanan yang sedang diproses.
            </p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEmail('pelanggan@ecothread.local')
                setPassword('DemoPelanggan2026!')
              }}
              style={{ width: '100%', minHeight: '42px', fontSize: '0.82rem' }}
            >
              Isi akun demo otomatis
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Email *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@contoh.com"
                  style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.25rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: '#FFF', fontSize: '0.875rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Kata sandi"
                  style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.25rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: '#FFF', fontSize: '0.875rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
            >
              {loading ? 'Memproses Login...' : 'Masuk Sekarang'} <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Belum memiliki akun?{' '}
            <Link to={'/auth/customer/register?redirect=' + encodeURIComponent(redirect)} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              Daftar di sini
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
