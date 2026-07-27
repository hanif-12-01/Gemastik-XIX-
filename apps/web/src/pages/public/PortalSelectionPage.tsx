import React from 'react'
import { ROUTES } from '../../lib/routes'
import { PortalCard } from '../../components/portal/PortalCard'
import { PortalSecurityNotice } from '../../components/portal/PortalSecurityNotice'
import { Badge } from '../../components/ui/Badge'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export const PortalSelectionPage: React.FC = () => {
  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container-narrow">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to={ROUTES.PUBLIC.LANDING} style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Badge variant="info" className="mb-2">Portal Selection</Badge>
          <h1 style={{ fontSize: '2.25rem', color: '#FFF', marginBottom: '0.75rem' }}>Pilih Portal Operasional</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto' }}>
            Silakan pilih peran dan portal aplikasi untuk melanjutkan ke konsol operasional EcoThread.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Admin Portal */}
          <PortalCard
            role="admin"
            title="Admin City Hub"
            subtitle="City Hub Manager"
            description="Kelola inventaris limbah material, digitalisasi AI, validasi pola, alokasi Eco-Kit, Quality Control, dan penerbitan DPP."
            noticeTitle="Aturan Akses Admin"
            noticeText={
              <>
                Pendaftaran akun Admin <strong>hanya dapat dilakukan melalui undangan resmi Super Admin</strong>. Pendaftaran publik langsung tidak diizinkan.
              </>
            }
            primaryActionText="Masuk Login Admin"
            primaryActionUrl={ROUTES.AUTH.ADMIN_LOGIN}
            secondaryActionText="Punya Undangan? Simulasi Token Admin"
            secondaryActionUrl={ROUTES.AUTH.getAdminInvite('demo-token')}
          />

          {/* Mitra Portal */}
          <PortalCard
            role="mitra"
            title="Mitra Penjahit"
            subtitle="Penjahit & Konveksi"
            description="Terima pesanan pembuatan pakaian upcycled, perbarui progres milestone produksi, submit bukti foto QC, dan pantau dompet pembayaran."
            noticeTitle="Status Verifikasi Mitra"
            noticeText={
              <>
                Mitra baru dapat mendaftar secara publik. Akun baru akan berstatus <code>pending_verification</code> sampai disetujui Admin.
              </>
            }
            primaryActionText="Masuk Login Mitra"
            primaryActionUrl={ROUTES.AUTH.MITRA_LOGIN}
            secondaryActionText="Daftar Akun Mitra Baru"
            secondaryActionUrl={ROUTES.AUTH.MITRA_REGISTER}
          />
        </div>

        {/* Security Notice Summary */}
        <PortalSecurityNotice />
      </div>
    </div>
  )
}
