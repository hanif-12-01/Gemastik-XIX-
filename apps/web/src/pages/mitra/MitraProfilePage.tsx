import React, { useEffect, useState } from 'react'
import { Save, ShieldCheck } from 'lucide-react'
import { Alert } from '../../components/feedback/Alert'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { useAuth } from '../../features/auth/AuthContext'
import { apiClient } from '../../lib/api'

export const MitraProfilePage: React.FC = () => {
  const { refreshUser } = useAuth()
  const [loading, setLoading] = useState(true)
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
        setName(data.user?.name || '')
        setWorkshopName(data.workshopName || '')
        setPhone(data.user?.userProfile?.phone || '')
        setLocation(data.location || '')
        setAddress(data.user?.userProfile?.address || '')
        setSpecialization(data.specialization || '')
        setCapacityPerWeek(data.capacityPerWeek || 10)
      } catch (err: any) {
        setError(err.message || 'Profil belum bisa dimuat.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setSubmitting(true)

    try {
      await apiClient.updateMitraProfile({
        name,
        workshopName,
        phone,
        location,
        address,
        specialization,
        capacityPerWeek: Number(capacityPerWeek)
      })
      setSuccess('Profil berhasil disimpan.')
      await refreshUser()
    } catch (err: any) {
      setError(err.message || 'Profil belum berhasil disimpan.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Membuka profil Ibu..." />
  }

  return (
    <div className="mitra-page">
      <div className="mitra-page-header">
        <span className="mitra-verified" style={{ marginBottom: '0.5rem' }}>
          <ShieldCheck size={18} /> Mitra terverifikasi
        </span>
        <h1>Profil Usaha Jahit</h1>
        <p>Ubah hanya jika nomor HP, alamat, atau kemampuan menerima pekerjaan berubah.</p>
      </div>

      {success && <Alert type="success" title="Berhasil">{success}</Alert>}
      {error && <Alert type="danger" title="Belum berhasil">{error}</Alert>}

      <section className="mitra-action-card" style={{ marginTop: 0 }}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="mitra-name">Nama Ibu / pemilik usaha</label>
          <input
            id="mitra-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label htmlFor="workshop-name" style={{ marginTop: '0.85rem' }}>Nama usaha jahit</label>
          <input
            id="workshop-name"
            value={workshopName}
            onChange={(event) => setWorkshopName(event.target.value)}
            required
          />

          <label htmlFor="mitra-phone" style={{ marginTop: '0.85rem' }}>Nomor HP / WhatsApp</label>
          <input
            id="mitra-phone"
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Contoh: 081234567890"
            required
          />

          <label htmlFor="mitra-location" style={{ marginTop: '0.85rem' }}>Kota atau wilayah</label>
          <input
            id="mitra-location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            required
          />

          <label htmlFor="mitra-address" style={{ marginTop: '0.85rem' }}>Alamat usaha jahit</label>
          <textarea
            id="mitra-address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Tuliskan alamat lengkap."
          />

          <label htmlFor="mitra-specialization" style={{ marginTop: '0.85rem' }}>
            Jenis jahitan yang paling dikuasai
          </label>
          <input
            id="mitra-specialization"
            value={specialization}
            onChange={(event) => setSpecialization(event.target.value)}
            placeholder="Contoh: denim, tas, atau pakaian anak"
          />

          <label htmlFor="mitra-capacity" style={{ marginTop: '0.85rem' }}>
            Kesanggupan dalam satu minggu
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              id="mitra-capacity"
              type="number"
              min={1}
              value={capacityPerWeek}
              onChange={(event) => setCapacityPerWeek(Number(event.target.value))}
              required
            />
            <span style={{ color: '#63718a', whiteSpace: 'nowrap' }}>buah produk</span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ width: '100%', marginTop: '1.25rem' }}
          >
            <Save size={18} />
            {submitting ? 'Menyimpan...' : 'Simpan profil'}
          </button>
        </form>
      </section>
    </div>
  )
}
