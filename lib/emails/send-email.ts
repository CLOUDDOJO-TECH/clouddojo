"use server"
import { Resend } from 'resend'
import AnalysisNotificationEmail from './analysis-notification'
import CloudDojoWelcomeEmail from './welcome-email'
import FeedbackThankYouEmail from './feedback-thank-you'
import FeedbackNotificationEmail from './feedback-notification'
import CloudDojoAiReportEmail from './drafts/new-report'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = 'bonyuglen@gmail.com'

interface SendAnalysisNotificationProps {
  email: string
  username: string
  userImage?: string
  certificationName?: string
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

  try {
    const data = await resend.emails.send({
      from: 'CloudDojo <welcome@clouddojo.tech>',
      to: email,
      subject: 'Your AWS Certification AI Analysis is Ready!',
      react: CloudDojoAiReportEmail({ 
        username,
        userImage,
        certificationName,
        readinessScore
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

  try {
    const data = await resend.emails.send({
      from: 'CloudDojo <welcome@clouddojo.tech>',
      to: email,
      subject: 'Welcome to CloudDojo - Your AWS Certification Journey Begins!',
      react: CloudDojoWelcomeEmail({ username }),
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

  try {
    // Send thank you email to user
    const userEmailResult = await resend.emails.send({
      from: 'CloudDojo <feedback@clouddojo.tech>',
      to: userEmail,
      subject: 'Thank You for Your Feedback!',
      react: FeedbackThankYouEmail({ username: userName }),
    })

    // Send notification email to admin
    const adminEmailResult = await resend.emails.send({
      from: 'CloudDojo <feedback@clouddojo.tech>',
      to: ADMIN_EMAIL,
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