-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'PRO', 'PREMIUM');

-- CreateEnum
CREATE TYPE "userRole" AS ENUM ('BASIC', 'PRO', 'PREMIUM', 'ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'EXPIRED', 'PAST_DUE', 'PENDING');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('BEGINER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "VariantType" AS ENUM ('DAYS', 'MONTHS', 'YEARS');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('PRO_MONTHLY', 'PRO_YEARLY', 'PREMIUM_MONTHLY', 'PREMIUM_YEARLY');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('TUTORIAL', 'CHALLENGE', 'ASSESSMENT', 'CAPSTONE');

-- CreateEnum
CREATE TYPE "ProjectStepType" AS ENUM ('INSTRUCTION', 'QUIZ', 'VALIDATION', 'REFLECTION', 'CHECKPOINT');

-- CreateEnum
CREATE TYPE "GuidanceMode" AS ENUM ('INDEPENDENT', 'SOME_GUIDANCE', 'STEP_BY_STEP');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "AchievementType" AS ENUM ('FIRST_PROJECT', 'SPEED_COMPLETION', 'PERFECT_SCORE', 'DOCUMENTATION_MASTER', 'STREAK', 'CATEGORY_EXPERT');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "userRole" DEFAULT 'BASIC',
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
    "providers" TEXT[] DEFAULT ARRAY[]::TEXT[],
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
    "billingPortalUrl" TEXT,
    "updatePaymentMethodUrl" TEXT,

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

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'BEGINER',
    "estimatedTime" INTEGER NOT NULL,
    "estimatedCost" INTEGER NOT NULL DEFAULT 0,
    "thumbnailUrl" TEXT,
    "videoUrl" TEXT,
    "prerequisites" TEXT[],
    "learningObjectives" TEXT[],
    "keyTechnologies" TEXT[],
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "projectType" "ProjectType" NOT NULL DEFAULT 'TUTORIAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectCategoryAssignment" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "projectCategoryId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectCategoryAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectStep" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instructions" TEXT NOT NULL,
    "expectedOutput" TEXT,
    "validationCriteria" TEXT[],
    "mediaUrls" TEXT[],
    "estimatedTime" INTEGER NOT NULL,
    "stepType" "ProjectStepType" NOT NULL DEFAULT 'INSTRUCTION',
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "completedSteps" INTEGER[],
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "guidanceMode" "GuidanceMode" NOT NULL DEFAULT 'SOME_GUIDANCE',
    "generatedDocumentation" TEXT,
    "certificateUrl" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectStepResponse" (
    "id" TEXT NOT NULL,
    "progressId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "hintsUsed" INTEGER NOT NULL DEFAULT 0,
    "validationPassed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectStepResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectAchievement" (
    "id" TEXT NOT NULL,
    "progressId" TEXT NOT NULL,
    "type" "AchievementType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconUrl" TEXT,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectDraft" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "draftData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectDraft_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE INDEX "Project_difficulty_idx" ON "Project"("difficulty");

-- CreateIndex
CREATE INDEX "Project_isPremium_idx" ON "Project"("isPremium");

-- CreateIndex
CREATE INDEX "Project_isPublished_idx" ON "Project"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectCategory_name_key" ON "ProjectCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectCategory_slug_key" ON "ProjectCategory"("slug");

-- CreateIndex
CREATE INDEX "ProjectCategory_slug_idx" ON "ProjectCategory"("slug");

-- CreateIndex
CREATE INDEX "ProjectCategoryAssignment_projectId_idx" ON "ProjectCategoryAssignment"("projectId");

-- CreateIndex
CREATE INDEX "ProjectCategoryAssignment_projectCategoryId_idx" ON "ProjectCategoryAssignment"("projectCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectCategoryAssignment_projectId_projectCategoryId_key" ON "ProjectCategoryAssignment"("projectId", "projectCategoryId");

-- CreateIndex
CREATE INDEX "ProjectStep_projectId_idx" ON "ProjectStep"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectStep_projectId_stepNumber_key" ON "ProjectStep"("projectId", "stepNumber");

-- CreateIndex
CREATE INDEX "ProjectProgress_userId_idx" ON "ProjectProgress"("userId");

-- CreateIndex
CREATE INDEX "ProjectProgress_projectId_idx" ON "ProjectProgress"("projectId");

-- CreateIndex
CREATE INDEX "ProjectProgress_status_idx" ON "ProjectProgress"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectProgress_userId_projectId_key" ON "ProjectProgress"("userId", "projectId");

-- CreateIndex
CREATE INDEX "ProjectStepResponse_progressId_idx" ON "ProjectStepResponse"("progressId");

-- CreateIndex
CREATE INDEX "ProjectStepResponse_stepId_idx" ON "ProjectStepResponse"("stepId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectStepResponse_progressId_stepId_key" ON "ProjectStepResponse"("progressId", "stepId");

-- CreateIndex
CREATE INDEX "ProjectAchievement_progressId_idx" ON "ProjectAchievement"("progressId");

-- CreateIndex
CREATE INDEX "ProjectAchievement_type_idx" ON "ProjectAchievement"("type");

-- CreateIndex
CREATE INDEX "ProjectDraft_userId_idx" ON "ProjectDraft"("userId");

-- CreateIndex
CREATE INDEX "ProjectDraft_updatedAt_idx" ON "ProjectDraft"("updatedAt");

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

-- AddForeignKey
ALTER TABLE "ProjectCategoryAssignment" ADD CONSTRAINT "ProjectCategoryAssignment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectCategoryAssignment" ADD CONSTRAINT "ProjectCategoryAssignment_projectCategoryId_fkey" FOREIGN KEY ("projectCategoryId") REFERENCES "ProjectCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStep" ADD CONSTRAINT "ProjectStep_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectProgress" ADD CONSTRAINT "ProjectProgress_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectProgress" ADD CONSTRAINT "ProjectProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStepResponse" ADD CONSTRAINT "ProjectStepResponse_progressId_fkey" FOREIGN KEY ("progressId") REFERENCES "ProjectProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectStepResponse" ADD CONSTRAINT "ProjectStepResponse_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "ProjectStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAchievement" ADD CONSTRAINT "ProjectAchievement_progressId_fkey" FOREIGN KEY ("progressId") REFERENCES "ProjectProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectDraft" ADD CONSTRAINT "ProjectDraft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
