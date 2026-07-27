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
  MarkPayoutPaidSchema,
  CreateProductSchema,
  PublishDppSchema,
  RegisterCustomerSchema,
  UpdateCustomerProfileSchema,
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

import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'
import fastifyMultipart from '@fastify/multipart'

// Register plugins
fastify.register(cors, {
  origin: CORS_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
})

fastify.register(jwt, {
  secret: JWT_SECRET
})

fastify.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB per file limit
  }
})

// Ensure uploads directory exists (support running from root or apps/api)
const UPLOADS_DIR = fs.existsSync(path.join(process.cwd(), 'apps', 'api'))
  ? path.join(process.cwd(), 'uploads', 'qc')
  : path.resolve(process.cwd(), '..', '..', 'uploads', 'qc')

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}


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

// POST /api/v1/admin/orders/:id/assign & /api/v1/admin/production-orders/:id/assign
const assignHandler = async (request: any, reply: any) => {
  const { id } = request.params
  const result = AssignProductionOrderSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Mitra target wajib ditentukan.', meta: result.error.format() })
  }

  const { mitraUserId } = result.data
  const mitra = await prisma.user.findFirst({ where: { id: mitraUserId, role: Role.mitra } })
  if (!mitra) return reply.status(400).send({ success: false, error: 'Mitra tidak valid atau tidak terdaftar.' })

  const updated = await prisma.productionOrder.update({
    where: { id },
    data: { mitraUserId, status: ProductionOrderStatus.offered }
  })

  await createAuditLog(request.user.id, 'ASSIGN_PRODUCTION_ORDER', 'production_orders', id, `Order ${updated.orderCode} ditawarkan ke Mitra ${mitra.name}`)
  return { success: true, data: updated }
}

fastify.post('/api/v1/admin/orders/:id/assign', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, assignHandler)
fastify.post('/api/v1/admin/production-orders/:id/assign', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, assignHandler)

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

// ----------------------------------------------------
// Real File Upload & Serving for Quality Control (QC)
// ----------------------------------------------------
fastify.post('/api/v1/uploads/qc', { preHandler: [fastify.authenticate] }, async (request: any, reply: any) => {
  try {
    const data = await request.file()
    if (!data) {
      return reply.status(400).send({ success: false, error: 'Tidak ada file yang diunggah.' })
    }

    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedMimeTypes.includes(data.mimetype)) {
      return reply.status(400).send({
        success: false,
        error: 'Format file tidak valid. Harap unggah foto berformat JPG, PNG, atau WebP.'
      })
    }

    const ext = path.extname(data.filename) || '.jpg'
    const safeFilename = `qc_${Date.now()}_${crypto.randomBytes(6).toString('hex')}${ext.toLowerCase()}`
    const targetPath = path.join(UPLOADS_DIR, safeFilename)

    await pipeline(data.file, fs.createWriteStream(targetPath))

    const fileUrl = `/api/v1/uploads/qc/${safeFilename}`
    await createAuditLog(request.user.id, 'UPLOAD_QC_FILE', 'production_evidence', undefined, `File ${safeFilename} diunggah`)

    return reply.status(201).send({
      success: true,
      data: {
        url: fileUrl,
        filename: safeFilename,
        mimeType: data.mimetype
      }
    })
  } catch (err: any) {
    if (err.code === 'FST_REQ_FILE_TOO_LARGE') {
      return reply.status(400).send({ success: false, error: 'Ukuran file melebihi batas maksimum 5 MB.' })
    }
    fastify.log.error(err)
    return reply.status(500).send({ success: false, error: 'Gagal mengunggah file foto bukti QC.' })
  }
})

fastify.get('/api/v1/uploads/qc/:filename', { preHandler: [fastify.authenticate] }, async (request: any, reply: any) => {
  const { filename } = request.params as { filename: string }

  // Prevent directory traversal
  const safeFilename = path.basename(filename)
  const filePath = path.join(UPLOADS_DIR, safeFilename)

  if (!fs.existsSync(filePath)) {
    return reply.status(404).send({ success: false, error: 'File foto tidak ditemukan.' })
  }

  const ext = path.extname(safeFilename).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp'
  }

  const contentType = mimeTypes[ext] || 'application/octet-stream'
  reply.header('Content-Type', contentType)
  return reply.send(fs.createReadStream(filePath))
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
// Roadmap 5: QC Queue & Detail (Admin)
// ----------------------------------------------------

// Helper: generate metadata hash (SHA-256 of canonical JSON)
function generateMetadataHash(payload: object): string {
  const canonical = JSON.stringify(payload, Object.keys(payload).sort())
  return crypto.createHash('sha256').update(canonical).digest('hex')
}

// Helper: generate payout code
async function generatePayoutCode(): Promise<string> {
  const count = await prisma.payout.count()
  return `PAY-2026-${String(count + 1).padStart(4, '0')}`
}

// Helper: generate product code and slug
async function generateProductCode(): Promise<{ code: string; slug: string }> {
  const count = await prisma.product.count()
  const code = `PRD-2026-${String(count + 1).padStart(4, '0')}`
  const slug = code.toLowerCase()
  return { code, slug }
}

// GET /api/v1/admin/qc — QC Queue
fastify.get('/api/v1/admin/qc', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const orders = await prisma.productionOrder.findMany({
    where: { status: { in: [ProductionOrderStatus.submitted_to_qc, ProductionOrderStatus.qc_revision, ProductionOrderStatus.qc_approved] } },
    include: {
      productionEvidence: { orderBy: { submittedAt: 'desc' } },
      ecoKit: { include: { pattern: true } },
      mitraUser: { include: { mitraProfile: true } },
      qcReviews: { orderBy: { reviewedAt: 'desc' } }
    },
    orderBy: { updatedAt: 'desc' }
  })
  return reply.send({ success: true, data: orders })
})

