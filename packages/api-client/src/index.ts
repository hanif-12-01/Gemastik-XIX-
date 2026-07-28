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

  public async uploadQcPhoto(file: File): Promise<{ url: string; filename: string; mimeType: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const headers: Record<string, string> = {}
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const res = await fetch(`${this.baseUrl}/uploads/qc`, {
      method: 'POST',
      headers,
      body: formData
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

  // Generic HTTP helpers
  public async get<T = any>(endpoint: string): Promise<{ success: boolean; data: T }> {
    const data = await this.request<T>(endpoint, { method: 'GET' })
    return { success: true, data }
  }

  public async post<T = any>(endpoint: string, body?: any): Promise<{ success: boolean; data: T }> {
    const data = await this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    })
    return { success: true, data }
  }

  public async patch<T = any>(endpoint: string, body?: any): Promise<{ success: boolean; data: T }> {
    const data = await this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined
    })
    return { success: true, data }
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

  public async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' })
    } catch (e) {
      // Ignore network failure on logout
    } finally {
      this.setToken(null)
    }
  }

  public async registerMitra(payload: any) {
    return this.request('/auth/mitra/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  public async createAdminInvitation(payload: { email: string; expiresInHours?: number }) {
    return this.request('/auth/admin/invitations', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  public async validateAdminInvitation(token: string) {
    return this.request(`/auth/admin/invitations/${token}/validate`)
  }

  public async registerAdminFromInvitation(token: string, payload: { password: string; name: string }) {
    return this.request(`/auth/admin/invitations/${token}/register`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  public async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  }

  public async resetPassword(token: string, password: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password })
    })
  }

  public async listMitraApplications() {
    return this.request('/admin/mitra-applications')
  }

  public async getMitraApplication(id: string) {
    return this.request(`/admin/mitra-applications/${id}`)
  }

  public async decideMitraApplication(id: string, approve: boolean, notes?: string) {
    return this.request(`/admin/mitra-applications/${id}/decision`, {
      method: 'POST',
      body: JSON.stringify({ approve, notes })
    })
  }

  // Admin
  public async getAdminDashboardStats() {
    return this.request('/admin/dashboard-stats')
  }

  // Admin Material Sources
  public async listMaterialSources() {
    return this.request('/admin/material-sources')
  }

  public async getMaterialSource(id: string) {
    return this.request(`/admin/material-sources/${id}`)
  }

  public async createMaterialSource(payload: any) {
    return this.request('/admin/material-sources', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  public async updateMaterialSource(id: string, payload: any) {
    return this.request(`/admin/material-sources/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
  }

  // Admin Material Batches
  public async getMaterialBatches() {
    return this.request('/admin/material-batches')
  }

  public async getMaterialBatch(id: string) {
    return this.request(`/admin/material-batches/${id}`)
  }

  public async createMaterialBatch(payload: any) {
    return this.request('/admin/material-batches', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  public async updateMaterialBatch(id: string, payload: any) {
    return this.request(`/admin/material-batches/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
  }

  // Admin Patterns
  public async listPatterns() {
    return this.request('/admin/patterns')
  }

  public async getPattern(id: string) {
    return this.request(`/admin/patterns/${id}`)
  }

  public async createPattern(payload: any) {
    return this.request('/admin/patterns', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  public async updatePattern(id: string, payload: any) {
    return this.request(`/admin/patterns/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
  }

  // Admin Eco-Kits
  public async listEcoKits() {
    return this.request('/admin/eco-kits')
  }

  public async getEcoKit(id: string) {
    return this.request(`/admin/eco-kits/${id}`)
  }

  public async createEcoKit(payload: any) {
    return this.request('/admin/eco-kits', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  public async updateEcoKit(id: string, payload: any) {
    return this.request(`/admin/eco-kits/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
  }

  // Admin Production Orders
  public async listAdminProductionOrders() {
    return this.request('/admin/production-orders')
  }

  public async getAdminProductionOrder(id: string) {
    return this.request(`/admin/production-orders/${id}`)
  }

  public async createProductionOrder(payload: any) {
    return this.request('/admin/production-orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  public async updateProductionOrder(id: string, payload: any) {
    return this.request(`/admin/production-orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
  }

  public async assignOrder(id: string, mitraUserId: string) {
    return this.request(`/admin/production-orders/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ mitraUserId })
    })
  }

  public async getAssignableMitra() {
    return this.request('/admin/assignable-mitra')
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

  public async createProductionIssue(id: string, payload: any) {
    return this.request(`/mitra/production-orders/${id}/issues`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  public async updateMitraProfile(payload: any) {
    return this.request('/mitra/profile', {
      method: 'PATCH',
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

  public async registerCustomer(payload: any) {
    return this.request('/auth/customer/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  public async getCustomerProfile() {
    return this.request('/customer/profile')
  }

  public async updateCustomerProfile(payload: any) {
    return this.request('/customer/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
  }

  public async getCustomerOrderDetail(id: string) {
    return this.request(`/customer-orders/${id}`)
  }

  public async getAdminPayments() {
    return this.request('/admin/payments')
  }

  public async getAdminPaymentDetail(id: string) {
    return this.request(`/admin/payments/${id}`)
  }

  public async verifyPayment(id: string, payloadOrApprove: any, notes?: string) {
    const body = typeof payloadOrApprove === 'boolean'
      ? { approve: payloadOrApprove, notes }
      : payloadOrApprove
    return this.request(`/admin/payments/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify(body)
    })
  }

  // Mitra
  public async getMitraProfile() {
    return this.request('/mitra/profile')
  }

  public async getMitraPayouts() {
    return this.request('/mitra/payouts')
  }

  // Blockchain Anchoring (Roadmap 9 — Polygon Amoy)
  public async getAdminDppBlockchainAnchor(id: string) {
    return this.request(`/admin/dpp/${id}/blockchain-anchor`)
  }

  public async anchorDppOnAmoy(id: string, versionNum?: number) {
    return this.request(`/admin/dpp/${id}/anchor-amoy`, {
      method: 'POST',
      body: JSON.stringify({ versionNum })
    })
  }

  public async reconcileDppAnchor(id: string) {
    return this.request(`/admin/dpp/${id}/blockchain-anchor/reconcile`, {
      method: 'POST'
    })
  }

  public async retryDppAnchor(id: string, versionNum?: number) {
    return this.request(`/admin/dpp/${id}/blockchain-anchor/retry`, {
      method: 'POST',
      body: JSON.stringify({ versionNum })
    })
  }

  public async getPublicDppBlockchainVerification(productCode: string) {
    return this.request(`/public/dpp/${productCode}/blockchain-verification`)
  }
}

export const api = new EcoThreadApiClient()

