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
import { Plus, ArrowLeft, Layers } from 'lucide-react'

export const AdminMaterialBatchesPage: React.FC = () => {
  const [batches, setBatches] = useState<any[]>([])
  const [sources, setSources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const [sourceId, setSourceId] = useState('')
  const [materialType, setMaterialType] = useState('Upcycled Denim 14oz')
  const [weightKg, setWeightKg] = useState<number>(25.5)
  const [usableWeightKg, setUsableWeightKg] = useState<number>(24.0)
  const [color, setColor] = useState('Indigo Blue')
  const [sortingDetails, setSortingDetails] = useState('Pilah kelim bawah dan kantong')
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [batchData, sourceData] = await Promise.all([
        apiClient.getMaterialBatches(),
        apiClient.listMaterialSources()
      ])
      setBatches(batchData)
      setSources(sourceData)
      if (sourceData.length > 0) setSourceId(sourceData[0].id)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat batch material.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (usableWeightKg > weightKg) {
      setError('Berat bersih layak jahit tidak boleh melebihi berat total kotor.')
      return
    }

    try {
      setSubmitting(true)
      await apiClient.createMaterialBatch({
        sourceId,
        materialType,
        weightKg: Number(weightKg),
        usableWeightKg: Number(usableWeightKg),
        color,
        sortingDetails
      })
      setShowModal(false)
      await fetchData()
    } catch (err: any) {
      setError(err.message || 'Gagal membuat batch material.')
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
          <Badge variant="warning" className="mb-2">Inventaris Supply Chain</Badge>
          <h1 style={{ fontSize: '1.75rem', color: '#FFF' }}>Manajemen Batch Material Terukur</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Registrasi batch limbah kain terpilah untuk dialokasikan ke Eco-Kit.
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} variant="primary">
          <Plus size={16} /> Tambah Batch Material Baru
        </Button>
      </div>

      {error && <Alert type="danger" title="Error">{error}</Alert>}

      {loading ? (
        <LoadingSpinner message="Memuat daftar batch material..." />
      ) : batches.length === 0 ? (
        <EmptyState title="Belum Ada Batch Material" description="Tambahkan batch material limbah tekstil pertama Anda." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {batches.map((b) => (
            <Card key={b.id} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers color="var(--color-primary)" size={20} />
                  <h3 style={{ fontSize: '1.1rem', color: '#FFF', margin: 0 }}>{b.batchCode}</h3>
                </div>
                <Badge variant={b.status === 'depleted' ? 'danger' : 'success'}>
                  {b.status}
                </Badge>
              </div>

              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFF', marginBottom: '0.25rem' }}>
                {b.materialType} ({b.color || 'Mixed'})
              </p>

              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                <span>Berat Total: <strong>{b.weightKg} kg</strong></span>
                <span>Sumber: <strong>{b.source?.name || 'Bank Sampah'}</strong></span>
              </div>

              {b.sortingDetails && (
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                  Catatan Pemilahan: {b.sortingDetails}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <Card style={{ maxWidth: '520px', width: '100%', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '1rem' }}>Tambah Batch Material Baru</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Sumber Material *</label>
                <select
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.375rem', backgroundColor: '#0F172A', border: '1px solid var(--color-border)', color: '#FFF' }}
                  required
                >
                  {sources.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.location})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Jenis Material *</label>
                <Input value={materialType} onChange={(e) => setMaterialType(e.target.value)} placeholder="Upcycled Denim 14oz" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Berat Total (Kg) *</label>
                  <Input type="number" step="0.1" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Warna Dominan</label>
                  <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="Indigo Blue" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Detail Pemilahan / Sanitasi</label>
                <Input value={sortingDetails} onChange={(e) => setSortingDetails(e.target.value)} placeholder="Telah melalui proses steam sanitasi & pemotongan awal" />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <Button type="button" onClick={() => setShowModal(false)} variant="secondary" style={{ flex: 1 }}>Batal</Button>
                <Button type="submit" variant="primary" disabled={submitting} style={{ flex: 1 }}>{submitting ? 'Simpan...' : 'Simpan Batch'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
