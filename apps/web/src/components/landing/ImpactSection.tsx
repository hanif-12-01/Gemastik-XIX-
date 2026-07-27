import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

export const ImpactSection: React.FC = () => {
  return (
    <section id="dampak" style={{ padding: '5rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <Badge variant="info" className="mb-2">Dampak Terukur &amp; Terverifikasi</Badge>
          <h2 style={{ fontSize: '2.25rem', color: '#FFF', marginBottom: '0.75rem' }}>
            Metrik Dampak Lingkungan &amp; Ekonomi Lokal
          </h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '650px', margin: '0 auto' }}>
            Setiap pengerjaan busana sirkular memberikan dampak langsung yang terhitung dalam basis data.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          <Card>
            <Badge variant="success" className="mb-2">Pilot Aktual</Badge>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-family-heading)' }}>
              20 kg
            </div>
            <span style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 600, display: 'block', margin: '0.25rem 0' }}>
              Limbah Garmen Diproses
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Denim daur ulang dari Bank Sampah Tekstil Bandung
            </span>
          </Card>

          <Card>
            <Badge variant="info" className="mb-2">Estimasi Formula</Badge>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-secondary)', fontFamily: 'var(--font-family-heading)' }}>
              2,450 L
            </div>
            <span style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 600, display: 'block', margin: '0.25rem 0' }}>
              Air Bersih Dihemat / Pcs
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Dibandingkan produksi kain virgin sintetis baru
            </span>
          </Card>

          <Card>
            <Badge variant="info" className="mb-2">Estimasi Formula</Badge>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-accent)', fontFamily: 'var(--font-family-heading)' }}>
              12.4 kg
            </div>
            <span style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 600, display: 'block', margin: '0.25rem 0' }}>
              Potensi Emisi CO2 Dihentikan
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Pengalihan dari penimbunan sampah akhir (landfill)
            </span>
          </Card>

          <Card>
            <Badge variant="success" className="mb-2">Pilot Aktual</Badge>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-status-warning)', fontFamily: 'var(--font-family-heading)' }}>
              Rp 175rb
            </div>
            <span style={{ fontSize: '0.9rem', color: '#FFF', fontWeight: 600, display: 'block', margin: '0.25rem 0' }}>
              Fee Pengerjaan Mitra / Pcs
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Upah adil transparan sesuai tingkat kesulitan pola
            </span>
          </Card>
        </div>
      </div>
    </section>
  )
}
