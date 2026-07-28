import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Badge } from '../ui/Badge'
import { ArrowRight, ShieldCheck, QrCode, Sparkles } from 'lucide-react'

export const HeroSection: React.FC = () => {
  return (
    <section
      style={{
        padding: '5.5rem 0 4.5rem',
        background: 'radial-gradient(ellipse at 50% 15%, rgba(16, 185, 129, 0.18) 0%, rgba(11, 15, 23, 0) 70%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        {/* Badge & Pill Header */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Badge variant="success">
            <Sparkles size={13} style={{ marginRight: '4px' }} /> Platform Manufaktur Sirkular Terdesentralisasi
          </Badge>
        </div>

        {/* Main Headline */}
        <h1
          style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            color: '#FFF',
            marginBottom: '1.25rem',
            maxWidth: '900px',
            margin: '0 auto 1.25rem',
            lineHeight: 1.15,
            letterSpacing: '-0.03em'
          }}
        >
          Mengubah Limbah Tekstil Menjadi Produk Upcycled Melalui Penjahit Lokal &amp; Dynamic DPP
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--color-text-muted)',
            maxWidth: '720px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6
          }}
        >
          EcoThread menghubungkan pengelolaan material limbah garmen, validasi pola presisi Human-in-the-Loop, keterampilan mitra penjahit lokal, serta transparansi <strong>Digital Product Passport (DPP)</strong> dengan penjangkaran Polygon Amoy dalam satu rantai pasok terukur.
        </p>

        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <Link
            to={ROUTES.AUTH.MITRA_REGISTER}
            className="btn btn-primary"
            style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}
          >
            Gabung Sebagai Mitra Penjahit <ArrowRight size={18} />
          </Link>

          <Link
            to={ROUTES.PUBLIC.PORTAL}
            className="btn btn-secondary"
            style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}
          >
            Buka Portal Operasional
          </Link>

          <Link
            to={ROUTES.PUBLIC.getDpp('PRD-DEMO')}
            className="btn btn-outline"
            style={{ padding: '0.875rem 1.75rem', fontSize: '0.95rem' }}
          >
            <QrCode size={18} /> Pemindaian DPP Demo
          </Link>
        </div>

        {/* Trust Badges */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            color: 'var(--color-text-dim)',
            fontSize: '0.875rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '2rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} color="var(--color-primary)" /> Terverifikasi Database Canonical
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} color="var(--color-primary)" /> Panduan Pola Presisi Human-in-the-Loop
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} color="var(--color-primary)" /> Transparansi Upah Mitra
          </span>
        </div>
      </div>
    </section>
  )
}
