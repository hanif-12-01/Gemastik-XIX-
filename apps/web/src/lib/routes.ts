/**
 * EcoThread Application Route Definitions
 */
export const ROUTES = {
  PUBLIC: {
    LANDING: '/',
    PORTAL: '/portal',
    CATALOG: '/catalog',
    PRODUCT_DETAIL: '/catalog/:slug',
    DPP: '/dpp/:productCode',
    getProductDetail: (slug: string) => `/catalog/${slug}`,
    getDpp: (code: string) => `/dpp/${code}`
  },
  AUTH: {
    ADMIN_LOGIN: '/auth/admin/login',
    ADMIN_INVITE: '/auth/admin/invite/:token',
    getAdminInvite: (token: string) => `/auth/admin/invite/${token}`,
    MITRA_LOGIN: '/auth/mitra/login',
    MITRA_REGISTER: '/auth/mitra/register',
    FORGOT_PASSWORD: '/auth/forgot-password'
  },
  PROTECTED: {
    ADMIN: '/admin',
    MITRA: '/mitra'
  },
  ERRORS: {
    FORBIDDEN: '/403',
    NOT_FOUND: '/404'
  }
} as const
