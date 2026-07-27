import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/feedback/Alert'
import { Badge } from '../../components/ui/Badge'

export const MitraRegistrationPage: React.FC = () => {
  const [name, setName] = useState('')
  const [workshopName, setWorkshopName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <Badge variant="info" className="mb-2">Registrasi Publik Mitra</Badge>
        <h2 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: '0.25rem' }}>Pendaftaran Mitra Penjahit</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Bergabung dalam jaringan manufaktur sirkular EcoThread
        </p>
      </div>

      {submitted ? (
        <div>
          <Alert type="warning" title="Akun Dalam Verifikasi (pending_verification)">
            Pendaftaran Mitra Anda berhasil dikirim! Status akun Anda saat ini adalah <strong>pending_verification</strong>.
            <br /><br />
            Sesuai aturan keamanan operasional, akun Mitra berstatus pending belum dapat menerima atau memproses pesanan produksi sebelum diverifikasi oleh Admin City Hub.
          </Alert>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link to={ROUTES.AUTH.MITRA_LOGIN} className="btn btn-secondary" style={{ width: '100%' }}>
              Kembali ke Halaman Login Mitra
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            label="Nama Lengkap Penjahit"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ibu Ratna"
            required
          />

          <Input
            label="Nama Workshop / Konveksi"
            value={workshopName}
            onChange={(e) => setWorkshopName(e.target.value)}
            placeholder="Ratna Taylor Bandung"
            required
          />

          <Input
            label="Nomor Telepon / WA"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="081234567890"
            required
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ratna@ecothread.local"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 8 karakter"
            required
          />

          <Button type="submit" variant="primary" style={{ width: '100%', marginBottom: '1.5rem' }}>
            Kirim Pengajuan Mitra
          </Button>

          <div style={{ textAlign: 'center', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Sudah punya akun? </span>
            <Link to={ROUTES.AUTH.MITRA_LOGIN} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              Masuk Login Mitra
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}
