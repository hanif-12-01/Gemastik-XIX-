import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'
import { ROUTES } from '../../lib/routes'
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  Scissors,
  FileCheck,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Database,
  Truck,
  CreditCard,
  QrCode
} from 'lucide-react'

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { label: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
    { label: 'Verifikasi Mitra', path: ROUTES.ADMIN.MITRA_APPLICATIONS, icon: Users },
    { label: 'Sumber Material', path: '/admin/materials/sources', icon: Truck },
    { label: 'Batch Material', path: '/admin/materials', icon: Layers },
    { label: 'Pola Garment', path: '/admin/patterns', icon: Scissors },
    { label: 'Eco-Kits', path: '/admin/eco-kits', icon: Package },
    { label: 'Production Orders', path: '/admin/orders', icon: FileCheck },
    { label: 'Review QC', path: '/admin/qc', icon: ShieldCheck },
    { label: 'Manajemen Payout', path: '/admin/payouts', icon: CreditCard },
    { label: 'Produk & DPP', path: '/admin/products', icon: QrCode }
  ]

  const disabledItems: Array<{ label: string; icon: any }> = []


  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-dark)' }}>
      {/* Sidebar Desktop */}
      <aside
        className="desktop-only"
        style={{
          width: '260px',
          backgroundColor: '#0F172A',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh'
        }}
      >
        {/* Brand */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '0.5rem', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#000' }}>
            ET
          </div>
          <div>
            <div style={{ color: '#FFF', fontWeight: 700, fontSize: '1.125rem' }}>EcoThread</div>
            <div style={{ color: 'var(--color-warning)', fontSize: '0.75rem', fontWeight: 600 }}>Portal Admin City Hub</div>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-dim)', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
            OPERASIONAL UTAMA
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontWeight: active ? 600 : 400,
                      color: active ? '#FFF' : 'var(--color-text-muted)',
                      backgroundColor: active ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                      borderLeft: active ? '3px solid var(--color-primary)' : '3px solid transparent'
                    }}
                  >
                    <Icon size={18} color={active ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-dim)', marginTop: '1.5rem', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
            MODUL MENATANG
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {disabledItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.label}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.55rem 0.85rem',
                      fontSize: '0.8rem',
                      color: 'var(--color-text-dim)',
                      opacity: 0.6,
                      cursor: 'not-allowed'
                    }}
                  >
                    <Icon size={16} />
                    {item.label}
                  </div>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Footer */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--color-border)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFF' }}>{user?.name || 'Admin'}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user?.email}</div>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              border: '1px solid var(--color-border)',
              backgroundColor: 'transparent',
              color: 'var(--color-status-danger)',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            <LogOut size={14} /> Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header Bar */}
        <header
          style={{
            height: '64px',
            backgroundColor: '#0F172A',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 30
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="mobile-only"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              <span>Admin</span>
              <ChevronRight size={14} />
              <span style={{ color: '#FFF', fontWeight: 600 }}>Konsol Operasional</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-warning)', border: '1px solid var(--color-warning)' }}>
              Environ: Local PostgreSQL
            </span>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div
            className="mobile-only"
            style={{
              position: 'fixed',
              top: '64px',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#0F172A',
              zIndex: 40,
              padding: '1.5rem',
              overflowY: 'auto'
            }}
          >
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.375rem',
                        color: '#FFF',
                        backgroundColor: isActive(item.path) ? 'rgba(16, 185, 129, 0.15)' : 'transparent'
                      }}
                    >
                      <Icon size={20} />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <div style={{ marginTop: '2rem' }}>
              <button
                onClick={() => { setMobileOpen(false); logout() }}
                className="btn btn-secondary"
                style={{ width: '100%', color: 'var(--color-status-danger)' }}
              >
                <LogOut size={16} /> Keluar (Logout)
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Page Component */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
