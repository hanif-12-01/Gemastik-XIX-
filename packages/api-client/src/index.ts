export class EcoThreadApiClient {
  private baseUrl: string
  private token: string | null = null
  private on401Callback: (() => void) | null = null

  constructor(baseUrl: string = 'http://localhost:4000/api/v1') {
    this.baseUrl = baseUrl
  }

  public setToken(token: string | null) {
    this.token = token
  }

  public getToken(): string | null {
    return this.token
  }

  public isAuthenticated(): boolean {
    return this.token !== null
  }

  public onUnauthorized(callback: () => void) {
    this.on401Callback = callback
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>)
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    })

    if (res.status === 401 && this.on401Callback) {
      this.token = null
      this.on401Callback()
      throw new Error('Sesi telah berakhir. Silakan login kembali.')
    }

    const json = await res.json()
    if (!res.ok || !json.success) {
      throw new Error(json.error || `HTTP Error ${res.status}`)
    }

    return json.data
  }

  // Health
  public async getHealth() {
    return this.request('/health')
  }

  // Auth
  public async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    if (data.token) {
      this.setToken(data.token)
    }
    return data
  }

  public async getMe() {
    return this.request('/me')
  }

  // Admin
  public async getAdminDashboardStats() {
    return this.request('/admin/dashboard-stats')
  }

  public async getMaterialBatches() {
    return this.request('/admin/material-batches')
  }

  public async createMaterialBatch(payload: any) {
    return this.request('/admin/material-batches', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  public async createProductionOrder(payload: any) {
    return this.request('/admin/production-orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  public async assignOrder(id: string, mitraUserId: string) {
    return this.request(`/admin/production-orders/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ mitraUserId })
    })
  }

  public async getQcReviews() {
    return this.request('/admin/qc-reviews')
  }

  public async submitQcDecision(id: string, payload: any) {
    return this.request(`/admin/qc-reviews/${id}/decision`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  public async markPayoutPaid(id: string, paymentReference: string) {
    return this.request(`/admin/payouts/${id}/mark-paid`, {
      method: 'POST',
      body: JSON.stringify({ paymentReference })
    })
  }

  public async verifyPayment(paymentId: string, approve: boolean, notes?: string) {
    return this.request(`/admin/payments/${paymentId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ approve, notes })
    })
  }

  public async createProduct(payload: any) {
    return this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  public async publishDpp(productId: string) {
    return this.request(`/admin/products/${productId}/publish-dpp`, {
      method: 'POST',
      body: JSON.stringify({})
    })
  }

  // Mitra
  public async getMitraOrders() {
    return this.request('/mitra/production-orders')
  }

  public async getMitraOrderDetail(id: string) {
    return this.request(`/mitra/production-orders/${id}`)
  }

  public async acceptOrder(id: string) {
    return this.request(`/mitra/production-orders/${id}/accept`, {
      method: 'POST',
      body: JSON.stringify({})
    })
  }

  public async rejectOrder(id: string, reason?: string) {
    return this.request(`/mitra/production-orders/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    })
  }

  public async updateProgress(id: string, payload: any) {
    return this.request(`/mitra/production-orders/${id}/progress`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  public async submitQcEvidence(id: string, payload: any) {
    return this.request(`/mitra/production-orders/${id}/submit-qc`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  // Public DPP & Catalog
  public async getDpp(productCode: string) {
    return this.request(`/dpp/${productCode}`)
  }

  public async getCatalog() {
    return this.request('/catalog')
  }

  public async getCatalogDetail(slug: string) {
    return this.request(`/catalog/${slug}`)
  }

  public async createCustomerOrder(payload: any) {
    return this.request('/customer-orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  public async submitPaymentProof(orderId: string, payload: any) {
    return this.request(`/customer-orders/${orderId}/payment-proof`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  public async getMyCustomerOrders() {
    return this.request('/me/customer-orders')
  }

  // Admin: List endpoints
  public async getAdminMitra() {
    return this.request('/admin/mitra')
  }

  public async getAdminProductionOrders() {
    return this.request('/admin/production-orders')
  }

  public async getAdminProducts() {
    return this.request('/admin/products')
  }

  public async getAdminCustomerOrders() {
    return this.request('/admin/customer-orders')
  }

  public async getAdminPayments() {
    return this.request('/admin/payments')
  }

  // Mitra
  public async getMitraProfile() {
    return this.request('/mitra/profile')
  }

  public async getMitraPayouts() {
    return this.request('/mitra/payouts')
  }
}

export const api = new EcoThreadApiClient()
