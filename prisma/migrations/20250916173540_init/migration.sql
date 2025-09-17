-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('CLAIMANT', 'OFFICIAL', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."ClaimType" AS ENUM ('INDIVIDUAL', 'COMMUNITY', 'TRADITIONAL');

-- CreateEnum
CREATE TYPE "public"."ClaimStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PENDING_DOCUMENTS');

-- CreateEnum
CREATE TYPE "public"."DocumentStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."WorkflowStage" AS ENUM ('INITIAL_REVIEW', 'FIELD_VERIFICATION', 'LEGAL_REVIEW', 'FINAL_DECISION');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'CLAIMANT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phone" TEXT,
    "avatar" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."forest_rights_claims" (
    "id" TEXT NOT NULL,
    "claimNumber" TEXT NOT NULL,
    "claimantName" TEXT NOT NULL,
    "villageName" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "forestAreaHectares" DOUBLE PRECISION NOT NULL,
    "claimType" "public"."ClaimType" NOT NULL,
    "status" "public"."ClaimStatus" NOT NULL DEFAULT 'SUBMITTED',
    "submissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "actualCompletionDate" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "forest_rights_claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."claim_documents" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ocrText" TEXT,
    "extractedEntities" JSONB,
    "verificationStatus" "public"."DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "claimId" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,

    CONSTRAINT "claim_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."spatial_boundaries" (
    "id" TEXT NOT NULL,
    "boundaryType" TEXT NOT NULL,
    "geoJsonData" JSONB NOT NULL,
    "area" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimId" TEXT NOT NULL,

    CONSTRAINT "spatial_boundaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."claim_workflow" (
    "id" TEXT NOT NULL,
    "stage" "public"."WorkflowStage" NOT NULL,
    "status" TEXT NOT NULL,
    "comments" TEXT,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimId" TEXT NOT NULL,
    "officialId" TEXT NOT NULL,

    CONSTRAINT "claim_workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."decision_factors" (
    "id" TEXT NOT NULL,
    "factorType" TEXT NOT NULL,
    "factorValue" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "reasoning" TEXT,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimId" TEXT NOT NULL,

    CONSTRAINT "decision_factors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blockchain_records" (
    "id" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "blockNumber" INTEGER,
    "eventType" TEXT NOT NULL,
    "eventData" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimId" TEXT NOT NULL,

    CONSTRAINT "blockchain_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_trail" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "tableName" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "claimId" TEXT,

    CONSTRAINT "audit_trail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "public"."user_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "forest_rights_claims_claimNumber_key" ON "public"."forest_rights_claims"("claimNumber");

-- CreateIndex
CREATE UNIQUE INDEX "blockchain_records_transactionHash_key" ON "public"."blockchain_records"("transactionHash");

-- AddForeignKey
ALTER TABLE "public"."user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."forest_rights_claims" ADD CONSTRAINT "forest_rights_claims_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."claim_documents" ADD CONSTRAINT "claim_documents_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "public"."forest_rights_claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."claim_documents" ADD CONSTRAINT "claim_documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."spatial_boundaries" ADD CONSTRAINT "spatial_boundaries_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "public"."forest_rights_claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."claim_workflow" ADD CONSTRAINT "claim_workflow_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "public"."forest_rights_claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."claim_workflow" ADD CONSTRAINT "claim_workflow_officialId_fkey" FOREIGN KEY ("officialId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."decision_factors" ADD CONSTRAINT "decision_factors_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "public"."forest_rights_claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blockchain_records" ADD CONSTRAINT "blockchain_records_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "public"."forest_rights_claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_trail" ADD CONSTRAINT "audit_trail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_trail" ADD CONSTRAINT "audit_trail_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "public"."forest_rights_claims"("id") ON DELETE SET NULL ON UPDATE CASCADE;
