import React from 'react'
import { AuthProvider, useAuth } from './AuthContext'
import { LoginForm } from './LoginForm'
import App from './App'
import { Loader2, ShieldAlert } from 'lucide-react'

const MitraMain = () => {
  const { user, loading, isAuthenticated, logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <p className="text-sm font-medium">Memuat Aplikasi Mitra EcoThread...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  if (user?.role !== 'mitra') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-3xl p-8 text-center text-gray-800 shadow-xl">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Akses Ditolak</h2>
          <p className="text-gray-500 text-sm mb-6">
            Akun Anda (<span className="text-gray-900 font-semibold">{user?.email}</span>) bukan akun Penjahit Mitra (Role: <code className="text-red-600 bg-red-50 px-2 py-0.5 rounded">{user?.role}</code>).
          </p>
          <button
            onClick={logout}
            className="w-full py-3 bg-gray-800 text-white hover:bg-gray-700 rounded-2xl font-bold text-sm transition-colors"
          >
            Keluar & Gunakan Akun Mitra
          </button>
        </div>
      </div>
    )
  }

  return <App />
}

export default function MitraApp() {
  return (
    <AuthProvider>
      <MitraMain />
    </AuthProvider>
  )
}
