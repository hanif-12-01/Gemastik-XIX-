import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { ROUTES } from '../../lib/routes'
import '../../styles/navigation.css'

export const PublicFooter: React.FC = () => {
  return (
    <footer className="public-footer">
      <div className="container">
        <div className="public-footer__top">
          <div className="public-footer__brand">
            <div className="public-footer__logo">
              <img src="/ecothread-logo.png" alt="EcoThread" />
            </div>
            <p>
              Ekosistem manufaktur fashion sirkular yang mengubah limbah tekstil menjadi
              produk bernilai melalui teknologi dan keterampilan Mitra lokal.
            </p>
            <span><MapPin size={15} /> Bandung, Indonesia</span>
          </div>

          <div className="public-footer__column">
            <h2>Jelajahi</h2>
            <Link to={ROUTES.PUBLIC.CATALOG}>Koleksi Produk</Link>
            <a href="/#cara-kerja">Cara Kerja</a>
            <a href="/#dpp-info">Digital Product Passport</a>
            <a href="/#model-bisnis">Model Bisnis</a>
          </div>

          <div className="public-footer__column">
            <h2>Ekosistem</h2>
            <Link to={ROUTES.AUTH.MITRA_REGISTER}>Gabung sebagai Mitra</Link>
            <Link to={ROUTES.PUBLIC.PORTAL}>Portal Operasional</Link>
            <Link to={ROUTES.AUTH.ADMIN_LOGIN}>Admin City Hub</Link>
            <Link to={ROUTES.PUBLIC.getDpp('PRD-DEMO')}>Verifikasi DPP</Link>
          </div>

          <div className="public-footer__column">
            <h2>Proyek</h2>
            <span>GEMASTIK XIX - Bisnis TIK</span>
            <span>Telkom University</span>
            <Link to={ROUTES.PUBLIC.PORTAL}>Akses demo aplikasi</Link>
            <Link to={ROUTES.PUBLIC.getDpp('PRD-DEMO')}>Buka bukti DPP</Link>
          </div>
        </div>

        <div className="public-footer__bottom">
          <span>&copy; 2026 EcoThread. Rethink Waste. Redefine Style.</span>
          <span>Data aktual, demo, dan estimasi ditandai secara transparan.</span>
        </div>
      </div>
    </footer>
  )
}
