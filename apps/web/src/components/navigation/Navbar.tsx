import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Badge } from '../ui/Badge'
import { Menu, X, ArrowRight } from 'lucide-react'

export const Navbar: React.FC = () => {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header style={{
      backgroundColor: 'rgba(11, 15, 23, 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        <Link to={ROUTES.PUBLIC.LANDING} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: '#000',
            fontSize: '1.125rem'
          }}>
            E
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', fontFamily: 'var(--font-family-heading)' }}>
              EcoThread
            </span>
            <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--color-primary)', fontWeight: 600, letterSpacing: '0.05em' }}>
              CIRCULAR FASHION TECH
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link
            to={ROUTES.PUBLIC.LANDING}
            style={{
              color: location.pathname === ROUTES.PUBLIC.LANDING ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: 500
            }}
          >
            Beranda
          </Link>
          <Link
            to={ROUTES.PUBLIC.CATALOG}
            style={{
              color: location.pathname.startsWith(ROUTES.PUBLIC.CATALOG) ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: 500
            }}
          >
            Katalog
          </Link>
          <Link
            to={ROUTES.PUBLIC.PORTAL}
            style={{
              color: location.pathname === ROUTES.PUBLIC.PORTAL ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: 500
            }}
          >
            Portal Masuk
          </Link>
        </nav>

        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Badge variant="success">GEMASTIK XIX MVP</Badge>
          <Link to={ROUTES.PUBLIC.PORTAL} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            Masuk Portal
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-only"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', color: '#FFF', padding: '0.5rem', cursor: 'pointer', minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div
          className="mobile-only"
          style={{
            backgroundColor: '#0F172A',
            borderBottom: '1px solid var(--color-border)',
            padding: '1.25rem 1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <Link
            to={ROUTES.PUBLIC.LANDING}
            onClick={() => setMobileOpen(false)}
            style={{ color: '#FFF', fontSize: '1rem', fontWeight: 600, padding: '0.5rem 0' }}
          >
            Beranda
          </Link>
          <Link
            to={ROUTES.PUBLIC.CATALOG}
            onClick={() => setMobileOpen(false)}
            style={{ color: '#FFF', fontSize: '1rem', fontWeight: 600, padding: '0.5rem 0' }}
          >
            Katalog Produk Upcycled
          </Link>
          <Link
            to={ROUTES.PUBLIC.PORTAL}
            onClick={() => setMobileOpen(false)}
            style={{ color: 'var(--color-primary)', fontSize: '1rem', fontWeight: 600, padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            Pilih Portal Masuk <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </header>
  )
}
