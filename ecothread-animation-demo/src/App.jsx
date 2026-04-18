import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scissors, User, Factory, AlertTriangle, CloudRain, Smartphone,
  Leaf, Recycle, HeartHandshake, ShieldCheck, Cpu, Star, QrCode, 
  TrendingUp, Users, ArrowRight, ArrowDown, Droplets, Wind
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, y: 0,
    transition: { type: "spring", stiffness: 100 }
  }
};

const Card = ({ children, className = '' }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={`bg-zinc-900/90 border backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-2xl ${className}`}
  >
    {children}
  </motion.div>
);

export default function App() {
  const [scene, setScene] = useState(0);

  const nextScene = () => setScene((s) => Math.min(s + 1, 8));
  const prevScene = () => setScene((s) => Math.max(s - 1, 0));
  const resetScene = () => setScene(0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden relative flex items-center justify-center p-4 font-sans select-none">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
      
      {/* Dynamic Background Glows based on Scene */}
      <motion.div
        animate={{ 
          backgroundColor: 
            scene === 0 ? 'rgba(245,158,11,0.1)' : // Amber
            scene === 1 ? 'rgba(239,68,68,0.1)' : // Red
            scene === 2 ? 'rgba(59,130,246,0.1)' : // Blue
            (scene >= 4 && scene <= 6) ? 'rgba(16,185,129,0.1)' : // Emerald
            scene === 7 ? 'rgba(59,130,246,0.1)' : // Blue
            'rgba(16,185,129,0.1)', // Gen Emerald
          scale: [1, 1.2, 1],
          rotate: 360
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full blur-[150px] pointer-events-none"
      />
      <motion.div
        animate={{ 
          backgroundColor: 
            scene === 0 ? 'rgba(217,119,6,0.1)' :
            scene === 1 ? 'rgba(185,28,28,0.1)' :
            scene === 2 ? 'rgba(107,114,128,0.1)' :
            'rgba(52,211,153,0.1)',
          scale: [1, 1.3, 1],
          rotate: -360
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] rounded-full blur-[150px] pointer-events-none"
      />

      {/* Progress Timeline */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50 bg-black/50 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              width: i === scene ? 40 : 12,
              backgroundColor: i === scene ? '#fff' : i < scene ? '#10B981' : '#3f3f46'
            }}
            className="h-2 rounded-full cursor-pointer hover:bg-zinc-300 transition-colors"
            onClick={() => setScene(i)}
            title={`Scene ${i + 1}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* SCENE 0: Ibu Siti */}
        {scene === 0 && (
          <motion.div key="scene0" className="w-full max-w-4xl z-10">
            <Card className="border-amber-900/50 bg-gradient-to-br from-zinc-900/90 to-amber-950/20 text-center">
              <motion.div variants={itemVariants} className="flex justify-center gap-4 mb-8">
                <User size={80} className="text-amber-500/80" />
                <Scissors size={80} className="text-amber-700/50" />
              </motion.div>
              <motion.div variants={itemVariants} className="uppercase tracking-widest text-amber-500 font-bold text-sm mb-4">Protagonis 1 : Penjahit Lokal</motion.div>
              <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-black text-amber-400 mb-6">
                Ibu Siti, 25 Tahun Mengabdi
              </motion.h1>
              <motion.p variants={itemVariants} className="text-xl md:text-2xl text-zinc-400 mb-8 italic">
                "Anak sekarang lebih pilih baju murah dari mall. Skill jahit saya rasanya terbuang percuma, orderan kosong."
              </motion.p>
              <motion.div variants={itemVariants} className="flex justify-center gap-6">
                <div className="bg-amber-950/30 p-4 rounded-xl border border-amber-500/20">
                  <div className="text-3xl font-black text-red-400">-60%</div>
                  <div className="text-sm text-zinc-400">Penurunan Omzet</div>
                </div>
                <div className="bg-amber-950/30 p-4 rounded-xl border border-amber-500/20">
                  <div className="text-3xl font-black text-amber-400">4.2 Juta</div>
                  <div className="text-sm text-zinc-400">UMKM Terdampak</div>
                </div>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {/* SCENE 1: Fast Fashion */}
        {scene === 1 && (
          <motion.div key="scene1" className="w-full max-w-4xl z-10">
            <Card className="border-red-900/50 bg-gradient-to-br from-zinc-900/90 to-red-950/30 text-center">
              <motion.div variants={itemVariants} className="flex justify-center gap-6 mb-8 text-red-500">
                <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}><Factory size={80} /></motion.div>
                <AlertTriangle size={80} className="text-red-600" />
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-black text-red-400 mb-6">
                Gempuran Fast Fashion
              </motion.h1>
              <motion.p variants={itemVariants} className="text-xl md:text-2xl text-red-200/70 mb-8">
                Baju murah membanjiri pasar, tapi siapa yang menanggung dampaknya?
              </motion.p>
              <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 gap-6 text-left">
                <div className="bg-zinc-950/50 p-6 rounded-2xl border border-red-500/20">
                  <div className="text-3xl font-black text-white">2.3 Juta</div>
                  <div className="text-red-400 font-bold">Ton Limbah/Tahun di RI</div>
                </div>
                <div className="bg-zinc-950/50 p-6 rounded-2xl border border-red-500/20">
                  <div className="text-3xl font-black text-white">10%</div>
                  <div className="text-red-400 font-bold">Emisi Karbon Global</div>
                </div>
                <div className="bg-zinc-950/50 p-6 rounded-2xl border border-red-500/20 md:col-span-1 col-span-2">
                  <div className="text-3xl font-black text-white">Rp 29.000</div>
                  <div className="text-red-400 font-bold">Harga Tidak Masuk Akal</div>
                </div>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {/* SCENE 2: Nadia */}
        {scene === 2 && (
          <motion.div key="scene2" className="w-full max-w-4xl z-10">
            <Card className="border-blue-900/50 bg-gradient-to-br from-zinc-900/90 to-blue-950/20 text-center">
              <motion.div variants={itemVariants} className="flex justify-center gap-4 mb-8">
                <User size={80} className="text-blue-400" />
                <Smartphone size={60} className="text-blue-600 self-end" />
                <CloudRain size={50} className="text-zinc-500 absolute -mt-6 ml-20" />
              </motion.div>
              <motion.div variants={itemVariants} className="uppercase tracking-widest text-blue-400 font-bold text-sm mb-4">Protagonis 2 : Gen-Z Sadar Lingkungan</motion.div>
              <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-black text-blue-300 mb-6">
                Nadia & Kecemasan Iklim
              </motion.h1>
              <motion.p variants={itemVariants} className="text-xl md:text-2xl text-zinc-300 mb-8 italic">
                "Aku mau beli sustainable fashion, tapi mahal banget. Gimana caranya support lingkungan tanpa harus jadi miskin?"
              </motion.p>
              <motion.div variants={itemVariants} className="flex justify-center gap-4 text-blue-200">
                <span className="px-4 py-2 bg-blue-900/40 rounded-full border border-blue-700/30">Greenwashing</span>
                <span className="px-4 py-2 bg-blue-900/40 rounded-full border border-blue-700/30">Eco-Anxiety</span>
                <span className="px-4 py-2 bg-blue-900/40 rounded-full border border-blue-700/30">Budget Terbatas</span>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {/* SCENE 3: Titik Temu */}
        {scene === 3 && (
          <motion.div key="scene3" className="w-full max-w-5xl z-10">
            <Card className="border-zinc-700/50 bg-transparent shadow-none text-center">
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-black text-white mb-12">
                Dua Krisis. Satu Solusi.
              </motion.h1>
              <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-center gap-8 relative">
                <div className="bg-amber-950/40 p-8 rounded-3xl border border-amber-500/30 w-full md:w-1/3 shadow-[0_0_30px_rgba(245,158,11,0.15)] flex flex-col items-center">
                  <Scissors size={60} className="text-amber-500 mb-4" />
                  <h3 className="text-xl font-bold text-amber-300 mb-2">Skill Terabaikan</h3>
                  <p className="text-zinc-400 text-sm">Penjahit lokal kehilangan orderan</p>
                </div>
                
                <div className="flex flex-col items-center justify-center text-white/50 p-4">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}><HeartHandshake size={50} className="text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]" /></motion.div>
                </div>

                <div className="bg-blue-950/40 p-8 rounded-3xl border border-blue-500/30 w-full md:w-1/3 shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col items-center">
                  <Leaf size={60} className="text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-blue-300 mb-2">Limbah Menumpuk</h3>
                  <p className="text-zinc-400 text-sm">Gen-Z mencari opsi ramah lingkungan</p>
                </div>
              </motion.div>
              <motion.p variants={itemVariants} className="mt-12 text-2xl text-emerald-300 font-bold max-w-2xl mx-auto">
                Bagaimana jika keduanya bisa saling merevolusi industri?
              </motion.p>
            </Card>
          </motion.div>
        )}

        {/* SCENE 4: EcoThread Hadir */}
        {scene === 4 && (
          <motion.div key="scene4" className="w-full max-w-4xl z-10 text-center">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="relative">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-[80px]"
              />
              <motion.div variants={itemVariants} className="mb-6 inline-block bg-emerald-950/50 p-6 rounded-full border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.4)]">
                <Recycle size={100} className="text-emerald-400" />
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 mb-4">
                EcoThread
              </motion.h1>
              <motion.h3 variants={itemVariants} className="text-2xl text-emerald-200/80 uppercase tracking-[0.2em] mb-10 font-medium">
                Circular Fashion Manufacturing
              </motion.h3>
              <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
                <span className="px-6 py-3 bg-zinc-900 border border-emerald-500/30 rounded-full flex items-center gap-2 text-emerald-300"><Cpu size={20}/> AI-Powered Design</span>
                <span className="px-6 py-3 bg-zinc-900 border border-blue-500/30 rounded-full flex items-center gap-2 text-blue-300"><ShieldCheck size={20}/> Blockchain Verified</span>
                <span className="px-6 py-3 bg-zinc-900 border border-amber-500/30 rounded-full flex items-center gap-2 text-amber-300"><Users size={20}/> Community Driven</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* SCENE 5: Flow Cara Kerja */}
        {scene === 5 && (
          <motion.div key="scene5" className="w-full max-w-6xl z-10">
            <Card className="border-teal-900/40 bg-zinc-900/80">
              <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-black text-center mb-10 text-white">
                Bagaimana <span className="text-teal-400">EcoThread</span> Bekerja?
              </motion.h2>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {[
                  { i: Recycle, t: "Sourcing", d: "Kumpul Limbah" },
                  { i: Wind, t: "Sterilisasi", d: "Treatment Ozon" },
                  { i: Cpu, t: "GarmageNet", d: "AI Pola 3D" },
                  { i: Scissors, t: "Mitra Lokal", d: "Produksi Jahit" },
                  { i: Star, t: "QC", d: "Inspeksi Kualitas" },
                  { i: ShieldCheck, t: "DPP", d: "Blockchain Scan" }
                ].map((step, idx) => (
                  <motion.div variants={itemVariants} key={idx} className="flex flex-col items-center bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800 relative">
                    <div className="w-12 h-12 bg-teal-900/40 text-teal-400 rounded-full flex items-center justify-center mb-3">
                      <step.i size={24} />
                    </div>
                    <div className="font-bold text-white text-sm text-center mb-1">{step.t}</div>
                    <div className="text-xs text-zinc-400 text-center leading-tight">{step.d}</div>
                    {idx < 5 && <ArrowRight size={20} className="text-teal-600 hidden md:block absolute -right-3 top-1/2 -translate-y-1/2" />}
                  </motion.div>
                ))}
              </div>
              <motion.p variants={itemVariants} className="text-center mt-10 text-lg text-teal-200/80">
                Penyatuan Teknologi AI + Blockchain + Kearifan Lokal
              </motion.p>
            </Card>
          </motion.div>
        )}

        {/* SCENE 6: Kebangkitan Ibu Siti */}
        {scene === 6 && (
          <motion.div key="scene6" className="w-full max-w-4xl z-10">
            <Card className="border-emerald-500/40 bg-gradient-to-b from-zinc-900/90 to-emerald-950/20 text-center">
              <motion.div variants={itemVariants} className="flex justify-center gap-6 mb-6">
                <User size={80} className="text-emerald-400" />
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <TrendingUp size={60} className="text-emerald-500" />
                </motion.div>
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-black text-emerald-400 mb-6">
                Kebangkitan Ibu Siti!
              </motion.h1>
              <motion.p variants={itemVariants} className="text-xl md:text-2xl text-emerald-100/90 mb-8 italic">
                "Orderan ramai lagi, skill saya dihargai. Sekarang tiap hari ada pesanan Eco-Kit dari anak muda!"
              </motion.p>
              <motion.div variants={itemVariants} className="flex justify-center items-center gap-4">
                <div className="bg-emerald-950/50 p-6 rounded-2xl border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <div className="text-sm text-emerald-300 font-bold mb-1">EcoThread Mitra App</div>
                  <div className="text-4xl font-black text-white">+156 Order Baru</div>
                  <div className="text-emerald-400 flex justify-center gap-1 mt-2">
                    <Star size={16} fill="currentColor"/> <Star size={16} fill="currentColor"/> <Star size={16} fill="currentColor"/> <Star size={16} fill="currentColor"/> <Star size={16} fill="currentColor"/>
                    <span className="ml-2 font-bold">(4.9)</span>
                  </div>
                </div>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {/* SCENE 7: Kepuasan Nadia */}
        {scene === 7 && (
          <motion.div key="scene7" className="w-full max-w-4xl z-10">
            <Card className="border-blue-500/40 bg-gradient-to-b from-zinc-900/90 to-blue-950/20 text-center">
              <motion.div variants={itemVariants} className="flex justify-center gap-6 mb-6 relative">
                <User size={80} className="text-blue-400" />
                <QrCode size={50} className="text-emerald-400 absolute ml-20 mt-4" />
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-black text-blue-300 mb-6">
                Nadia Menemukan Jawabannya
              </motion.h1>
              <motion.p variants={itemVariants} className="text-xl text-blue-100/90 mb-8 italic max-w-2xl mx-auto">
                "Fashion unik, harga terjangkau (Rp 349.000), dan lewat scan NFC baju ini, aku tau persis kalau Bu Siti dari Bandung yang menjahitnya!"
              </motion.p>
              <motion.div variants={itemVariants} className="flex justify-center gap-4">
                <div className="flex items-center gap-3 bg-blue-950/40 px-6 py-4 rounded-full border border-blue-500/30">
                  <ShieldCheck size={24} className="text-emerald-400" />
                  <div className="text-left">
                    <div className="text-xs text-blue-300">Digital Product Passport</div>
                    <div className="font-bold text-white">100% Traceable</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-blue-950/40 px-6 py-4 rounded-full border border-blue-500/30">
                  <Leaf size={24} className="text-emerald-400" />
                  <div className="text-left">
                    <div className="text-xs text-blue-300">Impact Tracker</div>
                    <div className="font-bold text-white">CO₂ Saved: 2.3 kg</div>
                  </div>
                </div>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {/* SCENE 8: CTA */}
        {scene === 8 && (
          <motion.div key="scene8" className="w-full max-w-5xl z-10 text-center">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <motion.div variants={itemVariants} className="flex justify-center mb-6">
                <Recycle size={80} className="text-teal-400 drop-shadow-[0_0_30px_rgba(45,212,191,0.5)]" />
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                Dari Limbah Lahir Harapan.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  Dari Tangan Lokal Untuk Dunia.
                </span>
              </motion.h1>
              
              <motion.div variants={itemVariants} className="flex justify-center gap-8 my-10 border-y border-zinc-800 py-6">
                <div>
                  <div className="text-sm text-zinc-400">Target Dampak</div>
                  <div className="text-2xl font-black text-amber-400">4.2 Jt Penjahit</div>
                </div>
                <div>
                  <div className="text-sm text-zinc-400">Target Pasar</div>
                  <div className="text-2xl font-black text-blue-400">44.5 Jt Gen-Z</div>
                </div>
                <div>
                  <div className="text-sm text-zinc-400">Reduksi Limbah</div>
                  <div className="text-2xl font-black text-emerald-400">2.3 Jt Ton</div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-10 flex flex-col items-center">
                <div className="text-sm tracking-widest text-zinc-500 uppercase mb-3">Tim EcoThread</div>
                <div className="flex gap-4 text-zinc-300 font-medium">
                  <span>M. Hanif Al Faiz (CEO)</span> • 
                  <span>Stella Rahma (COO)</span> • 
                  <span>Carlita Wahyu (CMO)</span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(16,185,129,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open('http://localhost:5173', '_blank')}
                  className="px-8 py-4 rounded-full bg-emerald-500 text-zinc-950 font-black text-lg flex items-center justify-center gap-2"
                >
                  <Smartphone size={20} /> Coba Prototipe App
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetScene}
                  className="px-8 py-4 rounded-full border-2 border-zinc-700 text-zinc-300 font-bold text-lg flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
                >
                  <Recycle size={20} /> Putar Ulang
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
        <button 
          onClick={prevScene} 
          disabled={scene === 0}
          className="p-3 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 transition-all"
        >
          <ArrowRight size={24} className="rotate-180" />
        </button>
        <button 
          onClick={nextScene} 
          disabled={scene === 8}
          className="p-3 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 transition-all"
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
}
