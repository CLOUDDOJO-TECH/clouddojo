-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'PRO', 'PREMIUM');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'EXPIRED', 'PAST_DUE', 'PENDING');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('BEGINER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "VariantType" AS ENUM ('DAYS', 'MONTHS', 'YEARS');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('PRO_MONTHLY', 'PRO_YEARLY', 'PREMIUM_MONTHLY', 'PREMIUM_YEARLY');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hasCompletedOnboarding" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserOnboarding" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "platforms" TEXT[],
    "certifications" TEXT[],
    "role" TEXT NOT NULL DEFAULT 'OTHER',
    "focusArea" TEXT[],
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserOnboarding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT,
    "duration" INTEGER,
    "free" BOOLEAN,
    "level" "DifficultyLevel" DEFAULT 'BEGINER',
    "thumbnail" TEXT,
    "isNew" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "isMultiSelect" BOOLEAN NOT NULL DEFAULT false,
    "correctAnswer" TEXT[],
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" TEXT,
    "difficultyLevel" TEXT,
    "awsService" TEXT,
    "content" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flashcard" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT,

    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3),
    "timeTaken" INTEGER,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "percentageScore" DOUBLE PRECISION NOT NULL,
    "timeSpentSecs" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "categoryId" TEXT,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionAttempt" (
    "id" TEXT NOT NULL,
    "quizAttemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "userAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "timeSpentSecs" INTEGER NOT NULL,
    "categoryId" TEXT,
    "difficultyLevel" TEXT NOT NULL,
    "awsService" TEXT,

    CONSTRAINT "QuestionAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "QuestionOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIAnalysisReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reportData" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastRequestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latest" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AIAnalysisReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessedCronJobUser" (
    "jobId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessedCronJobUser_pkey" PRIMARY KEY ("jobId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_firstName_key" ON "User"("firstName");

-- CreateIndex
CREATE UNIQUE INDEX "UserOnboarding_userId_key" ON "UserOnboarding"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LsSubscriptionPlan_variantId_key" ON "LsSubscriptionPlan"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "LsUserSubscription_lemonSqueezyId_key" ON "LsUserSubscription"("lemonSqueezyId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "QuizAttempt_userId_idx" ON "QuizAttempt"("userId");

-- CreateIndex
CREATE INDEX "QuizAttempt_quizId_idx" ON "QuizAttempt"("quizId");

-- CreateIndex
CREATE INDEX "QuizAttempt_categoryId_idx" ON "QuizAttempt"("categoryId");

-- CreateIndex
CREATE INDEX "QuestionAttempt_quizAttemptId_idx" ON "QuestionAttempt"("quizAttemptId");

-- CreateIndex
CREATE INDEX "QuestionAttempt_questionId_idx" ON "QuestionAttempt"("questionId");

-- CreateIndex
CREATE INDEX "QuestionAttempt_categoryId_idx" ON "QuestionAttempt"("categoryId");

-- CreateIndex
CREATE INDEX "QuestionOption_questionId_idx" ON "QuestionOption"("questionId");

-- CreateIndex
CREATE INDEX "AIAnalysisReport_userId_idx" ON "AIAnalysisReport"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AIAnalysisReport_userId_latest_key" ON "AIAnalysisReport"("userId", "latest");

-- CreateIndex
CREATE INDEX "ProcessedCronJobUser_processedAt_idx" ON "ProcessedCronJobUser"("processedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedCronJobUser_jobId_userId_key" ON "ProcessedCronJobUser"("jobId", "userId");

-- AddForeignKey
ALTER TABLE "UserOnboarding" ADD CONSTRAINT "UserOnboarding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LsUserSubscription" ADD CONSTRAINT "LsUserSubscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "LsSubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LsUserSubscription" ADD CONSTRAINT "LsUserSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAttempt" ADD CONSTRAINT "QuestionAttempt_quizAttemptId_fkey" FOREIGN KEY ("quizAttemptId") REFERENCES "QuizAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOption" ADD CONSTRAINT "QuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIAnalysisReport" ADD CONSTRAINT "AIAnalysisReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
