import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Badge } from '../ui/Badge'
import { Menu, X, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react'

export const PublicHeader: React.FC = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      {/* Skip to Main Content Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only"
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 9999,
          padding: '0.75rem 1.25rem',
          backgroundColor: 'var(--color-primary)',
          color: '#000',
          fontWeight: 700,
          borderRadius: 'var(--radius-md)',
          textDecoration: 'none'
        }}
      >
        Lompat ke Konten Utama (Skip to Content)
      </a>

      <header
        style={{
          backgroundColor: scrolled || mobileMenuOpen ? 'rgba(11, 15, 23, 0.95)' : 'rgba(11, 15, 23, 0.8)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          transition: 'background-color 0.3s ease'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '72px'
          }}
        >
          {/* Logo & Brand Identity */}
          <Link
            to={ROUTES.PUBLIC.LANDING}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
            aria-label="EcoThread Beranda"
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#000',
                fontSize: '1.25rem',
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)'
              }}
            >
              E
            </div>
            <div>
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#FFF',
                  fontFamily: 'var(--font-family-heading)',
                  letterSpacing: '-0.02em'
                }}
              >
                EcoThread
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  display: 'block',
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}
              >
                CIRCULAR FASHION TECH
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}
            className="desktop-only"
            aria-label="Navigasi Utama"
          >
            <Link
              to={ROUTES.PUBLIC.LANDING}
              style={{
                color: location.pathname === ROUTES.PUBLIC.LANDING ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: location.pathname === ROUTES.PUBLIC.LANDING ? 600 : 500,
                fontSize: '0.925rem',
                transition: 'color 0.2s'
              }}
            >
              Beranda
            </Link>
            <a
              href="#cara-kerja"
              style={{ color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.925rem' }}
            >
              Cara Kerja
            </a>
            <a
              href="#dpp-info"
              style={{ color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.925rem' }}
            >
              Digital Passport
            </a>
            <Link
              to={ROUTES.PUBLIC.CATALOG}
              style={{
                color: location.pathname.startsWith(ROUTES.PUBLIC.CATALOG) ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: location.pathname.startsWith(ROUTES.PUBLIC.CATALOG) ? 600 : 500,
                fontSize: '0.925rem'
              }}
            >
              Katalog Produk
            </Link>
            <a
              href="#tentang-kami"
              style={{ color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.925rem' }}
            >
              Tentang Kami
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }} className="desktop-only">
            <Badge variant="success">GEMASTIK XIX</Badge>
            <Link
              to={ROUTES.PUBLIC.PORTAL}
              className="btn btn-primary"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem', borderRadius: 'var(--radius-md)' }}
            >
              Buka Portal <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            className="mobile-only"
            style={{
              background: 'none',
              border: 'none',
              color: '#FFF',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'none'
            }}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: 'var(--color-bg-card)',
              borderBottom: '1px solid var(--color-border)',
              padding: '1.5rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <Link
              to={ROUTES.PUBLIC.LANDING}
              style={{ color: '#FFF', fontSize: '1rem', fontWeight: 600, padding: '0.5rem 0' }}
            >
              Beranda
            </Link>
            <a
              href="#cara-kerja"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: 'var(--color-text-muted)', fontSize: '1rem', padding: '0.5rem 0' }}
            >
              Cara Kerja Sirkular
            </a>
            <a
              href="#dpp-info"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: 'var(--color-text-muted)', fontSize: '1rem', padding: '0.5rem 0' }}
            >
              Digital Product Passport
            </a>
            <Link
              to={ROUTES.PUBLIC.CATALOG}
              style={{ color: 'var(--color-text-muted)', fontSize: '1rem', padding: '0.5rem 0' }}
            >
              Katalog Produk
            </Link>
            <a
              href="#tentang-kami"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: 'var(--color-text-muted)', fontSize: '1rem', padding: '0.5rem 0' }}
            >
              Tim EcoThread
            </a>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                to={ROUTES.AUTH.MITRA_REGISTER}
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Daftar Sebagai Mitra Penjahit
              </Link>
              <Link
                to={ROUTES.PUBLIC.PORTAL}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Pilih Portal Operasional <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
