"use strict";
/**
 * Email Orchestrator Lambda
 *
 * Entry point from Next.js app for all email events
 * - Validates email eligibility
 * - Checks user preferences
 * - Queues emails to SQS
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const prisma_client_1 = require("../../shared/utils/prisma-client");
const redis_client_1 = require("../../shared/utils/redis-client");
const sqs_client_1 = require("../../shared/utils/sqs-client");
async function handler(event) {
    console.log('Email Orchestrator invoked:', JSON.stringify(event, null, 2));
    try {
        // Parse request body
        const emailEvent = JSON.parse(event.body || '{}');
        if (!emailEvent.eventType || !emailEvent.userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields: eventType and userId' }),
            };
        }
        // Validate request signature (optional but recommended)
        const signature = event.headers['x-clouddojo-signature'];
        if (!validateSignature(signature, event.body || '')) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Invalid signature' }),
            };
        }
        // Process the email event
        const result = await processEmailEvent(emailEvent);
        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    }
    catch (error) {
        console.error('Error in email orchestrator:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            }),
        };
    }
}
async function processEmailEvent(emailEvent) {
    const { eventType, userId, eventData } = emailEvent;
    const prisma = await (0, prisma_client_1.getPrismaClient)();
    // 1. Get user and preferences
    const user = await prisma.user.findUnique({
        where: { userId },
        include: { emailPreferences: true },
    });
    if (!user) {
        console.log(`User not found: ${userId}`);
        return { success: false, reason: 'User not found' };
    }
    // 2. Check if user has email preferences (create if not)
    if (!user.emailPreferences) {
        await prisma.emailPreferences.create({
            data: { userId },
        });
    }
    // 3. Map event to email type
    const emailType = mapEventToEmailType(eventType);
    if (!emailType) {
        console.log(`No email mapping for event: ${eventType}`);
        return { success: false, reason: 'No email mapping for event' };
    }
    // 4. Check user preferences
    if (!shouldSendEmail(user.emailPreferences, emailType)) {
        console.log(`User opted out of ${emailType}`);
        return { success: false, reason: 'User opted out' };
    }
    // 5. Check deduplication (Redis)
    const wasRecentlySent = await (0, redis_client_1.wasEmailSentRecently)(userId, emailType, 24);
    if (wasRecentlySent) {
        console.log(`Email ${emailType} was sent recently to ${userId}`);
        return { success: false, reason: 'Email sent recently' };
    }
    // 6. Check rate limiting
    const rateLimit = await (0, redis_client_1.checkRateLimit)(`email:user:${userId}`, 10, 3600); // 10 emails per hour
    if (!rateLimit.allowed) {
        console.log(`Rate limit exceeded for user ${userId}`);
        return { success: false, reason: 'Rate limit exceeded' };
    }
    // 7. Prepare email message
    const emailMessage = {
        messageId: `${Date.now()}-${userId}-${emailType}`,
        emailType,
        userId,
        data: {
            to: user.email,
            from: getFromAddress(emailType),
            subject: getSubject(emailType, eventData),
            templateData: {
                username: user.firstName,
                ...eventData,
            },
        },
        priority: getPriority(emailType),
        createdAt: new Date().toISOString(),
        retryCount: 0,
    };
    // 8. Queue to SQS
    await (0, sqs_client_1.queueEmail)(emailMessage);
    // 9. Mark as sent in Redis (for deduplication)
    await (0, redis_client_1.markEmailAsSent)(userId, emailType, 24);
    // 10. Log event to database
    await prisma.emailEvent.create({
        data: {
            eventType,
            userId,
            eventData,
            processed: true,
        },
    });
    console.log(`Email queued successfully: ${emailType} to ${user.email}`);
    return {
        success: true,
        emailType,
        queuedAt: emailMessage.createdAt,
    };
}
/**
 * Map event type to email type
 */
function mapEventToEmailType(eventType) {
    const mapping = {
        'user.created': 'welcome',
        'quiz.completed': 'quiz_milestone',
        'quiz.perfect_score': 'perfect_score',
        'milestone.reached': 'milestone_celebration',
        'user.inactive_3d': 'inactive_3day',
        'user.inactive_7d': 'inactive_7day',
        'user.inactive_14d': 'inactive_14day',
        'ai_analysis.ready': 'ai_analysis_notification',
        'feature.unused': 'feature_spotlight',
    };
    return mapping[eventType] || null;
}
/**
 * Check if email should be sent based on preferences
 */
function shouldSendEmail(preferences, emailType) {
    if (!preferences)
        return true;
    if (preferences.unsubscribedAll)
        return false;
    const preferenceMapping = {
        welcome: 'productUpdates',
        quiz_milestone: 'milestoneEmails',
        perfect_score: 'milestoneEmails',
        milestone_celebration: 'milestoneEmails',
        inactive_3day: 'productUpdates',
        inactive_7day: 'productUpdates',
        inactive_14day: 'productUpdates',
        ai_analysis_notification: 'aiAnalysisNotifs',
        feature_spotlight: 'featureUpdates',
        weekly_progress: 'weeklyProgressReport',
        marketing: 'marketingEmails',
    };
    const prefKey = preferenceMapping[emailType];
    return prefKey ? preferences[prefKey] !== false : true;
}
/**
 * Get from address based on email type
 */
function getFromAddress(emailType) {
    const fromMapping = {
        welcome: 'welcome@clouddojo.tech',
        ai_analysis_notification: 'analysis@clouddojo.tech',
        marketing: 'hello@clouddojo.tech',
    };
    return fromMapping[emailType] || 'noreply@clouddojo.tech';
}
/**
 * Get subject line based on email type
 */
function getSubject(emailType, eventData) {
    const subjects = {
        welcome: 'Welcome to CloudDojo! 🚀',
        quiz_milestone: `Great progress, ${eventData.username}! 🎯`,
        perfect_score: `Perfect Score! You're on fire! 🔥`,
        milestone_celebration: `${eventData.milestone} Milestone Unlocked! 🎉`,
        inactive_3day: `We miss you! Come back and practice 📚`,
        inactive_7day: `Your progress is waiting for you 💪`,
        inactive_14day: `Last chance to continue your journey 🎓`,
        ai_analysis_notification: `Your AI Analysis is Ready! 📊`,
        feature_spotlight: `Unlock this powerful feature 💡`,
        weekly_progress: 'Your Weekly Progress Report 📈',
    };
    return subjects[emailType] || 'CloudDojo Update';
}
/**
 * Get priority based on email type
 */
function getPriority(emailType) {
    const highPriority = ['welcome', 'ai_analysis_notification'];
    const lowPriority = ['marketing', 'weekly_progress'];
    if (highPriority.includes(emailType))
        return 'high';
    if (lowPriority.includes(emailType))
        return 'low';
    return 'normal';
}
/**
 * Validate request signature (security)
 */
function validateSignature(signature, body) {
    // TODO: Implement HMAC signature validation
    // For now, check if signature exists
    if (!signature) {
        console.warn('No signature provided - consider adding signature validation');
    }
    // In production, verify HMAC signature:
    // const expectedSignature = crypto.createHmac('sha256', SECRET).update(body).digest('hex');
    // return signature === expectedSignature;
    return true; // Temporarily allow all (remove in production)
}
