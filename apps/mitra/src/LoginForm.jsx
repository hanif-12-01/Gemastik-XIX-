import React, { useState } from 'react'
import { useAuth } from './AuthContext'
import { Scissors, Lock, Mail, ShieldAlert, UserCheck } from 'lucide-react'

export const LoginForm = ({ defaultEmail = 'mitra@ecothread.local' }) => {
  const { login, error: authError } = useAuth()
  const [email, setEmail] = useState(defaultEmail)
  const [password, setPassword] = useState('Password123!')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa email & password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800 p-4">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-200 shadow-sm">
            <Scissors className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Aplikasi Penjahit Mitra</h1>
          <p className="text-gray-500 text-sm mt-1">Masuk untuk menerima & mengelola pesanan jahit</p>
        </div>

        {(error || authError) && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{error || authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Email Mitra
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 focus:outline-none focus:border-teal-500 transition-colors text-base"
                placeholder="mitra@ecothread.local"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 focus:outline-none focus:border-teal-500 transition-colors text-base"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-base rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-600/30"
          >
            {loading ? 'Proses Masuk...' : 'Masuk Aplikasi Mitra'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 space-y-2 text-center text-xs text-gray-500">
          <p className="font-semibold text-gray-700">Pilih Akun Demo Mitra:</p>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => { setEmail('mitra@ecothread.local'); setPassword('Password123!'); }}
              className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-xl font-medium border border-teal-200 hover:bg-teal-100"
            >
              Ibu Siti (mitra)
            </button>
            <button
              onClick={() => { setEmail('mitra2@ecothread.local'); setPassword('Password123!'); }}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl font-medium border border-emerald-200 hover:bg-emerald-100"
            >
              Ibu Rina (mitra2)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
