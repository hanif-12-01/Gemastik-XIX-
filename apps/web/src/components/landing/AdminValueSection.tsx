import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Alert } from '../feedback/Alert'
import { Shield, ArrowRight, Settings } from 'lucide-react'

export const AdminValueSection: React.FC = () => {
  return (
    <section id="admin" style={{ padding: '5rem 0' }}>
      <div className="container">
        <div className="container-narrow" style={{ margin: '0 auto' }}>
          <Card style={{ background: 'linear-gradient(135deg, #131B2A 0%, #1A263B 100%)', padding: '3rem 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Badge variant="warning" className="mb-2">Portal Pengelola City Hub</Badge>
              <h2 style={{ fontSize: '2rem', color: '#FFF', marginBottom: '0.75rem' }}>
                Pusat Kendali Manufaktur Sirkular (Admin Console)
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
                Pengelola City Hub bertanggung jawab atas verifikasi material, penyetujuan pola, alokasi pekerjaan, Quality Control, dan pencatatan pembayaran.
              </p>
            </div>

            <Alert type="warning" title="Aturan Akses Keamanan Admin">
              Pendaftaran akun Admin <strong>hanya dapat dilakukan melalui undangan resmi Super Admin</strong>. Pengunjung umum tidak diizinkan membuat akun Admin secara mandiri.
            </Alert>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
              <Link to={ROUTES.AUTH.ADMIN_LOGIN} className="btn btn-primary" style={{ padding: '0.875rem 2rem' }}>
                Masuk Login Admin <ArrowRight size={18} />
              </Link>
              <Link to={ROUTES.PUBLIC.PORTAL} className="btn btn-secondary" style={{ padding: '0.875rem 2rem' }}>
                Lihat Opsi Portal Selection
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
