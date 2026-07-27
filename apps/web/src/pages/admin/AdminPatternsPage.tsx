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
import { Plus, ArrowLeft, Scissors } from 'lucide-react'

export const AdminPatternsPage: React.FC = () => {
  const [patterns, setPatterns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const [name, setName] = useState('')
  const [category, setCategory] = useState('Outerwear')
  const [description, setDescription] = useState('')
  const [difficultyLevel, setDifficultyLevel] = useState('Medium')
  const [estimatedMinutes, setEstimatedMinutes] = useState(240)
  const [submitting, setSubmitting] = useState(false)

  const fetchPatterns = async () => {
    try {
      setLoading(true)
      const data = await apiClient.listPatterns()
      setPatterns(data)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat pola garment.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatterns()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await apiClient.createPattern({
        name,
        category,
        description,
        difficultyLevel,
        estimatedMinutes: Number(estimatedMinutes),
        approvalStatus: 'approved'
      })
      setShowModal(false)
      setName('')
      setDescription('')
      await fetchPatterns()
    } catch (err: any) {
      setError(err.message || 'Gagal membuat pola baru.')
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
          <Badge variant="info" className="mb-2">Desain & Modul Garment</Badge>
          <h1 style={{ fontSize: '1.75rem', color: '#FFF' }}>Manajemen Pola Garment Terstandarisasi</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Daftar referensi pola jahit upcycling dengan estimasi waktu dan tingkat kesulitan.
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} variant="primary">
          <Plus size={16} /> Tambah Pola Garment Baru
        </Button>
      </div>

      {error && <Alert type="danger" title="Error">{error}</Alert>}

      {loading ? (
        <LoadingSpinner message="Memuat daftar pola garment..." />
      ) : patterns.length === 0 ? (
        <EmptyState title="Belum Ada Pola Garment" description="Daftarkan referensi pola jahit pertama Anda untuk merakit Eco-Kit." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {patterns.map((p) => (
            <Card key={p.id} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Scissors color="var(--color-primary)" size={20} />
                  <h3 style={{ fontSize: '1.1rem', color: '#FFF', margin: 0 }}>{p.name}</h3>
                </div>
                <Badge variant="success">Approved</Badge>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--color-warning)', fontWeight: 600, marginBottom: '0.5rem' }}>
                {p.patternCode} &bull; {p.category}
              </p>

              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                <span>Kesulitan: <strong>{p.difficultyLevel || 'Medium'}</strong></span>
                <span>Estimasi: <strong>{p.estimatedMinutes || 240} menit</strong></span>
              </div>

              {p.description && (
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem' }}>
                  {p.description}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <Card style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '1rem' }}>Tambah Pola Garment Baru</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Nama Pola Garment *</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Kimono Upcycled Denim Jacket" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Kategori Kategori *</label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Outerwear / Shirt / Bag" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Tingkat Kesulitan</label>
                  <select
                    value={difficultyLevel}
                    onChange={(e) => setDifficultyLevel(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '0.375rem', backgroundColor: '#0F172A', border: '1px solid var(--color-border)', color: '#FFF' }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Est. Menit Jahit</label>
                  <Input type="number" value={estimatedMinutes} onChange={(e) => setEstimatedMinutes(Number(e.target.value))} required />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Deskripsi & Petunjuk Pemotongan</label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Pola cardigan kimono unisex tanpa resleting" />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <Button type="button" onClick={() => setShowModal(false)} variant="secondary" style={{ flex: 1 }}>Batal</Button>
                <Button type="submit" variant="primary" disabled={submitting} style={{ flex: 1 }}>{submitting ? 'Simpan...' : 'Simpan Pola'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
