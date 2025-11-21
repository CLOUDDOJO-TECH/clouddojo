-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('QUEUED', 'SENDING', 'SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED', 'FAILED');

-- CreateEnum
CREATE TYPE "EmailCategory" AS ENUM ('TRANSACTIONAL', 'ONBOARDING', 'ENGAGEMENT', 'RETENTION', 'MARKETING', 'LIFECYCLE');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'CANCELLED', 'FAILED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resendContactId" TEXT;

-- CreateTable
CREATE TABLE "QuizAnalysis" (
    "id" TEXT NOT NULL,
    "quizAttemptId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryScores" JSONB,
    "timeEfficiency" TEXT,
    "difficultyTrend" TEXT,
    "strengths" JSONB,
    "weaknesses" JSONB,
    "recommendations" JSONB,
    "topicMastery" JSONB,
    "insights" TEXT,
    "quizScore" DOUBLE PRECISION,
    "processingTimeMs" INTEGER,
    "error" TEXT,

    CONSTRAINT "QuizAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardAnalysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "overallScore" DOUBLE PRECISION,
    "totalQuizzesTaken" INTEGER,
    "averageTimePerQuiz" INTEGER,
    "categoryBreakdown" JSONB,
    "recentTrend" TEXT,
    "consistencyScore" INTEGER,
    "certificationReadiness" DOUBLE PRECISION,
    "topStrengths" JSONB,
    "topWeaknesses" JSONB,
    "trendingUp" JSONB,
    "trendingDown" JSONB,
    "studyPlan" JSONB,
    "estimatedReadyDate" TIMESTAMP(3),
    "percentileRank" DOUBLE PRECISION,
    "learningVelocity" TEXT,
    "lastQuizAnalyzed" TEXT,
    "nextUpdateAt" TIMESTAMP(3),

    CONSTRAINT "DashboardAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicMastery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "masteryScore" DOUBLE PRECISION NOT NULL,
    "questionsAnswered" INTEGER NOT NULL,
    "lastPracticed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trend" TEXT NOT NULL,

    CONSTRAINT "TopicMastery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStreak" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "streakFreezes" INTEGER NOT NULL DEFAULT 0,
    "streakData" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStreak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyActivity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "questionsAnswered" INTEGER NOT NULL DEFAULT 0,
    "quizzesTaken" INTEGER NOT NULL DEFAULT 0,
    "flashcardsStudied" INTEGER NOT NULL DEFAULT 0,
    "minutesSpent" INTEGER NOT NULL DEFAULT 0,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserXP" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalXP" INTEGER NOT NULL DEFAULT 0,
    "currentLevel" INTEGER NOT NULL DEFAULT 1,
    "xpToNextLevel" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserXP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XPTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "XPTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "requirement" JSONB NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progress" INTEGER,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaderboardEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaderboardEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGamificationSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dailyXPGoal" INTEGER NOT NULL DEFAULT 100,
    "showOnLeaderboard" BOOLEAN NOT NULL DEFAULT true,
    "streakReminders" BOOLEAN NOT NULL DEFAULT true,
    "achievementNotifications" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserGamificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "marketingEmails" BOOLEAN NOT NULL DEFAULT true,
    "productUpdates" BOOLEAN NOT NULL DEFAULT true,
    "weeklyProgressReport" BOOLEAN NOT NULL DEFAULT true,
    "aiAnalysisNotifs" BOOLEAN NOT NULL DEFAULT true,
    "milestoneEmails" BOOLEAN NOT NULL DEFAULT true,
    "featureUpdates" BOOLEAN NOT NULL DEFAULT true,
    "unsubscribedAll" BOOLEAN NOT NULL DEFAULT false,
    "unsubscribedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "emailType" TEXT NOT NULL,
    "templateId" TEXT,
    "to" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "status" "EmailStatus" NOT NULL DEFAULT 'QUEUED',
    "resendId" TEXT,
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),
    "bouncedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "subject" TEXT NOT NULL,
    "componentPath" TEXT NOT NULL,
    "category" "EmailCategory" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "variables" JSONB,
    "previewText" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSegment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "segmentType" TEXT NOT NULL,
    "segmentValue" TEXT NOT NULL,
    "resendAudienceId" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removedAt" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "UserSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailCampaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "templateId" TEXT NOT NULL,
    "targetSegments" JSONB NOT NULL,
    "scheduledFor" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "totalRecipients" INTEGER NOT NULL DEFAULT 0,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "deliveredCount" INTEGER NOT NULL DEFAULT 0,
    "openCount" INTEGER NOT NULL DEFAULT 0,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "bounceCount" INTEGER NOT NULL DEFAULT 0,
    "failCount" INTEGER NOT NULL DEFAULT 0,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailEvent" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventData" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuizAnalysis_quizAttemptId_key" ON "QuizAnalysis"("quizAttemptId");

-- CreateIndex
CREATE INDEX "QuizAnalysis_userId_generatedAt_idx" ON "QuizAnalysis"("userId", "generatedAt");

-- CreateIndex
CREATE INDEX "QuizAnalysis_status_idx" ON "QuizAnalysis"("status");

