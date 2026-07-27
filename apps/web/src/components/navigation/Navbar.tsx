import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Badge } from '../ui/Badge'

export const Navbar: React.FC = () => {
  const location = useLocation()

  return (
    <header style={{
      backgroundColor: 'rgba(11, 15, 23, 0.85)',
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

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Badge variant="success">GEMASTIK XIX MVP</Badge>
          <Link to={ROUTES.PUBLIC.PORTAL} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            Masuk Portal
          </Link>
        </div>
      </div>
    </header>
  )
}
