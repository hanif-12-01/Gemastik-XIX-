/**
 * Environment configuration for EcoThread Web Application
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:3000',
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  isDev: (import.meta.env.VITE_ENVIRONMENT || 'development') === 'development'
} as const

// Environment validation check on application startup
if (!import.meta.env.VITE_API_BASE_URL && import.meta.env.DEV) {
  console.warn('[Env Notice] VITE_API_BASE_URL is not set. Using Vite dev proxy fallback: /api/v1')
}
