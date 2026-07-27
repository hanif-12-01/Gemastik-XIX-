import crypto from 'crypto'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { PrismaClient, Role, ProductionOrderStatus, PayoutStatus, DppVerificationState, DataOrigin, MitraVerificationStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'
import {
  LoginSchema,
  RegisterMitraSchema,
  CreateAdminInvitationSchema,
  RegisterAdminFromInvitationSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  MitraDecisionSchema,
  CreateMaterialSourceSchema,
  UpdateMaterialSourceSchema,
  CreateMaterialBatchSchema,
  UpdateMaterialBatchSchema,
  CreatePatternSchema,
  UpdatePatternSchema,
  CreateEcoKitSchema,
  UpdateEcoKitSchema,
  CreateProductionOrderSchema,
  UpdateProductionOrderSchema,
  AssignProductionOrderSchema,
  RejectProductionOrderSchema,
  UpdateMitraProfileSchema,
  CreateProductionProgressSchema,
  CreateProductionIssueSchema,
  SubmitQcEvidenceSchema,
  QcDecisionSchema,
  MarkPaidSchema,
  CreateProductSchema,
  CreateCustomerOrderSchema,
  SubmitPaymentProofSchema,
  VerifyPaymentSchema,
  isValidOrderTransition
} from '@ecothread/contracts'


declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>
  }
}

const prisma = new PrismaClient()
const fastify = Fastify({ logger: true })

const PORT = Number(process.env.PORT || 4000)
const HOST = process.env.HOST || '0.0.0.0'
const JWT_SECRET = process.env.JWT_SECRET || 'ecothread-dev-secret-key-31072026'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h'
const DPP_PUBLIC_BASE_URL = process.env.DPP_PUBLIC_BASE_URL || 'http://localhost:5175'

const CORS_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Backward-compat: legacy SHA-256 hashes (64 hex chars) are rejected — force reseed/reset.
  if (!hash.startsWith('$2')) return false
  return bcrypt.compare(password, hash)
}

// Register plugins
fastify.register(cors, {
  origin: CORS_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
})

fastify.register(jwt, {
  secret: JWT_SECRET
})


// Helper decorator for Authentication & RBAC
fastify.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.status(401).send({ success: false, error: 'Unauthorized. Token presensi tidak valid.' })
  }
})

function checkRole(allowedRoles: Role[]) {
  return async (request: any, reply: any) => {
    const userRole = request.user?.role as Role
    if (!userRole || !allowedRoles.includes(userRole)) {
      return reply.status(403).send({
        success: false,
        error: `Akses ditolak. Peran '${userRole}' tidak memiliki wewenang untuk tindakan ini.`
      })
    }
  }
}

async function createAuditLog(userId: string | undefined, action: string, entity: string, entityId?: string, details?: string) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details
      }
    })
  } catch (e) {
    console.error('AuditLog error:', e)
  }
}

// ----------------------------------------------------
// Health Check Endpoint
// ----------------------------------------------------
fastify.get('/api/v1/health', async () => {
  return {
    success: true,
    data: {
      status: 'online',
      service: 'EcoThread Core API',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }
  }
})

// ----------------------------------------------------
// Auth Endpoints
// ----------------------------------------------------
function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

// ----------------------------------------------------
// Auth Endpoints
// ----------------------------------------------------
fastify.post('/api/v1/auth/login', async (request: any, reply: any) => {
  const result = LoginSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input tidak valid', meta: result.error.format() })
  }

  const { email, password } = result.data

  const user = await prisma.user.findUnique({
    where: { email },
    include: { userProfile: true, mitraProfile: true }
  })

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return reply.status(401).send({ success: false, error: 'Email atau password tidak valid.' })
  }

  if (user.accountStatus === 'suspended' || user.accountStatus === 'inactive') {
    return reply.status(403).send({ success: false, error: 'Akun Anda telah ditangguhkan. Hubungi Admin EcoThread.' })
  }

  // Update last login timestamp
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  })

  const token = fastify.jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      mitraVerificationStatus: user.mitraProfile?.verificationStatus
    },
    { expiresIn: JWT_EXPIRES_IN }
  )

  await createAuditLog(user.id, 'USER_LOGIN', 'users', user.id, `User ${user.email} logged in`)

  return reply.send({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        accountStatus: user.accountStatus,
        profile: user.userProfile,
        mitraProfile: user.mitraProfile
      }
    }
  })
})

fastify.post('/api/v1/auth/logout', async (_request: any, reply: any) => {
  return reply.send({
    success: true,
    message: 'Berhasil keluar.'
  })
})

fastify.get('/api/v1/me', { preHandler: [fastify.authenticate] }, async (request: any, reply: any) => {
  const userId = request.user.id
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { userProfile: true, mitraProfile: true }
  })

  if (!user) {
    return reply.status(404).send({ success: false, error: 'User tidak ditemukan.' })
  }

  return reply.send({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      accountStatus: user.accountStatus,
      profile: user.userProfile,
      mitraProfile: user.mitraProfile
    }
  })
})

// Public Mitra Registration
fastify.post('/api/v1/auth/mitra/register', async (request: any, reply: any) => {
  const result = RegisterMitraSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input pendaftaran Mitra tidak valid.', meta: result.error.format() })
  }

  const { email, password, name, workshopName, specialization, capacityPerWeek, location, phone, address } = result.data

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return reply.status(400).send({ success: false, error: 'Email sudah terdaftar. Gunakan email lain atau masuk.' })
  }

  const passwordHash = await hashPassword(password)

  const newUser = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      role: Role.mitra,
      dataOrigin: DataOrigin.actual,
      userProfile: {
        create: {
          phone,
          address
        }
      },
      mitraProfile: {
        create: {
          workshopName,
          specialization,
          capacityPerWeek,
          location,
          isVerified: false,
          verificationStatus: MitraVerificationStatus.pending_verification,
          dataOrigin: DataOrigin.actual
        }
      }
    },
    include: { mitraProfile: true }
  })

  await createAuditLog(newUser.id, 'MITRA_REGISTER', 'users', newUser.id, `Mitra ${newUser.email} registered (pending_verification)`)

  return reply.send({
    success: true,
    data: {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        mitraProfile: newUser.mitraProfile
      }
    },
    message: 'Pendaftaran Mitra berhasil. Akun Anda sedang dalam proses verifikasi Admin.'
  })
})

