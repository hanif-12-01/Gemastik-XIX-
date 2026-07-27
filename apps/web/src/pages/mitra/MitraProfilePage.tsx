import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'
import { apiClient } from '../../lib/api'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Alert } from '../../components/feedback/Alert'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { ArrowLeft, User, Save, ShieldCheck } from 'lucide-react'

export const MitraProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [workshopName, setWorkshopName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [address, setAddress] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [capacityPerWeek, setCapacityPerWeek] = useState<number>(10)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true)
        const data = await apiClient.getMitraProfile()
        setProfile(data)
        setName(data.user?.name || '')
        setWorkshopName(data.workshopName || '')
        setPhone(data.user?.userProfile?.phone || '')
        setLocation(data.location || '')
        setAddress(data.user?.userProfile?.address || '')
        setSpecialization(data.specialization || '')
        setCapacityPerWeek(data.capacityPerWeek || 10)
      } catch (err: any) {
        setError(err.message || 'Gagal memuat profil Mitra.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      setSubmitting(true)
      await apiClient.updateMitraProfile({
        name,
        workshopName,
        phone,
        location,
        address,
        specialization,
        capacityPerWeek: Number(capacityPerWeek)
      })
      setSuccess('Profil Mitra berhasil diperbarui!')
      await refreshUser()
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui profil.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Memuat data profil..." />
  }

  return (
    <div style={{ padding: '1.5rem 1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/mitra" style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
          <ArrowLeft size={16} /> Kembali ke Dashboard Mitra
        </Link>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <Badge variant="success" className="mb-2">Profil Terverifikasi</Badge>
        <h1 style={{ fontSize: '1.5rem', color: '#FFF', margin: 0 }}>Profil & Kapasitas Bengkel Jahit</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          Perbarui informasi kontak dan kapasitas produksi mingguan Anda.
        </p>
      </div>

      {success && <Alert type="success" title="Sukses">{success}</Alert>}
      {error && <Alert type="danger" title="Gagal">{error}</Alert>}

      <Card style={{ padding: '1.25rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Nama Pemilik *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Nama Workshop / Penjahit *</label>
            <Input value={workshopName} onChange={(e) => setWorkshopName(e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Kota / Wilayah *</label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Nomor HP / WA *</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Kapasitas Mingguan (Pcs)</label>
            <Input type="number" min={1} value={capacityPerWeek} onChange={(e) => setCapacityPerWeek(Number(e.target.value))} required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Spesialisasi Jahit</label>
            <Input value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="Upcycled Denim & Outerwear" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Alamat Lengkap Workshop</label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Jl. Merdeka No. 45" />
          </div>

          <Button type="submit" variant="primary" disabled={submitting} style={{ padding: '0.75rem', marginTop: '0.5rem' }}>
            <Save size={16} /> {submitting ? 'Simpan...' : 'Simpan Perubahan Profil'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
