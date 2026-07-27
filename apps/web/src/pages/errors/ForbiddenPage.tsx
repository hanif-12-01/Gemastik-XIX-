import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'

export const ForbiddenPage: React.FC = () => {
  return (
    <div style={{ padding: '5rem 0', textAlign: 'center' }}>
      <div className="container-narrow">
        <Card>
          <Badge variant="danger" className="mb-2">403 Forbidden</Badge>
          <h1 style={{ fontSize: '2.5rem', color: '#FFF', margin: '1rem 0 0.5rem' }}>Akses Ditolak</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            Anda tidak memiliki izin atau peran yang sesuai untuk membuka area aplikasi ini.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to={ROUTES.PUBLIC.PORTAL} className="btn btn-primary">
              Pilih Portal yang Sesuai
            </Link>
            <Link to={ROUTES.PUBLIC.LANDING} className="btn btn-secondary">
              Kembali ke Beranda
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
