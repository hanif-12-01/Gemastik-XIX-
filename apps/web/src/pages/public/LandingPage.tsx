import React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  BriefcaseBusiness,
  CheckCircle2,
  Factory,
  Leaf,
  QrCode,
  ScanLine,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react'
import { ROUTES } from '../../lib/routes'
import '../../styles/landing.css'

const businessPillars = [
  {
    icon: Factory,
    label: 'City Hub',
    title: 'Limbah menjadi bahan baku terukur',
    text: 'Material dipilah, disanitasi, didigitalisasi, lalu dialokasikan sebagai Eco-Kit dengan jejak data yang rapi.'
  },
  {
    icon: Scissors,
    label: 'Mitra UMKM',
    title: 'Produksi tersebar, kualitas tetap terjaga',
    text: 'Penjahit lokal menerima pola tervalidasi, fee yang jelas, milestone kerja, dan QC berbasis bukti.'
  },
  {
    icon: ShoppingBag,
    label: 'Konsumen',
    title: 'Fashion bernilai, bukan sekadar daur ulang',
    text: 'Produk upcycled yang terbatas, transparan, mudah dipesan, dan memiliki Digital Product Passport.'
  }
]

const processSteps = [
  {
    number: '01',
    title: 'Material intelligence',
    text: 'Limbah tekstil dipetakan agar area layak pakai, cacat, warna, dan kebutuhan pola dapat dihitung.'
  },
  {
    number: '02',
    title: 'Human-validated pattern',
    text: 'AI membantu menyiapkan draft. Validator manusia memastikan pola benar-benar dapat diproduksi.'
  },
  {
    number: '03',
    title: 'Distributed production',
    text: 'Eco-Kit dikirim kepada Mitra terverifikasi dengan fee, deadline, dan instruksi yang transparan.'
  },
  {
    number: '04',
    title: 'QC, commerce & DPP',
    text: 'Produk lolos QC, masuk katalog, lalu memperoleh identitas digital yang dapat dipindai pelanggan.'
  }
]

const technologyPoints = [
  'Fastify API dan Prisma sebagai sumber data operasional',
  'Role-based access untuk Admin, Mitra, dan pelanggan',
  'Human-in-the-loop pada alur AI dan validasi pola',
  'DPP database-first dengan hash yang di-anchor ke Polygon Amoy',
  'Audit trail untuk status produksi, QC, dan payout',
  'Web responsif tunggal untuk mengurangi friksi antar-portal'
]

