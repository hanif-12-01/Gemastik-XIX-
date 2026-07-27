-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'mitra', 'user');

-- CreateEnum
CREATE TYPE "DataOrigin" AS ENUM ('demo', 'actual', 'target');

-- CreateEnum
CREATE TYPE "ProductionOrderStatus" AS ENUM ('draft', 'offered', 'accepted', 'rejected_by_mitra', 'kit_preparing', 'kit_shipped', 'kit_received', 'in_progress', 'submitted_to_qc', 'qc_revision', 'qc_approved', 'payout_pending', 'paid', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('pending', 'approved', 'processing', 'paid', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "DppVerificationState" AS ENUM ('database_verified', 'anchoring_pending', 'blockchain_verified', 'anchoring_failed');

-- CreateEnum
CREATE TYPE "CustomerOrderStatus" AS ENUM ('pending_payment', 'payment_proof_submitted', 'payment_verified', 'payment_rejected', 'processing', 'shipped', 'delivered', 'cancelled');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dataOrigin" "DataOrigin" NOT NULL DEFAULT 'demo',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "avatarUrl" TEXT,
    "preferences" TEXT,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mitra_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workshopName" TEXT NOT NULL,
    "specialization" TEXT,
    "capacityPerWeek" INTEGER NOT NULL DEFAULT 10,
    "location" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "totalPaidOut" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "bankAccountInfo" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "dataOrigin" "DataOrigin" NOT NULL DEFAULT 'demo',

    CONSTRAINT "mitra_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_sources" (
    "id" TEXT NOT NULL,
    "sourceCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "contact" TEXT,
    "dataOrigin" "DataOrigin" NOT NULL DEFAULT 'demo',

    CONSTRAINT "material_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_batches" (
    "id" TEXT NOT NULL,
    "batchCode" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "materialType" TEXT NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "color" TEXT,
    "sortingDetails" TEXT,
    "imageUrl" TEXT,
    "sanitizationDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'sorted',
    "dataOrigin" "DataOrigin" NOT NULL DEFAULT 'demo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "material_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sanitization_records" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "temperatureC" DOUBLE PRECISION,
    "operator" TEXT NOT NULL,
    "sanitizedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "passedInspection" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,

    CONSTRAINT "sanitization_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patterns" (
    "id" TEXT NOT NULL,
    "patternCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "dataOrigin" "DataOrigin" NOT NULL DEFAULT 'demo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pattern_versions" (
    "id" TEXT NOT NULL,
    "patternId" TEXT NOT NULL,
    "versionCode" TEXT NOT NULL DEFAULT 'v1.0',
    "fileUrl" TEXT,
    "instructions" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pattern_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eco_kits" (
    "id" TEXT NOT NULL,
    "kitCode" TEXT NOT NULL,
    "patternId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'Medium',
    "targetHours" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "status" TEXT NOT NULL DEFAULT 'ready',
    "dataOrigin" "DataOrigin" NOT NULL DEFAULT 'demo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eco_kits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eco_kit_items" (
    "id" TEXT NOT NULL,
    "kitId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'kg',
    "itemNotes" TEXT,

    CONSTRAINT "eco_kit_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_orders" (
    "id" TEXT NOT NULL,
    "orderCode" TEXT NOT NULL,
    "ecoKitId" TEXT NOT NULL,
    "mitraUserId" TEXT,
    "status" "ProductionOrderStatus" NOT NULL DEFAULT 'draft',
    "targetCompletion" TIMESTAMP(3),
    "agreedPayoutRate" DOUBLE PRECISION NOT NULL DEFAULT 150000.0,
    "rejectionReason" TEXT,
    "dataOrigin" "DataOrigin" NOT NULL DEFAULT 'demo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "production_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_progress" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "stepName" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "notes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "production_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_evidence" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "frontPhoto" TEXT NOT NULL,
    "backPhoto" TEXT NOT NULL,
    "detailPhoto" TEXT NOT NULL,
    "notes" TEXT,
    "actualSize" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "production_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qc_reviews" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL,
    "decisionNotes" TEXT NOT NULL,
    "checkFront" BOOLEAN NOT NULL DEFAULT true,
    "checkBack" BOOLEAN NOT NULL DEFAULT true,
    "checkStitching" BOOLEAN NOT NULL DEFAULT true,
    "checkMeasures" BOOLEAN NOT NULL DEFAULT true,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qc_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qc_findings" (
    "id" TEXT NOT NULL,
    "qcReviewId" TEXT NOT NULL,
    "issueType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'minor',

    CONSTRAINT "qc_findings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payouts" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'pending',
    "paymentReference" TEXT,
    "paidAt" TIMESTAMP(3),
    "dataOrigin" "DataOrigin" NOT NULL DEFAULT 'demo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "productCode" TEXT NOT NULL,
    "productionOrderId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "beforeImageUrl" TEXT,
    "afterImageUrl" TEXT,
    "isPublishedDpp" BOOLEAN NOT NULL DEFAULT false,
    "dataOrigin" "DataOrigin" NOT NULL DEFAULT 'demo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_materials" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "product_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dpp_records" (
    "id" TEXT NOT NULL,
    "productCode" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "verificationState" "DppVerificationState" NOT NULL DEFAULT 'database_verified',
    "blockchainTxHash" TEXT,
    "blockchainChainId" INTEGER,
    "explorerUrl" TEXT,
    "qrCodeUrl" TEXT,
    "dataOrigin" "DataOrigin" NOT NULL DEFAULT 'demo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dpp_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dpp_versions" (
    "id" TEXT NOT NULL,
    "dppRecordId" TEXT NOT NULL,
    "versionNum" INTEGER NOT NULL DEFAULT 1,
    "payloadJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dpp_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "impact_records" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "co2SavedKg" DOUBLE PRECISION NOT NULL,
    "waterSavedLiters" DOUBLE PRECISION NOT NULL,
    "landfillDivertedKg" DOUBLE PRECISION NOT NULL,
    "dataOrigin" "DataOrigin" NOT NULL DEFAULT 'demo',

    CONSTRAINT "impact_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog_items" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "depositAmount" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 1,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "dataOrigin" "DataOrigin" NOT NULL DEFAULT 'demo',

    CONSTRAINT "catalog_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_orders" (
    "id" TEXT NOT NULL,
    "orderCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "CustomerOrderStatus" NOT NULL DEFAULT 'pending_payment',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "depositPaid" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "shippingAddress" TEXT NOT NULL,
    "dataOrigin" "DataOrigin" NOT NULL DEFAULT 'demo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_order_items" (
    "id" TEXT NOT NULL,
    "customerOrderId" TEXT NOT NULL,
    "catalogItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "customer_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "customerOrderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentProofUrl" TEXT,
    "paymentMethod" TEXT NOT NULL DEFAULT 'bank_transfer',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "verifiedByUserId" TEXT,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "details" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "payload" TEXT NOT NULL,
    "result" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "mitra_profiles_userId_key" ON "mitra_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "material_sources_sourceCode_key" ON "material_sources"("sourceCode");

-- CreateIndex
CREATE UNIQUE INDEX "material_batches_batchCode_key" ON "material_batches"("batchCode");

-- CreateIndex
CREATE UNIQUE INDEX "patterns_patternCode_key" ON "patterns"("patternCode");

-- CreateIndex
CREATE UNIQUE INDEX "eco_kits_kitCode_key" ON "eco_kits"("kitCode");

-- CreateIndex
CREATE UNIQUE INDEX "production_orders_orderCode_key" ON "production_orders"("orderCode");

-- CreateIndex
CREATE UNIQUE INDEX "products_productCode_key" ON "products"("productCode");

-- CreateIndex
CREATE UNIQUE INDEX "dpp_records_productCode_key" ON "dpp_records"("productCode");

-- CreateIndex
CREATE UNIQUE INDEX "dpp_records_productId_key" ON "dpp_records"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_items_slug_key" ON "catalog_items"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "customer_orders_orderCode_key" ON "customer_orders"("orderCode");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mitra_profiles" ADD CONSTRAINT "mitra_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_batches" ADD CONSTRAINT "material_batches_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "material_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sanitization_records" ADD CONSTRAINT "sanitization_records_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "material_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pattern_versions" ADD CONSTRAINT "pattern_versions_patternId_fkey" FOREIGN KEY ("patternId") REFERENCES "patterns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eco_kits" ADD CONSTRAINT "eco_kits_patternId_fkey" FOREIGN KEY ("patternId") REFERENCES "patterns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eco_kit_items" ADD CONSTRAINT "eco_kit_items_kitId_fkey" FOREIGN KEY ("kitId") REFERENCES "eco_kits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eco_kit_items" ADD CONSTRAINT "eco_kit_items_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "material_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_orders" ADD CONSTRAINT "production_orders_ecoKitId_fkey" FOREIGN KEY ("ecoKitId") REFERENCES "eco_kits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_orders" ADD CONSTRAINT "production_orders_mitraUserId_fkey" FOREIGN KEY ("mitraUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_progress" ADD CONSTRAINT "production_progress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "production_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_evidence" ADD CONSTRAINT "production_evidence_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "production_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qc_reviews" ADD CONSTRAINT "qc_reviews_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "production_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qc_reviews" ADD CONSTRAINT "qc_reviews_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qc_findings" ADD CONSTRAINT "qc_findings_qcReviewId_fkey" FOREIGN KEY ("qcReviewId") REFERENCES "qc_reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "production_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_productionOrderId_fkey" FOREIGN KEY ("productionOrderId") REFERENCES "production_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_materials" ADD CONSTRAINT "product_materials_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_materials" ADD CONSTRAINT "product_materials_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "material_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dpp_records" ADD CONSTRAINT "dpp_records_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dpp_versions" ADD CONSTRAINT "dpp_versions_dppRecordId_fkey" FOREIGN KEY ("dppRecordId") REFERENCES "dpp_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impact_records" ADD CONSTRAINT "impact_records_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_items" ADD CONSTRAINT "catalog_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_orders" ADD CONSTRAINT "customer_orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_order_items" ADD CONSTRAINT "customer_order_items_customerOrderId_fkey" FOREIGN KEY ("customerOrderId") REFERENCES "customer_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_order_items" ADD CONSTRAINT "customer_order_items_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES "catalog_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_customerOrderId_fkey" FOREIGN KEY ("customerOrderId") REFERENCES "customer_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
