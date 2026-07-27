import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { QrCode, CheckCircle, Database, Link as LinkIcon, Eye } from 'lucide-react'

export const DppSection: React.FC = () => {
  return (
    <section id="dpp-info" style={{ padding: '5rem 0', backgroundColor: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <Badge variant="success" className="mb-2">Transparansi Tanpa Greenwashing</Badge>
          <h2 style={{ fontSize: '2.25rem', color: '#FFF', marginBottom: '0.75rem' }}>
            Digital Product Passport (DPP) EcoThread
          </h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '680px', margin: '0 auto' }}>
            Setiap produk pakaian sirkular EcoThread membawa paspor digital unik yang dapat dipindai melalui QR Code tanpa perlu menginstal aplikasi.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          {/* DPP Features Overview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <Database color="var(--color-primary)" size={24} style={{ marginTop: '4px' }} />
                <div>
                  <h3 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '0.375rem' }}>
                    Verifikasi Database Canonical (Database Verified)
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    Setiap rekam rekam jejak material, proses sanitasi, profil penjahit, dan checklist QC disimpan secara resmi di database utama platform.
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <LinkIcon color="var(--color-secondary)" size={24} style={{ marginTop: '4px' }} />
                <div>
                  <h3 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '0.375rem' }}>
                    Integrasi Anchoring Blockchain (Penyempurnaan Roadmap)
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    Sebagai lapisan verifikasi audit tambahan, hash metadata DPP direncanakan untuk di-anchor ke jaringan <strong>Polygon Amoy Testnet</strong> pada roadmap rilis lanjutan.
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <Eye color="var(--color-accent)" size={24} style={{ marginTop: '4px' }} />
                <div>
                  <h3 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '0.375rem' }}>
                    Foto Before &amp; After Pembuatan
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    Konsumen dapat melihat visual transformasi nyata dari limbah garmen bekas (before) menjadi produk busana upcycled bernilai tinggi (after).
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* DPP Demo Preview Card */}
          <Card style={{ backgroundColor: 'var(--color-bg-main)', border: '1px solid var(--color-primary)', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
            <div
              style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 1.5rem',
                backgroundColor: '#FFF',
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <QrCode size={80} color="#000" />
            </div>

            <Badge variant="success" className="mb-2">Status: Database Verified</Badge>
            <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '0.5rem' }}>Kode Produk: PRD-DEMO</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Jaket Denim Upcycle Heritage Batch #1
            </p>

            <Link to={ROUTES.PUBLIC.getDpp('PRD-DEMO')} className="btn btn-primary" style={{ width: '100%' }}>
              Uji Coba Pemindaian DPP Demo
            </Link>
          </Card>
        </div>
      </div>
    </section>
  )
}
