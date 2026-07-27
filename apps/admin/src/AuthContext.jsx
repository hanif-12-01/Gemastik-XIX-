import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '@ecothread/api-client'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('ecothread_token'))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.onUnauthorized(() => {
      logout()
    })
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        api.setToken(token)
        try {
          const userData = await api.getMe()
          setUser(userData)
        } catch (err) {
          console.error('Failed to fetch me:', err)
          logout()
        }
      } else {
        api.setToken(null)
        setUser(null)
      }
      setLoading(false)
    }
    initAuth()
  }, [token])

  const login = async (email, password) => {
    setError(null)
    try {
      const res = await api.login(email, password)
      const authToken = res.token
      localStorage.setItem('ecothread_token', authToken)
      api.setToken(authToken)
      setUser(res.user)
      setToken(authToken)
      return res
    } catch (err) {
      setError(err.message || 'Login gagal')
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('ecothread_token')
    api.setToken(null)
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, logout, isAuthenticated: !!user }}>
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
