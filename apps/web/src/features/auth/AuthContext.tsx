import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiClient } from '../../lib/api'
import { AuthStorage } from './AuthStorage'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'mitra' | 'user'
  accountStatus?: string
  profile?: any
  mitraProfile?: {
    id: string
    workshopName: string
    specialization?: string
    capacityPerWeek?: number
    location: string
    verificationStatus: 'pending_verification' | 'approved' | 'rejected' | 'suspended'
    verificationNotes?: string
  }
}

interface AuthContextType {
  status: 'initializing' | 'authenticated' | 'anonymous'
  user: User | null
  login: (email: string, password: string) => Promise<User>
  setToken: (token: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<'initializing' | 'authenticated' | 'anonymous'>('initializing')
  const [user, setUser] = useState<User | null>(null)

  // Configure 401 callback to clear token & update state
  useEffect(() => {
    apiClient.onUnauthorized(() => {
      AuthStorage.clearToken()
      setUser(null)
      setStatus('anonymous')
    })
  }, [])

  // Initialize session on startup
  useEffect(() => {
    async function initAuth() {
      const storedToken = AuthStorage.getToken()
      if (!storedToken) {
        setStatus('anonymous')
        return
      }

      apiClient.setToken(storedToken)
      try {
        const userData = await apiClient.getMe()
        setUser(userData)
        setStatus('authenticated')
      } catch (err) {
        AuthStorage.clearToken()
        apiClient.setToken(null)
        setUser(null)
        setStatus('anonymous')
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<User> => {
    const res = await apiClient.login(email, password)
    if (res.token) {
      AuthStorage.setToken(res.token)
      apiClient.setToken(res.token)
    }
    const userData = res.user
    setUser(userData)
    setStatus('authenticated')
    return userData
  }

  const setToken = async (token: string): Promise<void> => {
    AuthStorage.setToken(token)
    apiClient.setToken(token)
    try {
      const userData = await apiClient.getMe()
      setUser(userData)
      setStatus('authenticated')
    } catch {
      setStatus('anonymous')
    }
  }

  const logout = async (): Promise<void> => {
    await apiClient.logout()
    AuthStorage.clearToken()
    apiClient.setToken(null)
    setUser(null)
    setStatus('anonymous')
  }

  const refreshUser = async (): Promise<void> => {
    if (!apiClient.getToken()) return
    try {
      const userData = await apiClient.getMe()
      setUser(userData)
    } catch {
      // Ignore refresh error
    }
  }

  return (
    <AuthContext.Provider value={{ status, user, login, setToken, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
