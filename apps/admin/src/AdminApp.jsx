import React from 'react'
import { AuthProvider, useAuth } from './AuthContext'
import { LoginForm } from './LoginForm'
import EcoThreadDashboard from './ecothread_dashboard'
import { Loader2, ShieldAlert } from 'lucide-react'

const AdminMain = () => {
  const { user, loading, isAuthenticated, logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center text-stone-300">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-sm font-medium">Memuat sesi Admin EcoThread...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-800 border border-stone-700 rounded-2xl p-8 text-center text-white">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Akses Ditolak</h2>
          <p className="text-stone-400 text-sm mb-6">
            Akun Anda (<span className="text-stone-200">{user?.email}</span>) memiliki role <code className="text-rose-400 bg-stone-900 px-2 py-0.5 rounded">{user?.role}</code> dan tidak berhak mengakses Admin Dashboard.
          </p>
          <button
            onClick={logout}
            className="w-full py-3 bg-stone-700 hover:bg-stone-600 rounded-xl font-semibold text-sm transition-colors"
          >
            Keluar & Gunakan Akun Admin
          </button>
        </div>
      </div>
    )
  }

  return <EcoThreadDashboard />
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <AdminMain />
    </AuthProvider>
  )
}
