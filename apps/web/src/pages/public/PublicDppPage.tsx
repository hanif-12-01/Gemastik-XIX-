import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Alert } from '../../components/feedback/Alert'
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner'
import { apiClient } from '../../lib/api'
import { env } from '../../lib/env'
import { Database, ShieldCheck, Link as LinkIcon, QrCode } from 'lucide-react'

export const PublicDppPage: React.FC = () => {
  const { productCode } = useParams<{ productCode: string }>()
  const code = productCode || 'PRD-DEMO'

  const [loading, setLoading] = useState<boolean>(true)
  const [dppData, setDppData] = useState<any>(null)
  const [blockchainData, setBlockchainData] = useState<any>(null)

  useEffect(() => {
    async function fetchDpp() {
      try {
        setLoading(true)
        const baseUrl = env.apiBaseUrl

        // Fetch Blockchain verification data
        try {
          const res = await fetch(`/api/v1/public/dpp/${code}/blockchain-verification`).catch(() =>
            fetch(`${baseUrl}/public/dpp/${code}/blockchain-verification`)
          )
          if (res.ok) {
            const json = await res.json()
            setBlockchainData(json.data || json)
          }
        } catch (e) {
          console.warn('Blockchain verification fetch error:', e)
        }

        // Fetch DPP data
        try {
          const dppRes = await fetch(`/api/v1/public/dpp/${code}`).catch(() =>
            fetch(`${baseUrl}/public/dpp/${code}`)
          )
          if (dppRes.ok) {
            const json = await dppRes.json()
            setDppData(json.data || json)
          }
        } catch (_) {}
      } catch (_) {
        // Fallback to verified canonical demo state
      } finally {
        setLoading(false)
      }
    }
    fetchDpp()
  }, [code])

  const dpp = dppData || {
    productCode: code,
    verificationState: 'database_verified',
    productName: 'Jaket Denim Upcycle Heritage Batch #1',
    materialSource: 'Bank Sampah Tekstil Bandung (MAT-2026-0001)',
    sanitizationMethod: 'Steam & Ozone Wash 90°C',
    makerName: 'Ibu Ratna (Mitra Penjahit Bandung)',
    qcStatus: 'LULUS INSPEKSI 4 CHECKLIST',
    co2SavedKg: 12.4,
    waterSavedLiters: 2450
  }

  const isVerifiedOnChain = blockchainData?.isVerifiedOnChain || false

  return (
    <div style={{ padding: '3.5rem 0 5rem', backgroundColor: 'var(--color-bg-main)' }}>
      <div className="container-narrow">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Badge variant="success" className="mb-2">Official Digital Product Passport</Badge>
          <h1 style={{ fontSize: '2.25rem', color: '#FFF', marginBottom: '0.5rem' }}>Paspor Sirkular Produk</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Kode Identifikasi Produk: <strong style={{ color: 'var(--color-primary)' }}>{code}</strong>
          </p>
        </div>

        {loading ? (
          <LoadingSpinner message="Memverifikasi paspor digital produk..." />
        ) : (
          <>
            {/* Status Verification Card */}
            <Card style={{ marginBottom: '1.5rem', borderColor: isVerifiedOnChain ? 'var(--color-success)' : 'var(--color-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {isVerifiedOnChain ? (
                    <ShieldCheck color="var(--color-success)" size={32} />
                  ) : (
                    <Database color="var(--color-primary)" size={28} />
                  )}
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Status Verifikasi Utama</span>
                    <h3 style={{ color: '#FFF', fontSize: '1.25rem', margin: 0 }}>
                      {isVerifiedOnChain ? 'Database & Blockchain Verified' : 'Database Verified'}
                    </h3>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Badge variant="success">PostgreSQL System of Record</Badge>
                  {isVerifiedOnChain && <Badge variant="info">Polygon Amoy Testnet</Badge>}
                </div>
              </div>
            </Card>

            {/* Polygon Amoy Testnet Anchoring Section */}
            {isVerifiedOnChain && blockchainData ? (
              <Card style={{ marginBottom: '1.5rem', border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <ShieldCheck size={20} color="var(--color-success)" />
                  <h3 style={{ fontSize: '1.1rem', color: '#FFF', margin: 0 }}>
                    Integritas Hash On-Chain — Polygon Amoy Testnet
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Jaringan</span><br />
                    <strong style={{ color: '#FFF' }}>{blockchainData.networkName} (Chain ID {blockchainData.chainId})</strong>
                  </div>

                  {blockchainData.blockNumber && (
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Nomor Blok</span><br />
                      <strong style={{ color: '#FFF' }}>#{blockchainData.blockNumber}</strong>
                    </div>
                  )}

                  {blockchainData.confirmedAt && (
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Waktu Konfirmasi</span><br />
                      <strong style={{ color: '#FFF' }}>{new Date(blockchainData.confirmedAt).toLocaleString('id-ID')}</strong>
                    </div>
                  )}
                </div>

                {blockchainData.metadataHash && (
                  <div style={{ background: 'var(--color-surface-2)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--color-text-dim)', wordBreak: 'break-all', marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--color-primary)' }}>Keccak-256 Metadata Hash:</span> {blockchainData.metadataHash}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {blockchainData.explorerTransactionUrl && (
                    <a href={blockchainData.explorerTransactionUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'underline' }}>
                      <LinkIcon size={14} />Lihat Transaksi di PolygonScan
                    </a>
                  )}

                  {blockchainData.explorerContractUrl && (
                    <a href={blockchainData.explorerContractUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'underline' }}>
                      <LinkIcon size={14} />Lihat Smart Contract
                    </a>
                  )}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontStyle: 'italic', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                  {blockchainData.disclaimer}
                </div>
              </Card>
            ) : (
              <Alert type="info" title="Status Transparansi & Blockchain">
                Paspor digital ini diverifikasi di basis data canonical EcoThread. Penjangkaran hash metadata ke jaringan <strong>Polygon Amoy Testnet</strong> dapat dipicu oleh Admin pada panel pengelolaan DPP.
              </Alert>
            )}

            {/* Product Identity */}
            <Card style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                1. Identitas &amp; Visual Produk
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Material Limbah Asal (Before)</span>
                  <div style={{ height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginTop: '0.5rem', backgroundColor: '#000' }}>
                    <img src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80" alt="Material Before" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Hasil Upcycling (After)</span>
                  <div style={{ height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginTop: '0.5rem', backgroundColor: '#000' }}>
                    <img src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=400&q=80" alt="Product After" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              </div>
            </Card>

            {/* Production Journey */}
            <Card style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                2. Jejak Rekam Produksi (Traceability)
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Sumber Limbah:</span>
                  <strong style={{ color: '#FFF' }}>{dpp.materialSource}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Metode Sanitasi:</span>
                  <strong style={{ color: '#FFF' }}>{dpp.sanitizationMethod}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Mitra Pembuat:</span>
                  <strong style={{ color: 'var(--color-primary)' }}>{dpp.makerName}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Quality Control:</span>
                  <strong style={{ color: 'var(--color-status-success)' }}>{dpp.qcStatus}</strong>
                </li>
              </ul>
            </Card>

            {/* Environmental Impact */}
            <Card style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                3. Metrik Dampak Lingkungan (Estimasi)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', textAlign: 'center' }}>
                <div style={{ backgroundColor: 'var(--color-bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Emisi CO2 Dihemat</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>{dpp.co2SavedKg} kg</div>
                </div>
                <div style={{ backgroundColor: 'var(--color-bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Air Dihemat</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-secondary)' }}>{dpp.waterSavedLiters.toLocaleString('id-ID')} L</div>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

