/**
 * Email Service
 * 
 * Centralized email sending functions using Resend and React Email templates.
 * Supports both direct sending and queued (background) sending via Inngest.
 */
"use server"
import { Resend } from 'resend'

// Import templates
import WelcomeEmail from './templates/WelcomeEmail'
import PasswordResetEmail from './templates/PasswordResetEmail'
import StudyReminderEmail from './templates/StudyReminderEmail'
import QuizResultsEmail from './templates/QuizResultsEmail'

// Legacy imports for backwards compatibility
import CloudDojoAiReportEmail from './drafts/new-report'
import LegacyWelcomeEmail from './drafts/welcome-mail'
import FeedbackThankYouEmail from './feedback-thank-you'
import FeedbackNotificationEmail from './feedback-notification'

const resend = new Resend(process.env.RESEND_API_KEY)

// Test mode configuration
const TEST_EMAIL = 'bonyuglen@gmail.com'
const isTestMode = process.env.EMAIL_TEST_MODE === 'true'
const isDev = process.env.NODE_ENV === 'development'

// Sender addresses by category
export const SENDERS = {
  welcome: 'CloudDojo <welcome@clouddojo.tech>',
  reset: 'CloudDojo <reset@clouddojo.tech>',
  reminders: 'CloudDojo <reminders@clouddojo.tech>',
  results: 'CloudDojo <results@clouddojo.tech>',
  support: 'CloudDojo <support@clouddojo.tech>',
  feedback: 'CloudDojo <feedback@clouddojo.tech>',
  noreply: 'CloudDojo <noreply@clouddojo.tech>',
} as const

// Email log type
interface EmailLog {
  timestamp: Date
  recipient: string
  actualRecipient: string
  type: string
  sender: string
  subject: string
  success: boolean
  error?: string
  variables?: Record<string, unknown>
}

// In-memory log for development (replace with proper logging in production)
const emailLogs: EmailLog[] = []

/**
 * Get the recipient email address.
 * In test mode or dev, all emails go to the test address.
 */
function getRecipient(email: string): string {
  if (isTestMode || isDev) {
    console.log(`[Email] Test mode: redirecting ${email} to ${TEST_EMAIL}`)
    return TEST_EMAIL
  }
  return email
}

/**
 * Log email send attempt
 */
function logEmail(log: EmailLog): void {
  emailLogs.push(log)
  console.log(`[Email Log] ${log.success ? '✓' : '✗'} ${log.type} to ${log.recipient} (${log.actualRecipient}) at ${log.timestamp.toISOString()}`)
  if (!log.success && log.error) {
    console.error(`[Email Error] ${log.error}`)
  }
}

/**
 * Get email logs (for debugging/monitoring)
 */
export function getEmailLogs(): EmailLog[] {
  return emailLogs
}

// ============================================
// NEW EMAIL SENDING FUNCTIONS (per requirements)
// ============================================

interface SendWelcomeEmailParams {
  userId: string
  email: string
  name: string
}

export async function sendWelcomeEmailNew({
  userId,
  email,
  name,
}: SendWelcomeEmailParams): Promise<{ success: boolean; data?: unknown; error?: unknown }> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined')
  }

  const recipient = getRecipient(email)
  const subject = 'Welcome to CloudDojo - Your AWS Certification Journey Begins!'
  const variables = {
    name,
    loginUrl: 'https://www.clouddojo.tech/signin',
    dashboardUrl: 'https://www.clouddojo.tech/dashboard',
  }

  try {
    const data = await resend.emails.send({
      from: SENDERS.welcome,
      to: recipient,
      subject,
      react: WelcomeEmail(variables),
    })

    logEmail({
      timestamp: new Date(),
      recipient: email,
      actualRecipient: recipient,
      type: 'welcome',
      sender: SENDERS.welcome,
      subject,
      success: true,
      variables: { ...variables, userId },
    })

    return { success: true, data }
  } catch (error) {
    logEmail({
      timestamp: new Date(),
      recipient: email,
      actualRecipient: recipient,
      type: 'welcome',
      sender: SENDERS.welcome,
      subject,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      variables: { ...variables, userId },
    })

    console.error('Failed to send welcome email:', error)
    return { success: false, error }
  }
}

