import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'
import { ROUTES } from '../../lib/routes'
import {
  LayoutDashboard,
  Scissors,
  User,
  CreditCard,
  LogOut,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react'

export const MitraLayout: React.FC = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { label: 'Dashboard', path: ROUTES.MITRA.DASHBOARD, icon: LayoutDashboard },
    { label: 'Pesanan Saya', path: '/mitra/orders', icon: Scissors },
    { label: 'Profil & Kapasitas', path: '/mitra/profile', icon: User },
    { label: 'Riwayat Payout', path: '/mitra/payouts', icon: CreditCard }
  ]

  const isActive = (path: string) => {
    if (path === '/mitra') return location.pathname === '/mitra'
    return location.pathname.startsWith(path)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg-dark)' }}>
      {/* Header Bar */}
      <header
        style={{
          height: '60px',
          backgroundColor: '#0F172A',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '0.375rem', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#000', fontSize: '0.85rem' }}>
            ET
          </div>
          <div>
            <div style={{ color: '#FFF', fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>Mitra EcoThread</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>
              {user?.mitraProfile?.workshopName || user?.name}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-status-success)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <ShieldCheck size={14} /> Terverifikasi
          </span>

          <button
            onClick={logout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '0.375rem',
              border: '1px solid var(--color-border)',
              backgroundColor: 'transparent',
              color: 'var(--color-status-danger)',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '70px' }}>
        <Outlet />
      </main>

      {/* Mobile-First Bottom Navigation Bar */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          backgroundColor: '#0F172A',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 40
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem',
                color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontSize: '0.7rem',
                fontWeight: active ? 600 : 400,
                textDecoration: 'none',
                flex: 1,
                height: '100%'
              }}
            >
              <Icon size={20} color={active ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
