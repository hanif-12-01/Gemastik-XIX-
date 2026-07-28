import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Menu, ShoppingBag, X } from 'lucide-react'
import { ROUTES } from '../../lib/routes'
import '../../styles/navigation.css'

const landingLinks = [
  { label: 'Model Bisnis', href: '/#model-bisnis' },
  { label: 'Cara Kerja', href: '/#cara-kerja' },
  { label: 'Teknologi', href: '/#teknologi' },
  { label: 'DPP', href: '/#dpp-info' }
]

export const PublicHeader: React.FC = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname, location.hash])

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only public-skip-link">
        Lompat ke konten utama
      </a>

      <header className={`public-header ${scrolled ? 'public-header--scrolled' : ''} ${mobileMenuOpen ? 'public-header--open' : ''}`}>
        <div className="container public-header__inner">
          <Link to={ROUTES.PUBLIC.LANDING} className="public-brand" aria-label="EcoThread - Beranda">
            <img src="/ecothread-logo.png" alt="EcoThread Sustainable Fashion Tech" />
          </Link>

          <nav className="public-header__nav desktop-only" aria-label="Navigasi publik">
            {landingLinks.map((item) => (
              <a key={item.label} href={item.href}>{item.label}</a>
            ))}
            <Link
              to={ROUTES.PUBLIC.CATALOG}
              className={location.pathname.startsWith(ROUTES.PUBLIC.CATALOG) ? 'is-active' : ''}
            >
              Koleksi
            </Link>
            <a href="/#mitra">Mitra</a>
          </nav>

          <div className="public-header__actions desktop-only">
            <Link to="/account" className="public-header__login">Masuk</Link>
            <Link to={ROUTES.PUBLIC.CATALOG} className="public-header__shop">
              <ShoppingBag size={16} /> Belanja <ArrowRight size={15} />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={mobileMenuOpen}
            className="mobile-only public-header__toggle"
          >
            {mobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="mobile-only public-mobile-menu" aria-label="Navigasi publik seluler">
            <div className="container public-mobile-menu__inner">
              {landingLinks.map((item) => (
                <a key={item.label} href={item.href}>{item.label}</a>
              ))}
              <Link to={ROUTES.PUBLIC.CATALOG}>Koleksi Produk</Link>
              <a href="/#mitra">Mitra EcoThread</a>
              <div className="public-mobile-menu__actions">
                <Link to="/account" className="btn btn-secondary">Masuk Akun</Link>
                <Link to={ROUTES.PUBLIC.CATALOG} className="btn btn-primary">
                  <ShoppingBag size={17} /> Belanja Koleksi
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>
    </>
  )
}
