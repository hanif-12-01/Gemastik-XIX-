import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Badge } from '../../components/ui/Badge'

export const AuthLayout: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg-main)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <Link to={ROUTES.PUBLIC.LANDING} style={{ textDecoration: 'none' }}>
          <h1 style={{ fontSize: '2rem', color: '#FFF', marginBottom: '0.25rem' }}>EcoThread</h1>
        </Link>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          Platform Manufaktur Fashion Sirkular Terdesentralisasi
        </p>
        <div style={{ marginTop: '0.5rem' }}>
          <Badge variant="info">Otentikasi Aman Roadmap 0</Badge>
        </div>
      </div>

      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <Outlet />
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link to={ROUTES.PUBLIC.PORTAL} style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          &larr; Kembali ke Pemilihan Portal
        </Link>
      </div>
    </div>
  )
}
