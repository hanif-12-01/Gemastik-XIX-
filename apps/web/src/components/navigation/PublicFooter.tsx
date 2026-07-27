import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'

export const PublicFooter: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderTop: '1px solid var(--color-border)',
        padding: '3.5rem 0 2rem',
        marginTop: 'auto'
      }}
    >
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem'
          }}
        >
          {/* Brand Identity Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: '#000'
                }}
              >
                E
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>EcoThread</span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '320px' }}>
              Platform manufaktur fashion sirkular terdesentralisasi berbasis Digital Product Passport (DPP).
            </p>
          </div>

          {/* Nav Links Column */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#FFF', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Navigasi Utama
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li>
                <Link to={ROUTES.PUBLIC.LANDING} style={{ color: 'var(--color-text-muted)' }}>
                  Beranda
                </Link>
              </li>
              <li>
                <a href="#cara-kerja" style={{ color: 'var(--color-text-muted)' }}>
                  Cara Kerja Sirkular
                </a>
              </li>
              <li>
                <a href="#dpp-info" style={{ color: 'var(--color-text-muted)' }}>
                  Digital Product Passport
                </a>
              </li>
              <li>
                <Link to={ROUTES.PUBLIC.CATALOG} style={{ color: 'var(--color-text-muted)' }}>
                  Katalog Produk
                </Link>
              </li>
            </ul>
          </div>

          {/* Portal Links Column */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#FFF', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Akses Portal Operasional
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
              <li>
                <Link to={ROUTES.PUBLIC.PORTAL} style={{ color: 'var(--color-text-muted)' }}>
                  Portal Selection
                </Link>
              </li>
              <li>
                <Link to={ROUTES.AUTH.MITRA_REGISTER} style={{ color: 'var(--color-text-muted)' }}>
                  Registrasi Mitra Penjahit
                </Link>
              </li>
              <li>
                <Link to={ROUTES.AUTH.MITRA_LOGIN} style={{ color: 'var(--color-text-muted)' }}>
                  Login Portal Mitra
                </Link>
              </li>
              <li>
                <Link to={ROUTES.AUTH.ADMIN_LOGIN} style={{ color: 'var(--color-text-muted)' }}>
                  Login Admin City Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Project Info Column */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#FFF', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Konteks Pengujian
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              GEMASTIK XIX — Divisi Bisnis TIK
              <br />
              Target Single-Web App: Vercel SPA (`apps/web`)
            </p>
            <Link to={ROUTES.PUBLIC.getDpp('PRD-DEMO')} style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>
              Uji Pemindaian DPP Demo &rarr;
            </Link>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: '1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.825rem',
            color: 'var(--color-text-dim)'
          }}
        >
          <span>&copy; 2026 Tim EcoThread. Dibuat untuk Gemastik XIX — Divisi Bisnis TIK.</span>
          <span>Roadmap 1 — Landing Page &amp; Portal Selection</span>
        </div>
      </div>
    </footer>
  )
}