-- CreateIndex
CREATE UNIQUE INDEX "DashboardAnalysis_userId_key" ON "DashboardAnalysis"("userId");

-- CreateIndex
CREATE INDEX "DashboardAnalysis_lastUpdatedAt_idx" ON "DashboardAnalysis"("lastUpdatedAt");

-- CreateIndex
CREATE INDEX "TopicMastery_userId_masteryScore_idx" ON "TopicMastery"("userId", "masteryScore");

-- CreateIndex
CREATE UNIQUE INDEX "TopicMastery_userId_topic_key" ON "TopicMastery"("userId", "topic");

-- CreateIndex
CREATE UNIQUE INDEX "UserStreak_userId_key" ON "UserStreak"("userId");

-- CreateIndex
CREATE INDEX "UserStreak_userId_idx" ON "UserStreak"("userId");

-- CreateIndex
CREATE INDEX "DailyActivity_userId_date_idx" ON "DailyActivity"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyActivity_userId_date_key" ON "DailyActivity"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "UserXP_userId_key" ON "UserXP"("userId");

-- CreateIndex
CREATE INDEX "UserXP_userId_idx" ON "UserXP"("userId");

-- CreateIndex
CREATE INDEX "XPTransaction_userId_createdAt_idx" ON "XPTransaction"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_name_key" ON "Badge"("name");

-- CreateIndex
CREATE INDEX "Badge_category_idx" ON "Badge"("category");

-- CreateIndex
CREATE INDEX "UserBadge_userId_idx" ON "UserBadge"("userId");

-- CreateIndex
CREATE INDEX "UserBadge_badgeId_idx" ON "UserBadge"("badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBadge_userId_badgeId_key" ON "UserBadge"("userId", "badgeId");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_type_period_score_idx" ON "LeaderboardEntry"("type", "period", "score");

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_userId_type_period_key" ON "LeaderboardEntry"("userId", "type", "period");

-- CreateIndex
CREATE UNIQUE INDEX "UserGamificationSettings_userId_key" ON "UserGamificationSettings"("userId");

-- CreateIndex
CREATE INDEX "UserGamificationSettings_userId_idx" ON "UserGamificationSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailPreferences_userId_key" ON "EmailPreferences"("userId");

-- CreateIndex
CREATE INDEX "EmailPreferences_userId_idx" ON "EmailPreferences"("userId");

-- CreateIndex
CREATE INDEX "EmailLog_userId_idx" ON "EmailLog"("userId");

-- CreateIndex
CREATE INDEX "EmailLog_emailType_idx" ON "EmailLog"("emailType");

-- CreateIndex
CREATE INDEX "EmailLog_status_idx" ON "EmailLog"("status");

-- CreateIndex
CREATE INDEX "EmailLog_createdAt_idx" ON "EmailLog"("createdAt");

-- CreateIndex
CREATE INDEX "EmailLog_resendId_idx" ON "EmailLog"("resendId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplate_name_key" ON "EmailTemplate"("name");

-- CreateIndex
CREATE INDEX "EmailTemplate_category_idx" ON "EmailTemplate"("category");

-- CreateIndex
CREATE INDEX "EmailTemplate_isActive_idx" ON "EmailTemplate"("isActive");

-- CreateIndex
CREATE INDEX "UserSegment_segmentType_idx" ON "UserSegment"("segmentType");

-- CreateIndex
CREATE INDEX "UserSegment_segmentValue_idx" ON "UserSegment"("segmentValue");

-- CreateIndex
CREATE INDEX "UserSegment_userId_idx" ON "UserSegment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSegment_userId_segmentType_segmentValue_key" ON "UserSegment"("userId", "segmentType", "segmentValue");

-- CreateIndex
CREATE INDEX "EmailCampaign_status_idx" ON "EmailCampaign"("status");

-- CreateIndex
CREATE INDEX "EmailCampaign_scheduledFor_idx" ON "EmailCampaign"("scheduledFor");

-- CreateIndex
CREATE INDEX "EmailCampaign_createdAt_idx" ON "EmailCampaign"("createdAt");

-- CreateIndex
CREATE INDEX "EmailEvent_eventType_processed_idx" ON "EmailEvent"("eventType", "processed");

-- CreateIndex
CREATE INDEX "EmailEvent_userId_idx" ON "EmailEvent"("userId");

-- CreateIndex
CREATE INDEX "EmailEvent_createdAt_idx" ON "EmailEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "QuizAnalysis" ADD CONSTRAINT "QuizAnalysis_quizAttemptId_fkey" FOREIGN KEY ("quizAttemptId") REFERENCES "QuizAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAnalysis" ADD CONSTRAINT "QuizAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DashboardAnalysis" ADD CONSTRAINT "DashboardAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicMastery" ADD CONSTRAINT "TopicMastery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStreak" ADD CONSTRAINT "UserStreak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyActivity" ADD CONSTRAINT "DailyActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserXP" ADD CONSTRAINT "UserXP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XPTransaction" ADD CONSTRAINT "XPTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderboardEntry" ADD CONSTRAINT "LeaderboardEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGamificationSettings" ADD CONSTRAINT "UserGamificationSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailPreferences" ADD CONSTRAINT "EmailPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSegment" ADD CONSTRAINT "UserSegment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
