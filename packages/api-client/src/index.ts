export class EcoThreadApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = 'http://localhost:4000/api/v1') {
    this.baseUrl = baseUrl
  }

  public setToken(token: string | null) {
    this.token = token
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

  public async createProduct(payload: any) {
    return this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  public async publishDpp(productId: string) {
    return this.request(`/admin/products/${productId}/publish-dpp`, {
      method: 'POST'
    })
  }

  // Mitra
  public async getMitraOrders() {
    return this.request('/mitra/production-orders')
  }

  public async acceptOrder(id: string) {
    return this.request(`/mitra/production-orders/${id}/accept`, {
      method: 'POST'
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
}

export const api = new EcoThreadApiClient()
