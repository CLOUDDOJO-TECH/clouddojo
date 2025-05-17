import prisma from "./prisma"

export async function getProcessedUserIds(jobId: string): Promise<string[]> {
    const records = await prisma.processedCronJobUser.findMany({
      where: { jobId },
      select: { userId: true }
    })
    return records.map(r => r.userId)
  }
  
  export async function markUsersAsProcessed(jobId: string, userIds: string[]): Promise<void> {
    if (userIds.length === 0) return
    
    await prisma.$transaction([
      prisma.processedCronJobUser.createMany({
        data: userIds.map(userId => ({ jobId, userId })),
        skipDuplicates: true
      }),
      // Cleanup old records (older than 7 days)
      prisma.processedCronJobUser.deleteMany({
        where: { processedAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
      })
    ])
  }
  
