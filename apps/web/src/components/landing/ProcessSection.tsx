import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Pencatatan Batch Limbah',
      desc: 'Material limbah tekstil diterima City Hub, dicatat kategori, berat (kg), dan asal sumbernya.'
    },
    {
      num: '02',
      title: 'Sanitasi & Sterilisasi',
      desc: 'Material menjalani pencucian dan sterilisasi terstandar dengan bukti waktu dan operator.'
    },
    {
      num: '03',
      title: 'Digitalisasi & Map AI',
      desc: 'Foto material dianalisis untuk mendeteksi area usable dan cacat secara valid.'
    },
    {
      num: '04',
      title: 'Validasi Pola & Eco-Kit',
      desc: 'Draft pola AI disetujui validator manusia sebelum dikemas menjadi paket Eco-Kit siap jahit.'
    },
    {
      num: '05',
      title: 'Penugasan Mitra',
      desc: 'Order diberikan kepada penjahit terverifikasi sesuai keahlian dan kapasitas mingguan.'
    },
    {
      num: '06',
      title: 'Produksi Terdistribusi',
      desc: 'Mitra menerima paket, mengikuti instruksi visual, dan memperbarui progres milestone.'
    },
    {
      num: '07',
      title: 'Quality Control (QC)',
      desc: 'Mitra mengirimkan foto bukti. Admin memeriksa checklist jahitan dan presisi ukuran.'
    },
    {
      num: '08',
      title: 'Dynamic DPP & QR',
      desc: 'Produk diterbitkan dengan QR Code unik yang dapat dipindai publik untuk verifikasi.'
    }
  ]

  return (
    <section id="cara-kerja" style={{ padding: '5rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <Badge variant="info" className="mb-2">Alur Produksi Terintegrasi</Badge>
          <h2 style={{ fontSize: '2.25rem', color: '#FFF', marginBottom: '0.75rem' }}>
            Bagaimana EcoThread Bekerja?
          </h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '650px', margin: '0 auto' }}>
            Sistem operasi sirkular 8 langkah dari limbah hingga transparansi pembeli.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {steps.map((s) => (
            <Card key={s.num} hoverable style={{ position: 'relative', overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--color-primary)',
                  marginBottom: '0.5rem',
                  fontFamily: 'var(--font-family-heading)'
                }}
              >
                {s.num}
              </div>
              <h3 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '0.5rem' }}>{s.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{s.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
