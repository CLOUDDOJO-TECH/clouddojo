/**
 * Shared TypeScript types for Email Service
 */

export interface EmailQueueMessage {
  messageId: string;
  emailType: string;
  userId: string;
  templateId?: string;
  data: EmailData;
  priority: 'high' | 'normal' | 'low';
  createdAt: string;
  retryCount: number;
}

export interface EmailData {
  to: string;
  from: string;
  subject: string;
  templateData: Record<string, any>;
}

export interface EmailEvent {
  eventType: string;
  userId: string;
  eventData: Record<string, any>;
  timestamp: string;
}

export interface EmailPreferences {
  marketingEmails: boolean;
  productUpdates: boolean;
  weeklyProgressReport: boolean;
  aiAnalysisNotifs: boolean;
  milestoneEmails: boolean;
  featureUpdates: boolean;
  unsubscribedAll: boolean;
}

export interface UserSegment {
  segmentType: string;
  segmentValue: string;
  resendAudienceId?: string;
}

export type EmailStatus =
  | 'QUEUED'
  | 'SENDING'
  | 'SENT'
  | 'DELIVERED'
  | 'OPENED'
  | 'CLICKED'
  | 'BOUNCED'
  | 'FAILED';

export interface EmailLogEntry {
  id: string;
  userId?: string;
  emailType: string;
  to: string;
  from: string;
  subject: string;
  status: EmailStatus;
  resendId?: string;
  errorMessage?: string;
  retryCount: number;
  metadata?: Record<string, any>;
}
