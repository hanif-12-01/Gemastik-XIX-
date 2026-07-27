import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { Card } from '../../components/ui/Card'
import { Alert } from '../../components/feedback/Alert'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { ArrowLeft, Save } from 'lucide-react'

export const CustomerProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryNotes: ''
  })

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await apiClient.getCustomerProfile()
        const data = res.data
        let notes = ''
        if (data?.profile?.preferences) {
          try { notes = JSON.parse(data.profile.preferences)?.deliveryNotes || '' } catch(e){}
        }
        setForm({
          name: data?.name || '',
          phone: data?.profile?.phone || '',
          address: data?.profile?.address || '',
          city: '',
          postalCode: '',
          deliveryNotes: notes
        })
      } catch (e: any) {
        setError(e.message || 'Gagal memuat profil')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setSubmitting(true)
      setError(null)
      setSuccess(null)
      await apiClient.updateCustomerProfile(form)
      setSuccess('Profil berhasil diperbarui.')
    } catch (e: any) {
      setError(e.message || 'Gagal memperbarui profil')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner message="Memuat profil..." />

  return (
    <div style={{ padding: '2.5rem 1rem 4rem' }}>
      <div className="container" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <button onClick={() => navigate('/account')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Kembali ke Akun
        </button>

        <h1 style={{ color: '#FFF', fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>Pengaturan Profil</h1>

        {success && <Alert variant="success" message={success} />}
        {error && <Alert variant="error" message={error} />}

        <Card style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Nama Lengkap *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: '#FFF', fontSize: '0.875rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Nomor Telepon / WhatsApp</label>
              <input
                type="text"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="08123456789"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: '#FFF', fontSize: '0.875rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Alamat Pengiriman Utama</label>
              <textarea
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                rows={3}
                placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan, Kota/Kabupaten..."
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: '#FFF', fontSize: '0.875rem', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Catatan Khusus Pengiriman (Opsional)</label>
              <input
                type="text"
                value={form.deliveryNotes}
                onChange={e => setForm(f => ({ ...f, deliveryNotes: e.target.value }))}
                placeholder="e.g. Titipkan ke satpam jika tidak ada di rumah"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: '#FFF', fontSize: '0.875rem', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
            >
              <Save size={16} /> {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </Card>
      </div>
    </div>
  )
}
