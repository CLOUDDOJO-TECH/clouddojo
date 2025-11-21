"use strict";
/**
 * Email Queue Processor Lambda
 *
 * Triggered by SQS messages
 * - Processes email queue
 * - Sends emails via Resend
 * - Logs to database
 * - Handles retries
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const resend_1 = require("resend");
const prisma_client_1 = require("../../shared/utils/prisma-client");
const sqs_client_1 = require("../../shared/utils/sqs-client");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
async function handler(event) {
    console.log(`Processing ${event.Records.length} messages from queue`);
    const results = await Promise.allSettled(event.Records.map((record) => processMessage(record)));
    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;
    console.log(`Processed: ${successful} successful, ${failed} failed`);
    return {
        batchItemFailures: results
            .map((result, index) => result.status === 'rejected'
            ? { itemIdentifier: event.Records[index].messageId }
            : null)
            .filter(Boolean),
    };
}
async function processMessage(record) {
    const message = JSON.parse(record.body);
    const prisma = await (0, prisma_client_1.getPrismaClient)();
    console.log(`Processing email: ${message.emailType} to ${message.data.to}`);
    try {
        // 1. Create email log entry
        const emailLog = await prisma.emailLog.create({
            data: {
                userId: message.userId,
                emailType: message.emailType,
                to: message.data.to,
                from: message.data.from,
                subject: message.data.subject,
                status: 'SENDING',
                retryCount: message.retryCount,
                metadata: message.data.templateData,
            },
        });
        // 2. Render email template
        const emailHtml = await renderTemplate(message.emailType, message.data.templateData);
        if (!emailHtml) {
            throw new Error(`Template not found for ${message.emailType}`);
        }
        // 3. Send via Resend
        const response = await resend.emails.send({
            from: message.data.from,
            to: message.data.to,
            subject: message.data.subject,
            html: emailHtml,
        });
        if (response.error) {
            throw new Error(`Resend error: ${response.error.message}`);
        }
        console.log(`Email sent successfully via Resend: ${response.data?.id}`);
        // 4. Update email log
        await prisma.emailLog.update({
            where: { id: emailLog.id },
            data: {
                status: 'SENT',
                resendId: response.data?.id,
                sentAt: new Date(),
            },
        });
        // 5. Delete message from queue
        await (0, sqs_client_1.deleteMessage)(record.receiptHandle);
        return { success: true, emailId: response.data?.id };
    }
    catch (error) {
        console.error(`Error sending email:`, error);
        // Update email log with error
        const emailLog = await prisma.emailLog.findFirst({
            where: {
                userId: message.userId,
                emailType: message.emailType,
                to: message.data.to,
            },
            orderBy: { createdAt: 'desc' },
        });
        if (emailLog) {
            await prisma.emailLog.update({
                where: { id: emailLog.id },
                data: {
                    status: 'FAILED',
                    errorMessage: error instanceof Error ? error.message : 'Unknown error',
                    failedAt: new Date(),
                },
            });
        }
        // Rethrow to trigger SQS retry
        throw error;
    }
}
/**
 * Render email template based on type
 */
async function renderTemplate(emailType, data) {
    const prisma = await (0, prisma_client_1.getPrismaClient)();
    // Get template from database
    const template = await prisma.emailTemplate.findFirst({
        where: {
            name: emailType,
            isActive: true,
        },
    });
    if (!template) {
        console.warn(`No template found for ${emailType}, using fallback`);
        return getTemplateFromMemory(emailType, data);
    }
    // Dynamically import React Email component
    try {
        const componentModule = await Promise.resolve(`${`../../../${template.componentPath}`}`).then(s => __importStar(require(s)));
        const EmailComponent = componentModule.default;
        // Render React Email component to HTML
        const { render } = await Promise.resolve().then(() => __importStar(require('@react-email/components')));
        const html = render(EmailComponent(data));
        return html;
    }
    catch (error) {
        console.error(`Error rendering template ${template.componentPath}:`, error);
        return getTemplateFromMemory(emailType, data);
    }
}
/**
 * Fallback: Get template from memory (static imports)
 */
function getTemplateFromMemory(emailType, data) {
    // For now, use existing email functions from lib/emails/send-email.ts
    // This will be replaced with proper template system
    const templates = {
        welcome: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to CloudDojo</title>
        </head>
        <body>
          <h1>Welcome to CloudDojo, ${data.username}! 🚀</h1>
          <p>We're excited to have you on board!</p>
          <a href="https://clouddojo.tech/dashboard">Get Started</a>
        </body>
      </html>
    `,
        quiz_milestone: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Quiz Milestone</title>
        </head>
        <body>
          <h1>Great progress, ${data.username}! 🎯</h1>
          <p>You've completed ${data.quizCount} quizzes with a score of ${data.score}%!</p>
          <a href="https://clouddojo.tech/dashboard">View Your Progress</a>
        </body>
      </html>
    `,
    };
    return templates[emailType] || null;
}
