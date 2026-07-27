import React from 'react'
import { useAuth } from '../../features/auth/AuthContext'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/feedback/Alert'
import { Clock, ShieldAlert, CheckCircle, LogOut } from 'lucide-react'

export const MitraVerificationStatusPage: React.FC = () => {
  const { user, logout } = useAuth()
  const status = user?.mitraProfile?.verificationStatus || 'pending_verification'

  return (
    <div style={{ maxWidth: '560px', margin: '4rem auto', padding: '0 1rem' }}>
      <Card style={{ padding: '2.5rem', textAlign: 'center' }}>
        {status === 'pending_verification' && (
          <>
            <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.15)', borderRadius: '50%', marginBottom: '1rem' }}>
              <Clock size={48} color="var(--color-status-warning)" />
            </div>

            <Badge variant="warning" className="mb-2">Status: Menunggu Verifikasi</Badge>
            <h1 style={{ fontSize: '1.75rem', color: '#FFF', marginBottom: '0.75rem' }}>
              Pendaftaran Mitra Dalam Verifikasi
            </h1>

            <Alert type="warning" title="Pemberitahuan Akses Pembatasan">
              Akun Mitra Anda (<strong>{user?.mitraProfile?.workshopName || user?.name}</strong>) berhasil terdaftar. Tim Admin City Hub sedang memeriksa dokumen profil dan lokasi workshop Anda.
            </Alert>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: '1.5rem 0', lineHeight: 1.6 }}>
              Selama proses verifikasi berlangsung, fitur penugasan pesanan jahit belum dapat diakses. Anda dapat memeriksa kembali halaman ini secara berkala.
            </p>
          </>
        )}

        {status === 'rejected' && (
          <>
            <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', borderRadius: '50%', marginBottom: '1rem' }}>
              <ShieldAlert size={48} color="var(--color-status-danger)" />
            </div>

            <Badge variant="danger" className="mb-2">Status: Pendaftaran Ditolak</Badge>
            <h1 style={{ fontSize: '1.75rem', color: '#FFF', marginBottom: '0.75rem' }}>
              Permohonan Mitra Belum Disetujui
            </h1>

            <Alert type="danger" title="Catatan Admin">
              {user?.mitraProfile?.verificationNotes || 'Profil atau dokumen tempat jahit belum memenuhi kriteria kualifikasi Mitra EcoThread.'}
            </Alert>
          </>
        )}

        {status === 'approved' && (
          <>
            <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', marginBottom: '1rem' }}>
              <CheckCircle size={48} color="var(--color-status-success)" />
            </div>

            <Badge variant="success" className="mb-2">Status: Verifikasi Disetujui</Badge>
            <h1 style={{ fontSize: '1.75rem', color: '#FFF', marginBottom: '0.75rem' }}>
              Selamat! Akun Mitra Aktif
            </h1>

            <Alert type="success" title="Terverifikasi">
              Akun Mitra Anda telah diverifikasi secara resmi. Anda dapat mengakses konsol kerja Mitra.
            </Alert>
          </>
        )}

        <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '2rem', paddingTop: '1.5rem' }}>
          <Button onClick={logout} variant="secondary" style={{ width: '100%', justifyContent: 'center' }}>
            <LogOut size={16} /> Keluar (Logout Sesi)
          </Button>
        </div>
      </Card>
    </div>
  )
}
