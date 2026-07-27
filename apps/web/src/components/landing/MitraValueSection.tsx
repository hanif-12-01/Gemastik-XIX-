import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/routes'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { ArrowRight, CheckCircle2, DollarSign, BookOpen, Clock } from 'lucide-react'

export const MitraValueSection: React.FC = () => {
  const benefits = [
    {
      icon: <BookOpen color="var(--color-primary)" size={20} />,
      title: 'Panduan Pola Visual & Lengkap',
      text: 'Setiap pekerjaan disertai paket Eco-Kit berisi potongan material, aksesori lengkap, dan instruksi perakitan berbasis foto/video.'
    },
    {
      icon: <Clock color="var(--color-secondary)" size={20} />,
      title: 'Fleksibilitas Kapasitas Kerja',
      text: 'Mitra mengatur kapasitas mingguan sendiri. Menerima atau menolak penugasan sesuai ketersediaan waktu dan keahlian.'
    },
    {
      icon: <DollarSign color="var(--color-status-success)" size={20} />,
      title: 'Rincian Upah Transparan',
      text: 'Tarif pengerjaan (fee) disetujui di awal. Catatan pembayaran tersimpan transparan di dompet internal aplikasi.'
    },
    {
      icon: <CheckCircle2 color="var(--color-accent)" size={20} />,
      title: 'Rekam Jejak Portofolio Kualitas',
      text: 'Hasil jahitan yang lolos QC menjadi bukti rekam jejak profesional penjahit untuk membangun reputasi permanen.'
    }
  ]

  return (
    <section id="mitra" style={{ padding: '5rem 0', backgroundColor: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          {/* Left Column Text & Action */}
          <div>
            <Badge variant="success" className="mb-3">Nilai Bagi Mitra Penjahit</Badge>
            <h2 style={{ fontSize: '2.25rem', color: '#FFF', marginBottom: '1rem', lineHeight: 1.25 }}>
              Tingkatkan Pendapatan &amp; Keterampilan Bersama Ekosistem EcoThread
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
              Bagi Anda penjahit mandiri, artisan, atau UMKM konveksi lokal: dapatkan penugasan terstruktur tanpa perlu pusing mencari pasar atau mendesain pola sendiri.
            </p>

            <Link
              to={ROUTES.AUTH.MITRA_REGISTER}
              className="btn btn-primary"
              style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}
            >
              Daftar Sebagai Mitra Penjahit <ArrowRight size={18} />
            </Link>
          </div>

          {/* Right Column Benefits Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {benefits.map((b, i) => (
              <Card key={i} style={{ padding: '1.25rem' }}>
                <div style={{ marginBottom: '0.75rem' }}>{b.icon}</div>
                <h3 style={{ fontSize: '1rem', color: '#FFF', marginBottom: '0.375rem' }}>{b.title}</h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{b.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