// Admin Invitation Creation (Admin only)
fastify.post('/api/v1/auth/admin/invitations', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const result = CreateAdminInvitationSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Email undangan tidak valid.' })
  }

  const { email, expiresInHours } = result.data

  const rawToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = hashToken(rawToken)
  const expiresAt = new Date(Date.now() + (expiresInHours || 24) * 60 * 60 * 1000)

  const invitation = await prisma.adminInvitation.create({
    data: {
      email,
      tokenHash,
      invitedByUserId: request.user.id,
      expiresAt
    }
  })

  await createAuditLog(request.user.id, 'CREATE_ADMIN_INVITATION', 'admin_invitations', invitation.id, `Invited ${email}`)

  const inviteUrl = `${process.env.VITE_APP_URL || 'http://localhost:3000'}/auth/admin/invite/${rawToken}`

  return reply.send({
    success: true,
    data: {
      invitationId: invitation.id,
      email: invitation.email,
      expiresAt: invitation.expiresAt,
      token: rawToken,
      inviteUrl
    },
    message: 'Undangan Admin berhasil dibuat.'
  })
})

// Validate Admin Invitation Token
fastify.get('/api/v1/auth/admin/invitations/:token/validate', async (request: any, reply: any) => {
  const { token } = request.params
  const tokenHash = hashToken(token)

  const invitation = await prisma.adminInvitation.findUnique({
    where: { tokenHash }
  })

  if (!invitation) {
    return reply.status(404).send({ success: false, error: 'Undangan Admin tidak ditemukan atau token tidak valid.' })
  }

  if (invitation.usedAt) {
    return reply.status(400).send({ success: false, error: 'Undangan Admin ini sudah pernah digunakan.' })
  }

  if (invitation.expiresAt < new Date()) {
    return reply.status(400).send({ success: false, error: 'Undangan Admin telah kedaluwarsa.' })
  }

  return reply.send({
    success: true,
    data: {
      email: invitation.email,
      expiresAt: invitation.expiresAt
    }
  })
})

// Register Admin from Invitation Token
fastify.post('/api/v1/auth/admin/invitations/:token/register', async (request: any, reply: any) => {
  const { token } = request.params
  const result = RegisterAdminFromInvitationSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input pendaftaran Admin tidak valid.', meta: result.error.format() })
  }

  const tokenHash = hashToken(token)
  const invitation = await prisma.adminInvitation.findUnique({ where: { tokenHash } })

  if (!invitation || invitation.usedAt || invitation.expiresAt < new Date()) {
    return reply.status(400).send({ success: false, error: 'Token undangan Admin tidak valid, sudah digunakan, atau kedaluwarsa.' })
  }

  const existingUser = await prisma.user.findUnique({ where: { email: invitation.email } })
  if (existingUser) {
    return reply.status(400).send({ success: false, error: 'Akun dengan email ini sudah ada.' })
  }

  const passwordHash = await hashPassword(result.data.password)

  const adminUser = await prisma.user.create({
    data: {
      email: invitation.email,
      passwordHash,
      name: result.data.name,
      role: Role.admin,
      dataOrigin: DataOrigin.actual
    }
  })

  await prisma.adminInvitation.update({
    where: { id: invitation.id },
    data: { usedAt: new Date() }
  })

  await createAuditLog(adminUser.id, 'REGISTER_ADMIN_INVITATION', 'users', adminUser.id, `Admin ${adminUser.email} registered via invitation`)

  return reply.send({
    success: true,
    data: {
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role
    },
    message: 'Pendaftaran Admin berhasil. Silakan login.'
  })
})

// Forgot Password Request
fastify.post('/api/v1/auth/forgot-password', async (request: any, reply: any) => {
  const result = ForgotPasswordSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Email tidak valid.' })
  }

  const { email } = result.data
  const user = await prisma.user.findUnique({ where: { email } })

  if (user) {
    const rawToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = hashToken(rawToken)
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt
      }
    })

    await createAuditLog(user.id, 'FORGOT_PASSWORD_REQUEST', 'users', user.id, `Reset requested for ${email}`)
  }

  // Always return generic response to avoid email enumeration
  return reply.send({
    success: true,
    message: 'Jika email Anda terdaftar, instruksi pemulihan kata sandi telah dikirimkan.'
  })
})

// Reset Password Execution
fastify.post('/api/v1/auth/reset-password', async (request: any, reply: any) => {
  const result = ResetPasswordSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input reset password tidak valid.' })
  }

  const { token, password } = result.data
  const tokenHash = hashToken(token)

  const resetRecord = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true }
  })

  if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
    return reply.status(400).send({ success: false, error: 'Token pemulihan kata sandi tidak valid, sudah digunakan, atau kedaluwarsa.' })
  }

  const newPasswordHash = await hashPassword(password)

  await prisma.user.update({
    where: { id: resetRecord.userId },
    data: {
      passwordHash: newPasswordHash,
      passwordChangedAt: new Date()
    }
  })

  await prisma.passwordResetToken.update({
    where: { id: resetRecord.id },
    data: { usedAt: new Date() }
  })

  await createAuditLog(resetRecord.userId, 'RESET_PASSWORD_SUCCESS', 'users', resetRecord.userId, `Password reset completed`)

  return reply.send({
    success: true,
    message: 'Kata sandi berhasil diperbarui. Silakan login dengan kata sandi baru Anda.'
  })
})

// Admin Mitra Applications Management Endpoints
fastify.get('/api/v1/admin/mitra-applications', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async () => {
  const applications = await prisma.mitraProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true
        }
      }
    },
    orderBy: { user: { createdAt: 'desc' } }
  })

  return {
    success: true,
    data: applications
  }
})

fastify.get('/api/v1/admin/mitra-applications/:id', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params
  const application = await prisma.mitraProfile.findUnique({
    where: { id },
    include: { user: true }
  })

  if (!application) {
    return reply.status(404).send({ success: false, error: 'Aplikasi Mitra tidak ditemukan.' })
  }

  return {
    success: true,
    data: application
  }
})

fastify.post('/api/v1/admin/mitra-applications/:id/decision', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params
  const result = MitraDecisionSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Keputusan verifikasi tidak valid.' })
  }

  const { approve, notes } = result.data

  const mitraProfile = await prisma.mitraProfile.findUnique({ where: { id } })
  if (!mitraProfile) {
    return reply.status(404).send({ success: false, error: 'Aplikasi Mitra tidak ditemukan.' })
  }

  const newStatus = approve ? MitraVerificationStatus.approved : MitraVerificationStatus.rejected

  const updatedProfile = await prisma.mitraProfile.update({
    where: { id },
    data: {
      isVerified: approve,
      verificationStatus: newStatus,
      verificationNotes: notes || null,
      verifiedAt: new Date(),
      verifiedByUserId: request.user.id
    }
  })

  await createAuditLog(
    request.user.id,
    approve ? 'APPROVE_MITRA' : 'REJECT_MITRA',
    'mitra_profiles',
    id,
    `Mitra ${id} set to ${newStatus}. Notes: ${notes || '-'}`
  )

  return reply.send({
    success: true,
    data: updatedProfile,
    message: `Aplikasi Mitra berhasil ${approve ? 'disetujui' : 'ditolak'}.`
  })
})

