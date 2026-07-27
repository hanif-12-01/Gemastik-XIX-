import React, { useState } from 'react'
import { useAuth } from './AuthContext'
import { Lock, Mail, ShieldAlert } from 'lucide-react'

export const LoginForm = ({ defaultEmail = 'admin@ecothread.local' }) => {
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
    <div className="min-h-screen flex items-center justify-center bg-stone-900 text-white p-4">
      <div className="max-w-md w-full bg-stone-800 border border-stone-700 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-stone-100">EcoThread Admin</h1>
          <p className="text-stone-400 text-sm mt-1">Masuk untuk mengelola platform manufaktur sirkular</p>
        </div>

        {(error || authError) && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl flex items-center gap-3 text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{error || authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
              Email Admin
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-stone-900 border border-stone-700 rounded-xl py-3 pl-11 pr-4 text-stone-100 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="admin@ecothread.local"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-stone-900 border border-stone-700 rounded-xl py-3 pl-11 pr-4 text-stone-100 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/30"
          >
            {loading ? 'Proses Masuk...' : 'Masuk ke Dashboard'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-stone-700/50 text-center text-xs text-stone-500">
          Akun Demo Admin: <code className="text-emerald-400 bg-stone-900 px-2 py-0.5 rounded">admin@ecothread.local</code> / <code className="text-emerald-400 bg-stone-900 px-2 py-0.5 rounded">Password123!</code>
        </div>
      </div>
    </div>
  )
}