// Keep backward-compat alias
fastify.get('/api/v1/admin/qc-reviews', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const orders = await prisma.productionOrder.findMany({
    where: { status: { in: [ProductionOrderStatus.submitted_to_qc, ProductionOrderStatus.qc_revision, ProductionOrderStatus.qc_approved] } },
    include: {
      productionEvidence: { orderBy: { submittedAt: 'desc' } },
      ecoKit: { include: { pattern: true } },
      mitraUser: { include: { mitraProfile: true } },
      qcReviews: { orderBy: { reviewedAt: 'desc' } }
    },
    orderBy: { updatedAt: 'desc' }
  })
  return reply.send({ success: true, data: orders })
})

// GET /api/v1/admin/qc/:id — QC Detail
fastify.get('/api/v1/admin/qc/:id', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }
  const order = await prisma.productionOrder.findUnique({
    where: { id },
    include: {
      ecoKit: { include: { pattern: true, ecoKitItems: { include: { batch: { include: { source: true } } } } } },
      mitraUser: { include: { mitraProfile: true } },
      productionProgress: { orderBy: { updatedAt: 'desc' } },
      productionEvidence: { orderBy: { submittedAt: 'desc' } },
      productionIssues: { orderBy: { createdAt: 'desc' } },
      qcReviews: { include: { adminUser: { select: { name: true, email: true } }, qcFindings: true }, orderBy: { reviewedAt: 'desc' } },
      payouts: true,
      products: { include: { dppRecord: true } }
    }
  })
  if (!order) return reply.status(404).send({ success: false, error: 'Order tidak ditemukan.' })
  return reply.send({ success: true, data: order })
})

// POST /api/v1/admin/qc/:id/decision — Full QC Decision
fastify.post('/api/v1/admin/qc/:id/decision', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }
  const result = QcDecisionSchema.safeParse(request.body)

  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input tidak valid', meta: result.error.format() })
  }

  const data = result.data
  const isApproved = data.decision === 'approved'
  const isRejected = data.decision === 'rejected'

  // Validate order exists and is in correct state
  const order = await prisma.productionOrder.findUnique({ where: { id }, include: { mitraUser: true } })
  if (!order) return reply.status(404).send({ success: false, error: 'Order tidak ditemukan.' })
  if (!['submitted_to_qc', 'qc_revision'].includes(order.status)) {
    return reply.status(409).send({ success: false, error: `Order status ${order.status} tidak dapat diputuskan QC.` })
  }

  // Prevent duplicate approval if already QC approved
  if (isApproved) {
    const existingApproval = await prisma.qcReview.findFirst({ where: { orderId: id, decision: 'approved' } })
    if (existingApproval) {
      return reply.status(409).send({ success: false, error: 'Order ini sudah disetujui QC sebelumnya. Duplikat keputusan ditolak.' })
    }
  }

  // Determine new order status
  const newStatus = isApproved
    ? ProductionOrderStatus.qc_approved
    : isRejected
    ? ProductionOrderStatus.cancelled
    : ProductionOrderStatus.qc_revision

  // Atomic: create QC review + update order status + create payout if approved
  const [qcReview, updatedOrder] = await prisma.$transaction(async (tx) => {
    const review = await tx.qcReview.create({
      data: {
        orderId: id,
        adminUserId: request.user.id,
        decision: data.decision,
        isApproved,
        decisionNotes: data.decisionNotes,
        revisionInstructions: data.revisionInstructions,
        rejectionReason: data.rejectionReason,
        checkFront: data.checkFront,
        checkBack: data.checkBack,
        checkStitching: data.checkStitching,
        checkMeasures: data.checkMeasures,
        checkQuantity: data.checkQuantity,
        checkMaterial: data.checkMaterial,
        checkDimensions: data.checkDimensions,
        checkCleanliness: data.checkCleanliness
      }
    })

    const updated = await tx.productionOrder.update({
      where: { id },
      data: { status: newStatus }
    })

    // Create payout eligibility atomically on approval
    if (isApproved) {
      const existingPayout = await tx.payout.findFirst({ where: { orderId: id } })
      if (!existingPayout) {
        const payoutCode = await generatePayoutCode()
        await tx.payout.create({
          data: {
            payoutCode,
            orderId: id,
            mitraUserId: order.mitraUserId,
            amount: order.agreedPayoutRate,
            status: PayoutStatus.pending,
            eligibleAt: new Date(),
            dataOrigin: order.dataOrigin
          }
        })
      }
    }

    return [review, updated]
  })

  await createAuditLog(request.user.id, `QC_${data.decision.toUpperCase()}`, 'qc_reviews', qcReview.id,
    `QC ${data.decision} untuk Order ${updatedOrder.orderCode}`)

  return reply.send({ success: true, data: { qcReview, order: updatedOrder } })
})

