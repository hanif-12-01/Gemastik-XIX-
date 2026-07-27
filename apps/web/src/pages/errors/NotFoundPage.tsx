import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{ padding: '5rem 0', textAlign: 'center' }}>
      <div className="container-narrow">
        <Card>
          <Badge variant="danger" className="mb-2">404 Not Found</Badge>
          <h1 style={{ fontSize: '2.5rem', color: '#FFF', margin: '1rem 0 0.5rem' }}>Halaman Tidak Ditemukan</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            Halaman atau rute yang Anda cari tidak tersedia dalam aplikasi EcoThread.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to={ROUTES.PUBLIC.LANDING} className="btn btn-primary">
              Kembali ke Beranda
            </Link>
            <Link to={ROUTES.PUBLIC.PORTAL} className="btn btn-secondary">
              Pemilihan Portal
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
