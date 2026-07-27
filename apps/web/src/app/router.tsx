import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

// Layouts
import { PublicLayout } from './layouts/PublicLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { MitraLayout } from './layouts/MitraLayout'

// Guards
import { ProtectedRoute, RoleGuard, MitraVerificationGuard } from './route-guards'

// Public Pages
import { LandingPage } from '../pages/public/LandingPage'
import { PortalSelectionPage } from '../pages/public/PortalSelectionPage'
import { CatalogPage } from '../pages/public/CatalogPage'
import { ProductDetailPage } from '../pages/public/ProductDetailPage'
import { PublicDppPage } from '../pages/public/PublicDppPage'

// Auth Pages
import { AdminLoginPage } from '../pages/auth/AdminLoginPage'
import { AdminInvitationPage } from '../pages/auth/AdminInvitationPage'
import { MitraLoginPage } from '../pages/auth/MitraLoginPage'
import { MitraRegistrationPage } from '../pages/auth/MitraRegistrationPage'
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage'

// Protected Pages
import { AdminDashboardPlaceholder } from '../pages/admin/AdminDashboardPlaceholder'
import { AdminMitraApplicationsPage } from '../pages/admin/AdminMitraApplicationsPage'
import { MitraDashboardPlaceholder } from '../pages/mitra/MitraDashboardPlaceholder'
import { MitraVerificationStatusPage } from '../pages/mitra/MitraVerificationStatusPage'

// Error Pages
import { NotFoundPage } from '../pages/errors/NotFoundPage'
import { ForbiddenPage } from '../pages/errors/ForbiddenPage'
import { UnexpectedErrorPage } from '../pages/errors/UnexpectedErrorPage'

export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <UnexpectedErrorPage />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'portal', element: <PortalSelectionPage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'catalog/:slug', element: <ProductDetailPage /> },
      { path: 'dpp/:productCode', element: <PublicDppPage /> }
    ]
  },

  // Auth Routes
  {
    path: '/auth',
    element: <AuthLayout />,
    errorElement: <UnexpectedErrorPage />,
    children: [
      { path: 'admin/login', element: <AdminLoginPage /> },
      { path: 'admin/invite/:token', element: <AdminInvitationPage /> },
      { path: 'mitra/login', element: <MitraLoginPage /> },
      { path: 'mitra/register', element: <MitraRegistrationPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password/:token', element: <ResetPasswordPage /> }
    ]
  },

  // Protected Admin Routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['admin']}>
          <AdminLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    errorElement: <UnexpectedErrorPage />,
    children: [
      { index: true, element: <AdminDashboardPlaceholder /> },
      { path: 'mitra', element: <AdminMitraApplicationsPage /> }
    ]
  },

  // Protected Mitra Routes
  {
    path: '/mitra',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['mitra']}>
          <MitraLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    errorElement: <UnexpectedErrorPage />,
    children: [
      { path: 'verification-status', element: <MitraVerificationStatusPage /> },
      {
        index: true,
        element: (
          <MitraVerificationGuard>
            <MitraDashboardPlaceholder />
          </MitraVerificationGuard>
        )
      }
    ]
  },

  // Error Routes
  { path: '/403', element: <ForbiddenPage /> },
  { path: '*', element: <NotFoundPage /> }
])
