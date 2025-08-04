/*
  Warnings:

  - You are about to drop the column `companySize` on the `UserOnboarding` table. All the data in the column will be lost.
  - You are about to drop the column `companyType` on the `UserOnboarding` table. All the data in the column will be lost.
  - You are about to drop the column `goals` on the `UserOnboarding` table. All the data in the column will be lost.
  - You are about to drop the column `preferredCertifications` on the `UserOnboarding` table. All the data in the column will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Purchase` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `experience` on table `UserOnboarding` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "VariantType" AS ENUM ('DAYS', 'MONTHS', 'YEARS');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('PRO_MONTHLY', 'PRO_YEARLY', 'PREMIUM_MONTHLY', 'PREMIUM_YEARLY');

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_userId_fkey";

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "isNew" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "UserOnboarding" DROP COLUMN "companySize",
DROP COLUMN "companyType",
DROP COLUMN "goals",
DROP COLUMN "preferredCertifications",
ADD COLUMN     "certifications" TEXT[],
ADD COLUMN     "focusArea" TEXT[],
ADD COLUMN     "platforms" TEXT[],
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'OTHER',
ALTER COLUMN "experience" SET NOT NULL;

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "Purchase";

-- CreateTable
CREATE TABLE "LsSubscriptionPlan" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "features" TEXT[],
    "individual" BOOLEAN NOT NULL DEFAULT false,
    "team" BOOLEAN NOT NULL DEFAULT false,
    "variantId" INTEGER NOT NULL,
    "variantType" "VariantType" DEFAULT 'MONTHS',
    "price" TEXT NOT NULL,
    "isUsageBased" BOOLEAN NOT NULL DEFAULT false,
    "interval" TEXT,
    "intervalCount" INTEGER,
    "trialInterval" TEXT,
    "trialIntervalCount" INTEGER,

    CONSTRAINT "LsSubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LsUserSubscription" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lemonSqueezyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "orderId" INTEGER NOT NULL,
    "subscriptionItemId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "statusFormatted" TEXT NOT NULL,
    "renewsAt" TEXT NOT NULL,
    "endsAt" TEXT,
    "trialEndsAt" TEXT,
    "price" TEXT NOT NULL,
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "isUsageBased" BOOLEAN NOT NULL,

    CONSTRAINT "LsUserSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LsWebhookEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventName" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "body" JSONB NOT NULL,
    "processingError" TEXT,

    CONSTRAINT "LsWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessedCronJobUser" (
    "jobId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessedCronJobUser_pkey" PRIMARY KEY ("jobId")
);

-- CreateIndex
CREATE UNIQUE INDEX "LsSubscriptionPlan_variantId_key" ON "LsSubscriptionPlan"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "LsUserSubscription_lemonSqueezyId_key" ON "LsUserSubscription"("lemonSqueezyId");

-- CreateIndex
CREATE INDEX "ProcessedCronJobUser_processedAt_idx" ON "ProcessedCronJobUser"("processedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedCronJobUser_jobId_userId_key" ON "ProcessedCronJobUser"("jobId", "userId");

-- AddForeignKey
ALTER TABLE "LsUserSubscription" ADD CONSTRAINT "LsUserSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LsUserSubscription" ADD CONSTRAINT "LsUserSubscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "LsSubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
