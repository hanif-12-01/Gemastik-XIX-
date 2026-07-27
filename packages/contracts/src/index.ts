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

export const RegisterMitraSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  workshopName: z.string().min(2),
  specialization: z.string().optional(),
  capacityPerWeek: z.number().int().nonnegative().default(10),
  location: z.string().min(2),
  phone: z.string().min(8),
  address: z.string().min(5).optional(),
  portfolioUrl: z.string().optional()
})

export const CreateAdminInvitationSchema = z.object({
  email: z.string().email(),
  expiresInHours: z.number().int().positive().default(24)
})

export const RegisterAdminFromInvitationSchema = z.object({
  password: z.string().min(6),
  name: z.string().min(2)
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email()
})

export const ResetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(6)
})

export const MitraDecisionSchema = z.object({
  approve: z.boolean(),
  notes: z.string().optional()
})

export const CreateMaterialSourceSchema = z.object({
  name: z.string().min(2),
  category: z.string().default('Waste Bank'),
  location: z.string().min(2),
  contact: z.string().optional(),
  sourceType: z.string().default('waste_bank'),
  notes: z.string().optional()
})

export const UpdateMaterialSourceSchema = CreateMaterialSourceSchema.partial()

export const CreateMaterialBatchSchema = z.object({
  sourceId: z.string().uuid().optional(),
  sourceName: z.string().min(2).optional(),
  materialType: z.string().min(2),
  weightKg: z.number().positive(),
  usableWeightKg: z.number().positive().optional(),
  color: z.string().optional(),
  sortingDetails: z.string().optional(),
  imageUrl: z.string().optional()
})

export const UpdateMaterialBatchSchema = CreateMaterialBatchSchema.partial()

export const CreatePatternSchema = z.object({
  name: z.string().min(2),
  category: z.string().default('Outerwear'),
  description: z.string().optional(),
  difficultyLevel: z.string().default('Medium'),
  estimatedMinutes: z.number().positive().default(300),
  approvalStatus: z.enum(['draft', 'under_review', 'approved', 'archived']).default('approved')
})

export const UpdatePatternSchema = CreatePatternSchema.partial()

export const CreateEcoKitSchema = z.object({
  name: z.string().min(2),
  patternId: z.string().uuid(),
  difficulty: z.string().default('Medium'),
  targetHours: z.number().positive().default(5.0),
  items: z.array(
    z.object({
      batchId: z.string().uuid(),
      quantity: z.number().positive(),
      unit: z.string().default('kg'),
      itemNotes: z.string().optional()
    })
  ).min(1)
})

export const UpdateEcoKitSchema = CreateEcoKitSchema.partial()

export const CreateProductionOrderSchema = z.object({
  ecoKitId: z.string().uuid(),
  mitraUserId: z.string().uuid().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  agreedPayoutRate: z.number().positive().default(150000.0),
  targetCompletionDays: z.number().int().positive().default(5),
  notes: z.string().optional()
})

export const UpdateProductionOrderSchema = CreateProductionOrderSchema.partial()

export const AssignProductionOrderSchema = z.object({
  mitraUserId: z.string().uuid()
})

export const RejectProductionOrderSchema = z.object({
  rejectionReason: z.string().min(3)
})

export const UpdateMitraProfileSchema = z.object({
  name: z.string().min(2).optional(),
  workshopName: z.string().min(2).optional(),
  phone: z.string().min(8).optional(),
  location: z.string().min(2).optional(),
  address: z.string().min(5).optional(),
  specialization: z.string().optional(),
  capacityPerWeek: z.number().int().positive().optional()
})

export const CreateProductionProgressSchema = z.object({
  stepName: z.string().min(2),
  percentage: z.number().min(0).max(100),
  notes: z.string().optional()
})

export const CreateProductionIssueSchema = z.object({
  issueType: z.enum([
    'material_shortage',
    'material_damage',
    'pattern_unclear',
    'equipment_problem',
    'deadline_risk',
    'quality_risk',
    'other'
  ]),
  severity: z.enum(['low', 'medium', 'high', 'blocking']).default('medium'),
  description: z.string().min(5),
  requestedAction: z.string().optional()
})

// Accepts either a full URL or an uploaded local storage path (e.g. /uploads/xxx.jpg)
const UploadedFileRef = z.string().min(3)