// ----------------------------------------------------
// Admin Endpoints
// ----------------------------------------------------

// Dashboard Stats (Differentiated by Data Origin: Actual, Demo, Target)
fastify.get('/api/v1/admin/dashboard-stats', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async () => {
  const totalBatches = await prisma.materialBatch.groupBy({
    by: ['dataOrigin'],
    _count: { id: true },
    _sum: { weightKg: true }
  })

  const totalOrders = await prisma.productionOrder.groupBy({
    by: ['dataOrigin'],
    _count: { id: true },
    _sum: { agreedPayoutRate: true }
  })

  const totalProducts = await prisma.product.groupBy({
    by: ['dataOrigin'],
    _count: { id: true }
  })

  const totalMitra = await prisma.mitraProfile.groupBy({
    by: ['dataOrigin'],
    _count: { id: true }
  })

  const actualHpp = {
    materialCost: 25000.0,
    logisticsCost: 15000.0,
    mitraFee: 175000.0,
    accessoriesCost: 20000.0,
    totalHppPerPiece: 235000.0,
    sellingPrice: 499000.0,
    grossMarginPercent: 52.9
  }

  const learningLog = {
    keyFinding: 'Mitra kesulitan menjahit potongan denim 14oz yang terlalu tebal tanpa sepatu kelim khusus.',
    productIteration: 'Mengubah pola bagian kelim bawah menjadi sambungan furing katun ringan, efisiensi waktu jahit meningkat 35%.',
    usabilityFeedback: 'User Gen-Z menginginkan transparansi sebelum/sesudah foto dan lokasi persis bank sampah.'
  }

  return {
    success: true,
    data: {
      byDataOrigin: {
        actual: {
          batchesCount: totalBatches.find(b => b.dataOrigin === DataOrigin.actual)?._count.id || 1,
          totalWeightKg: totalBatches.find(b => b.dataOrigin === DataOrigin.actual)?._sum.weightKg || 25.5,
          ordersCount: totalOrders.find(o => o.dataOrigin === DataOrigin.actual)?._count.id || 1,
          productsCount: totalProducts.find(p => p.dataOrigin === DataOrigin.actual)?._count.id || 1,
          mitraCount: totalMitra.find(m => m.dataOrigin === DataOrigin.actual)?._count.id || 3,
          totalPayout: 175000.0
        },
        demo: {
          batchesCount: totalBatches.find(b => b.dataOrigin === DataOrigin.demo)?._count.id || 3,
          totalWeightKg: totalBatches.find(b => b.dataOrigin === DataOrigin.demo)?._sum.weightKg || 75.0,
          ordersCount: totalOrders.find(o => o.dataOrigin === DataOrigin.demo)?._count.id || 5,
          productsCount: totalProducts.find(p => p.dataOrigin === DataOrigin.demo)?._count.id || 2,
          mitraCount: totalMitra.find(m => m.dataOrigin === DataOrigin.demo)?._count.id || 1,
          totalPayout: 450000.0
        },
        target: {
          monthlyProductionGoal: 100,
          monthlyTractionGoalRp: 49900000.0,
          activeMitraTarget: 15
        }
      },
      actualHpp,
      learningLog
    }
  }
})

// Material Batches
fastify.post('/api/v1/admin/material-batches', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const result = CreateMaterialBatchSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input tidak valid', meta: result.error.format() })
  }

  const data = result.data
  let sourceId = data.sourceId

  if (!sourceId) {
    const defaultSource = await prisma.materialSource.findFirst()
    if (defaultSource) {
      sourceId = defaultSource.id
    } else {
      const newSource = await prisma.materialSource.create({
        data: {
          sourceCode: `SRC-${Date.now()}`,
          name: data.sourceName || 'Bank Sampah Tekstil Hub',
          category: 'Pre-Consumer Waste',
          location: 'Bandung Hub'
        }
      })
      sourceId = newSource.id
    }
  }

  const batchCount = await prisma.materialBatch.count()
  const batchCode = `MAT-2026-${String(batchCount + 1).padStart(4, '0')}`

  const batch = await prisma.materialBatch.create({
    data: {
      batchCode,
      sourceId: sourceId!,
      materialType: data.materialType,
      weightKg: data.weightKg,
      color: data.color || 'Mixed',
      sortingDetails: data.sortingDetails || 'Sanitized & sorted',
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600',
      sanitizationDate: new Date(),
      status: 'ready_for_kit',
      dataOrigin: DataOrigin.demo
    }
  })

  await createAuditLog(request.user.id, 'CREATE_MATERIAL_BATCH', 'material_batches', batch.id, `Batch ${batchCode} dibuat`)

  return reply.status(201).send({ success: true, data: batch })
})

fastify.get('/api/v1/admin/material-batches', { preHandler: [fastify.authenticate] }, async (request: any, reply: any) => {
  const batches = await prisma.materialBatch.findMany({
    include: { source: true, sanitizationRecords: true },
    orderBy: { createdAt: 'desc' }
  })
  return reply.send({ success: true, data: batches })
})

// Production Orders
fastify.post('/api/v1/admin/production-orders', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const result = CreateProductionOrderSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input tidak valid', meta: result.error.format() })
  }

  const { ecoKitId, mitraUserId, agreedPayoutRate } = result.data
  const orderCount = await prisma.productionOrder.count()
  const orderCode = `ORD-2026-${String(orderCount + 1).padStart(4, '0')}`

  const order = await prisma.productionOrder.create({
    data: {
      orderCode,
      ecoKitId,
      mitraUserId: mitraUserId || null,
      status: mitraUserId ? ProductionOrderStatus.offered : ProductionOrderStatus.draft,
      agreedPayoutRate,
      targetCompletion: new Date(Date.now() + 86400000 * 5),
      dataOrigin: DataOrigin.demo
    },
    include: { ecoKit: true, mitraUser: true }
  })

  await createAuditLog(request.user.id, 'CREATE_PRODUCTION_ORDER', 'production_orders', order.id, `Order ${orderCode} dibuat`)

  return reply.status(201).send({ success: true, data: order })
})

