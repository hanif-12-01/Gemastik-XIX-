import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Badge } from '../../components/ui/Badge'

export const AdminLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: 'var(--color-bg-card)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem'
      }}>
        <div style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: '#FFF' }}>EcoThread Admin</h2>
          <Badge variant="warning" className="mt-1">City Hub Portal</Badge>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <Link to={ROUTES.PROTECTED.ADMIN} style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', fontWeight: 600 }}>
            Dashboard Overview
          </Link>
          <span style={{ padding: '0.75rem 1rem', color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>Material & Eco-Kits (Roadmap 1)</span>
          <span style={{ padding: '0.75rem 1rem', color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>QC & Payouts (Roadmap 1)</span>
          <span style={{ padding: '0.75rem 1rem', color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>Products & DPP (Roadmap 1)</span>
        </nav>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
          <Link to={ROUTES.PUBLIC.LANDING} style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            &larr; Keluar ke Beranda
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '64px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--color-text-main)' }}>City Hub Operational Console</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Role: Admin</span>
          </div>
        </header>

        <main style={{ flex: 1, padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