// POST /api/v1/admin/qc-reviews/:id/decision — backward-compat alias (enhanced)
fastify.post('/api/v1/admin/qc-reviews/:id/decision', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }
  const result = QcDecisionSchema.safeParse(request.body)

  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input tidak valid', meta: result.error.format() })
  }

  const data = result.data
  const isApproved = data.decision === 'approved'
  const order = await prisma.productionOrder.findUnique({ where: { id } })
  if (!order) return reply.status(404).send({ success: false, error: 'Order tidak ditemukan.' })

  const newStatus = isApproved ? ProductionOrderStatus.qc_approved
    : data.decision === 'rejected' ? ProductionOrderStatus.cancelled
    : ProductionOrderStatus.qc_revision

  const [qcReview, updatedOrder] = await prisma.$transaction(async (tx) => {
    const review = await tx.qcReview.create({
      data: {
        orderId: id, adminUserId: request.user.id, decision: data.decision, isApproved,
        decisionNotes: data.decisionNotes, revisionInstructions: data.revisionInstructions,
        rejectionReason: data.rejectionReason, checkFront: data.checkFront, checkBack: data.checkBack,
        checkStitching: data.checkStitching, checkMeasures: data.checkMeasures,
        checkQuantity: data.checkQuantity, checkMaterial: data.checkMaterial,
        checkDimensions: data.checkDimensions, checkCleanliness: data.checkCleanliness
      }
    })
    const updated = await tx.productionOrder.update({ where: { id }, data: { status: newStatus } })
    if (isApproved) {
      const exists = await tx.payout.findFirst({ where: { orderId: id } })
      if (!exists) {
        const payoutCode = await generatePayoutCode()
        await tx.payout.create({
          data: { payoutCode, orderId: id, mitraUserId: order.mitraUserId, amount: order.agreedPayoutRate,
            status: PayoutStatus.pending, eligibleAt: new Date(), dataOrigin: order.dataOrigin }
        })
      }
    }
    return [review, updated]
  })

  await createAuditLog(request.user.id, `QC_${data.decision.toUpperCase()}`, 'qc_reviews', qcReview.id,
    `QC ${data.decision} untuk Order ${updatedOrder.orderCode}`)
  return reply.send({ success: true, data: { qcReview, order: updatedOrder } })
})

// ----------------------------------------------------
// Roadmap 5: Payout Management (Admin)
// ----------------------------------------------------

// GET /api/v1/admin/payouts
fastify.get('/api/v1/admin/payouts', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const payouts = await prisma.payout.findMany({
    include: {
      order: { include: { ecoKit: true, mitraUser: { include: { mitraProfile: true } } } },
      mitraUser: { include: { mitraProfile: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
  return reply.send({ success: true, data: payouts })
})

// GET /api/v1/admin/payouts/:id
fastify.get('/api/v1/admin/payouts/:id', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }
  const payout = await prisma.payout.findUnique({
    where: { id },
    include: {
      order: { include: { ecoKit: { include: { pattern: true } }, mitraUser: { include: { mitraProfile: true } }, qcReviews: { orderBy: { reviewedAt: 'desc' }, take: 1 } } },
      mitraUser: { include: { mitraProfile: true } }
    }
  })
  if (!payout) return reply.status(404).send({ success: false, error: 'Payout tidak ditemukan.' })
  return reply.send({ success: true, data: payout })
})

// POST /api/v1/admin/payouts/:id/mark-paid
fastify.post('/api/v1/admin/payouts/:id/mark-paid', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }
  const result = MarkPaidSchema.safeParse(request.body)

  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Payment reference wajib diisi.', meta: result.error.format() })
  }

  const existing = await prisma.payout.findUnique({ where: { id } })
  if (!existing) return reply.status(404).send({ success: false, error: 'Payout tidak ditemukan.' })
  if (existing.status === PayoutStatus.paid) {
    return reply.status(409).send({ success: false, error: 'Payout ini sudah ditandai paid. Duplikat ditolak.' })
  }

  const { paymentReference, paymentMethod, paidAt, notes } = result.data

  const payout = await prisma.payout.update({
    where: { id },
    data: {
      status: PayoutStatus.paid,
      paymentReference,
      paymentMethod: paymentMethod || 'bank_transfer',
      paidAt: paidAt ? new Date(paidAt) : new Date(),
      paidByUserId: request.user.id,
      notes,
      approvedAt: new Date()
    },
    include: { order: true }
  })

  await prisma.productionOrder.update({
    where: { id: payout.orderId },
    data: { status: ProductionOrderStatus.completed }
  })

  await createAuditLog(request.user.id, 'MARK_PAYOUT_PAID', 'payouts', id,
    `Payout ${payout.payoutCode || id} ditandai Paid (${paymentReference})`)

  return reply.send({ success: true, data: payout })
})

