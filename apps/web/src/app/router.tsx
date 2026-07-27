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

// Admin Pages (Roadmap 3)
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminMitraApplicationsPage } from '../pages/admin/AdminMitraApplicationsPage'
import { AdminMaterialSourcesPage } from '../pages/admin/AdminMaterialSourcesPage'
import { AdminMaterialBatchesPage } from '../pages/admin/AdminMaterialBatchesPage'
import { AdminPatternsPage } from '../pages/admin/AdminPatternsPage'
import { AdminEcoKitsPage } from '../pages/admin/AdminEcoKitsPage'
import { AdminProductionOrdersPage } from '../pages/admin/AdminProductionOrdersPage'
import { AdminOrderDetailPage } from '../pages/admin/AdminOrderDetailPage'

// Admin Pages (Roadmap 5)
import { AdminQcQueuePage } from '../pages/admin/AdminQcQueuePage'
import { AdminQcDetailPage } from '../pages/admin/AdminQcDetailPage'
import { AdminPayoutsPage } from '../pages/admin/AdminPayoutsPage'
import { AdminPayoutDetailPage } from '../pages/admin/AdminPayoutDetailPage'
import { AdminProductsPage } from '../pages/admin/AdminProductsPage'
import { AdminProductDetailPage } from '../pages/admin/AdminProductDetailPage'
import { AdminCreateProductPage } from '../pages/admin/AdminCreateProductPage'

// Mitra Pages (Roadmap 4)
import { MitraDashboardPage } from '../pages/mitra/MitraDashboardPage'
import { MitraOrdersPage } from '../pages/mitra/MitraOrdersPage'
import { MitraOrderDetailPage } from '../pages/mitra/MitraOrderDetailPage'
import { MitraProfilePage } from '../pages/mitra/MitraProfilePage'
import { MitraPayoutsPage } from '../pages/mitra/MitraPayoutsPage'
import { MitraVerificationStatusPage } from '../pages/mitra/MitraVerificationStatusPage'

// Customer Pages (Roadmap 6)
import { RegisterCustomerPage } from '../pages/customer/RegisterCustomerPage'
import { CustomerLoginPage } from '../pages/customer/CustomerLoginPage'
import { CustomerAccountPage } from '../pages/customer/CustomerAccountPage'
import { CustomerProfilePage } from '../pages/customer/CustomerProfilePage'
import { CustomerOrdersPage } from '../pages/customer/CustomerOrdersPage'
import { CustomerOrderDetailPage } from '../pages/customer/CustomerOrderDetailPage'
import { CheckoutPage } from '../pages/customer/CheckoutPage'

// Admin Payments (Roadmap 6)
import { AdminPaymentsPage } from '../pages/admin/AdminPaymentsPage'
import { AdminPaymentDetailPage } from '../pages/admin/AdminPaymentDetailPage'

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
      { path: 'dpp/:productCode', element: <PublicDppPage /> },
      { path: 'checkout/:catalogItemId', element: <CheckoutPage /> }
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
      { path: 'customer/register', element: <RegisterCustomerPage /> },
      { path: 'customer/login', element: <CustomerLoginPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password/:token', element: <ResetPasswordPage /> }
    ]
  },

  // Protected Customer Routes (Roadmap 6)
  {
    path: '/account',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['user', 'admin']}>
          <PublicLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    errorElement: <UnexpectedErrorPage />,
    children: [
      { index: true, element: <CustomerAccountPage /> },
      { path: 'profile', element: <CustomerProfilePage /> },
      { path: 'orders', element: <CustomerOrdersPage /> },
      { path: 'orders/:id', element: <CustomerOrderDetailPage /> }
    ]
  },

  // Protected Admin Routes (Roadmap 3, 5, 6)
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
      { index: true, element: <AdminDashboardPage /> },
      { path: 'mitra', element: <AdminMitraApplicationsPage /> },
      { path: 'materials/sources', element: <AdminMaterialSourcesPage /> },
      { path: 'material-sources', element: <AdminMaterialSourcesPage /> },
      { path: 'materials', element: <AdminMaterialBatchesPage /> },
      { path: 'material-batches', element: <AdminMaterialBatchesPage /> },
      { path: 'patterns', element: <AdminPatternsPage /> },
      { path: 'eco-kits', element: <AdminEcoKitsPage /> },
      { path: 'orders', element: <AdminProductionOrdersPage /> },
      { path: 'orders/:id', element: <AdminOrderDetailPage /> },
      // Roadmap 5
      { path: 'qc', element: <AdminQcQueuePage /> },
      { path: 'qc/:id', element: <AdminQcDetailPage /> },
      { path: 'payouts', element: <AdminPayoutsPage /> },
      { path: 'payouts/:id', element: <AdminPayoutDetailPage /> },
      { path: 'products', element: <AdminProductsPage /> },
      { path: 'products/new', element: <AdminCreateProductPage /> },
      { path: 'products/:id', element: <AdminProductDetailPage /> },
      // Roadmap 6
      { path: 'payments', element: <AdminPaymentsPage /> },
      { path: 'payments/:id', element: <AdminPaymentDetailPage /> }
    ]
  },

  // Protected Mitra Routes (Roadmap 4)
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
            <MitraDashboardPage />
          </MitraVerificationGuard>
        )
      },
      {
        path: 'orders',
        element: (
          <MitraVerificationGuard>
            <MitraOrdersPage />
          </MitraVerificationGuard>
        )
      },
      {
        path: 'orders/:id',
        element: (
          <MitraVerificationGuard>
            <MitraOrderDetailPage />
          </MitraVerificationGuard>
        )
      },
      {
        path: 'profile',
        element: (
          <MitraVerificationGuard>
            <MitraProfilePage />
          </MitraVerificationGuard>
        )
      },
      {
        path: 'payouts',
        element: (
          <MitraVerificationGuard>
            <MitraPayoutsPage />
          </MitraVerificationGuard>
        )
      }
    ]
  },

  // Error Routes
  { path: '/403', element: <ForbiddenPage /> },
  { path: '*', element: <NotFoundPage /> }
])
