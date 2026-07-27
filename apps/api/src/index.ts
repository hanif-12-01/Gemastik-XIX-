import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { PrismaClient, Role, ProductionOrderStatus, PayoutStatus, DppVerificationState, DataOrigin } from '@prisma/client'
import crypto from 'crypto'
import {
  LoginSchema,
  CreateMaterialBatchSchema,
  CreateProductionOrderSchema,
  SubmitQcEvidenceSchema,
  QcDecisionSchema,
  MarkPaidSchema,
  CreateProductSchema,
  CreateCustomerOrderSchema,
  SubmitPaymentProofSchema,
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

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// Register plugins
fastify.register(cors, {
  origin: true,
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
fastify.post('/api/v1/auth/login', async (request: any, reply: any) => {
  const result = LoginSchema.safeParse(request.body)
  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Input tidak valid', meta: result.error.format() })
  }

  const { email, password } = result.data
  const hashedPassword = hashPassword(password)

  const user = await prisma.user.findUnique({
    where: { email },
    include: { userProfile: true, mitraProfile: true }
  })

  if (!user || user.passwordHash !== hashedPassword) {
    return reply.status(401).send({ success: false, error: 'Email atau password salah.' })
  }

  const token = fastify.jwt.sign({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  })

  await createAuditLog(user.id, 'USER_LOGIN', 'users', user.id, `User ${user.email} login`)

  return reply.send({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: user.userProfile,
        mitraProfile: user.mitraProfile
      }
    }
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
      profile: user.userProfile,
      mitraProfile: user.mitraProfile
    }
  })
})

// ----------------------------------------------------
// Admin Endpoints
// ----------------------------------------------------

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

fastify.post('/api/v1/admin/production-orders/:id/assign', { preHandler: [fastify.authenticate, checkRole([Role.admin])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }
  const { mitraUserId } = request.body as { mitraUserId: string }

  const order = await prisma.productionOrder.findUnique({ where: { id } })
  if (!order) {
    return reply.status(404).send({ success: false, error: 'Production Order tidak ditemukan.' })
  }

  const updated = await prisma.productionOrder.update({
    where: { id },
    data: {
      mitraUserId,
      status: ProductionOrderStatus.offered
    },
    include: { ecoKit: true, mitraUser: { include: { mitraProfile: true } } }
  })

  await createAuditLog(request.user.id, 'ASSIGN_ORDER_TO_MITRA', 'production_orders', id, `Order ${order.orderCode} ditugaskan ke Mitra ${mitraUserId}`)

  return reply.send({ success: true, data: updated })
})

// ----------------------------------------------------
// Mitra Endpoints
// ----------------------------------------------------

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

  return reply.send({ success: true, data: order })
})

fastify.post('/api/v1/mitra/production-orders/:id/accept', { preHandler: [fastify.authenticate, checkRole([Role.mitra])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }
  const order = await prisma.productionOrder.findUnique({ where: { id } })

  if (!order) return reply.status(404).send({ success: false, error: 'Order tidak ditemukan' })
  if (!isValidOrderTransition(order.status, ProductionOrderStatus.accepted)) {
    return reply.status(400).send({ success: false, error: `Transisi status dari ${order.status} ke accepted tidak valid.` })
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
  if (!order) return reply.status(404).send({ success: false, error: 'Order tidak ditemukan' })

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

  const progress = await prisma.productionProgress.create({
    data: {
      orderId: id,
      stepName,
      percentage,
      notes
    }
  })

  // Update order status to in_progress if acceptable
  const order = await prisma.productionOrder.findUnique({ where: { id } })
  if (order && (order.status === ProductionOrderStatus.accepted || order.status === ProductionOrderStatus.kit_received)) {
    await prisma.productionOrder.update({
      where: { id },
      data: { status: ProductionOrderStatus.in_progress }
    })
  }

  return reply.send({ success: true, data: progress })
})

fastify.post('/api/v1/mitra/production-orders/:id/submit-qc', { preHandler: [fastify.authenticate, checkRole([Role.mitra])] }, async (request: any, reply: any) => {
  const { id } = request.params as { id: string }
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
      dataOrigin: DataOrigin.demo,
      impactRecords: {
        create: {
          co2SavedKg: 12.4,
          waterSavedLiters: 2450.0,
          landfillDivertedKg: 1.8,
          dataOrigin: DataOrigin.demo
        }
      }
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
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=http://localhost:5175/dpp/${product.productCode}`,
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
            impactMetrics: product.impactRecords[0] || { co2SavedKg: 12.4, waterSavedLiters: 2450 }
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
  const result = SubmitPaymentProofSchema.safeParse(request.body)

  if (!result.success) {
    return reply.status(400).send({ success: false, error: 'Bukti pembayaran tidak lengkap.', meta: result.error.format() })
  }

  const { paymentProofUrl, amount } = result.data

  const payment = await prisma.payment.create({
    data: {
      customerOrderId: id,
      amount,
      paymentProofUrl,
      isVerified: true,
      verifiedAt: new Date()
    }
  })

  const updatedOrder = await prisma.customerOrder.update({
    where: { id },
    data: { status: 'payment_verified' }
  })

  await createAuditLog(request.user.id, 'SUBMIT_PAYMENT_PROOF', 'payments', payment.id, `Bukti pembayaran diunggah untuk ${updatedOrder.orderCode}`)

  return reply.send({ success: true, data: { payment, order: updatedOrder } })
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
