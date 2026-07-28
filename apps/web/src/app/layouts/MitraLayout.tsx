import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  CircleDollarSign,
  ClipboardList,
  Home,
  LogOut,
  ShieldCheck,
  User
} from 'lucide-react'
import { useAuth } from '../../features/auth/AuthContext'
import { ROUTES } from '../../lib/routes'
import '../../styles/mitra.css'

const navItems = [
  { label: 'Beranda', path: ROUTES.MITRA.DASHBOARD, icon: Home },
  { label: 'Pekerjaan', path: '/mitra/orders', icon: ClipboardList },
  { label: 'Upah', path: '/mitra/payouts', icon: CircleDollarSign },
  { label: 'Profil', path: '/mitra/profile', icon: User }
]

export const MitraLayout: React.FC = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/mitra') return location.pathname === '/mitra'
    return location.pathname.startsWith(path)
  }

  const workshopName =
    user?.mitraProfile?.workshopName ||
    user?.name ||
    'Mitra EcoThread'

  return (
    <div className="mitra-app">
      <header className="mitra-topbar">
        <Link to={ROUTES.MITRA.DASHBOARD} className="mitra-brand">
          <img src="/ecothread-logo.png" alt="EcoThread" />
          <div>
            <strong>Ruang Kerja Mitra</strong>
            <span>{workshopName}</span>
          </div>
        </Link>

        <div className="mitra-topbar__actions">
          <span className="mitra-verified">
            <ShieldCheck size={17} aria-hidden="true" />
            Mitra terverifikasi
          </span>
          <button type="button" onClick={logout} className="mitra-logout" aria-label="Keluar dari akun">
            <LogOut size={18} aria-hidden="true" />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      <main className="mitra-main">
        <Outlet />
      </main>

      <nav className="mitra-nav" aria-label="Menu utama Mitra">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={22} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