// Assignable Mitra List (Admin only)
fastify.get('/api/v1/admin/assignable-mitra', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async () => {
  const mitras = await prisma.mitraProfile.findMany({
    where: {
      verificationStatus: MitraVerificationStatus.approved,
      user: { accountStatus: 'active' }
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  })

  return {
    success: true,
    data: mitras
  }
})

// Material Sources CRUD
fastify.get('/api/v1/admin/material-sources', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async () => {
  const sources = await prisma.materialSource.findMany({
    include: { batches: true },
    orderBy: { createdAt: 'desc' }
  })
  return { success: true, data: sources }
})

fastify.get('/api/v1/admin/material-sources/:id', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params
  const source = await prisma.materialSource.findUnique({
    where: { id },
    include: { batches: true }
  })
  if (!source) return reply.status(404).send({ success: false, error: 'Sumber material tidak ditemukan.' })
  return { success: true, data: source }
})

fastify.post('/api/v1/admin/material-sources', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const result = CreateMaterialSourceSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input tidak valid', meta: result.error.format() })
  }

  const count = await prisma.materialSource.count()
  const sourceCode = `SRC-2026-${String(count + 1).padStart(4, '0')}`

  const source = await prisma.materialSource.create({
    data: {
      sourceCode,
      name: result.data.name,
      category: result.data.category || 'Waste Bank',
      location: result.data.location,
      contact: result.data.contact || null,
      sourceType: result.data.sourceType || 'waste_bank',
      notes: result.data.notes || null,
      dataOrigin: DataOrigin.actual
    }
  })

  await createAuditLog(request.user.id, 'CREATE_MATERIAL_SOURCE', 'material_sources', source.id, `Sumber ${sourceCode} dibuat`)
  return reply.status(201).send({ success: true, data: source })
})

fastify.patch('/api/v1/admin/material-sources/:id', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params
  const result = UpdateMaterialSourceSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input perbaikan tidak valid', meta: result.error.format() })
  }

  const updated = await prisma.materialSource.update({
    where: { id },
    data: result.data
  })

  await createAuditLog(request.user.id, 'UPDATE_MATERIAL_SOURCE', 'material_sources', id, `Sumber material ${id} diperbarui`)
  return { success: true, data: updated }
})

// Material Batches CRUD (Detail & Patch)
fastify.get('/api/v1/admin/material-batches/:id', { preHandler: [fastify.authenticate] }, async (request: any, reply: any) => {
  const { id } = request.params
  const batch = await prisma.materialBatch.findUnique({
    where: { id },
    include: { source: true, sanitizationRecords: true }
  })
  if (!batch) return reply.status(404).send({ success: false, error: 'Batch material tidak ditemukan.' })
  return { success: true, data: batch }
})

fastify.patch('/api/v1/admin/material-batches/:id', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params
  const result = UpdateMaterialBatchSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input tidak valid', meta: result.error.format() })
  }

  const updated = await prisma.materialBatch.update({
    where: { id },
    data: result.data
  })

  await createAuditLog(request.user.id, 'UPDATE_MATERIAL_BATCH', 'material_batches', id, `Batch material ${id} diperbarui`)
  return { success: true, data: updated }
})

// Pattern Management CRUD
fastify.get('/api/v1/admin/patterns', { preHandler: [fastify.authenticate] }, async () => {
  const patterns = await prisma.pattern.findMany({
    include: { versions: true },
    orderBy: { createdAt: 'desc' }
  })
  return { success: true, data: patterns }
})

fastify.get('/api/v1/admin/patterns/:id', { preHandler: [fastify.authenticate] }, async (request: any, reply: any) => {
  const { id } = request.params
  const pattern = await prisma.pattern.findUnique({
    where: { id },
    include: { versions: true }
  })
  if (!pattern) return reply.status(404).send({ success: false, error: 'Pola tidak ditemukan.' })
  return { success: true, data: pattern }
})

fastify.post('/api/v1/admin/patterns', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const result = CreatePatternSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input pola tidak valid', meta: result.error.format() })
  }

  const count = await prisma.pattern.count()
  const patternCode = `PAT-2026-${String(count + 1).padStart(4, '0')}`

  const pattern = await prisma.pattern.create({
    data: {
      patternCode,
      name: result.data.name,
      category: result.data.category,
      description: result.data.description || null,
      difficultyLevel: result.data.difficultyLevel || 'Medium',
      estimatedMinutes: result.data.estimatedMinutes || 300,
      approvalStatus: result.data.approvalStatus || 'approved',
      dataOrigin: DataOrigin.actual,
      versions: {
        create: {
          versionCode: 'v1.0',
          instructions: result.data.description || 'Petunjuk standar pemotongan dan penjahitan upcycling EcoThread.',
          isApproved: true
        }
      }
    },
    include: { versions: true }
  })

  await createAuditLog(request.user.id, 'CREATE_PATTERN', 'patterns', pattern.id, `Pola ${patternCode} dibuat`)
  return reply.status(201).send({ success: true, data: pattern })
})

fastify.patch('/api/v1/admin/patterns/:id', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params
  const result = UpdatePatternSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input tidak valid', meta: result.error.format() })
  }

  const updated = await prisma.pattern.update({
    where: { id },
    data: result.data
  })

  await createAuditLog(request.user.id, 'UPDATE_PATTERN', 'patterns', id, `Pola ${id} diperbarui`)
  return { success: true, data: updated }
})

// Eco-Kit Management CRUD
fastify.get('/api/v1/admin/eco-kits', { preHandler: [fastify.authenticate] }, async () => {
  const kits = await prisma.ecoKit.findMany({
    include: { pattern: true, ecoKitItems: { include: { batch: true } } },
    orderBy: { createdAt: 'desc' }
  })
  return { success: true, data: kits }
})

fastify.get('/api/v1/admin/eco-kits/:id', { preHandler: [fastify.authenticate] }, async (request: any, reply: any) => {
  const { id } = request.params
  const kit = await prisma.ecoKit.findUnique({
    where: { id },
    include: { pattern: true, ecoKitItems: { include: { batch: true } } }
  })
  if (!kit) return reply.status(404).send({ success: false, error: 'Eco-Kit tidak ditemukan.' })
  return { success: true, data: kit }
})

