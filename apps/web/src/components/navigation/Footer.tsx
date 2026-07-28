import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--color-bg-card)',
      borderTop: '1px solid var(--color-border)',
      padding: '3rem 0 1.5rem',
      marginTop: 'auto'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '0.5rem' }}>EcoThread</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', maxWidth: '320px' }}>
              Platform manufaktur fashion sirkular database-first dengan penjangkaran integritas Digital Product Passport (DPP) pada Polygon Amoy.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#FFF', marginBottom: '0.75rem' }}>Akses Portal</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li><a href="/portal" style={{ color: 'var(--color-text-muted)' }}>Portal Selection</a></li>
              <li><a href="/auth/mitra/register" style={{ color: 'var(--color-text-muted)' }}>Registrasi Mitra</a></li>
              <li><a href="/auth/admin/login" style={{ color: 'var(--color-text-muted)' }}>Login Admin</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#FFF', marginBottom: '0.75rem' }}>Verifikasi Publik</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li><a href="/catalog" style={{ color: 'var(--color-text-muted)' }}>Katalog Produk</a></li>
              <li><a href="/dpp/PRD-DEMO" style={{ color: 'var(--color-text-muted)' }}>Digital Product Passport</a></li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.875rem',
          color: 'var(--color-text-dim)'
        }}>
          <span>&copy; 2026 Tim EcoThread. GEMASTIK XIX — Divisi Bisnis TIK.</span>
          <span>Roadmap 0 Single Web Foundation</span>
        </div>
      </div>
    </footer>
  )
}