interface SendPasswordResetEmailParams {
  userId: string
  email: string
  name: string
  resetToken: string
  expiryMinutes: number
}

export async function sendPasswordResetEmail({
  userId,
  email,
  name,
  resetToken,
  expiryMinutes,
}: SendPasswordResetEmailParams): Promise<{ success: boolean; data?: unknown; error?: unknown }> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined')
  }

  const recipient = getRecipient(email)
  const subject = 'Reset Your CloudDojo Password'
  const expiryTime = expiryMinutes >= 60 
    ? `${Math.floor(expiryMinutes / 60)} hour${expiryMinutes >= 120 ? 's' : ''}`
    : `${expiryMinutes} minutes`
  
  const variables = {
    name,
    resetUrl: `https://www.clouddojo.tech/reset-password?token=${resetToken}`,
    expiryTime,
  }

  try {
    const data = await resend.emails.send({
      from: SENDERS.reset,
      to: recipient,
      subject,
      react: PasswordResetEmail(variables),
    })

    logEmail({
      timestamp: new Date(),
      recipient: email,
      actualRecipient: recipient,
      type: 'password-reset',
      sender: SENDERS.reset,
      subject,
      success: true,
      variables: { ...variables, userId, resetToken: '***' },
    })

    return { success: true, data }
  } catch (error) {
    logEmail({
      timestamp: new Date(),
      recipient: email,
      actualRecipient: recipient,
      type: 'password-reset',
      sender: SENDERS.reset,
      subject,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      variables: { ...variables, userId, resetToken: '***' },
    })

    console.error('Failed to send password reset email:', error)
    return { success: false, error }
  }
}

interface SendStudyReminderEmailParams {
  userId: string
  email: string
  name: string
  lastCertification: string
  daysSinceLastStudy: number
}

export async function sendStudyReminderEmail({
  userId,
  email,
  name,
  lastCertification,
  daysSinceLastStudy,
}: SendStudyReminderEmailParams): Promise<{ success: boolean; data?: unknown; error?: unknown }> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined')
  }

  const recipient = getRecipient(email)
  const subject = `Time to study! It's been ${daysSinceLastStudy} days`
  const variables = {
    name,
    lastCertification,
    daysSinceLastStudy,
    practiceTestUrl: 'https://www.clouddojo.tech/practice-tests',
    unsubscribeUrl: 'https://www.clouddojo.tech/settings/notifications',
  }

  try {
    const data = await resend.emails.send({
      from: SENDERS.reminders,
      to: recipient,
      subject,
      react: StudyReminderEmail(variables),
    })

    logEmail({
      timestamp: new Date(),
      recipient: email,
      actualRecipient: recipient,
      type: 'study-reminder',
      sender: SENDERS.reminders,
      subject,
      success: true,
      variables: { ...variables, userId },
    })

    return { success: true, data }
  } catch (error) {
    logEmail({
      timestamp: new Date(),
      recipient: email,
      actualRecipient: recipient,
      type: 'study-reminder',
      sender: SENDERS.reminders,
      subject,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      variables: { ...variables, userId },
    })

    console.error('Failed to send study reminder email:', error)
    return { success: false, error }
  }
}

interface QuizData {
  score: number
  totalQuestions: number
  passPercentage: number
  passed: boolean
  weakAreas: string[]
  nextSteps: string
}

interface SendQuizResultsEmailParams {
  userId: string
  email: string
  name: string
  quizData: QuizData
}

