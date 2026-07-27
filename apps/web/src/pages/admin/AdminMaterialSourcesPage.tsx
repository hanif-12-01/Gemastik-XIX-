import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Alert } from '../../components/feedback/Alert'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { Plus, ArrowLeft, Truck } from 'lucide-react'

export const AdminMaterialSourcesPage: React.FC = () => {
  const [sources, setSources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const [name, setName] = useState('')
  const [category, setCategory] = useState('Waste Bank')
  const [location, setLocation] = useState('Bandung Hub')
  const [contact, setContact] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchSources = async () => {
    try {
      setLoading(true)
      const data = await apiClient.listMaterialSources()
      setSources(data)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat sumber material.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSources()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await apiClient.createMaterialSource({ name, category, location, contact, notes })
      setShowModal(false)
      setName('')
      setContact('')
      setNotes('')
      await fetchSources()
    } catch (err: any) {
      setError(err.message || 'Gagal membuat sumber material baru.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/admin" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
          <ArrowLeft size={16} /> Kembali ke Dashboard Admin
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Badge variant="info" className="mb-2">Inventaris Supply Chain</Badge>
          <h1 style={{ fontSize: '1.75rem', color: '#FFF' }}>Manajemen Sumber Material</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Daftar bank sampah, fasilitas pemilahan, dan mitra penyedia limbah tekstil.
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} variant="primary">
          <Plus size={16} /> Tambah Sumber Material Baru
        </Button>
      </div>

      {error && <Alert type="danger" title="Error">{error}</Alert>}

      {loading ? (
        <LoadingSpinner message="Memuat daftar sumber material..." />
      ) : sources.length === 0 ? (
        <EmptyState title="Belum Ada Sumber Material" description="Daftarkan sumber limbah tekstil pertama Anda untuk memulai alokasi batch." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {sources.map((src) => (
            <Card key={src.id} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Truck color="var(--color-primary)" size={24} />
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: '#FFF', margin: 0 }}>{src.name}</h3>
                  <code style={{ fontSize: '0.75rem', color: 'var(--color-warning)' }}>{src.sourceCode}</code>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                Kategori: <strong>{src.category}</strong> &bull; Lokasi: <strong>{src.location}</strong>
              </p>
              {src.contact && (
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
                  Kontak: {src.contact}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <Card style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '1rem' }}>Tambah Sumber Material Baru</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Nama Fasilitas / Bank Sampah *</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Bank Sampah Tekstil Bandung" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Kategori</label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Waste Bank / Corporate Partner" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Kota / Wilayah *</label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Bandung Barat" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Kontak Penanggung Jawab</label>
                <Input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="08123456789 (Bpk. Ahmad)" />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <Button type="button" onClick={() => setShowModal(false)} variant="secondary" style={{ flex: 1 }}>Batal</Button>
                <Button type="submit" variant="primary" disabled={submitting} style={{ flex: 1 }}>{submitting ? 'Simpan...' : 'Simpan Sumber'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
