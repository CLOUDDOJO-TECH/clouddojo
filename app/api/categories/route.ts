import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getAuth(req);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get categories with project counts
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            projects: {
              where: {
                isPublished: true
              }
            }
          }
        },
        projects: {
          where: {
            isPublished: true
          },
          include: {
            userProgresses: {
              where: {
                userId: userId
              },
              select: {
                status: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Transform categories to include user statistics
    const transformedCategories = categories.map(category => {
      const totalProjects = category._count.projects;
      const userCompletedProjects = category.projects.filter(
        project => project.userProgresses.some(progress => progress.status === 'COMPLETED')
      ).length;
      const userInProgressProjects = category.projects.filter(
        project => project.userProgresses.some(progress => progress.status === 'IN_PROGRESS')
      ).length;

      return {
        id: category.id,
        name: category.name,
        description: category.description,
        projectCount: totalProjects,
        userStats: {
          completed: userCompletedProjects,
          inProgress: userInProgressProjects,
          notStarted: totalProjects - userCompletedProjects - userInProgressProjects
        }
      };
    });

    return NextResponse.json({
      categories: transformedCategories
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}