// ----------------------------------------------------
// Roadmap 5: Product Management (Admin)
// ----------------------------------------------------

// GET /api/v1/admin/products
fastify.get('/api/v1/admin/products', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const products = await prisma.product.findMany({
    include: {
      productionOrder: { include: { mitraUser: { include: { mitraProfile: true } } } },
      dppRecord: { include: { dppVersions: { orderBy: { versionNum: 'desc' }, take: 1 } } },
      impactRecords: true
    },
    orderBy: { createdAt: 'desc' }
  })
  return reply.send({ success: true, data: products })
})

// GET /api/v1/admin/products/:id
fastify.get('/api/v1/admin/products/:id', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      productionOrder: {
        include: {
          ecoKit: { include: { pattern: true, ecoKitItems: { include: { batch: { include: { source: true } } } } } },
          mitraUser: { include: { mitraProfile: true } },
          qcReviews: { orderBy: { reviewedAt: 'desc' } },
          payouts: true
        }
      },
      dppRecord: { include: { dppVersions: { orderBy: { versionNum: 'desc' } } } },
      impactRecords: true
    }
  })
  if (!product) return reply.status(404).send({ success: false, error: 'Produk tidak ditemukan.' })
  return reply.send({ success: true, data: product })
})

// POST /api/v1/admin/products — Create Final Product (QC-approved orders only)
fastify.post('/api/v1/admin/products', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const result = CreateProductSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input tidak valid', meta: result.error.format() })
  }

  const data = result.data

  // Guard: order must be QC approved
  const order = await prisma.productionOrder.findUnique({
    where: { id: data.productionOrderId },
    include: { products: true }
  })
  if (!order) return reply.status(404).send({ success: false, error: 'Production order tidak ditemukan.' })
  if (order.status !== ProductionOrderStatus.qc_approved && order.status !== ProductionOrderStatus.payout_pending && order.status !== ProductionOrderStatus.paid && order.status !== ProductionOrderStatus.completed) {
    return reply.status(409).send({ success: false, error: `Order status ${order.status} belum QC approved. Produk hanya bisa dibuat setelah QC disetujui.` })
  }

  // Prevent duplicate product for same order
  if (order.products.length > 0) {
    return reply.status(409).send({ success: false, error: 'Produk sudah dibuat untuk order ini. Duplikat produk ditolak.' })
  }

  const { code: productCode, slug: baseSlug } = await generateProductCode()
  const slug = baseSlug

  const product = await prisma.product.create({
    data: {
      productCode,
      slug,
      productionOrderId: data.productionOrderId,
      name: data.name,
      shortDescription: data.shortDescription,
      description: data.description,
      size: data.size || 'L',
      category: data.category || 'Outerwear',
      status: 'draft',
      primaryImageUrl: data.primaryImageUrl,
      beforeImageUrl: data.beforeImageUrl,
      afterImageUrl: data.afterImageUrl,
      dataOrigin: order.dataOrigin
    }
  })

  await createAuditLog(request.user.id, 'CREATE_PRODUCT', 'products', product.id, `Produk ${productCode} dibuat dari Order ${order.orderCode}`)
  return reply.status(201).send({ success: true, data: product })
})

// POST /api/v1/admin/products/:id/publish — Publish product to catalog
fastify.post('/api/v1/admin/products/:id/publish', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return reply.status(404).send({ success: false, error: 'Produk tidak ditemukan.' })
  if (product.status === 'published') return reply.status(409).send({ success: false, error: 'Produk sudah dipublikasikan.' })

  const body = request.body as { primaryImageUrl?: string }
  const updated = await prisma.product.update({
    where: { id },
    data: {
      status: 'published',
      publishedAt: new Date(),
      primaryImageUrl: body?.primaryImageUrl || product.primaryImageUrl
    }
  })

  // Create catalog item if not exists
  const catalogSlug = product.slug || product.productCode.toLowerCase()
  await prisma.catalogItem.upsert({
    where: { slug: catalogSlug },
    update: { isAvailable: true },
    create: {
      slug: catalogSlug,
      productId: product.id,
      title: product.name,
      price: 499000.0,
      depositAmount: 150000.0,
      stock: 1,
      isAvailable: true,
      dataOrigin: product.dataOrigin
    }
  })

  await createAuditLog(request.user.id, 'PUBLISH_PRODUCT', 'products', id, `Produk ${product.productCode} dipublikasikan`)
  return reply.send({ success: true, data: updated })
})

// ----------------------------------------------------
// Roadmap 5: DPP Management (Admin)
// ----------------------------------------------------

// GET /api/v1/admin/dpp/:id — Admin DPP detail
fastify.get('/api/v1/admin/dpp/:id', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }
  const dpp = await prisma.dppRecord.findUnique({
    where: { id },
    include: {
      product: { include: { productionOrder: { include: { ecoKit: { include: { pattern: true } }, mitraUser: { include: { mitraProfile: true } } } }, impactRecords: true } },
      dppVersions: { orderBy: { versionNum: 'desc' } }
    }
  })
  if (!dpp) return reply.status(404).send({ success: false, error: 'DPP tidak ditemukan.' })
  return reply.send({ success: true, data: dpp })
})