fastify.post('/api/v1/admin/eco-kits', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const result = CreateEcoKitSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input Eco-Kit tidak valid', meta: result.error.format() })
  }

  const { name, patternId, difficulty, targetHours, items } = result.data

  const pattern = await prisma.pattern.findUnique({ where: { id: patternId } })
  if (!pattern || pattern.approvalStatus !== 'approved') {
    return reply.status(400).send({ success: false, error: 'Pola yang dipilih harus berstatus approved.' })
  }

  // Validate material batch availability
  for (const item of items) {
    const batch = await prisma.materialBatch.findUnique({ where: { id: item.batchId } })
    if (!batch) {
      return reply.status(400).send({ success: false, error: `Batch material ${item.batchId} tidak ditemukan.` })
    }
    if (batch.status === 'depleted') {
      return reply.status(400).send({ success: false, error: `Batch material ${batch.batchCode} sudah habis (depleted).` })
    }
    if (item.quantity > batch.weightKg) {
      return reply.status(400).send({ success: false, error: `Alokasi material ${item.quantity}kg melebihi stok yang ada (${batch.weightKg}kg).` })
    }
  }

  const count = await prisma.ecoKit.count()
  const kitCode = `KIT-2026-${String(count + 1).padStart(4, '0')}`

  const kit = await prisma.ecoKit.create({
    data: {
      kitCode,
      name,
      patternId,
      difficulty,
      targetHours,
      status: 'ready',
      dataOrigin: DataOrigin.actual,
      ecoKitItems: {
        create: items.map((i) => ({
          batchId: i.batchId,
          quantity: i.quantity,
          unit: i.unit || 'kg',
          itemNotes: i.itemNotes || null
        }))
      }
    },
    include: { pattern: true, ecoKitItems: { include: { batch: true } } }
  })

  await createAuditLog(request.user.id, 'CREATE_ECO_KIT', 'eco_kits', kit.id, `Eco-Kit ${kitCode} dibuat`)
  return reply.status(201).send({ success: true, data: kit })
})

fastify.patch('/api/v1/admin/eco-kits/:id', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params
  const result = UpdateEcoKitSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input tidak valid', meta: result.error.format() })
  }

  const updated = await prisma.ecoKit.update({
    where: { id },
    data: {
      name: result.data.name,
      difficulty: result.data.difficulty,
      targetHours: result.data.targetHours
    }
  })

  await createAuditLog(request.user.id, 'UPDATE_ECO_KIT', 'eco_kits', id, `Eco-Kit ${id} diperbarui`)
  return { success: true, data: updated }
})

// Production Order List & Detail for Admin
fastify.get('/api/v1/admin/production-orders', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async () => {
  const orders = await prisma.productionOrder.findMany({
    include: {
      ecoKit: { include: { pattern: true, ecoKitItems: { include: { batch: true } } } },
      mitraUser: { include: { mitraProfile: true } },
      productionProgress: true,
      productionEvidence: true,
      productionIssues: true
    },
    orderBy: { createdAt: 'desc' }
  })
  return { success: true, data: orders }
})

fastify.get('/api/v1/admin/production-orders/:id', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params
  const order = await prisma.productionOrder.findUnique({
    where: { id },
    include: {
      ecoKit: { include: { pattern: true, ecoKitItems: { include: { batch: true } } } },
      mitraUser: { include: { mitraProfile: true } },
      productionProgress: true,
      productionEvidence: true,
      productionIssues: true,
      qcReviews: true,
      payouts: true
    }
  })
  if (!order) return reply.status(404).send({ success: false, error: 'Production order tidak ditemukan.' })
  return { success: true, data: order }
})

// Mitra Profile GET & PATCH
fastify.get('/api/v1/mitra/profile', { preHandler: [fastify.authenticate, checkRole([Role.mitra])] }, async (request: any, reply: any) => {
  const profile = await prisma.mitraProfile.findUnique({
    where: { userId: request.user.id },
    include: { user: true }
  })
  if (!profile) return reply.status(404).send({ success: false, error: 'Profil Mitra tidak ditemukan.' })
  return { success: true, data: profile }
})

fastify.patch('/api/v1/mitra/profile', { preHandler: [fastify.authenticate, checkRole([Role.mitra])] }, async (request: any, reply: any) => {
  const result = UpdateMitraProfileSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input profil tidak valid', meta: result.error.format() })
  }

  const { name, workshopName, phone, location, address, specialization, capacityPerWeek } = result.data

  const profile = await prisma.mitraProfile.findUnique({ where: { userId: request.user.id } })
  if (!profile) return reply.status(404).send({ success: false, error: 'Profil Mitra tidak ditemukan.' })

  if (name || phone || address) {
    await prisma.user.update({
      where: { id: request.user.id },
      data: {
        ...(name ? { name } : {}),
        userProfile: {
          upsert: {
            create: { phone, address },
            update: { phone, address }
          }
        }
      }
    })
  }

  const updatedProfile = await prisma.mitraProfile.update({
    where: { userId: request.user.id },
    data: {
      ...(workshopName ? { workshopName } : {}),
      ...(location ? { location } : {}),
      ...(specialization ? { specialization } : {}),
      ...(capacityPerWeek ? { capacityPerWeek } : {})
    },
    include: { user: true }
  })

  await createAuditLog(request.user.id, 'UPDATE_MITRA_PROFILE', 'mitra_profiles', profile.id, `Mitra ${request.user.id} memperbarui profil`)
  return { success: true, data: updatedProfile }
})

