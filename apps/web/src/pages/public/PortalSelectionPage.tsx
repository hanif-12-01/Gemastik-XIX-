import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Alert } from '../../components/feedback/Alert'

export const PortalSelectionPage: React.FC = () => {
  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container-narrow">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Badge variant="info" className="mb-2">Portal Selection</Badge>
          <h1 style={{ fontSize: '2.25rem', color: '#FFF', marginBottom: '0.75rem' }}>Pilih Portal Operasional</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Silakan pilih peran dan portal aplikasi untuk melanjutkan ke dashboard operasional EcoThread.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Admin Portal Card */}
          <Card hoverable style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <Badge variant="warning">Portal Admin</Badge>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>City Hub Manager</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: '0.75rem' }}>Admin City Hub</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Kelola inventaris limbah material, digitalisasi AI, validasi pola, alokasi Eco-Kit, Quality Control, dan penerbitan DPP.
              </p>

              <Alert type="warning" title="Aturan Akses Admin">
                Pendaftaran akun Admin <strong>hanya dapat dilakukan melalui undangan resmi Super Admin</strong>. Pendaftaran publik langsung tidak diizinkan.
              </Alert>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Link to={ROUTES.AUTH.ADMIN_LOGIN} className="btn btn-primary" style={{ width: '100%' }}>
                Masuk Login Admin
              </Link>
              <Link to={ROUTES.AUTH.getAdminInvite('demo-token')} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.85rem' }}>
                Simulasi Undangan Admin (`/auth/admin/invite/:token`)
              </Link>
            </div>
          </Card>

          {/* Mitra Portal Card */}
          <Card hoverable style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <Badge variant="info">Portal Mitra</Badge>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Penjahit & Konveksi</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: '0.75rem' }}>Mitra Penjahit</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Terima pesanan pembuatan pakaian upcycled, perbarui progres milestone produksi, submit bukti foto QC, dan pantau dompet pembayaran.
              </p>

              <Alert type="info" title="Status Verifikasi Mitra">
                Mitra baru dapat mendaftar secara publik. Akun baru akan berstatus <code>pending_verification</code> sampai disetujui Admin.
              </Alert>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Link to={ROUTES.AUTH.MITRA_LOGIN} className="btn btn-primary" style={{ width: '100%' }}>
                Masuk Login Mitra
              </Link>
              <Link to={ROUTES.AUTH.MITRA_REGISTER} className="btn btn-secondary" style={{ width: '100%' }}>
                Daftar Akun Mitra Baru
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
