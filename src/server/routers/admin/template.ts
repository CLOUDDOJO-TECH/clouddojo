/**
 * Admin Template Manager Router
 *
 * Admin-only procedures for managing email templates:
 * - CRUD operations for React Email templates
 * - Template preview with variable substitution
 * - Template testing (send test emails)
 * - Template analytics and usage stats
 */

import { z } from 'zod';
import { router, adminProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';
import { EmailCategory } from '@prisma/client';
import { sendEmail } from '@/lib/emails/send-email';

/**
 * Email template schema for create/update operations
 */
const emailTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  subject: z.string().min(1).max(200),
  componentPath: z.string().min(1),
  category: z.nativeEnum(EmailCategory),
  isActive: z.boolean().default(true),
  variables: z.array(z.string()).optional(),
});

const templateUpdateSchema = emailTemplateSchema.partial().extend({
  id: z.string(),
});

export const adminTemplateRouter = router({
  /**
   * Get all email templates with optional filtering
   */
  getTemplates: adminProcedure
    .input(
      z.object({
        category: z.nativeEnum(EmailCategory).optional(),
        isActive: z.boolean().optional(),
        searchQuery: z.string().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ input, ctx }) => {
      const { category, isActive, searchQuery, page, limit } = input;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};

      if (category) {
        where.category = category;
      }

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      if (searchQuery) {
        where.OR = [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
          { subject: { contains: searchQuery, mode: 'insensitive' } },
        ];
      }

      const [templates, total] = await Promise.all([
        ctx.prisma.emailTemplate.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: {
                emailLogs: true,
              },
            },
          },
        }),
        ctx.prisma.emailTemplate.count({ where }),
      ]);

      return {
        templates: templates.map((t) => ({
          ...t,
          usageCount: t._count.emailLogs,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  /**
   * Get a single template by ID with usage stats
   */
  getTemplate: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const template = await ctx.prisma.emailTemplate.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: {
              emailLogs: true,
            },
          },
          emailLogs: {
            take: 5,
            orderBy: { sentAt: 'desc' },
            select: {
              id: true,
              status: true,
              sentAt: true,
              user: {
                select: {
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      if (!template) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Template not found',
        });
      }

      // Get usage stats for last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [sent30d, delivered30d, opened30d, clicked30d] = await Promise.all([
        ctx.prisma.emailLog.count({
          where: {
            emailType: template.name,
            sentAt: { gte: thirtyDaysAgo },
          },
        }),
        ctx.prisma.emailLog.count({
          where: {
            emailType: template.name,
            status: 'DELIVERED',
            sentAt: { gte: thirtyDaysAgo },
          },
        }),
        ctx.prisma.emailLog.count({
          where: {
            emailType: template.name,
            status: 'OPENED',
            sentAt: { gte: thirtyDaysAgo },
          },
        }),
        ctx.prisma.emailLog.count({
          where: {
            emailType: template.name,
            status: 'CLICKED',
            sentAt: { gte: thirtyDaysAgo },
          },
        }),
      ]);

      return {
        ...template,
        usageCount: template._count.emailLogs,
        recentSends: template.emailLogs,
        stats30d: {
          sent: sent30d,
          delivered: delivered30d,
          opened: opened30d,
          clicked: clicked30d,
          deliveryRate: sent30d > 0 ? (delivered30d / sent30d) * 100 : 0,
          openRate: delivered30d > 0 ? (opened30d / delivered30d) * 100 : 0,
          clickRate: opened30d > 0 ? (clicked30d / opened30d) * 100 : 0,
        },
      };
    }),

  /**
   * Create a new email template
   */
  createTemplate: adminProcedure
    .input(emailTemplateSchema)
    .mutation(async ({ input, ctx }) => {
      // Check if template name already exists
      const existing = await ctx.prisma.emailTemplate.findUnique({
        where: { name: input.name },
      });

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A template with this name already exists',
        });
      }

      // Validate component path exists
      // TODO: Add file system check to verify componentPath exists

      const template = await ctx.prisma.emailTemplate.create({
        data: {
          name: input.name,
          description: input.description,
          subject: input.subject,
          componentPath: input.componentPath,
          category: input.category,
          isActive: input.isActive,
          variables: input.variables || [],
        },
      });

      return {
        success: true,
        message: 'Template created successfully',
        template,
      };
    }),

  /**
   * Update an existing template
   */
  updateTemplate: adminProcedure
    .input(templateUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;

      // Check if template exists
      const existing = await ctx.prisma.emailTemplate.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Template not found',
        });
      }

      // If name is being changed, check uniqueness
      if (data.name && data.name !== existing.name) {
        const nameExists = await ctx.prisma.emailTemplate.findUnique({
          where: { name: data.name },
        });

        if (nameExists) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A template with this name already exists',
          });
        }
      }

      const template = await ctx.prisma.emailTemplate.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.subject && { subject: data.subject }),
          ...(data.componentPath && { componentPath: data.componentPath }),
          ...(data.category && { category: data.category }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
          ...(data.variables && { variables: data.variables }),
        },
      });

      return {
        success: true,
        message: 'Template updated successfully',
        template,
      };
    }),

  /**
   * Delete a template (soft delete by setting isActive = false)
   */
  deleteTemplate: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const template = await ctx.prisma.emailTemplate.findUnique({
        where: { id: input.id },
      });

      if (!template) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Template not found',
        });
      }

      // Soft delete by setting isActive = false
      await ctx.prisma.emailTemplate.update({
        where: { id: input.id },
        data: { isActive: false },
      });

      return {
        success: true,
        message: 'Template deactivated successfully',
      };
    }),

  /**
   * Permanently delete a template (hard delete)
   */
  permanentlyDeleteTemplate: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const template = await ctx.prisma.emailTemplate.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: {
              emailLogs: true,
            },
          },
        },
      });

      if (!template) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Template not found',
        });
      }

      // Prevent deletion if template has been used
      if (template._count.emailLogs > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Cannot delete template with ${template._count.emailLogs} email logs. Deactivate instead.`,
        });
      }

      await ctx.prisma.emailTemplate.delete({
        where: { id: input.id },
      });

      return {
        success: true,
        message: 'Template permanently deleted',
      };
    }),

  /**
   * Preview template with sample data
   */
  previewTemplate: adminProcedure
    .input(
      z.object({
        id: z.string().optional(),
        componentPath: z.string().optional(),
        variables: z.record(z.any()).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      let componentPath = input.componentPath;

      // If ID provided, fetch component path from database
      if (input.id) {
        const template = await ctx.prisma.emailTemplate.findUnique({
          where: { id: input.id },
        });

        if (!template) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Template not found',
          });
        }

        componentPath = template.componentPath;
      }

      if (!componentPath) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Either id or componentPath must be provided',
        });
      }

      try {
        // Dynamically import React Email component
        const emailModule = await import(`@/${componentPath}`);
        const EmailComponent = emailModule.default;

        // Render with provided variables or sample data
        const data = input.variables || {
          username: 'John Doe',
          email: 'john@example.com',
          score: 85,
          certificationName: 'AWS Solutions Architect',
        };

        // Use React Email's render function
        const { render } = await import('@react-email/render');
        const html = render(EmailComponent(data));

        return {
          html,
          componentPath,
          variables: data,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to render template: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    }),

  /**
   * Send test email to specified address
   */
  sendTestEmail: adminProcedure
    .input(
      z.object({
        templateId: z.string(),
        toEmail: z.string().email(),
        variables: z.record(z.any()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const template = await ctx.prisma.emailTemplate.findUnique({
        where: { id: input.templateId },
      });

      if (!template) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Template not found',
        });
      }

      // Prepare sample variables if not provided
      const variables = input.variables || {
        username: 'Test User',
        email: input.toEmail,
      };

      try {
        // Send test email
        await sendEmail({
          to: input.toEmail,
          subject: `[TEST] ${template.subject}`,
          emailType: template.name,
          templateData: variables,
        });

        return {
          success: true,
          message: `Test email sent to ${input.toEmail}`,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to send test email: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    }),

  /**
   * Get template analytics and usage trends
   */
  getTemplateAnalytics: adminProcedure
    .input(
      z.object({
        templateId: z.string().optional(),
        days: z.number().min(7).max(90).default(30),
      })
    )
    .query(async ({ input, ctx }) => {
      const { templateId, days } = input;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const where: any = {
        sentAt: { gte: startDate },
      };

      if (templateId) {
        const template = await ctx.prisma.emailTemplate.findUnique({
          where: { id: templateId },
        });

        if (!template) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Template not found',
          });
        }

        where.emailType = template.name;
      }

      const [total, delivered, opened, clicked, failed, bounced] = await Promise.all([
        ctx.prisma.emailLog.count({ where }),
        ctx.prisma.emailLog.count({ where: { ...where, status: 'DELIVERED' } }),
        ctx.prisma.emailLog.count({ where: { ...where, status: 'OPENED' } }),
        ctx.prisma.emailLog.count({ where: { ...where, status: 'CLICKED' } }),
        ctx.prisma.emailLog.count({ where: { ...where, status: 'FAILED' } }),
        ctx.prisma.emailLog.count({ where: { ...where, status: 'BOUNCED' } }),
      ]);

      return {
        total,
        delivered,
        opened,
        clicked,
        failed,
        bounced,
        deliveryRate: total > 0 ? Math.round((delivered / total) * 100) : 0,
        openRate: delivered > 0 ? Math.round((opened / delivered) * 100) : 0,
        clickRate: opened > 0 ? Math.round((clicked / opened) * 100) : 0,
        bounceRate: total > 0 ? Math.round((bounced / total) * 100) : 0,
        period: `Last ${days} days`,
      };
    }),

  /**
   * Duplicate a template
   */
  duplicateTemplate: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const template = await ctx.prisma.emailTemplate.findUnique({
        where: { id: input.id },
      });

      if (!template) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Template not found',
        });
      }

      // Create copy with " (Copy)" suffix
      let copyName = `${template.name} (Copy)`;
      let counter = 1;

      // Ensure unique name
      while (await ctx.prisma.emailTemplate.findUnique({ where: { name: copyName } })) {
        counter++;
        copyName = `${template.name} (Copy ${counter})`;
      }

      const newTemplate = await ctx.prisma.emailTemplate.create({
        data: {
          name: copyName,
          description: template.description,
          subject: template.subject,
          componentPath: template.componentPath,
          category: template.category,
          isActive: false, // Start as inactive
          variables: template.variables,
        },
      });

      return {
        success: true,
        message: 'Template duplicated successfully',
        template: newTemplate,
      };
    }),

  /**
   * Get template categories with counts
   */
  getTemplateCategories: adminProcedure.query(async ({ ctx }) => {
    const templates = await ctx.prisma.emailTemplate.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: {
        id: true,
      },
    });

    return templates.map((t) => ({
      category: t.category,
      count: t._count.id,
    }));
  }),
});