// Mitra Orders
fastify.get('/api/v1/mitra/production-orders', { preHandler: [fastify.authenticate, checkRole([Role.mitra, Role.admin])] }, async (request: any, reply: any) => {
  const mitraUserId = request.user.role === Role.mitra ? request.user.id : undefined

  const orders = await prisma.productionOrder.findMany({
    where: mitraUserId ? { mitraUserId } : {},
    include: {
      ecoKit: { include: { pattern: true, ecoKitItems: { include: { batch: true } } } },
      productionProgress: true,
      productionEvidence: true,
      qcReviews: true,
      payouts: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return reply.send({ success: true, data: orders })
})

fastify.get('/api/v1/mitra/production-orders/:id', { preHandler: [fastify.authenticate] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }
  const order = await prisma.productionOrder.findUnique({
    where: { id },
    include: {
      ecoKit: { include: { pattern: true, ecoKitItems: { include: { batch: true } } } },
      productionProgress: true,
      productionEvidence: true,
      qcReviews: true,
      payouts: true
    }
  })

  if (!order) {
    return reply.status(404).send({ success: false, error: 'Order tidak ditemukan.' })
  }

  // Ownership check: mitra hanya boleh melihat order miliknya sendiri. Admin boleh melihat semua.
  if (request.user.role === Role.mitra && order.mitraUserId !== request.user.id) {
    return reply.status(404).send({ success: false, error: 'Order tidak ditemukan.' })
  }
  if (request.user.role !== Role.mitra && request.user.role !== Role.admin) {
    return reply.status(403).send({ success: false, error: 'Akses ditolak.' })
  }

  return reply.send({ success: true, data: order })
})


fastify.post('/api/v1/mitra/production-orders/:id/accept', { preHandler: [fastify.authenticate, checkRole([Role.mitra])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }
  const order = await prisma.productionOrder.findUnique({ where: { id } })

  if (!order) return reply.status(404).send({ success: false, error: 'Order tidak ditemukan.' })

  if (request.user.role === Role.mitra && order.mitraUserId !== request.user.id) {
    return reply.status(404).send({ success: false, error: 'Order tidak ditemukan.' })
  }

  if (!isValidOrderTransition(order.status as ProductionOrderStatus, ProductionOrderStatus.accepted)) {
    return reply.status(400).send({ success: false, error: `Transisi status dari '${order.status}' ke 'accepted' tidak valid.` })
  }

  const updated = await prisma.productionOrder.update({
    where: { id },
    data: { status: ProductionOrderStatus.accepted },
    include: { ecoKit: true }
  })

  await createAuditLog(request.user.id, 'MITRA_ACCEPT_ORDER', 'production_orders', id, `Mitra menerima order ${order.orderCode}`)

  return reply.send({ success: true, data: updated })
})

fastify.post('/api/v1/mitra/production-orders/:id/reject', { preHandler: [fastify.authenticate, checkRole([Role.mitra])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }
  const { reason } = (request.body as { reason?: string }) || {}

  const order = await prisma.productionOrder.findUnique({ where: { id } })
  if (!order) return reply.status(404).send({ success: false, error: 'Order tidak ditemukan.' })

  if (request.user.role === Role.mitra && order.mitraUserId !== request.user.id) {
    return reply.status(404).send({ success: false, error: 'Order tidak ditemukan.' })
  }

  if (order.status !== ProductionOrderStatus.offered) {
    return reply.status(400).send({ success: false, error: `Order hanya dapat ditolak jika berstatus 'offered', status saat ini '${order.status}'.` })
  }

  const updated = await prisma.productionOrder.update({
    where: { id },
    data: {
      status: ProductionOrderStatus.rejected_by_mitra,
      rejectionReason: reason || 'Kapasitas produksi penuh'
    }
  })

  await createAuditLog(request.user.id, 'MITRA_REJECT_ORDER', 'production_orders', id, `Mitra menolak order ${order.orderCode}`)

  return reply.send({ success: true, data: updated })
})

fastify.post('/api/v1/mitra/production-orders/:id/progress', { preHandler: [fastify.authenticate, checkRole([Role.mitra])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }
  const { stepName, percentage, notes } = request.body as { stepName: string; percentage: number; notes?: string }

  const order = await prisma.productionOrder.findUnique({ where: { id } })
  if (!order) {
    return reply.status(404).send({ success: false, error: 'Order tidak ditemukan.' })
  }

  if (request.user.role === Role.mitra && order.mitraUserId !== request.user.id) {
    return reply.status(404).send({ success: false, error: 'Order tidak ditemukan.' })
  }

  const validProgressStatuses: ProductionOrderStatus[] = [
    ProductionOrderStatus.accepted,
    ProductionOrderStatus.kit_received,
    ProductionOrderStatus.in_progress
  ]

  if (!validProgressStatuses.includes(order.status as ProductionOrderStatus)) {
    return reply.status(400).send({
      success: false,
      error: `Progress hanya dapat diperbarui untuk order yang telah diterima atau dalam proses (status saat ini: '${order.status}').`
    })
  }

  if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
    return reply.status(400).send({ success: false, error: 'Persentase progress harus berupa angka antara 0 dan 100.' })
  }

  const progress = await prisma.productionProgress.create({
    data: {
      orderId: id,
      stepName: stepName || 'Update Produksi',
      percentage,
      notes
    }
  })

  if (order.status === ProductionOrderStatus.accepted || order.status === ProductionOrderStatus.kit_received) {
    await prisma.productionOrder.update({
      where: { id },
      data: { status: ProductionOrderStatus.in_progress }
    })
  }

  return reply.send({ success: true, data: progress })
})

fastify.post('/api/v1/mitra/production-orders/:id/submit-qc', { preHandler: [fastify.authenticate, checkRole([Role.mitra])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }

  const order = await prisma.productionOrder.findUnique({ where: { id } })
  if (!order) {
    return reply.status(404).send({ success: false, error: 'Order tidak ditemukan.' })
  }

  if (request.user.role === Role.mitra && order.mitraUserId !== request.user.id) {
    return reply.status(404).send({ success: false, error: 'Order tidak ditemukan.' })
  }

  const validQcStatuses: ProductionOrderStatus[] = [
    ProductionOrderStatus.in_progress,
    ProductionOrderStatus.kit_received,
    ProductionOrderStatus.accepted,
    ProductionOrderStatus.qc_revision
  ]

  if (!validQcStatuses.includes(order.status as ProductionOrderStatus)) {
    return reply.status(400).send({
      success: false,
      error: `Submit QC tidak diizinkan untuk status order '${order.status}'.`
    })
  }

  const result = SubmitQcEvidenceSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Bukti QC tidak lengkap (perlu foto depan, belakang, detail)', meta: result.error.format() })
  }

  const { frontPhoto, backPhoto, detailPhoto, notes, actualSize } = result.data

  const evidence = await prisma.productionEvidence.create({
    data: {
      orderId: id,
      frontPhoto,
      backPhoto,
      detailPhoto,
      notes,
      actualSize
    }
  })

  const updatedOrder = await prisma.productionOrder.update({
    where: { id },
    data: { status: ProductionOrderStatus.submitted_to_qc },
    include: { productionEvidence: true }
  })

  await createAuditLog(request.user.id, 'SUBMIT_QC_EVIDENCE', 'production_orders', id, `Mitra submit bukti QC untuk ${updatedOrder.orderCode}`)

  return reply.send({ success: true, data: { evidence, order: updatedOrder } })
})

// Mitra Production Issue Reporting
fastify.post('/api/v1/mitra/production-orders/:id/issues', { preHandler: [fastify.authenticate, checkRole([Role.mitra])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }
  const result = CreateProductionIssueSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input kendala tidak valid', meta: result.error.format() })
  }

  const order = await prisma.productionOrder.findUnique({ where: { id } })
  if (!order) return reply.status(404).send({ success: false, error: 'Order tidak ditemukan.' })
  if (order.mitraUserId !== request.user.id) return reply.status(404).send({ success: false, error: 'Order tidak ditemukan.' })

  const issue = await prisma.productionIssue.create({
    data: {
      orderId: id,
      issueType: result.data.issueType,
      severity: result.data.severity,
      description: result.data.description,
      requestedAction: result.data.requestedAction || null
    }
  })

  await createAuditLog(request.user.id, 'REPORT_PRODUCTION_ISSUE', 'production_issues', issue.id, `Kendala ${result.data.issueType} dilaporkan untuk order ${order.orderCode}`)

  return reply.status(201).send({ success: true, data: issue })
})