export const SubmitQcEvidenceSchema = z.object({
  frontPhoto: UploadedFileRef,
  backPhoto: UploadedFileRef,
  detailPhoto: UploadedFileRef,
  notes: z.string().optional(),
  actualSize: z.string().optional()
})


export const QcDecisionSchema = z.object({
  decision: z.enum(['approved', 'revision_required', 'rejected']),
  decisionNotes: z.string().min(3, 'Catatan keputusan minimal 3 karakter'),
  revisionInstructions: z.string().optional(),
  rejectionReason: z.string().optional(),
  // Category A: Product Identity
  checkOrderCode: z.boolean().default(true),
  checkPatternMatch: z.boolean().default(true),
  checkQuantity: z.boolean().default(true),
  // Category B: Construction Quality
  checkFront: z.boolean().default(true),
  checkBack: z.boolean().default(true),
  checkStitching: z.boolean().default(true),
  checkSeamConsistency: z.boolean().default(true),
  checkAttachmentStrength: z.boolean().default(true),
  // Category C: Material Usage
  checkMaterial: z.boolean().default(true),
  checkNoSubstitution: z.boolean().default(true),
  // Category D: Dimensions
  checkMeasures: z.boolean().default(true),
  checkDimensions: z.boolean().default(true),
  // Category E: Cleanliness
  checkCleanliness: z.boolean().default(true),
  checkReadyForPhotography: z.boolean().default(true),
  // Category F: Evidence Completeness
  checkFrontPhoto: z.boolean().default(true),
  checkBackPhoto: z.boolean().default(true),
  checkDetailPhoto: z.boolean().default(true)
}).superRefine((data, ctx) => {
  if (data.decision === 'revision_required' && !data.revisionInstructions) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Instruksi revisi wajib diisi untuk keputusan revision_required', path: ['revisionInstructions'] })
  }
  if (data.decision === 'rejected' && !data.rejectionReason) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Alasan penolakan wajib diisi untuk keputusan rejected', path: ['rejectionReason'] })
  }
})

export const MarkPayoutPaidSchema = z.object({
  paymentReference: z.string().min(3, 'Referensi pembayaran minimal 3 karakter'),
  paymentMethod: z.string().min(2).default('bank_transfer'),
  paidAt: z.string().datetime().optional(),
  notes: z.string().optional()
})

// Keep backward-compat alias
export const MarkPaidSchema = MarkPayoutPaidSchema

export const CreateProductSchema = z.object({
  productionOrderId: z.string().uuid(),
  name: z.string().min(3),
  shortDescription: z.string().max(200).optional(),
  description: z.string().min(5),
  size: z.string().default('L'),
  category: z.string().default('Outerwear'),
  primaryImageUrl: z.string().optional(),
  beforeImageUrl: z.string().optional(),
  afterImageUrl: z.string().optional()
})

export const UpdateProductSchema = CreateProductSchema.partial()

export const PublishProductSchema = z.object({
  primaryImageUrl: z.string().optional()
})

export const PublishDppSchema = z.object({
  notes: z.string().optional()
})



export const RegisterCustomerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  phone: z.string().min(8, 'Nomor telepon minimal 8 karakter').optional(),
  address: z.string().min(5, 'Alamat minimal 5 karakter').optional(),
  city: z.string().optional()
})

export const UpdateCustomerProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(8).optional(),
  address: z.string().min(5).optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  deliveryNotes: z.string().optional()
})

export const CreateCustomerOrderSchema = z.object({
  catalogItemId: z.string().uuid(),
  quantity: z.number().int().positive().default(1),
  shippingAddress: z.string().min(5),
  customerNotes: z.string().optional()
})

export const SubmitPaymentProofSchema = z.object({
  paymentProofUrl: UploadedFileRef,
  amount: z.number().positive(),
  paymentMethod: z.string().default('bank_transfer')
})

// Admin-only decision on a submitted payment proof. User can NEVER self-verify.
export const VerifyPaymentSchema = z.object({
  approve: z.boolean().optional(),
  decision: z.enum(['approved', 'rejected']).optional(),
  rejectionReason: z.string().optional(),
  notes: z.string().optional()
}).superRefine((data, ctx) => {
  const isRejected = data.decision === 'rejected' || data.approve === false
  if (isRejected && !data.rejectionReason && !data.notes) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Alasan penolakan wajib diisi', path: ['rejectionReason'] })
  }
})


// Standard API Response Format
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: Record<string, any>
}
