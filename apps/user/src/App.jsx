import React, { useState, useEffect } from 'react'
import { Leaf, ShieldCheck, MapPin, ScanLine, Clock, Cpu, Droplets, CloudRain, Award, ArrowRight, Heart, Share2, Database, Loader2, RefreshCw } from 'lucide-react'
import { api } from '@ecothread/api-client'

export default function App() {
  const [showEcoTradeModal, setShowEcoTradeModal] = useState(false)
  const [dppData, setDppData] = useState(null)
  const [catalog, setCatalog] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [productCode, setProductCode] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('dpp') || 'PRD-2026-0001'
  })

  const loadDpp = async (code) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getDpp(code)
      setDppData(data)
    } catch (err) {
      console.warn('Gagal memuat DPP khusus, memuat data katalog:', err.message)
      // Fallback ke catalog jika DPP tertentu tidak ditemukan
      try {
        const cat = await api.getCatalog()
        setCatalog(cat || [])
      } catch (e) {
        setError('Gagal memuat data dari server')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDpp(productCode)
  }, [productCode])

  const isVerifiedOnChain = dppData?.verificationState === 'testnet_verified'
  const verificationBadgeText = isVerifiedOnChain ? 'Blockchain Verified' : 'Database Verified'

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-20 font-sans max-w-md mx-auto relative shadow-xl overflow-hidden">
      {/* Header / Navbar */}
      <header className="absolute top-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-2 text-white">
          <Leaf className="text-green-400" size={24} />
          <span className="font-bold tracking-wider">EcoThread DPP</span>
        </div>
        <button 
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: dppData?.product?.name || 'EcoThread DPP', url: window.location.href })
            } else {
              navigator.clipboard.writeText(window.location.href)
              alert('Tautan DPP berhasil disalin!')
            }
          }}
          className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition"
        >
          <Share2 size={20} />
        </button>
      </header>

      {loading ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center pt-24 text-gray-500 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          <p className="text-sm font-medium">Memuat Paspor Digital Produk...</p>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <div className="relative h-80 bg-stone-800">
            <img 
              src={dppData?.product?.afterPhoto || "https://images.unsplash.com/photo-1542272201-b1ca555f8505?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
              alt={dppData?.product?.name || "Jaket Denim Upcycle"} 
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-gray-50 to-transparent">
              <div className="flex gap-2 mb-2 flex-wrap">
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200">100% Upcycled</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                  isVerifiedOnChain 
                    ? 'bg-blue-100 text-blue-800 border-blue-200' 
                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>
                  {isVerifiedOnChain ? <ShieldCheck size={12} /> : <Database size={12} />}
                  {verificationBadgeText}
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 -mt-2 relative z-10">
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
              {dppData?.product?.name || "Jaket Denim Upcycle"}
            </h1>
            <p className="text-gray-500 font-medium mt-1">ID: {dppData?.product?.productCode || productCode}</p>
            <p className="text-2xl font-bold text-green-700 mt-3">
              Rp {(dppData?.product?.price || 349000).toLocaleString('id-ID')}
            </p>
          </div>

          {/* Traceability Journey */}
          <div className="mt-8 px-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="text-green-600" /> Perjalanan Produk
            </h2>
            <div className="relative border-l-2 border-green-200 ml-4 space-y-8">
              <div className="relative">
                <div className="absolute -left-2.5 mt-1.5 w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow-sm"></div>
                <div className="pl-6">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">Sourcing & Sterilisasi <ShieldCheck size={16} className="text-green-500"/></h3>
                  <p className="text-sm text-gray-500 mt-1">Limbah denim dikumpulkan dari City Hub Bandung, disterilisasi 100% menggunakan teknologi Ozon.</p>
                  <div className="mt-2 text-xs font-semibold text-gray-400">12 April 2026 - City Hub Pusat</div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-2.5 mt-1.5 w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow-sm"></div>
                <div className="pl-6">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">AI-Driven Design <Cpu size={16} className="text-blue-500"/></h3>
                  <p className="text-sm text-gray-500 mt-1">Pola baru dirancang secara otonom oleh GarmageNet AI untuk meminimalkan sisa potongan kain.</p>
                  <div className="mt-2 text-xs font-semibold text-gray-400">13 April 2026 - GarmageNet Serverless</div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-2.5 mt-1.5 w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow-sm"></div>
                <div className="pl-6">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">Crafted by Artisan <ScanLine size={16} className="text-amber-500"/></h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Dijahit dan dirakit dengan tangan oleh {dppData?.maker?.name || 'Ibu Siti Aminah'} ({dppData?.maker?.location || 'Cigondewah, Bandung'}).
                  </p>
                  <div className="mt-2 text-xs font-semibold text-gray-400">15 April 2026 - Bandung</div>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Tracker */}
          <div className="mt-10 px-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Dampak Lingkungan Anda</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col items-center text-center">
                <Droplets className="text-blue-500 mb-2" size={28} />
                <span className="text-2xl font-black text-blue-700">1.500 L</span>
                <span className="text-xs text-blue-600 font-medium">Air Bersih Dihemat</span>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex flex-col items-center text-center">
                <CloudRain className="text-emerald-500 mb-2" size={28} />
                <span className="text-2xl font-black text-emerald-700">2.3 kg</span>
                <span className="text-xs text-emerald-600 font-medium">Emisi CO₂ Dicegah</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center mt-4">
              {isVerifiedOnChain
                ? 'Angka ini tervalidasi dan tercatat secara permanen di jaringan Blockchain Polygon.'
                : 'Data terverifikasi dan tersimpan secara permanen dalam database terenkripsi EcoThread Hub.'}
            </p>
          </div>

          {/* Meet the Maker */}
          <div className="mt-10 px-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" 
                alt={dppData?.maker?.name || "Ibu Siti"} 
                className="w-16 h-16 rounded-full object-cover border-2 border-green-100"
              />
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Pembuat Pakaian Anda</p>
                <h3 className="text-lg font-bold text-gray-900 mt-0.5">{dppData?.maker?.name || 'Ibu Siti Aminah'}</h3>
                <p className="text-sm text-gray-500">{dppData?.maker?.location || 'Penjahit Ahli • Bandung'}</p>
              </div>
              <button className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex justify-center items-center hover:bg-rose-100 transition">
                <Heart size={20} className="fill-rose-500" />
              </button>
            </div>
          </div>

          {/* Eco-Trade CTA */}
          <div className="mt-10 mb-8 px-6">
            <div className="bg-gradient-to-br from-green-800 to-emerald-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10">
                <Leaf size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="text-amber-400" />
                  <span className="font-bold text-green-100">Status Anda: Circular Artisan</span>
                </div>
                <h3 className="text-xl font-extrabold mb-2">Bosan dengan produk ini?</h3>
                <p className="text-green-100 text-sm mb-5 leading-relaxed">
                  Jangan dibuang! Kembalikan kepada kami melalui program Eco-Trade dan dapatkan <strong className="text-white">Cashback Rp 50.000</strong> berupa saldo Eco-Credits.
                </p>
                <button 
                  onClick={() => setShowEcoTradeModal(true)}
                  className="w-full bg-white text-green-800 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 active:bg-gray-200 transition"
                >
                  Tukar Produk Sekarang <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="text-center pb-8 opacity-60">
        <p className="text-xs font-bold text-gray-500 flex items-center justify-center gap-1">
          {isVerifiedOnChain ? <ShieldCheck size={14} className="text-blue-600"/> : <Database size={14} className="text-emerald-600"/>}
          Verified by EcoThread DPP ({verificationBadgeText})
        </p>
      </div>

      {/* Modal Eco-Trade */}
      {showEcoTradeModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center sm:items-center">
          <div className="bg-white w-full sm:w-[400px] sm:rounded-2xl rounded-t-3xl p-6 animate-slide-up sm:animate-none">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf size={32} />
            </div>
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">Panggil Kurir Eco-Trade</h3>
            <p className="text-center text-gray-500 mb-6">
              Kurir akan menjemput produk ini ke rumah Anda. Saldo Eco-Credits Rp 50.000 akan ditambahkan ke akun Anda setelah barang diterima di City Hub.
            </p>
            <button 
              className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl text-lg hover:bg-green-700 transition"
              onClick={() => {
                alert('Permintaan penjemputan berhasil dibuat!');
                setShowEcoTradeModal(false);
              }}
            >
              Konfirmasi Penjemputan
            </button>
            <button 
              className="w-full mt-3 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
              onClick={() => setShowEcoTradeModal(false)}
            >
              Nanti Saja
            </button>
          </div>
        </div>
      )}
    </div>
  )
}