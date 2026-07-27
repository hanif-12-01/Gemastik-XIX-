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
import { Plus, ArrowLeft, Package } from 'lucide-react'

export const AdminEcoKitsPage: React.FC = () => {
  const [kits, setKits] = useState<any[]>([])
  const [patterns, setPatterns] = useState<any[]>([])
  const [batches, setBatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const [name, setName] = useState('')
  const [patternId, setPatternId] = useState('')
  const [batchId, setBatchId] = useState('')
  const [allocatedQty, setAllocatedQty] = useState<number>(3.5)
  const [targetHours, setTargetHours] = useState<number>(5.0)
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [kitData, patternData, batchData] = await Promise.all([
        apiClient.listEcoKits(),
        apiClient.listPatterns(),
        apiClient.getMaterialBatches()
      ])
      setKits(kitData)
      setPatterns(patternData)
      setBatches(batchData)
      if (patternData.length > 0) setPatternId(patternData[0].id)
      if (batchData.length > 0) setBatchId(batchData[0].id)
    } catch (err: any) {
      setError(err.message || 'Gagal memuat daftar Eco-Kit.')
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

    const selectedBatch = batches.find((b) => b.id === batchId)
    if (selectedBatch && Number(allocatedQty) > selectedBatch.weightKg) {
      setError(`Alokasi material ${allocatedQty}kg melebihi stok batch yang ada (${selectedBatch.weightKg}kg).`)
      return
    }

    try {
      setSubmitting(true)
      await apiClient.createEcoKit({
        name,
        patternId,
        difficulty: 'Medium',
        targetHours: Number(targetHours),
        items: [
          {
            batchId,
            quantity: Number(allocatedQty),
            unit: 'kg',
            itemNotes: 'Bahan limbah denim utama'
          }
        ]
      })
      setShowModal(false)
      setName('')
      await fetchData()
    } catch (err: any) {
      setError(err.message || 'Gagal membuat Eco-Kit.')
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
          <Badge variant="warning" className="mb-2">Paket Produksi Standardized</Badge>
          <h1 style={{ fontSize: '1.75rem', color: '#FFF' }}>Manajemen Eco-Kits Terstandardisasi</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Kombinasi pola terverifikasi dan alokasi material terukur yang siap ditugaskan ke Mitra.
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} variant="primary">
          <Plus size={16} /> Merakit Eco-Kit Baru
        </Button>
      </div>

      {error && <Alert type="danger" title="Error">{error}</Alert>}

      {loading ? (
        <LoadingSpinner message="Memuat daftar Eco-Kit..." />
      ) : kits.length === 0 ? (
        <EmptyState title="Belum Ada Eco-Kit" description="Rakit Eco-Kit pertama Anda dengan menggabungkan pola dan material." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {kits.map((k) => (
            <Card key={k.id} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Package color="var(--color-primary)" size={20} />
                  <h3 style={{ fontSize: '1.1rem', color: '#FFF', margin: 0 }}>{k.name}</h3>
                </div>
                <Badge variant="success">{k.status}</Badge>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--color-warning)', fontWeight: 600, marginBottom: '0.5rem' }}>
                {k.kitCode} &bull; Pola: <strong>{k.pattern?.name || 'Standard'}</strong>
              </p>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                <div>Material Teralokasi:</div>
                {k.ecoKitItems?.map((item: any) => (
                  <div key={item.id} style={{ color: '#FFF', fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>
                    &bull; {item.batch?.materialType || 'Denim'} ({item.quantity} {item.unit})
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <Card style={{ maxWidth: '520px', width: '100%', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '1rem' }}>Merakit Eco-Kit Baru</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Nama Paket Eco-Kit *</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Eco-Kit Upcycled Denim Kimono #01" required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Pilih Pola Terverifikasi *</label>
                <select
                  value={patternId}
                  onChange={(e) => setPatternId(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.375rem', backgroundColor: '#0F172A', border: '1px solid var(--color-border)', color: '#FFF' }}
                  required
                >
                  {patterns.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.patternCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Pilih Batch Material *</label>
                <select
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.375rem', backgroundColor: '#0F172A', border: '1px solid var(--color-border)', color: '#FFF' }}
                  required
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>{b.batchCode} - {b.materialType} (Sisa: {b.weightKg} kg)</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Alokasi Berat (Kg) *</label>
                  <Input type="number" step="0.1" value={allocatedQty} onChange={(e) => setAllocatedQty(Number(e.target.value))} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Target Alokasi Jam</label>
                  <Input type="number" step="0.5" value={targetHours} onChange={(e) => setTargetHours(Number(e.target.value))} required />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <Button type="button" onClick={() => setShowModal(false)} variant="secondary" style={{ flex: 1 }}>Batal</Button>
                <Button type="submit" variant="primary" disabled={submitting} style={{ flex: 1 }}>{submitting ? 'Merakit...' : 'Rakit Eco-Kit'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