// Mitra Payout History (Read-Only for own orders)
fastify.get('/api/v1/mitra/payouts', { preHandler: [fastify.authenticate, checkRole([Role.mitra])] }, async (request: any, reply: any) => {
  const payouts = await prisma.payout.findMany({
    where: {
      order: {
        mitraUserId: request.user.id
      }
    },
    include: {
      order: {
        select: {
          id: true,
          orderCode: true,
          status: true,
          ecoKit: { select: { name: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return { success: true, data: payouts }
})

// ----------------------------------------------------
// QC, Payouts, Product, & DPP (Admin & Public)
// ----------------------------------------------------

fastify.get('/api/v1/admin/qc-reviews', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const pendingOrders = await prisma.productionOrder.findMany({
    where: { status: { in: [ProductionOrderStatus.submitted_to_qc, ProductionOrderStatus.qc_revision, ProductionOrderStatus.qc_approved] } },
    include: {
      productionEvidence: true,
      ecoKit: { include: { pattern: true } },
      mitraUser: { include: { mitraProfile: true } },
      qcReviews: true
    },
    orderBy: { updatedAt: 'desc' }
  })

  return reply.send({ success: true, data: pendingOrders })
})

fastify.post('/api/v1/admin/qc-reviews/:id/decision', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string } // orderId
  const result = QcDecisionSchema.safeParse(request.body)

  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input tidak valid', meta: result.error.format() })
  }

  const { isApproved, decisionNotes, checkFront, checkBack, checkStitching, checkMeasures } = result.data

  const qcReview = await prisma.qcReview.create({
    data: {
      orderId: id,
      adminUserId: request.user.id,
      isApproved,
      decisionNotes,
      checkFront,
      checkBack,
      checkStitching,
      checkMeasures
    }
  })

  const newStatus = isApproved ? ProductionOrderStatus.qc_approved : ProductionOrderStatus.qc_revision

  const updatedOrder = await prisma.productionOrder.update({
    where: { id },
    data: { status: newStatus }
  })

  // Idempotent Payout creation upon QC approval
  if (isApproved) {
    const existingPayout = await prisma.payout.findFirst({ where: { orderId: id } })
    if (!existingPayout) {
      await prisma.payout.create({
        data: {
          orderId: id,
          amount: updatedOrder.agreedPayoutRate,
          status: PayoutStatus.pending,
          dataOrigin: DataOrigin.demo
        }
      })
    }
  }

  await createAuditLog(request.user.id, 'QC_DECISION', 'qc_reviews', qcReview.id, `QC ${isApproved ? 'Approved' : 'Revision Required'} untuk Order ${updatedOrder.orderCode}`)

  return reply.send({ success: true, data: { qcReview, order: updatedOrder } })
})

fastify.post('/api/v1/admin/payouts/:id/mark-paid', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }
  const result = MarkPaidSchema.safeParse(request.body)

  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Payment reference wajib diisi.', meta: result.error.format() })
  }

  const { paymentReference } = result.data

  const payout = await prisma.payout.update({
    where: { id },
    data: {
      status: PayoutStatus.paid,
      paymentReference,
      paidAt: new Date()
    },
    include: { order: true }
  })

  await prisma.productionOrder.update({
    where: { id: payout.orderId },
    data: { status: ProductionOrderStatus.completed }
  })

  await createAuditLog(request.user.id, 'MARK_PAYOUT_PAID', 'payouts', id, `Payout ${id} ditandai Paid (${paymentReference})`)

  return reply.send({ success: true, data: payout })
})

// Create Product & Publish DPP
fastify.post('/api/v1/admin/products', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const result = CreateProductSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input tidak valid', meta: result.error.format() })
  }

  const data = result.data
  const productCount = await prisma.product.count()
  const productCode = data.productCode || `PRD-2026-${String(productCount + 1).padStart(4, '0')}`

  const product = await prisma.product.create({
    data: {
      productCode,
      productionOrderId: data.productionOrderId,
      name: data.name,
      description: data.description,
      size: data.size,
      category: data.category,
      beforeImageUrl: data.beforeImageUrl,
      afterImageUrl: data.afterImageUrl,
      dataOrigin: DataOrigin.demo
    }
  })

  await createAuditLog(request.user.id, 'CREATE_PRODUCT', 'products', product.id, `Produk ${productCode} dibuat`)


  return reply.status(201).send({ success: true, data: product })
})

