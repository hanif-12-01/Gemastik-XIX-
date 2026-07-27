import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import { LoadingSpinner } from '../components/feedback/LoadingSpinner'
import { ROUTES } from '../lib/routes'

export const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { status } = useAuth()

  if (status === 'initializing') {
    return <LoadingSpinner message="Memeriksa sesi otentikasi..." />
  }

  if (status === 'anonymous') {
    return <Navigate to={ROUTES.PUBLIC.PORTAL} replace />
  }

  return children ? <>{children}</> : <Outlet />
}

export const RoleGuard: React.FC<{ allowedRoles: ('admin' | 'mitra' | 'user')[]; children?: React.ReactNode }> = ({
  allowedRoles,
  children
}) => {
  const { user } = useAuth()

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.ERROR.FORBIDDEN} replace />
  }

  return children ? <>{children}</> : <Outlet />
}

export const MitraVerificationGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()

  if (user && user.role === 'mitra') {
    const status = user.mitraProfile?.verificationStatus || 'pending_verification'
    if (status !== 'approved') {
      return <Navigate to={ROUTES.MITRA.VERIFICATION_STATUS} replace />
    }
  }

  return children ? <>{children}</> : <Outlet />
}
