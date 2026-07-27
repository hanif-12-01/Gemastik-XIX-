import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Badge } from '../../components/ui/Badge'

export const MitraLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
      {/* Mobile-first Header */}
      <header style={{ height: '60px', backgroundColor: 'var(--color-bg-card)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', color: '#FFF' }}>Portal Mitra</h2>
          <Badge variant="info">Penjahit</Badge>
        </div>
        <Link to={ROUTES.PUBLIC.LANDING} style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          Keluar
        </Link>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, padding: '1rem', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile Tailors */}
      <nav style={{ height: '60px', backgroundColor: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', position: 'sticky', bottom: 0 }}>
        <Link to={ROUTES.PROTECTED.MITRA} style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
          Pesanan Saya
        </Link>
        <span style={{ color: 'var(--color-text-dim)', fontSize: '0.875rem' }}>Dompet</span>
        <span style={{ color: 'var(--color-text-dim)', fontSize: '0.875rem' }}>Profil</span>
      </nav>
    </div>
  )
}