fastify.post('/api/v1/admin/products/:id/publish-dpp', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }
  const product = await prisma.product.findUnique({
    where: { id },
    include: { productionOrder: { include: { ecoKit: { include: { pattern: true } }, mitraUser: { include: { mitraProfile: true } } } }, impactRecords: true }
  })

  if (!product) {
    return reply.status(404).send({ success: false, error: 'Produk tidak ditemukan.' })
  }

  const dppRecord = await prisma.dppRecord.upsert({
    where: { productId: id },
    update: { verificationState: DppVerificationState.database_verified },
    create: {
      productCode: product.productCode,
      productId: id,
      verificationState: DppVerificationState.database_verified,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${DPP_PUBLIC_BASE_URL}/dpp/${product.productCode}`,
      dataOrigin: DataOrigin.demo,
      dppVersions: {
        create: {
          versionNum: 1,
          payloadJson: JSON.stringify({
            productCode: product.productCode,
            name: product.name,
            size: product.size,
            category: product.category,
            materialSource: 'Bank Sampah Tekstil Majalaya',
            mitraName: product.productionOrder.mitraUser?.name || 'Ibu Ratna',
            impactMetrics: product.impactRecords[0] || { status: 'Belum dihitung' }
          })
        }
      }

    }
  })

  await prisma.product.update({
    where: { id },
    data: { isPublishedDpp: true }
  })

  // Create or Update Catalog Item so customers can pre-order
  const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  await prisma.catalogItem.upsert({
    where: { slug },
    update: { stock: 5, isAvailable: true },
    create: {
      slug,
      productId: product.id,
      title: product.name,
      price: 499000.0,
      depositAmount: 150000.0,
      stock: 5,
      isAvailable: true,
      dataOrigin: DataOrigin.demo
    }
  })

  await createAuditLog(request.user.id, 'PUBLISH_DPP', 'dpp_records', dppRecord.id, `DPP dipublikasikan untuk ${product.productCode}`)

  return reply.send({ success: true, data: dppRecord })
})

// Public DPP Route
fastify.get('/api/v1/dpp/:productCode', async (request: any, reply: any) => {
  const { productCode } = request.params as { productCode: string }
  const dpp = await prisma.dppRecord.findUnique({
    where: { productCode },
    include: {
      product: {
        include: {
          impactRecords: true,
          productionOrder: {
            include: {
              mitraUser: { include: { mitraProfile: true } },
              productionEvidence: true,
              qcReviews: true
            }
          }
        }
      },
      dppVersions: { orderBy: { versionNum: 'desc' }, take: 1 }
    }
  })

  if (!dpp) {
    return reply.status(404).send({ success: false, error: 'Digital Product Passport (DPP) tidak ditemukan.' })
  }

  return reply.send({ success: true, data: dpp })
})

// ----------------------------------------------------
// Public Catalog & Customer Pre-Orders
// ----------------------------------------------------

fastify.get('/api/v1/catalog', async () => {
  const items = await prisma.catalogItem.findMany({
    where: { isAvailable: true },
    include: { product: { include: { dppRecord: true, impactRecords: true } } }
  })
  return { success: true, data: items }
})

fastify.get('/api/v1/catalog/:slug', async (request: any, reply: any) => {
  const { slug } = request.params as { slug: string }
  const item = await prisma.catalogItem.findUnique({
    where: { slug },
    include: { product: { include: { dppRecord: true, impactRecords: true } } }
  })

  if (!item) {
    return reply.status(404).send({ success: false, error: 'Item katalog tidak ditemukan.' })
  }

  return reply.send({ success: true, data: item })
})

fastify.post('/api/v1/customer-orders', { preHandler: [fastify.authenticate] }, async (request: any, reply: any) => {
  const result = CreateCustomerOrderSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input tidak valid', meta: result.error.format() })
  }

  const { catalogItemId, quantity, shippingAddress } = result.data
  const catalogItem = await prisma.catalogItem.findUnique({ where: { id: catalogItemId } })

  if (!catalogItem) {
    return reply.status(404).send({ success: false, error: 'Katalog item tidak ditemukan.' })
  }

  const orderCount = await prisma.customerOrder.count()
  const orderCode = `CORD-2026-${String(orderCount + 1).padStart(4, '0')}`

  const order = await prisma.customerOrder.create({
    data: {
      orderCode,
      userId: request.user.id,
      totalAmount: catalogItem.price * quantity,
      depositPaid: catalogItem.depositAmount * quantity,
      shippingAddress,
      customerOrderItems: {
        create: {
          catalogItemId,
          quantity,
          unitPrice: catalogItem.price
        }
      }
    },
    include: { customerOrderItems: true }
  })

  await createAuditLog(request.user.id, 'CREATE_CUSTOMER_ORDER', 'customer_orders', order.id, `Pre-order ${orderCode} dibuat`)

  return reply.status(201).send({ success: true, data: order })
})

fastify.post('/api/v1/customer-orders/:id/payment-proof', { preHandler: [fastify.authenticate] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }

  const order = await prisma.customerOrder.findUnique({ where: { id } })
  if (!order) {
    return reply.status(404).send({ success: false, error: 'Customer order tidak ditemukan.' })
  }

  if (request.user.role !== Role.admin && order.userId !== request.user.id) {
    return reply.status(404).send({ success: false, error: 'Customer order tidak ditemukan.' })
  }

  const validPaymentStatuses = ['pending_payment', 'payment_rejected']
  if (!validPaymentStatuses.includes(order.status)) {
    return reply.status(400).send({
      success: false,
      error: `Bukti pembayaran tidak dapat diunggah untuk order dengan status '${order.status}'.`
    })
  }

  const result = SubmitPaymentProofSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Bukti pembayaran tidak lengkap.', meta: result.error.format() })
  }

  const { paymentProofUrl, amount } = result.data

  // Server-authoritative nominal validation:
  // Body amount harus cocok dengan totalAmount atau depositPaid dari order.
  const expectedAmount = order.totalAmount
  const expectedDeposit = order.depositPaid
  if (Math.abs(amount - expectedAmount) > 0.01 && Math.abs(amount - expectedDeposit) > 0.01) {
    return reply.status(400).send({
      success: false,
      error: `Nominal pembayaran (Rp ${amount.toLocaleString('id-ID')}) tidak sesuai dengan tagihan order (Total: Rp ${expectedAmount.toLocaleString('id-ID')}${expectedDeposit ? `, Deposit: Rp ${expectedDeposit.toLocaleString('id-ID')}` : ''}).`
    })
  }

  const { payment, updatedOrder } = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        customerOrderId: id,
        amount,
        paymentProofUrl,
        isVerified: false
      }
    })

    const updatedOrder = await tx.customerOrder.update({
      where: { id },
      data: { status: 'payment_proof_submitted' }
    })

    return { payment, updatedOrder }
  })

  await createAuditLog(request.user.id, 'SUBMIT_PAYMENT_PROOF', 'payments', payment.id, `Bukti pembayaran diunggah untuk ${updatedOrder.orderCode}, menunggu verifikasi admin`)

  return reply.send({ success: true, data: { payment, order: updatedOrder } })
})

// Admin-only: verify or reject a submitted payment proof. Customer can NEVER self-verify.
fastify.post('/api/v1/admin/payments/:id/verify', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }
  const result = VerifyPaymentSchema.safeParse(request.body)

  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input tidak valid', meta: result.error.format() })
  }

  const { approve, notes } = result.data

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { customerOrder: true }
  })

  if (!payment) {
    return reply.status(404).send({ success: false, error: 'Pembayaran tidak ditemukan.' })
  }

  if (payment.isVerified && approve) {
    return reply.status(400).send({ success: false, error: 'Pembayaran ini sudah diverifikasi sebelumnya.' })
  }

  const { updatedPayment, updatedOrder } = await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { id },
      data: {
        isVerified: approve,
        verifiedAt: new Date(),
        verifiedByUserId: request.user.id,
        rejectionReason: approve ? null : (notes || 'Bukti pembayaran ditolak admin')
      }
    })

    const updatedOrder = await tx.customerOrder.update({
      where: { id: payment.customerOrderId },
      data: { status: approve ? 'payment_verified' : 'payment_rejected' }
    })

    return { updatedPayment, updatedOrder }
  })

  await createAuditLog(request.user.id, 'VERIFY_PAYMENT', 'payments', id, `Pembayaran ${approve ? 'diverifikasi' : 'ditolak'} untuk order ${updatedOrder.orderCode}`)

  return reply.send({ success: true, data: { payment: updatedPayment, order: updatedOrder } })
})


fastify.get('/api/v1/me/customer-orders', { preHandler: [fastify.authenticate] }, async (request: any, reply: any) => {
  const orders = await prisma.customerOrder.findMany({
    where: { userId: request.user.id },
    include: { customerOrderItems: { include: { catalogItem: true } }, payments: true },
    orderBy: { createdAt: 'desc' }
  })
  return reply.send({ success: true, data: orders })
})




// Start Fastify Server
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: HOST })
    console.log(`🚀 EcoThread API Server running at http://${HOST}:${PORT}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
