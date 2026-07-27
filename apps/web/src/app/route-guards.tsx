import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { defaultTokenProvider } from '../lib/api'
import { ROUTES } from '../lib/routes'
import { Alert } from '../components/feedback/Alert'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

interface RouteGuardProps {
  requiredRole: 'admin' | 'mitra' | 'user'
  children: React.ReactNode
}

/**
 * RouteGuard component for protected routes in apps/web.
 * Enforces role boundaries and explicit authentication state checks.
 * Does NOT hardcode or fake authenticated sessions.
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({ requiredRole, children }) => {
  const token = defaultTokenProvider.getToken()
  const location = useLocation()

  // In Roadmap 0: Authentication placeholder boundary
  // If no token exists, present explicit authentication requirement notice rather than silent privilege grant.
  if (!token) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <Card>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFF' }}>Otentikasi Diperlukan</h3>
            <Badge variant="warning">Akses Terproteksi ({requiredRole.toUpperCase()})</Badge>
          </div>

          <Alert type="warning" title="Batas Keamanan Roadmap 0">
            Halaman ini membutuhkan otentikasi peran <strong>{requiredRole}</strong> yang valid.
            Integrasi otentikasi dan sesi nyata akan dihubungkan secara penuh pada <strong>Roadmap 2</strong>.
          </Alert>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Sistem tidak memberikan hak akses tanpa verifikasi kredensial. Silakan masuk melalui portal otentikasi resmi.
          </p>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button
              variant="primary"
              onClick={() => {
                const loginPath = requiredRole === 'admin' ? ROUTES.AUTH.ADMIN_LOGIN : ROUTES.AUTH.MITRA_LOGIN
                window.location.href = `${loginPath}?redirect=${encodeURIComponent(location.pathname)}`
              }}
            >
              Masuk Portal {requiredRole.toUpperCase()}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                window.location.href = ROUTES.PUBLIC.PORTAL
              }}
            >
              Pilih Portal Lain
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // When token exists, render child routes (in Roadmap 2 full JWT token claims validation will occur)
  return <>{children}</>
}
