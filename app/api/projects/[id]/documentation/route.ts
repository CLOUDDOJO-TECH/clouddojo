import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await getAuth(req);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const projectId = id;

    // Get user's completed progress for this project
    const progress = await prisma.projectProgress.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId
        }
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        project: {
          select: {
            title: true,
            description: true,
            category: {
              select: {
                name: true
              }
            },
            keyTechnologies: true,
            estimatedTime: true,
            difficulty: true
          }
        },
        stepResponses: {
          include: {
            step: {
              select: {
                stepNumber: true,
                title: true,
                description: true,
                stepType: true
              }
            }
          },
          orderBy: {
            step: {
              stepNumber: 'asc'
            }
          }
        },
        achievements: {
          orderBy: {
            earnedAt: 'asc'
          }
        }
      }
    });

    if (!progress) {
      return NextResponse.json(
        { error: 'Progress not found for this project' },
        { status: 404 }
      );
    }

    // Generate documentation
    const documentation = generateProjectDocumentation(progress);

    // Update the progress with the generated documentation
    await prisma.projectProgress.update({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId
        }
      },
      data: {
        generatedDocumentation: documentation
      }
    });

    return NextResponse.json({
      documentation: documentation,
      generatedAt: new Date(),
      projectTitle: progress.project.title,
      userName: `${progress.user.firstName} ${progress.user.lastName}`,
      completedAt: progress.completedAt,
      timeSpent: progress.timeSpent,
      achievements: progress.achievements.length
    });

  } catch (error) {
    console.error('Error generating documentation:', error);
    return NextResponse.json(
      { error: 'Failed to generate project documentation' },
      { status: 500 }
    );
  }
}

function generateProjectDocumentation(progress: any): string {
  const {
    user,
    project,
    stepResponses,
    achievements,
    startedAt,
    completedAt,
    timeSpent
  } = progress;

  const userName = `${user.firstName} ${user.lastName}`;
  const completionDate = completedAt ? format(new Date(completedAt), 'MMMM dd, yyyy') : 'In Progress';
  const startDate = format(new Date(startedAt), 'MMMM dd, yyyy');
  const hoursSpent = Math.round(timeSpent / 60 * 10) / 10; // Convert minutes to hours with 1 decimal

  // Filter responses by type for better organization
  const reflectionResponses = stepResponses.filter((r: any) => r.step.stepType === 'REFLECTION');
  const instructionResponses = stepResponses.filter((r: any) => r.step.stepType === 'INSTRUCTION');

  const documentation = `# ${project.title} - Project Documentation

**Completed by:** ${userName}  
**Project Category:** ${project.category.name}  
**Difficulty Level:** ${project.difficulty}  
**Started:** ${startDate}  
**Completed:** ${completionDate}  
**Time Invested:** ${hoursSpent} hours  

---

## Project Overview

${project.description}

### Technologies Used
${project.keyTechnologies.map((tech: string) => `- ${tech}`).join('\n')}

---

## Learning Journey

### What I Set Out to Learn

${reflectionResponses.length > 0 && reflectionResponses[0] ? reflectionResponses[0].response : 'Learning objectives documented during the project.'}

---

## Implementation Steps

${instructionResponses.map((response: any, index: number) => `
### Step ${response.step.stepNumber}: ${response.step.title}

**Objective:** ${response.step.description || 'Complete the implementation step'}

**What I Did:**
${response.response}

**Time Spent:** ${Math.round(response.timeSpent)} minutes
${response.hintsUsed > 0 ? `**Hints Used:** ${response.hintsUsed}` : ''}

---
`).join('')}

## Key Achievements

${achievements.length > 0 ? achievements.map((achievement: any) => `
🏆 **${achievement.title}**  
${achievement.description}  
*Earned on ${format(new Date(achievement.earnedAt), 'MMMM dd, yyyy')}*
`).join('\n') : 'Working towards earning achievements in this project.'}

---

## Reflection & Next Steps

### What I Learned
${reflectionResponses.length > 1 ? reflectionResponses[reflectionResponses.length - 1].response : 'This project provided hands-on experience with cloud technologies and development practices.'}

### Skills Developed
- Practical experience with ${project.keyTechnologies.slice(0, 3).join(', ')}
- Problem-solving and troubleshooting
- Technical documentation and communication
- Project planning and execution

---

## Project Statistics

- **Total Steps Completed:** ${stepResponses.length}
- **Achievements Earned:** ${achievements.length}
- **Completion Rate:** ${progress.status === 'COMPLETED' ? '100%' : `${Math.round((progress.completedSteps.length / stepResponses.length) * 100)}%`}
- **Average Time per Step:** ${stepResponses.length > 0 ? Math.round(timeSpent / stepResponses.length) : 0} minutes

---

*This documentation was automatically generated from project responses and can be used for portfolio purposes, job applications, or LinkedIn sharing.*

**Project completed through [CloudDojo](https://clouddojo.io) - Hands-On Labs Platform**

---

## Connect With Me

Feel free to connect with me to discuss this project or collaborate on similar technologies!

📧 Email: ${user.email}  
💼 LinkedIn: [Add your LinkedIn profile]  
🐙 GitHub: [Add your GitHub profile]  

---

*Generated on ${format(new Date(), 'MMMM dd, yyyy \'at\' h:mm a')}*
`;

  return documentation;
}