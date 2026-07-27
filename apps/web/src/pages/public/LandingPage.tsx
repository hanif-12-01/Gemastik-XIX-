import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'

export const LandingPage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        padding: '5rem 0 4rem',
        background: 'radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.15) 0%, rgba(11, 15, 23, 0) 70%)',
        textAlign: 'center'
      }}>
        <div className="container">
          <Badge variant="success" className="mb-4">Platform Manufaktur Sirkular Terdesentralisasi</Badge>
          <h1 style={{ fontSize: '3rem', color: '#FFF', marginBottom: '1.25rem', maxWidth: '850px', margin: '1rem auto' }}>
            Mengubah Limbah Tekstil Menjadi High-Fashion Melalui AI & Digital Product Passport
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', maxWidth: '680px', margin: '0 auto 2.5rem' }}>
            EcoThread menghubungkan City Hub pengelola material, mitra penjahit lokal, dan konsumen eco-conscious dalam satu rantai pasok terukur dan terverifikasi.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to={ROUTES.PUBLIC.PORTAL} className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
              Masuk Portal Operasional
            </Link>
            <Link to={ROUTES.PUBLIC.CATALOG} className="btn btn-secondary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
              Jelajahi Katalog Produk
            </Link>
            <Link to={ROUTES.PUBLIC.getDpp('PRD-DEMO')} className="btn btn-outline" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
              Pemindaian DPP Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Vertical Slice Workflow Overview */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', color: '#FFF', marginBottom: '0.5rem' }}>Rantai Pasok Sirkular EcoThread</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Alur produksi terintegrasi dari limbah hingga transparansi produk</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <Card hoverable>
              <Badge variant="info">01. Material & AI Map</Badge>
              <h3 style={{ fontSize: '1.125rem', margin: '0.75rem 0 0.5rem', color: '#FFF' }}>Digitalisasi Material</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Batch limbah garmen disanitasi, difoto, dan disegmentasi oleh Computer Vision untuk menghasilkan usable pattern area.
              </p>
            </Card>

            <Card hoverable>
              <Badge variant="info">02. Eco-Kit & Mitra</Badge>
              <h3 style={{ fontSize: '1.125rem', margin: '0.75rem 0 0.5rem', color: '#FFF' }}>Penugasan Penjahit</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Admin merakit paket Eco-Kit dan mengalokasikan pekerjaan kepada Mitra penjahit terverifikasi dengan panduan presisi.
              </p>
            </Card>

            <Card hoverable>
              <Badge variant="info">03. Quality Control</Badge>
              <h3 style={{ fontSize: '1.125rem', margin: '0.75rem 0 0.5rem', color: '#FFF' }}>Inspeksi QC & Payout</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Mitra mengunggah bukti foto progres. Admin memverifikasi checklist QC sebelum mencatat dan melepas pembayaran.
              </p>
            </Card>

            <Card hoverable>
              <Badge variant="info">04. Dynamic DPP</Badge>
              <h3 style={{ fontSize: '1.125rem', margin: '0.75rem 0 0.5rem', color: '#FFF' }}>Passports & Commerce</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Produk dipublikasikan bersama QR Code DPP dinamis yang menampilkan asal material, maker, dan metrik penghematan CO2/air.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Role Selection Banner */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <Card style={{ background: 'linear-gradient(135deg, #131B2A 0%, #1A263B 100%)', padding: '3rem 2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', color: '#FFF', marginBottom: '1rem' }}>Siap Mengakses Portal Operasional?</h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '560px', margin: '0 auto 2rem' }}>
              Pilih portal sesuai peran Anda sebagai Pengelola City Hub (Admin) atau Mitra Penjahit Terverifikasi.
            </p>
            <Link to={ROUTES.PUBLIC.PORTAL} className="btn btn-primary" style={{ padding: '0.875rem 2rem' }}>
              Buka Pemilihan Portal (Portal Selection)
            </Link>
          </Card>
        </div>
      </section>
    </div>
  )
}
