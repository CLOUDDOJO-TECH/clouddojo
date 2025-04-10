-- DropForeignKey
ALTER TABLE "QuestionAttempt" DROP CONSTRAINT "QuestionAttempt_categoryId_fkey";

-- AlterTable
ALTER TABLE "QuizAttempt" ADD COLUMN     "categoryId" TEXT;

-- CreateTable
CREATE TABLE "AIAnalysisReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reportData" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastRequestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIAnalysisReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIAnalysisReport_userId_idx" ON "AIAnalysisReport"("userId");

-- CreateIndex
CREATE INDEX "QuizAttempt_categoryId_idx" ON "QuizAttempt"("categoryId");

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIAnalysisReport" ADD CONSTRAINT "AIAnalysisReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