// POST /api/v1/admin/products/:id/publish-dpp — Full DPP creation + publish
fastify.post('/api/v1/admin/products/:id/publish-dpp', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      productionOrder: {
        include: {
          ecoKit: { include: { pattern: true, ecoKitItems: { include: { batch: { include: { source: true } } } } } },
          mitraUser: { include: { mitraProfile: true } },
          productionProgress: true,
          qcReviews: { where: { decision: 'approved' }, orderBy: { reviewedAt: 'desc' }, take: 1 }
        }
      },
      impactRecords: true
    }
  })

  if (!product) return reply.status(404).send({ success: false, error: 'Produk tidak ditemukan.' })

  // Build canonical metadata payload
  const order = product.productionOrder
  const kit = order.ecoKit
  const qcReview = order.qcReviews[0]

  const canonicalPayload = {
    _version: '1',
    _publishedAt: new Date().toISOString(),
    product: {
      productCode: product.productCode,
      name: product.name,
      shortDescription: product.shortDescription,
      size: product.size,
      category: product.category,
      status: product.status,
      dataOrigin: product.dataOrigin
    },
    production: {
      orderCode: order.orderCode,
      ecoKitCode: kit.kitCode,
      ecoKitName: kit.name,
      patternCode: kit.pattern?.patternCode,
      patternName: kit.pattern?.name,
      mitraPublicName: order.mitraUser?.mitraProfile?.workshopName || order.mitraUser?.name || 'Mitra Terverifikasi',
      qcApprovedAt: qcReview?.reviewedAt?.toISOString() || null,
      qcStatus: qcReview ? 'approved' : null
    },
    materials: kit.ecoKitItems?.map((item: any) => ({
      batchCode: item.batch?.batchCode,
      materialType: item.batch?.materialType,
      category: item.batch?.materialType,
      sourceType: item.batch?.source?.sourceType || 'waste_bank',
      allocatedKg: item.quantity,
      unit: item.unit,
      dataOrigin: item.batch?.dataOrigin
    })) || [],
    impact: product.impactRecords[0] ? {
      co2SavedKg: product.impactRecords[0].co2SavedKg,
      waterSavedLiters: product.impactRecords[0].waterSavedLiters,
      landfillDivertedKg: product.impactRecords[0].landfillDivertedKg,
      dataOrigin: product.impactRecords[0].dataOrigin,
      methodology: 'Estimated — EcoThread Textile Waste Reduction Formula v1.0'
    } : null,
    verification: {
      verificationState: 'database_verified',
      blockchainAnchoringStatus: 'not_yet_enabled',
      dppPublicUrl: `${DPP_PUBLIC_BASE_URL}/dpp/${product.productCode}`
    }
  }

  const metadataHash = generateMetadataHash(canonicalPayload)
  const payloadJson = JSON.stringify(canonicalPayload)

  // Get next version number
  const existingDpp = await prisma.dppRecord.findUnique({ where: { productId: id }, include: { dppVersions: true } })
  const nextVersion = existingDpp ? (existingDpp.dppVersions.length + 1) : 1

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`${DPP_PUBLIC_BASE_URL}/dpp/${product.productCode}`)}`

  const dppRecord = await prisma.dppRecord.upsert({
    where: { productId: id },
    update: {
      verificationState: DppVerificationState.database_verified,
      qrCodeUrl,
      updatedAt: new Date()
    },
    create: {
      productCode: product.productCode,
      productId: id,
      verificationState: DppVerificationState.database_verified,
      qrCodeUrl,
      dataOrigin: product.dataOrigin
    }
  })

  // Create new immutable version
  const dppVersion = await prisma.dppVersion.create({
    data: {
      dppRecordId: dppRecord.id,
      versionNum: nextVersion,
      payloadJson,
      metadataHash,
      publicationStatus: 'published',
      createdByUserId: request.user.id
    }
  })

  // Update product published state
  await prisma.product.update({
    where: { id },
    data: {
      isPublishedDpp: true,
      status: 'published',
      publishedAt: product.publishedAt || new Date(),
      slug: product.slug || product.productCode.toLowerCase()
    }
  })

  // Upsert catalog item
  const catalogSlug = product.slug || product.productCode.toLowerCase()
  await prisma.catalogItem.upsert({
    where: { slug: catalogSlug },
    update: { stock: 5, isAvailable: true },
    create: {
      slug: catalogSlug,
      productId: product.id,
      title: product.name,
      price: 499000.0,
      depositAmount: 150000.0,
      stock: 5,
      isAvailable: true,
      dataOrigin: product.dataOrigin
    }
  })

  await createAuditLog(request.user.id, 'PUBLISH_DPP', 'dpp_records', dppRecord.id,
    `DPP v${nextVersion} dipublikasikan untuk ${product.productCode} (hash: ${metadataHash.substring(0, 16)}...)`)

  return reply.send({ success: true, data: { dppRecord, dppVersion, metadataHash } })
})

// ----------------------------------------------------
// Roadmap 5: Public Routes
// ----------------------------------------------------

// Public DPP — only published products
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
              ecoKit: { include: { pattern: true, ecoKitItems: { include: { batch: { include: { source: true } } } } } },
              mitraUser: { include: { mitraProfile: true } },
              qcReviews: { where: { decision: 'approved' }, orderBy: { reviewedAt: 'desc' }, take: 1 }
            }
          }
        }
      },
      dppVersions: { where: { publicationStatus: 'published' }, orderBy: { versionNum: 'desc' }, take: 1 }
    }
  })

  if (!dpp) return reply.status(404).send({ success: false, error: 'Digital Product Passport (DPP) tidak ditemukan.' })
  if (!dpp.product.isPublishedDpp) return reply.status(404).send({ success: false, error: 'DPP ini belum dipublikasikan.' })

  // Sanitize: remove private fields
  const publicData = {
    ...dpp,
    product: {
      ...dpp.product,
      productionOrder: {
        ...dpp.product.productionOrder,
        agreedPayoutRate: undefined,
        rejectionReason: undefined,
        notes: undefined,
        mitraUser: {
          id: dpp.product.productionOrder.mitraUser?.id,
          name: dpp.product.productionOrder.mitraUser?.name,
          mitraProfile: {
            workshopName: dpp.product.productionOrder.mitraUser?.mitraProfile?.workshopName,
            location: dpp.product.productionOrder.mitraUser?.mitraProfile?.location,
            specialization: dpp.product.productionOrder.mitraUser?.mitraProfile?.specialization
          }
        }
      }
    }
  }

  return reply.send({ success: true, data: publicData })
})

// Public Catalog — only published products
fastify.get('/api/v1/catalog', async () => {
  const items = await prisma.catalogItem.findMany({
    where: { isAvailable: true, product: { status: 'published' } },
    include: { product: { include: { dppRecord: true, impactRecords: true } } }
  })
  return { success: true, data: items }
})

// Public Catalog Item by slug
fastify.get('/api/v1/catalog/:slug', async (request: any, reply: any) => {
  const { slug } = request.params as { slug: string }
  const item = await prisma.catalogItem.findUnique({
    where: { slug },
    include: { product: { include: { dppRecord: { include: { dppVersions: { orderBy: { versionNum: 'desc' }, take: 1 } } }, impactRecords: true, productionOrder: { include: { ecoKit: { include: { pattern: true } }, mitraUser: { include: { mitraProfile: true } } } } } } }
  })

  if (!item) return reply.status(404).send({ success: false, error: 'Item katalog tidak ditemukan.' })
  if (item.product.status !== 'published') return reply.status(404).send({ success: false, error: 'Produk ini belum dipublikasikan.' })

  return reply.send({ success: true, data: item })
})



// ----------------------------------------------------
// Roadmap 6: Customer Auth & Profile
// ----------------------------------------------------

// POST /api/v1/auth/customer/register
fastify.post('/api/v1/auth/customer/register', async (request: any, reply: any) => {
  const result = RegisterCustomerSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input pendaftaran tidak valid', meta: result.error.format() })
  }

  const { email, password, name, phone, address, city } = result.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return reply.status(409).send({ success: false, error: 'Email sudah terdaftar. Silakan login.' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
        passwordHash,
        role: Role.user, // FORCED to user role
        name,
        accountStatus: 'active'
      }
    })

    await tx.userProfile.create({
      data: {
        userId: newUser.id,
        phone: phone || null,
        address: address ? (city ? `${address}, ${city}` : address) : null
      }
    })

    return newUser
  })

  const token = fastify.jwt.sign({ id: user.id, email: user.email, role: user.role })

  await createAuditLog(user.id, 'REGISTER_CUSTOMER', 'users', user.id, `Pelanggan baru terdaftar: ${user.email}`)

  return reply.status(201).send({
    success: true,
    data: {
      token,
      user: { id: user.id, email: user.email, role: user.role, name: user.name }
    }
  })
})

// GET /api/v1/customer/profile
fastify.get('/api/v1/customer/profile', { preHandler: [fastify.authenticate] }, async (request: any, reply: any) => {
  const user = await prisma.user.findUnique({
    where: { id: request.user.id },
    include: { userProfile: true }
  })
  if (!user) return reply.status(404).send({ success: false, error: 'Profil tidak ditemukan.' })

  return reply.send({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      profile: user.userProfile
    }
  })
})

// PATCH /api/v1/customer/profile
fastify.patch('/api/v1/customer/profile', { preHandler: [fastify.authenticate] }, async (request: any, reply: any) => {
  const result = UpdateCustomerProfileSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input tidak valid', meta: result.error.format() })
  }

  const { name, phone, address, city, postalCode, deliveryNotes } = result.data

  const updated = await prisma.$transaction(async (tx) => {
    if (name) {
      await tx.user.update({ where: { id: request.user.id }, data: { name } })
    }

    const fullAddress = [address, city, postalCode].filter(Boolean).join(', ')

    const profile = await tx.userProfile.upsert({
      where: { userId: request.user.id },
      update: {
        phone: phone !== undefined ? phone : undefined,
        address: fullAddress || undefined,
        preferences: deliveryNotes ? JSON.stringify({ deliveryNotes }) : undefined
      },
      create: {
        userId: request.user.id,
        phone: phone || null,
        address: fullAddress || null,
        preferences: deliveryNotes ? JSON.stringify({ deliveryNotes }) : null
      }
    })

    return profile
  })

  await createAuditLog(request.user.id, 'UPDATE_CUSTOMER_PROFILE', 'user_profiles', request.user.id, 'Profil pelanggan diperbarui')

  return reply.send({ success: true, data: updated })
})

// ----------------------------------------------------
// Roadmap 6: Preorder & Customer Orders
// ----------------------------------------------------

// POST /api/v1/customer-orders
fastify.post('/api/v1/customer-orders', { preHandler: [fastify.authenticate] }, async (request: any, reply: any) => {
  const result = CreateCustomerOrderSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input tidak valid', meta: result.error.format() })
  }

  const { catalogItemId, quantity, shippingAddress, customerNotes } = result.data
  const catalogItem = await prisma.catalogItem.findUnique({
    where: { id: catalogItemId },
    include: { product: true }
  })

  if (!catalogItem) {
    return reply.status(404).send({ success: false, error: 'Katalog item tidak ditemukan.' })
  }

  if (!catalogItem.isAvailable || catalogItem.product.status !== 'published') {
    return reply.status(400).send({ success: false, error: 'Produk ini tidak tersedia untuk pre-order.' })
  }

  if (catalogItem.stock < quantity) {
    return reply.status(400).send({ success: false, error: `Stok tidak mencukupi (tersedia: ${catalogItem.stock}).` })
  }

  // SERVER-AUTHORITATIVE PRICING:
  const unitPrice = catalogItem.price
  const totalAmount = unitPrice * quantity
  const requiredDeposit = catalogItem.depositAmount * quantity

  const orderCount = await prisma.customerOrder.count()
  const orderCode = `CORD-2026-${String(orderCount + 1).padStart(4, '0')}`

  const order = await prisma.$transaction(async (tx) => {
    // Decrement stock
    await tx.catalogItem.update({
      where: { id: catalogItemId },
      data: { stock: { decrement: quantity } }
    })

    const newOrder = await tx.customerOrder.create({
      data: {
        orderCode,
        userId: request.user.id,
        status: 'pending_payment',
        totalAmount,
        depositPaid: requiredDeposit, // Snapshot required deposit amount
        shippingAddress,
        customerOrderItems: {
          create: {
            catalogItemId,
            quantity,
            unitPrice
          }
        }
      },
      include: {
        customerOrderItems: { include: { catalogItem: { include: { product: true } } } },
        payments: true
      }
    })

    return newOrder
  })

  await createAuditLog(request.user.id, 'CREATE_CUSTOMER_ORDER', 'customer_orders', order.id, `Pre-order ${orderCode} dibuat (Total: Rp ${totalAmount.toLocaleString('id-ID')})`)

  return reply.status(201).send({ success: true, data: order })
})

// GET /api/v1/me/customer-orders
fastify.get('/api/v1/me/customer-orders', { preHandler: [fastify.authenticate] }, async (request: any, reply: any) => {
  const orders = await prisma.customerOrder.findMany({
    where: { userId: request.user.id },
    include: {
      customerOrderItems: { include: { catalogItem: { include: { product: true } } } },
      payments: { orderBy: { createdAt: 'desc' } }
    },
    orderBy: { createdAt: 'desc' }
  })
  return reply.send({ success: true, data: orders })
})

// GET /api/v1/customer-orders — Alias for /me/customer-orders
fastify.get('/api/v1/customer-orders', { preHandler: [fastify.authenticate] }, async (request: any, reply: any) => {
  const orders = await prisma.customerOrder.findMany({
    where: { userId: request.user.id },
    include: {
      customerOrderItems: { include: { catalogItem: { include: { product: true } } } },
      payments: { orderBy: { createdAt: 'desc' } }
    },
    orderBy: { createdAt: 'desc' }
  })
  return reply.send({ success: true, data: orders })
})

// GET /api/v1/customer-orders/:id — Detail order with ownership guard
fastify.get('/api/v1/customer-orders/:id', { preHandler: [fastify.authenticate] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }

  const order = await prisma.customerOrder.findUnique({
    where: { id },
    include: {
      user: { include: { userProfile: true } },
      customerOrderItems: {
        include: {
          catalogItem: {
            include: {
              product: {
                include: {
                  dppRecord: true,
                  impactRecords: true
                }
              }
            }
          }
        }
      },
      payments: { orderBy: { createdAt: 'desc' } }
    }
  })

  if (!order) {
    return reply.status(404).send({ success: false, error: 'Pesanan tidak ditemukan.' })
  }

  // Ownership Guard: Only order owner or Admin can access detail
  if (request.user.role !== Role.admin && order.userId !== request.user.id) {
    return reply.status(404).send({ success: false, error: 'Pesanan tidak ditemukan.' })
  }

  return reply.send({ success: true, data: order })
})

// ----------------------------------------------------
// Roadmap 6: Payment Proof Upload & Resubmission
// ----------------------------------------------------

// POST /api/v1/customer-orders/:id/payment-proof
fastify.post('/api/v1/customer-orders/:id/payment-proof', { preHandler: [fastify.authenticate] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }

  const order = await prisma.customerOrder.findUnique({ where: { id } })
  if (!order) {
    return reply.status(404).send({ success: false, error: 'Pesanan tidak ditemukan.' })
  }

  if (request.user.role !== Role.admin && order.userId !== request.user.id) {
    return reply.status(404).send({ success: false, error: 'Pesanan tidak ditemukan.' })
  }

  const validPaymentStatuses = ['pending_payment', 'payment_rejected']
  if (!validPaymentStatuses.includes(order.status)) {
    return reply.status(400).send({
      success: false,
      error: `Bukti pembayaran tidak dapat diunggah untuk pesanan dengan status '${order.status}'.`
    })
  }

  const result = SubmitPaymentProofSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Bukti pembayaran tidak lengkap.', meta: result.error.format() })
  }

  const { paymentProofUrl, amount, paymentMethod } = result.data

  // Server-authoritative nominal validation: Body amount harus cocok dengan totalAmount atau depositPaid dari order.
  const expectedAmount = order.totalAmount
  const expectedDeposit = order.depositPaid
  if (Math.abs(amount - expectedAmount) > 0.01 && Math.abs(amount - expectedDeposit) > 0.01) {
    return reply.status(400).send({
      success: false,
      error: `Nominal pembayaran (Rp ${amount.toLocaleString('id-ID')}) tidak sesuai dengan tagihan pesanan (Total: Rp ${expectedAmount.toLocaleString('id-ID')}${expectedDeposit ? `, Deposit: Rp ${expectedDeposit.toLocaleString('id-ID')}` : ''}).`
    })
  }

  const { payment, updatedOrder } = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        customerOrderId: id,
        amount,
        paymentProofUrl,
        paymentMethod: paymentMethod || 'bank_transfer',
        isVerified: false
      }
    })

    const updatedOrder = await tx.customerOrder.update({
      where: { id },
      data: { status: 'payment_proof_submitted' }
    })

    return { payment, updatedOrder }
  })

  await createAuditLog(request.user.id, 'SUBMIT_PAYMENT_PROOF', 'payments', payment.id, `Bukti pembayaran diunggah untuk ${updatedOrder.orderCode}, menunggu verifikasi Admin`)

  return reply.send({ success: true, data: { payment, order: updatedOrder } })
})

// ----------------------------------------------------
// Roadmap 6: Admin Payment Verification Queue
// ----------------------------------------------------

// GET /api/v1/admin/payments — List submitted customer payments for Admin review
fastify.get('/api/v1/admin/payments', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const payments = await prisma.payment.findMany({
    include: {
      customerOrder: {
        include: {
          user: { include: { userProfile: true } },
          customerOrderItems: { include: { catalogItem: { include: { product: true } } } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  return reply.send({ success: true, data: payments })
})

// GET /api/v1/admin/payments/:id — Admin detail of a specific payment attempt
fastify.get('/api/v1/admin/payments/:id', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      customerOrder: {
        include: {
          user: { include: { userProfile: true } },
          customerOrderItems: { include: { catalogItem: { include: { product: true } } } },
          payments: { orderBy: { createdAt: 'desc' } }
        }
      }
    }
  })

  if (!payment) {
    return reply.status(404).send({ success: false, error: 'Bukti pembayaran tidak ditemukan.' })
  }

  return reply.send({ success: true, data: payment })
})

// POST /api/v1/admin/payments/:id/verify — Admin decision (approve / reject)
fastify.post('/api/v1/admin/payments/:id/verify', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }
  const result = VerifyPaymentSchema.safeParse(request.body)

  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input verifikasi tidak valid', meta: result.error.format() })
  }

  const { approve, decision, rejectionReason, notes } = result.data
  const isApproved = decision === 'approved' || approve === true

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { customerOrder: true }
  })

  if (!payment) {
    return reply.status(404).send({ success: false, error: 'Pembayaran tidak ditemukan.' })
  }

  if (payment.isVerified && isApproved) {
    return reply.status(409).send({ success: false, error: 'Pembayaran ini sudah diverifikasi sebelumnya.' })
  }

  const reason = rejectionReason || notes || 'Bukti pembayaran tidak sesuai'

  const { updatedPayment, updatedOrder } = await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { id },
      data: {
        isVerified: isApproved,
        verifiedAt: new Date(),
        verifiedByUserId: request.user.id,
        rejectionReason: isApproved ? null : reason
      }
    })

    const updatedOrder = await tx.customerOrder.update({
      where: { id: payment.customerOrderId },
      data: { status: isApproved ? 'payment_verified' : 'payment_rejected' }
    })

    return { updatedPayment, updatedOrder }
  })

  await createAuditLog(request.user.id, 'VERIFY_PAYMENT', 'payments', id, `Pembayaran ${isApproved ? 'DIVERIFIKASI' : 'DITOLAK'} untuk pesanan ${updatedOrder.orderCode}`)

  return reply.send({ success: true, data: { payment: updatedPayment, order: updatedOrder } })
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
