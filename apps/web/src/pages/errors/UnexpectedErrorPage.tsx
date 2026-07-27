import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'

export const UnexpectedErrorPage: React.FC = () => {
  return (
    <div style={{ padding: '5rem 0', textAlign: 'center' }}>
      <div className="container-narrow">
        <Card>
          <Badge variant="danger" className="mb-2">500 Server Error</Badge>
          <h1 style={{ fontSize: '2.5rem', color: '#FFF', margin: '1rem 0 0.5rem' }}>Terjadi Kesalahan Aplikasi</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            Terjadi masalah yang tidak terduga pada aplikasi. Silakan coba memuat ulang halaman.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Muat Ulang Halaman
            </button>
            <Link to={ROUTES.PUBLIC.LANDING} className="btn btn-secondary">
              Kembali ke Beranda
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