export async function sendQuizResultsEmail({
  userId,
  email,
  name,
  quizData,
}: SendQuizResultsEmailParams): Promise<{ success: boolean; data?: unknown; error?: unknown }> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined')
  }

  const recipient = getRecipient(email)
  const percentage = Math.round((quizData.score / quizData.totalQuestions) * 100)
  const subject = quizData.passed
    ? `🎉 Congratulations! You passed with ${percentage}%`
    : `Your practice test results: ${percentage}%`
  
  const variables = {
    name,
    ...quizData,
    retakeUrl: 'https://www.clouddojo.tech/practice-tests',
  }

  try {
    const data = await resend.emails.send({
      from: SENDERS.results,
      to: recipient,
      subject,
      react: QuizResultsEmail(variables),
    })

    logEmail({
      timestamp: new Date(),
      recipient: email,
      actualRecipient: recipient,
      type: 'quiz-results',
      sender: SENDERS.results,
      subject,
      success: true,
      variables: { ...variables, userId },
    })

    return { success: true, data }
  } catch (error) {
    logEmail({
      timestamp: new Date(),
      recipient: email,
      actualRecipient: recipient,
      type: 'quiz-results',
      sender: SENDERS.results,
      subject,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      variables: { ...variables, userId },
    })

    console.error('Failed to send quiz results email:', error)
    return { success: false, error }
  }
}

// ============================================
// LEGACY EMAIL SENDING FUNCTIONS (preserved for backwards compatibility)
// ============================================

const ADMIN_EMAIL = 'bonyuglen@gmail.com'

interface SendAnalysisNotificationProps {
  email: string
  username: string
  userImage?: string
  certificationName?: string | "AWS Certified Solutions Architect – Associate"
  readinessScore?: number
}

interface SendWelcomeEmailProps {
  email: string
  username: string
}

interface SendFeedbackEmailsProps {
  userEmail: string
  userName: string
  feedbackType: string
  feedbackContent: string
  mood: string
}

export async function sendAnalysisNotification({ 
  email, 
  username,
  userImage,
  certificationName,
  readinessScore
}: SendAnalysisNotificationProps) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined')
  }

  const recipient = getRecipient(email)

  try {
    const data = await resend.emails.send({
      from: SENDERS.welcome,
      to: recipient,
      subject: 'Your AWS Certification AI Analysis is Ready!',
      react: CloudDojoAiReportEmail({ 
        username,
        userImage,
        certificationName,
        readinessScore,
        language: 'en'
      }),
    })

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send analysis notification email:', error)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail({
  email,
  username
}: SendWelcomeEmailProps) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined')
  }

  const recipient = getRecipient(email)

  try {
    const data = await resend.emails.send({
      from: SENDERS.welcome,
      to: recipient,
      subject: 'Welcome to CloudDojo - Your AWS Certification Journey Begins!',
      react: LegacyWelcomeEmail({ username }),
    })

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    return { success: false, error }
  }
}

export async function sendFeedbackEmails({
  userEmail,
  userName,
  feedbackType,
  feedbackContent,
  mood,
}: SendFeedbackEmailsProps) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined')
  }

  const recipient = getRecipient(userEmail)

  try {
    // Send thank you email to user
    const userEmailResult = await resend.emails.send({
      from: SENDERS.support,
      to: recipient,
      subject: 'Thank You for Your Feedback!',
      react: FeedbackThankYouEmail({ username: userName }),
    })

    // Send notification email to admin (always to admin address)
    const adminEmailResult = await resend.emails.send({
      from: SENDERS.feedback,
      to: [ADMIN_EMAIL, 'support@clouddojo.tech'], 
      subject: `New Feedback Received from ${userName}`,
      react: FeedbackNotificationEmail({
        userName,
        userEmail,
        feedbackType,
        feedbackContent,
        mood
      }),
    })

    return { 
      success: true, 
      data: {
        userEmail: userEmailResult,
        adminEmail: adminEmailResult
      }
    }
  } catch (error) {
    console.error('Failed to send feedback emails:', error)
    return { success: false, error }
  }
}
