import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../../lib/api'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { Alert } from '../../components/feedback/Alert'
import { ArrowLeft, Globe, Shield, ExternalLink } from 'lucide-react'

export const AdminProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [publishingDpp, setPublishingDpp] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [anchorData, setAnchorData] = useState<any>(null)
  const [loadingAnchor, setLoadingAnchor] = useState(false)
  const [anchoring, setAnchoring] = useState(false)

  async function load() {
    try {
      setLoading(true); setError(null)
      const res = await apiClient.get('/admin/products/' + id)
      setProduct(res.data)
    } catch (e: any) { setError(e.message || 'Gagal memuat produk') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [id])

  async function publishProduct() {
    try {
      setPublishing(true); setActionError(null)
      await apiClient.post('/admin/products/' + id + '/publish', {})
      setSuccess('Produk berhasil dipublikasikan ke katalog.')
      await load()
    } catch (e: any) { setActionError(e.message || 'Gagal mempublikasikan produk') }
    finally { setPublishing(false) }
  }

  async function publishDpp() {
    try {
      setPublishingDpp(true); setActionError(null)
      const res = await apiClient.post('/admin/products/' + id + '/publish-dpp', {})
      setSuccess('DPP v' + (res.data.dppVersion?.versionNum || '1') + ' berhasil dipublikasikan. Hash: ' + (res.data.metadataHash?.substring(0, 24) || '') + '...')
      await load()
    } catch (e: any) { setActionError(e.message || 'Gagal mempublikasikan DPP') }
    finally { setPublishingDpp(false) }
  }

  async function loadAnchorData() {
    if (!product?.dppRecord?.id) {
      setAnchorData(null)
      return
    }

    try {
      setLoadingAnchor(true)
      const res = await apiClient.getAdminDppBlockchainAnchor(product.dppRecord.id)
      setAnchorData(res.data)
    } catch {
      setAnchorData(null)
    } finally {
      setLoadingAnchor(false)
    }
  }

  useEffect(() => {
    if (product?.dppRecord?.id) {
      loadAnchorData()
    }
  }, [product?.dppRecord?.id])

  async function handleAnchorAmoy() {
    if (!product?.dppRecord?.id) return
    try {
      setAnchoring(true); setActionError(null)
      const res = await apiClient.anchorDppOnAmoy(product.dppRecord.id)
      setSuccess(res.message || 'Transaksi anchoring ke Polygon Amoy berhasil dikirim!')
      await load()
      await loadAnchorData()
    } catch (e: any) {
      setActionError(e.message || 'Gagal melakukan anchoring ke Polygon Amoy')
    } finally {
      setAnchoring(false)
    }
  }

  async function handleReconcile() {
    if (!product?.dppRecord?.id) return
    try {
      setAnchoring(true); setActionError(null)
      const res = await apiClient.reconcileDppAnchor(product.dppRecord.id)
      setSuccess(res.message || 'Status rekonsiliasi diperbarui!')
      await load()
      await loadAnchorData()
    } catch (e: any) {
      setActionError(e.message || 'Gagal me-rekonsiliasi transaksi')
    } finally {
      setAnchoring(false)
    }
  }

  async function handleRetry() {
    if (!product?.dppRecord?.id) return
    try {
      setAnchoring(true); setActionError(null)
      const res = await apiClient.retryDppAnchor(product.dppRecord.id)
      setSuccess(res.message || 'Ulangi pengiriman transaksi berhasil!')
      await load()
      await loadAnchorData()
    } catch (e: any) {
      setActionError(e.message || 'Gagal mengulangi pengiriman transaksi')
    } finally {
      setAnchoring(false)
    }
  }

  if (loading) return <LoadingSpinner message="Memuat detail produk..." />
  if (error) return <Alert variant="error" message={error} onRetry={load} />
  if (!product) return null

  const statusConfig: Record<string, any> = {
    draft: { label: 'Draft', color: 'warning' },
    published: { label: 'Dipublikasikan', color: 'success' },
    archived: { label: 'Diarsipkan', color: 'danger' }
  }
  const cfg = statusConfig[product.status] || { label: product.status, color: 'info' }
  const latestDppVersion = product.dppRecord?.dppVersions?.[0]

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/admin/products')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={16} />Kembali
        </button>
        <h1 style={{ fontSize: '1.5rem', color: '#FFF', margin: 0 }}>{product.name}</h1>
        <Badge variant={cfg.color}>{cfg.label}</Badge>
        {product.dataOrigin === 'demo' && <Badge variant="info">Demo Data</Badge>}
      </div>

      {success && <Alert variant="success" message={success} />}
      {actionError && <Alert variant="error" message={actionError} />}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card style={{ padding: '1.25rem' }}>
            <h3 style={{ color: 'var(--color-primary)', fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Detail Produk</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1.5rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <div><span style={{ color: 'var(--color-text-muted)' }}>Kode Produk</span><br /><strong style={{ color: '#FFF' }}>{product.productCode}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)' }}>Slug</span><br /><strong style={{ color: '#FFF' }}>{product.slug || '-'}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)' }}>Ukuran</span><br /><strong style={{ color: '#FFF' }}>{product.size}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)' }}>Kategori</span><br /><strong style={{ color: '#FFF' }}>{product.category}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)' }}>Order Asal</span><br /><strong style={{ color: '#FFF' }}>{product.productionOrder?.orderCode}</strong></div>
              <div><span style={{ color: 'var(--color-text-muted)' }}>Mitra</span><br /><strong style={{ color: '#FFF' }}>{product.productionOrder?.mitraUser?.mitraProfile?.workshopName || '-'}</strong></div>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{product.shortDescription}</p>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>{product.description}</p>
          </Card>

          {(product.beforeImageUrl || product.afterImageUrl) && (
            <Card style={{ padding: '1.25rem' }}>
              <h3 style={{ color: 'var(--color-primary)', fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Foto Produk</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {product.beforeImageUrl && (
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Sebelum</p>
                    <img src={product.beforeImageUrl} alt="Sebelum" style={{ width: '100%', borderRadius: '8px' }} />
                  </div>
                )}
                {product.afterImageUrl && (
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Sesudah</p>
                    <img src={product.afterImageUrl} alt="Sesudah" style={{ width: '100%', borderRadius: '8px' }} />
                  </div>
                )}
              </div>
            </Card>
          )}

          {product.dppRecord && (
            <Card style={{ padding: '1.25rem' }}>
              <h3 style={{ color: 'var(--color-primary)', fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Digital Product Passport</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1.5rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                <div><span style={{ color: 'var(--color-text-muted)' }}>Status Verifikasi</span><br /><strong style={{ color: 'var(--color-success)' }}>{product.dppRecord.verificationState}</strong></div>
                <div><span style={{ color: 'var(--color-text-muted)' }}>Versi Terbaru</span><br /><strong style={{ color: '#FFF' }}>v{latestDppVersion?.versionNum || '-'}</strong></div>
              </div>
              {latestDppVersion?.metadataHash && (
                <div style={{ background: 'var(--color-surface-2)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--color-text-dim)', wordBreak: 'break-all' }}>
                  Keccak-256: {latestDppVersion.metadataHash}
                </div>
              )}
              <div style={{ marginTop: '1rem' }}>
                <a href={'/dpp/' + product.productCode} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ExternalLink size={14} />Lihat DPP Publik
                </a>
              </div>
            </Card>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {product.status !== 'published' && (
            <Card style={{ padding: '1.25rem' }}>
              <h3 style={{ color: '#FFF', margin: '0 0 0.75rem', fontSize: '1rem' }}>Publikasikan Produk</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>Produk akan muncul di katalog publik setelah dipublikasikan.</p>
              <button onClick={publishProduct} disabled={publishing} className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Globe size={16} />{publishing ? 'Mempublikasikan...' : 'Publikasikan ke Katalog'}
              </button>
            </Card>
          )}

          <Card style={{ padding: '1.25rem' }}>
            <h3 style={{ color: '#FFF', margin: '0 0 0.75rem', fontSize: '1rem' }}>Digital Product Passport</h3>
            {product.dppRecord ? (
              <div>
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid var(--color-success)', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.8rem' }}>
                  <strong style={{ color: 'var(--color-success)' }}>✓ DPP Aktif</strong>
                  <p style={{ color: 'var(--color-text-muted)', margin: '0.25rem 0 0' }}>Terakhir dipublikasikan: v{latestDppVersion?.versionNum}</p>
                </div>
                <button onClick={publishDpp} disabled={publishingDpp} className="btn" style={{ width: '100%', padding: '0.6rem', background: 'var(--color-surface-2)', color: '#FFF', border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Shield size={16} />{publishingDpp ? 'Memperbarui DPP...' : 'Update & Republish DPP'}
                </button>
              </div>
            ) : (
              <div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>DPP belum dibuat. Klik untuk membuat DPP dengan metadata Keccak-256.</p>
                <button onClick={publishDpp} disabled={publishingDpp} className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Shield size={16} />{publishingDpp ? 'Membuat DPP...' : 'Buat & Publikasikan DPP'}
                </button>
              </div>
            )}
          </Card>

          {/* Roadmap 9: Polygon Amoy Testnet Anchoring Control Panel */}
          {product.dppRecord && (
            <Card style={{ padding: '1.25rem' }}>
              <h3 style={{ color: '#FFF', margin: '0 0 0.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={18} style={{ color: 'var(--color-primary)' }} />
                Polygon Amoy Anchoring
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginBottom: '1rem' }}>
                Anchoring komitmen hash metadata DPP ke Polygon Amoy Testnet (Chain ID 80002).
              </p>

              {anchorData?.anchor ? (
                <div style={{ background: 'var(--color-surface-2)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.75rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)' }}>Status: </span>
                    <strong style={{ color: anchorData.anchor.status === 'verified' ? 'var(--color-success)' : anchorData.anchor.status === 'failed' ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                      {anchorData.anchor.status.toUpperCase()}
                    </strong>
                  </div>

                  {anchorData.anchor.transactionHash && (
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Tx Hash: </span>
                      <a href={anchorData.anchor.explorerTransactionUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', wordBreak: 'break-all' }}>
                        {anchorData.anchor.transactionHash.substring(0, 18)}...
                      </a>
                    </div>
                  )}

                  {anchorData.anchor.contractAddress && (
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Contract: </span>
                      <span style={{ color: '#FFF', fontFamily: 'monospace' }}>{anchorData.anchor.contractAddress.substring(0, 14)}...</span>
                    </div>
                  )}

                  {anchorData.anchor.blockNumber && (
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Block: </span>
                      <span style={{ color: '#FFF' }}>#{anchorData.anchor.blockNumber}</span>
                    </div>
                  )}

                  {anchorData.anchor.failureMessage && (
                    <div style={{ color: 'var(--color-danger)', fontSize: '0.7rem' }}>
                      Pesan Gagal: {anchorData.anchor.failureMessage}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ background: 'var(--color-surface-2)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.75rem', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
                  Belum ada rekam pengiriman ke Polygon Amoy untuk versi DPP ini.
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={handleAnchorAmoy}
                  disabled={anchoring || anchorData?.anchor?.status === 'verified'}
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  {anchoring ? 'Mengirim ke Amoy...' : 'Anchor ke Polygon Amoy'}
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    onClick={handleReconcile}
                    disabled={anchoring || !anchorData?.anchor}
                    className="btn"
                    style={{ background: 'var(--color-surface-2)', color: '#FFF', border: '1px solid var(--color-border)', fontSize: '0.75rem', padding: '0.4rem' }}
                  >
                    Rekonsiliasi
                  </button>

                  <button
                    onClick={handleRetry}
                    disabled={anchoring || anchorData?.anchor?.status === 'verified'}
                    className="btn"
                    style={{ background: 'var(--color-surface-2)', color: 'var(--color-warning)', border: '1px solid var(--color-border)', fontSize: '0.75rem', padding: '0.4rem' }}
                  >
                    Ulangi
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

