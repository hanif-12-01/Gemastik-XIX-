import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { AlertTriangle, Users, Eye, Layers } from 'lucide-react'

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      icon: <AlertTriangle color="var(--color-status-warning)" size={24} />,
      title: 'Limbah Tekstil Beragam & Berasal Banyak',
      description:
        'Karakteristik kain bekas tidak seragam dalam jenis, warna, dan tingkat kerusakan, sehingga memicu kesulitan standarisasi tanpa digitalisasi material.'
    },
    {
      icon: <Users color="var(--color-secondary)" size={24} />,
      title: 'Kapasitas Penjahit Lokal Terfragmentasi',
      description:
        'Penjahit lokal memiliki keterampilan hebat tetapi terkendala akses pasar, ketergantungan pesanan nilai rendah, dan instruksi pola rumit.'
    },
    {
      icon: <Eye color="var(--color-primary)" size={24} />,
      title: 'Kurangnya Transparansi Konsumen',
      description:
        'Konsumen eco-conscious membutuhkan bukti asal-usul material, pembuat produk, serta verifikasi klaim dampak lingkungan tanpa greenwashing.'
    },
    {
      icon: <Layers color="var(--color-accent)" size={24} />,
      title: 'Risiko Kualitas Produksi Terdistribusi',
      description:
        'Manufaktur tanpa pabrik terpusat berisiko menghasilkan kualitas tidak konsisten jika tidak didukung pengawasan QC berbasis bukti.'
    }
  ]

  return (
    <section id="masalah" style={{ padding: '4.5rem 0', backgroundColor: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Badge variant="warning" className="mb-2">Tantangan Industri Tekstil</Badge>
          <h2 style={{ fontSize: '2.25rem', color: '#FFF', marginBottom: '0.75rem' }}>
            Mengapa Manufaktur Sirkular Membutuhkan Sistem Terintegrasi?
          </h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '650px', margin: '0 auto' }}>
            Masalah utama dalam mengadaptasi produk upcycled pada skala industri berwawasan lingkungan.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {problems.map((p, idx) => (
            <Card key={idx} hoverable>
              <div style={{ marginBottom: '1rem' }}>{p.icon}</div>
              <h3 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '0.5rem' }}>{p.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                {p.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
