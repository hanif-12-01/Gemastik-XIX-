import { z } from 'zod'

// ----------------------------------------------------
// Production Order State Machine
// ----------------------------------------------------

export const ProductionOrderStatusEnum = z.enum([
  'draft',
  'offered',
  'accepted',
  'rejected_by_mitra',
  'kit_preparing',
  'kit_shipped',
  'kit_received',
  'in_progress',
  'submitted_to_qc',
  'qc_revision',
  'qc_approved',
  'payout_pending',
  'paid',
  'completed',
  'cancelled'
])

export type ProductionOrderStatus = z.infer<typeof ProductionOrderStatusEnum>

export const VALID_ORDER_TRANSITIONS: Record<ProductionOrderStatus, ProductionOrderStatus[]> = {
  draft: ['offered', 'cancelled'],
  offered: ['accepted', 'rejected_by_mitra', 'cancelled'],
  rejected_by_mitra: ['offered', 'cancelled'],
  accepted: ['kit_preparing', 'in_progress', 'cancelled'],
  kit_preparing: ['kit_shipped', 'cancelled'],
  kit_shipped: ['kit_received', 'cancelled'],
  kit_received: ['in_progress', 'cancelled'],
  in_progress: ['submitted_to_qc', 'cancelled'],
  submitted_to_qc: ['qc_approved', 'qc_revision', 'cancelled'],
  qc_revision: ['submitted_to_qc', 'cancelled'],
  qc_approved: ['payout_pending', 'paid', 'completed'],
  payout_pending: ['paid', 'cancelled'],
  paid: ['completed'],
  completed: [],
  cancelled: []
}

export function isValidOrderTransition(current: ProductionOrderStatus, next: ProductionOrderStatus): boolean {
  const allowed = VALID_ORDER_TRANSITIONS[current] || []
  return allowed.includes(next)
}

// ----------------------------------------------------
// Payout Status & Transitions
// ----------------------------------------------------

export const PayoutStatusEnum = z.enum([
  'pending',
  'approved',
  'processing',
  'paid',
  'failed',
  'cancelled'
])

export type PayoutStatus = z.infer<typeof PayoutStatusEnum>

// ----------------------------------------------------
// Dpp Verification State
// ----------------------------------------------------

export const DppVerificationStateEnum = z.enum([
  'database_verified',
  'anchoring_pending',
  'blockchain_verified',
  'anchoring_failed'
])

export type DppVerificationState = z.infer<typeof DppVerificationStateEnum>

// ----------------------------------------------------
// Zod Request & Response Schemas
// ----------------------------------------------------

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const CreateMaterialBatchSchema = z.object({
  sourceId: z.string().uuid().optional(),
  sourceName: z.string().min(2),
  materialType: z.string().min(2),
  weightKg: z.number().positive(),
  color: z.string().optional(),
  sortingDetails: z.string().optional(),
  imageUrl: z.string().optional()
})

export const CreateProductionOrderSchema = z.object({
  ecoKitId: z.string().uuid(),
  mitraUserId: z.string().uuid().optional(),
  agreedPayoutRate: z.number().positive()
})

export const SubmitQcEvidenceSchema = z.object({
  frontPhoto: z.string().url(),
  backPhoto: z.string().url(),
  detailPhoto: z.string().url(),
  notes: z.string().optional(),
  actualSize: z.string().optional()
})

export const QcDecisionSchema = z.object({
  isApproved: z.boolean(),
  decisionNotes: z.string().min(3),
  checkFront: z.boolean().default(true),
  checkBack: z.boolean().default(true),
  checkStitching: z.boolean().default(true),
  checkMeasures: z.boolean().default(true)
})

export const MarkPaidSchema = z.object({
  paymentReference: z.string().min(3)
})

export const CreateProductSchema = z.object({
  productCode: z.string().optional(),
  productionOrderId: z.string().uuid(),
  name: z.string().min(3),
  description: z.string().min(5),
  size: z.string().default('L'),
  category: z.string().default('Outerwear'),
  beforeImageUrl: z.string().optional(),
  afterImageUrl: z.string().optional()
})

export const CreateCustomerOrderSchema = z.object({
  catalogItemId: z.string().uuid(),
  quantity: z.number().int().positive().default(1),
  shippingAddress: z.string().min(5)
})

export const SubmitPaymentProofSchema = z.object({
  paymentProofUrl: z.string().url(),
  amount: z.number().positive()
})

// Standard API Response Format
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: Record<string, any>
}
