/**
 * Auto-Segmentation Service
 *
 * Automatically segments users based on their behavior and attributes.
 * This service should be run daily via a cron job or serverless function.
 *
 * Segmentation Categories:
 * 1. Plan-based: free, pro, premium
 * 2. Lifecycle: new (0-7 days), active (<7 days inactive), inactive (7-30 days), churned (30+ days)
 * 3. Engagement: power_users (50+ quizzes), casual (1-10 quizzes), streak_7 (7+ day streak)
 * 4. Certification: aws_focus, azure_focus, gcp_focus (based on quiz history)
 */

import prisma from "@/lib/prisma";

interface SegmentationResult {
  totalUsersProcessed: number;
  segmentsCreated: number;
  segmentsRemoved: number;
  errors: string[];
  duration: number;
}

export class AutoSegmentationService {
  private startTime: number = 0;
  private errors: string[] = [];
  private segmentsCreated: number = 0;
  private segmentsRemoved: number = 0;

  /**
   * Run auto-segmentation for all users
   */
  async runForAllUsers(): Promise<SegmentationResult> {
    this.startTime = Date.now();
    this.errors = [];
    this.segmentsCreated = 0;
    this.segmentsRemoved = 0;

    try {
      // Get all users (in batches for performance)
      const batchSize = 100;
      let skip = 0;
      let totalUsersProcessed = 0;

      while (true) {
        const users = await prisma.user.findMany({
          skip,
          take: batchSize,
          include: {
            _count: {
              select: {
                quizAttempts: true,
              },
            },
            quizAttempts: {
              take: 100,
              orderBy: { attemptedAt: 'desc' },
              select: {
                quiz: {
                  select: {
                    category: true,
                  },
                },
              },
            },
          },
        });

        if (users.length === 0) break;

        // Process each user
        for (const user of users) {
          try {
            await this.segmentUser(user);
            totalUsersProcessed++;
          } catch (error) {
            this.errors.push(`Error segmenting user ${user.userId}: ${error}`);
          }
        }

        skip += batchSize;

        // Break if we processed fewer users than batch size (last batch)
        if (users.length < batchSize) break;
      }

      const duration = Date.now() - this.startTime;

      return {
        totalUsersProcessed,
        segmentsCreated: this.segmentsCreated,
        segmentsRemoved: this.segmentsRemoved,
        errors: this.errors,
        duration,
      };
    } catch (error) {
      throw new Error(`Auto-segmentation failed: ${error}`);
    }
  }

