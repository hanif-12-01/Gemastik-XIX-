import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { ROUTES } from '../../lib/routes'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Alert } from '../../components/feedback/Alert'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

export const MitraRegistrationPage: React.FC = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    workshopName: '',
    specialization: 'Upcycled Denim & Outerwear',
    capacityPerWeek: 10,
    location: 'Bandung',
    phone: '',
    address: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registeredSuccess, setRegisteredSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.')
      return
    }

    if (formData.password.length < 6) {
      setError('Kata sandi minimal 6 karakter.')
      return
    }

    try {
      setLoading(true)
      await apiClient.registerMitra({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        workshopName: formData.workshopName,
        specialization: formData.specialization,
        capacityPerWeek: Number(formData.capacityPerWeek),
        location: formData.location,
        phone: formData.phone,
        address: formData.address
      })

      setRegisteredSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftar Mitra.')
    } finally {
      setLoading(false)
    }
  }

  if (registeredSuccess) {
    return (
      <div style={{ maxWidth: '520px', margin: '3rem auto' }}>
        <Card style={{ padding: '2.5rem', textAlign: 'center' }}>
          <Badge variant="success" className="mb-2">Pendaftaran Berhasil</Badge>
          <h1 style={{ fontSize: '1.75rem', color: '#FFF', marginBottom: '1rem' }}>
            Akun Mitra Berhasil Didaftarkan
          </h1>

          <Alert type="info" title="Status: Pending Verification">
            Pendaftaran Anda telah diterima. Akun Mitra berstatus <strong>pending_verification</strong> dan memerlukan persetujuan Admin City Hub sebelum dapat mengakses pesanan jahit.
          </Alert>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: '1.5rem 0', lineHeight: 1.6 }}>
            Anda dapat masuk ke portal Mitra untuk memantau status persetujuan akun Anda.
          </p>

          <Link to={ROUTES.AUTH.MITRA_LOGIN} className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
            Masuk ke Login Mitra
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '580px', margin: '3rem auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to={ROUTES.PUBLIC.PORTAL} style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
          <ArrowLeft size={16} /> Kembali ke Portal Selection
        </Link>
      </div>

      <Card style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Badge variant="info" className="mb-2">Formulir Pendaftaran Mitra</Badge>
          <h1 style={{ fontSize: '1.5rem', color: '#FFF' }}>Pendaftaran Mitra Penjahit EcoThread</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Isi data diri dan tempat usaha konveksi/jahit Anda untuk bergabung.
          </p>
        </div>

        {error && <Alert type="danger" title="Gagal Pendaftaran">{error}</Alert>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', color: '#FFF', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              1. Informasi Akun
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Nama Pemilik / Mitra *</label>
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="Budi Santoso" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Email Aktif *</label>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="budi@gmail.com" required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Kata Sandi *</label>
                <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 karakter" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Konfirmasi Sandi *</label>
                <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Ulangi sandi" required />
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', color: '#FFF', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              2. Profil Usaha Penjahit
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Nama Workshop / Penjahit *</label>
                <Input name="workshopName" value={formData.workshopName} onChange={handleChange} placeholder="Konveksi Budi Mandiri" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Kota / Wilayah *</label>
                <Input name="location" value={formData.location} onChange={handleChange} placeholder="Semarang / Bandung" required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Nomor Telepon / WA *</label>
                <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="081234567890" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Kapasitas Mingguan (Pcs)</label>
                <Input type="number" name="capacityPerWeek" value={formData.capacityPerWeek} onChange={handleChange} min={1} required />
              </div>
            </div>

            <div style={{ marginTop: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Spesialisasi Jahitan</label>
              <Input name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Upcycled Denim & Outerwear" />
            </div>

            <div style={{ marginTop: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Alamat Lengkap Workshop</label>
              <Input name="address" value={formData.address} onChange={handleChange} placeholder="Jl. Merdeka No. 45" />
            </div>
          </div>

          <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}>
            {loading ? 'Mendaftarkan Akun Mitra...' : 'Kirim Pendaftaran Mitra'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
