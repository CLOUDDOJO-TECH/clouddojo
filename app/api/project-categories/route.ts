import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/project-categories
 * Fetches all project categories with their project counts
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all project categories with project counts
    const categories = await prisma.projectCategory.findMany({
      include: {
        projects: {
          where: {
            project: {
              isPublished: true
            }
          },
          select: {
            projectId: true
          }
        }
      },
      orderBy: {
        sortOrder: 'asc'
      }
    });

    // Transform to include project count
    const categoriesWithCount = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl,
      sortOrder: category.sortOrder,
      projectCount: category.projects.length,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }));

    return NextResponse.json({
      categories: categoriesWithCount
    });

  } catch (error) {
    console.error('Error fetching project categories:', error);

    return NextResponse.json(
      { error: 'Failed to fetch project categories' },
      { status: 500 }
    );
  }
}
