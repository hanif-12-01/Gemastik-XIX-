import { EcoThreadApiClient } from '@ecothread/api-client'
import { env } from './env'

/**
 * Token Provider interface for managing client authentication state
 */
export interface TokenProvider {
  getToken(): string | null
  setToken(token: string | null): void
  clearToken(): void
}

const STORAGE_KEY = 'ecothread_auth_token'

export const defaultTokenProvider: TokenProvider = {
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEY)
  },
  setToken(token: string | null): void {
    if (token) {
      localStorage.setItem(STORAGE_KEY, token)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  },
  clearToken(): void {
    localStorage.removeItem(STORAGE_KEY)
  }
}

/**
 * Single initialized API SDK Client boundary for apps/web
 */
export const apiClient = new EcoThreadApiClient(env.apiBaseUrl)

// Restore saved token from storage if available
const initialToken = defaultTokenProvider.getToken()
if (initialToken) {
  apiClient.setToken(initialToken)
}

// Global 401 Unauthorized handler
apiClient.onUnauthorized(() => {
  defaultTokenProvider.clearToken()
})

/**
 * Helper to upload multipart evidence/files to API
 */
export async function uploadMultipartFile(
  endpoint: string,
  formData: FormData
): Promise<{ url: string; success: boolean }> {
  const token = apiClient.getToken()
  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${env.apiBaseUrl}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData
  })

  if (response.status === 401) {
    defaultTokenProvider.clearToken()
    throw new Error('Sesi telah berakhir. Silakan login kembali.')
  }

  const json = await response.json()
  if (!response.ok || !json.success) {
    throw new Error(json.error || `Upload gagal dengan HTTP status ${response.status}`)
  }

  return json.data
}
