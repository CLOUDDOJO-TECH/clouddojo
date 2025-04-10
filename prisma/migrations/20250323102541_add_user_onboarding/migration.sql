/*
  Warnings:

  - You are about to drop the column `quizId` on the `Purchase` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "DifficultyLevel" ADD VALUE 'EXPERT';

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_quizId_fkey";

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "quizId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hasCompletedOnboarding" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "UserOnboarding" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyType" TEXT,
    "companySize" TEXT,
    "goals" TEXT[],
    "preferredCertifications" TEXT[],
    "experience" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserOnboarding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserOnboarding_userId_key" ON "UserOnboarding"("userId");

-- AddForeignKey
ALTER TABLE "UserOnboarding" ADD CONSTRAINT "UserOnboarding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