  /**
   * Run auto-segmentation for a single user
   */
  async runForUser(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { userId },
      include: {
        _count: {
          select: {
            quizAttempts: true,
          },
        },
        quizAttempts: {
          take: 100,
          orderBy: { attemptedAt: 'desc' },
          select: {
            quiz: {
              select: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    await this.segmentUser(user);
  }

  /**
   * Segment a single user based on their attributes
   */
  private async segmentUser(user: any): Promise<void> {
    const segmentsToAdd: Array<{ type: string; value: string }> = [];
    const segmentsToRemove: Array<{ type: string; value: string }> = [];

    // 1. PLAN-BASED SEGMENTATION
    const userPlan = (user.plan || 'FREE').toLowerCase();
    segmentsToAdd.push({ type: 'plan', value: userPlan });

    // Remove old plan segments
    ['free', 'pro', 'premium'].forEach((plan) => {
      if (plan !== userPlan) {
        segmentsToRemove.push({ type: 'plan', value: plan });
      }
    });

    // 2. LIFECYCLE SEGMENTATION
    const now = new Date();
    const daysSinceCreated = user.createdAt
      ? Math.floor((now.getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 999;
    const daysSinceActive = user.lastActivityAt
      ? Math.floor((now.getTime() - new Date(user.lastActivityAt).getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    let lifecycleSegment = '';
    if (daysSinceCreated <= 7) {
      lifecycleSegment = 'new';
    } else if (daysSinceActive <= 7) {
      lifecycleSegment = 'active';
    } else if (daysSinceActive <= 30) {
      lifecycleSegment = 'inactive';
    } else {
      lifecycleSegment = 'churned';
    }

    segmentsToAdd.push({ type: 'lifecycle', value: lifecycleSegment });

    // Remove old lifecycle segments
    ['new', 'active', 'inactive', 'churned'].forEach((lifecycle) => {
      if (lifecycle !== lifecycleSegment) {
        segmentsToRemove.push({ type: 'lifecycle', value: lifecycle });
      }
    });

    // 3. ENGAGEMENT SEGMENTATION
    const quizCount = user._count.quizAttempts;

    // Remove all engagement segments first
    segmentsToRemove.push(
      { type: 'engagement', value: 'power_users' },
      { type: 'engagement', value: 'casual' },
      { type: 'engagement', value: 'streak_7' }
    );

    // Add current engagement segments
    if (quizCount >= 50) {
      segmentsToAdd.push({ type: 'engagement', value: 'power_users' });
    } else if (quizCount > 0 && quizCount <= 10) {
      segmentsToAdd.push({ type: 'engagement', value: 'casual' });
    }

    // Streak-based segment
    if (user.currentStreak && user.currentStreak >= 7) {
      segmentsToAdd.push({ type: 'engagement', value: 'streak_7' });
    }

    // 4. CERTIFICATION FOCUS SEGMENTATION
    // Analyze last 100 quizzes to determine certification focus
    const quizCategories = user.quizAttempts.map((qa: any) => qa.quiz?.category).filter(Boolean);
    const categoryCounts: Record<string, number> = {};

    quizCategories.forEach((category: string) => {
      const categoryLower = category.toLowerCase();
      categoryCounts[categoryLower] = (categoryCounts[categoryLower] || 0) + 1;
    });

    // Determine dominant certification
    const awsCount = (categoryCounts['aws'] || 0) + (categoryCounts['saa'] || 0);
    const azureCount = categoryCounts['azure'] || 0;
    const gcpCount = categoryCounts['gcp'] || 0;

    const total = awsCount + azureCount + gcpCount;

    // Remove all cert focus segments
    segmentsToRemove.push(
      { type: 'certification', value: 'aws_focus' },
      { type: 'certification', value: 'azure_focus' },
      { type: 'certification', value: 'gcp_focus' }
    );

    // Add cert focus if > 60% of quizzes are in one category
    if (total > 10) {
      // Only if user has significant quiz history
      if (awsCount / total > 0.6) {
        segmentsToAdd.push({ type: 'certification', value: 'aws_focus' });
      } else if (azureCount / total > 0.6) {
        segmentsToAdd.push({ type: 'certification', value: 'azure_focus' });
      } else if (gcpCount / total > 0.6) {
        segmentsToAdd.push({ type: 'certification', value: 'gcp_focus' });
      }
    }

    // EXECUTE SEGMENTATION
    // 1. Remove old segments
    for (const segment of segmentsToRemove) {
      await prisma.userSegment.updateMany({
        where: {
          userId: user.userId,
          segmentType: segment.type,
          segmentValue: segment.value,
          removedAt: null,
        },
        data: {
          removedAt: new Date(),
        },
      });
      this.segmentsRemoved++;
    }

    // 2. Add new segments (upsert to handle existing ones)
    for (const segment of segmentsToAdd) {
      await prisma.userSegment.upsert({
        where: {
          userId_segmentType_segmentValue: {
            userId: user.userId,
            segmentType: segment.type,
            segmentValue: segment.value,
          },
        },
        create: {
          userId: user.userId,
          segmentType: segment.type,
          segmentValue: segment.value,
        },
        update: {
          removedAt: null, // Reactivate if was removed
        },
      });
      this.segmentsCreated++;
    }
  }

  /**
   * Clean up old removed segments (older than 90 days)
   */
  async cleanupOldSegments(): Promise<number> {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const result = await prisma.userSegment.deleteMany({
      where: {
        removedAt: {
          lte: ninetyDaysAgo,
        },
      },
    });

    return result.count;
  }
}

/**
 * Helper function to run auto-segmentation (can be called from API route)
 */
export async function runAutoSegmentation(): Promise<SegmentationResult> {
  const service = new AutoSegmentationService();
  return await service.runForAllUsers();
}

/**
 * Helper function to segment a single user
 */
export async function segmentUser(userId: string): Promise<void> {
  const service = new AutoSegmentationService();
  return await service.runForUser(userId);
}