export const LandingPage: React.FC = () => {
  return (
    <div className="landing-shell">
      <div className="landing-announcement">
        <div className="container landing-announcement__inner">
          <span><Sparkles size={15} /> Finalis bisnis TIK dengan rantai produksi yang dapat diuji</span>
          <Link to={ROUTES.PUBLIC.getDpp('PRD-DEMO')}>
            Lihat bukti DPP <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <section className="landing-hero">
        <div className="landing-orbit landing-orbit--top" aria-hidden="true" />
        <div className="landing-orbit landing-orbit--bottom" aria-hidden="true" />

        <div className="container landing-hero__grid">
          <div className="landing-hero__copy">
            <div className="landing-eyebrow">
              <Leaf size={17} />
              Rethink waste. Redefine style.
            </div>

            <h1>
              Limbah tekstil, dijahit ulang menjadi fashion yang
              <span> punya cerita.</span>
            </h1>

            <p className="landing-hero__lead">
              EcoThread mengorkestrasi material sisa, teknologi desain, dan kapasitas
              penjahit lokal menjadi produk upcycled bernilai tinggi yang dapat dibeli,
              dilacak, dan diverifikasi.
            </p>

            <div className="landing-hero__actions">
              <Link to={ROUTES.PUBLIC.CATALOG} className="btn btn-primary landing-cta">
                <ShoppingBag size={18} /> Belanja koleksi terbatas
              </Link>
              <Link to={ROUTES.PUBLIC.getDpp('PRD-DEMO')} className="btn landing-cta landing-cta--cream">
                <ScanLine size={18} /> Jelajahi paspor produk
              </Link>
            </div>

            <div className="landing-hero__assurance">
              <span><CheckCircle2 size={17} /> Deposit mulai Rp150 ribu</span>
              <span><CheckCircle2 size={17} /> Dibuat Mitra lokal</span>
              <span><CheckCircle2 size={17} /> Jejak produksi transparan</span>
            </div>
          </div>

          <div className="landing-product-stage" aria-label="Produk unggulan EcoThread">
            <div className="landing-product-stage__halo" aria-hidden="true" />
            <article className="landing-product-card">
              <div className="landing-product-card__image">
                <img
                  src="/ecothread-denim-hero.webp"
                  alt="Jaket denim upcycled EcoThread"
                />
                <span className="landing-product-card__limited">01 / limited batch</span>
                <span className="landing-product-card__dpp"><QrCode size={16} /> DPP ready</span>
              </div>
              <div className="landing-product-card__body">
                <div>
                  <p className="landing-product-card__category">Upcycled outerwear</p>
                  <h2>Denim Heritage Jacket</h2>
                </div>
                <div className="landing-product-card__price">
                  <strong>Rp450.000</strong>
                  <span>deposit Rp150.000</span>
                </div>
              </div>
              <div className="landing-product-card__footer">
                <span><Leaf size={16} /> Est. 12,4 kg CO₂ dihindari</span>
                <Link to={ROUTES.PUBLIC.getProductDetail('jaket-denim-upcycle-hero')}>
                  Detail <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="landing-proof" aria-label="Bukti pilot EcoThread">
        <div className="container landing-proof__grid">
          <div>
            <strong>20 kg</strong>
            <span>material pilot diproses</span>
          </div>
          <div>
            <strong>Rp175 rb</strong>
            <span>fee Mitra per produk</span>
          </div>
          <div>
            <strong>8 tahap</strong>
            <span>alur produksi terlacak</span>
          </div>
          <div>
            <strong>1 DPP</strong>
            <span>pilot terverifikasi on-chain</span>
          </div>
        </div>
      </section>

      <section className="landing-section landing-section--cream" id="model-bisnis">
        <div className="container">
          <div className="landing-section__heading landing-section__heading--dark">
            <span className="landing-kicker">Model bisnis B2B2C</span>
            <h2>Satu ekosistem, tiga pihak yang sama-sama bertumbuh.</h2>
            <p>
              Teknologi bukan produk akhirnya. Nilai EcoThread lahir ketika pasokan limbah,
              kapasitas UMKM, dan permintaan konsumen bertemu dalam operasi yang dapat diskalakan.
            </p>
          </div>

          <div className="landing-pillar-grid">
            {businessPillars.map(({ icon: Icon, label, title, text }) => (
              <article className="landing-pillar" key={label}>
                <div className="landing-pillar__top">
                  <span className="landing-pillar__icon"><Icon size={23} /></span>
                  <span className="landing-pillar__label">{label}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>

          <div className="landing-business-strip">
            <div>
              <BriefcaseBusiness size={25} />
              <span>
                <strong>Revenue hari ini</strong>
                Penjualan D2C, pre-order, dan pengelolaan limbah tekstil B2B.
              </span>
            </div>
            <div>
              <TrendingUp size={25} />
              <span>
                <strong>Skala berikutnya</strong>
                Multi-hub, lisensi pola, dan layanan data kepatuhan ESG.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-section--blue" id="cara-kerja">
        <div className="container">
          <div className="landing-section__heading">
            <span className="landing-kicker landing-kicker--mint">Dari limbah ke lemari</span>
            <h2>Operasi sirkular yang terlihat sederhana di depan.</h2>
            <p>
              Di belakang setiap produk terdapat alur produksi yang terstandardisasi,
              bukti QC, pembayaran Mitra, dan data yang tetap konsisten lintas peran.
            </p>
          </div>

          <div className="landing-process">
            {processSteps.map((step) => (
              <article className="landing-process__item" key={step.number}>
                <span className="landing-process__number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-section--cream landing-product-story" id="koleksi">
        <div className="container landing-product-story__grid">
          <div className="landing-product-story__visual">
            <div className="landing-product-story__image">
              <img
                src="/ecothread-denim-hero.webp"
                alt="Detail material denim untuk koleksi upcycled"
              />
            </div>
            <div className="landing-product-story__stamp">
              <BadgeCheck size={26} />
              <span><strong>Small batch</strong>lebih unik, minim limbah</span>
            </div>
          </div>

          <div className="landing-product-story__copy">
            <span className="landing-kicker">Affordable sustainable luxury</span>
            <h2>Produk yang layak diinginkan, dengan dampak yang dapat dibuktikan.</h2>
            <p>
              Kami tidak meminta konsumen membeli hanya karena produknya ramah lingkungan.
              EcoThread menjual desain terbatas, craftsmanship lokal, harga yang masuk akal,
              dan cerita material yang dapat dipindai setelah produk sampai.
            </p>

            <ul>
              <li><CheckCircle2 size={18} /> Setiap batch memiliki jumlah terbatas.</li>
              <li><CheckCircle2 size={18} /> Harga, deposit, dan estimasi produksi terlihat jelas.</li>
              <li><CheckCircle2 size={18} /> Profil pembuat dan perjalanan material hadir di DPP.</li>
            </ul>

            <Link to={ROUTES.PUBLIC.CATALOG} className="btn landing-dark-button">
              Temukan produk Anda <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-section landing-section--tech" id="teknologi">
        <div className="container landing-tech__grid">
          <div className="landing-tech__copy">
            <span className="landing-kicker landing-kicker--mint">Business value, backed by IT</span>
            <h2>Teknologi bekerja di belakang. Kepercayaan hadir di depan.</h2>
            <p>
              Arsitektur EcoThread menjaga pengalaman belanja tetap ringan sekaligus memberi
              City Hub kendali operasional dan memberi Mitra alur kerja yang sederhana.
            </p>

            <div className="landing-tech__checks">
              {technologyPoints.map((point) => (
                <span key={point}><CheckCircle2 size={18} /> {point}</span>
              ))}
            </div>
          </div>

          <div className="landing-tech-card">
            <div className="landing-tech-card__header">
              <Boxes size={22} />
              <span>EcoThread operating system</span>
              <i>live MVP</i>
            </div>
            <div className="landing-tech-card__flow">
              <div><Factory size={20} /><span>Material & City Hub</span></div>
              <b>→</b>
              <div><Scissors size={20} /><span>Mitra & QC</span></div>
              <b>→</b>
              <div><ShoppingBag size={20} /><span>Commerce & DPP</span></div>
            </div>
            <div className="landing-tech-card__audit">
              <ShieldCheck size={24} />
              <span>
                <strong>Traceable by default</strong>
                Status, actor, waktu, dan bukti penting tersimpan sebagai audit trail.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-section--dpp" id="dpp-info">
        <div className="container landing-dpp__grid">
          <div className="landing-dpp-passport">
            <div className="landing-dpp-passport__top">
              <img src="/ecothread-logo.png" alt="EcoThread" />
              <span>Digital Product Passport</span>
            </div>
            <div className="landing-dpp-passport__code">
              <QrCode size={86} />
              <div>
                <small>Product code</small>
                <strong>PRD-DEMO</strong>
                <span><ShieldCheck size={15} /> Database verified</span>
              </div>
            </div>
            <div className="landing-dpp-passport__facts">
              <span><small>Material</small><strong>Upcycled denim</strong></span>
              <span><small>Maker</small><strong>Mitra Bandung</strong></span>
              <span><small>QC</small><strong>Approved</strong></span>
            </div>
          </div>

          <div className="landing-dpp__copy">
            <span className="landing-kicker">Transparansi tanpa jargon</span>
            <h2>Satu kali scan untuk melihat siapa, dari apa, dan bagaimana produk dibuat.</h2>
            <p>
              DPP menyatukan asal material, proses sanitasi, pembuat, QC, estimasi dampak,
              serta status verifikasi blockchain dalam cerita yang mudah dipahami konsumen.
            </p>
            <Link to={ROUTES.PUBLIC.getDpp('PRD-DEMO')} className="btn landing-dark-button">
              <QrCode size={18} /> Buka DPP contoh
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-final-cta" id="mitra">
        <div className="container landing-final-cta__inner">
          <div>
            <span className="landing-kicker landing-kicker--cream">Tumbuh bersama EcoThread</span>
            <h2>Punya keterampilan menjahit atau ingin memakai produk yang lebih bertanggung jawab?</h2>
          </div>
          <div className="landing-final-cta__actions">
            <Link to={ROUTES.AUTH.MITRA_REGISTER} className="btn landing-cta--cream">
              <Users size={18} /> Gabung sebagai Mitra
            </Link>
            <Link to={ROUTES.PUBLIC.CATALOG} className="btn landing-cta--ghost">
              Lihat koleksi <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
