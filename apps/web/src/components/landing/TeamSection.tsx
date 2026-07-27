import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Users, Award, Code, Compass } from 'lucide-react'

export const TeamSection: React.FC = () => {
  return (
    <section id="tentang-kami" style={{ padding: '5rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <Badge variant="info" className="mb-2">Tim Pengembang &amp; Inovator</Badge>
          <h2 style={{ fontSize: '2.25rem', color: '#FFF', marginBottom: '0.75rem' }}>
            Inovasi Karya Tim EcoThread
          </h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '650px', margin: '0 auto' }}>
            Dikembangkan untuk Pagelaran Mahasiswa Nasional Bidang Teknologi Informasi dan Komunikasi (GEMASTIK XIX) — Divisi Bisnis TIK.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <Card>
            <div style={{ marginBottom: '1rem' }}>
              <Compass color="var(--color-primary)" size={28} />
            </div>
            <h3 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '0.375rem' }}>Visi Platform</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Menjadi sistem operasi manufaktur sirkular terdesentralisasi terdepan di Indonesia yang mempertemukan limbah tekstil dan keterampilan lokal.
            </p>
          </Card>

          <Card>
            <div style={{ marginBottom: '1rem' }}>
              <Award color="var(--color-secondary)" size={28} />
            </div>
            <h3 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '0.375rem' }}>Kategori Kompetisi</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Divisi Bisnis TIK — Menghadirkan solusi teknologi fashion berdaya saing bisnis dan berdampak sosial-lingkungan nyata.
            </p>
          </Card>

          <Card>
            <div style={{ marginBottom: '1rem' }}>
              <Code color="var(--color-accent)" size={28} />
            </div>
            <h3 style={{ fontSize: '1.125rem', color: '#FFF', marginBottom: '0.375rem' }}>Status Pengembangan</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Roadmap 1 Single-Web Application dengan fondasi SDK API Client, route guards terproteksi, dan kesiapan deployment Vercel.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
