-- CreateEnum
CREATE TYPE "MitraVerificationStatus" AS ENUM ('pending_verification', 'approved', 'rejected', 'suspended');

-- AlterTable
ALTER TABLE "dpp_versions" ADD COLUMN     "createdByUserId" TEXT,
ADD COLUMN     "metadataHash" TEXT,
ADD COLUMN     "publicationStatus" TEXT NOT NULL DEFAULT 'published';

-- AlterTable
ALTER TABLE "material_batches" ADD COLUMN     "usableWeightKg" DOUBLE PRECISION,
ALTER COLUMN "status" SET DEFAULT 'ready_for_kit';

-- AlterTable
ALTER TABLE "material_sources" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "sourceType" TEXT DEFAULT 'waste_bank',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "mitra_profiles" ADD COLUMN     "verificationNotes" TEXT,
ADD COLUMN     "verificationStatus" "MitraVerificationStatus" NOT NULL DEFAULT 'pending_verification',
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedByUserId" TEXT;

-- AlterTable
ALTER TABLE "patterns" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "approvalStatus" TEXT NOT NULL DEFAULT 'approved',
ADD COLUMN     "difficultyLevel" TEXT NOT NULL DEFAULT 'Medium',
ADD COLUMN     "estimatedMinutes" DOUBLE PRECISION NOT NULL DEFAULT 300.0;

-- AlterTable
ALTER TABLE "payouts" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "eligibleAt" TIMESTAMP(3),
ADD COLUMN     "mitraUserId" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paidByUserId" TEXT,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "payoutCode" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "production_orders" ADD COLUMN     "assignedAt" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'normal';

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "primaryImageUrl" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "qc_reviews" ADD COLUMN     "checkCleanliness" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "checkDimensions" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "checkMaterial" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "checkQuantity" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "decision" TEXT NOT NULL DEFAULT 'approved',
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "revisionInstructions" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "accountStatus" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "passwordChangedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "admin_invitations" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "invitedByUserId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_issues" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "issueType" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "description" TEXT NOT NULL,
    "requestedAction" TEXT,
    "evidenceUrl" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolutionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "production_issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dpp_blockchain_anchors" (
    "id" TEXT NOT NULL,
    "dppRecordId" TEXT NOT NULL,
    "dppVersionId" TEXT NOT NULL,
    "network" TEXT NOT NULL DEFAULT 'polygon_amoy',
    "chainId" INTEGER NOT NULL DEFAULT 80002,
    "contractAddress" TEXT NOT NULL,
    "dppKey" TEXT NOT NULL,
    "versionNum" INTEGER NOT NULL,
    "metadataHash" TEXT NOT NULL,
    "canonicalizationVersion" TEXT NOT NULL DEFAULT 'ecothread-dpp-c14n-v1',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "transactionHash" TEXT,
    "blockNumber" INTEGER,
    "blockHash" TEXT,
    "blockTimestamp" TIMESTAMP(3),
    "issuerAddress" TEXT,
    "submittedAt" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),
    "lastCheckedAt" TIMESTAMP(3),
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "failureCode" TEXT,
    "failureMessage" TEXT,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dpp_blockchain_anchors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_invitations_tokenHash_key" ON "admin_invitations"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_tokenHash_key" ON "password_reset_tokens"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "dpp_blockchain_anchors_dppVersionId_network_key" ON "dpp_blockchain_anchors"("dppVersionId", "network");

-- CreateIndex
CREATE UNIQUE INDEX "dpp_blockchain_anchors_chainId_contractAddress_dppKey_versi_key" ON "dpp_blockchain_anchors"("chainId", "contractAddress", "dppKey", "versionNum");

-- CreateIndex
CREATE UNIQUE INDEX "payouts_payoutCode_key" ON "payouts"("payoutCode");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- AddForeignKey
ALTER TABLE "admin_invitations" ADD CONSTRAINT "admin_invitations_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_issues" ADD CONSTRAINT "production_issues_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "production_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_mitraUserId_fkey" FOREIGN KEY ("mitraUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_paidByUserId_fkey" FOREIGN KEY ("paidByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dpp_versions" ADD CONSTRAINT "dpp_versions_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dpp_blockchain_anchors" ADD CONSTRAINT "dpp_blockchain_anchors_dppRecordId_fkey" FOREIGN KEY ("dppRecordId") REFERENCES "dpp_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dpp_blockchain_anchors" ADD CONSTRAINT "dpp_blockchain_anchors_dppVersionId_fkey" FOREIGN KEY ("dppVersionId") REFERENCES "dpp_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dpp_blockchain_anchors" ADD CONSTRAINT "dpp_blockchain_anchors_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
