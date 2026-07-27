import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PublicLayout } from './layouts/PublicLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { MitraLayout } from './layouts/MitraLayout'
import { RouteGuard } from './route-guards'

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

// Protected Dashboard Placeholders
import { AdminDashboardPlaceholder } from '../pages/admin/AdminDashboardPlaceholder'
import { MitraDashboardPlaceholder } from '../pages/mitra/MitraDashboardPlaceholder'

// Error Pages
import { NotFoundPage } from '../pages/errors/NotFoundPage'
import { ForbiddenPage } from '../pages/errors/ForbiddenPage'

export const router = createBrowserRouter([
  // Public Routes Group
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'portal', element: <PortalSelectionPage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'catalog/:slug', element: <ProductDetailPage /> },
      { path: 'dpp/:productCode', element: <PublicDppPage /> }
    ]
  },

  // Auth Routes Group
  {
    path: 'auth',
    element: <AuthLayout />,
    children: [
      { path: 'admin/login', element: <AdminLoginPage /> },
      { path: 'admin/invite/:token', element: <AdminInvitationPage /> },
      { path: 'mitra/login', element: <MitraLoginPage /> },
      { path: 'mitra/register', element: <MitraRegistrationPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> }
    ]
  },

  // Protected Admin Routes Group
  {
    path: 'admin',
    element: (
      <RouteGuard requiredRole="admin">
        <AdminLayout />
      </RouteGuard>
    ),
    children: [
      { index: true, element: <AdminDashboardPlaceholder /> }
    ]
  },

  // Protected Mitra Routes Group
  {
    path: 'mitra',
    element: (
      <RouteGuard requiredRole="mitra">
        <MitraLayout />
      </RouteGuard>
    ),
    children: [
      { index: true, element: <MitraDashboardPlaceholder /> }
    ]
  },

  // Error Routes Group
  {
    path: '403',
    element: <ForbiddenPage />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
])
