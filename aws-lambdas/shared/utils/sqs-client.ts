/**
 * AWS SQS Client for Email Queue
 */

import { SQSClient, SendMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import type { EmailQueueMessage } from '../types/email';

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const QUEUE_URL = process.env.EMAIL_QUEUE_URL || '';

/**
 * Send email to SQS queue
 */
export async function queueEmail(message: EmailQueueMessage): Promise<void> {
  const command = new SendMessageCommand({
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify(message),
    MessageAttributes: {
      priority: {
        DataType: 'String',
        StringValue: message.priority,
      },
      emailType: {
        DataType: 'String',
        StringValue: message.emailType,
      },
    },
  });

  try {
    const response = await sqsClient.send(command);
    console.log('Message queued successfully:', response.MessageId);
  } catch (error) {
    console.error('Error queuing message:', error);
    throw error;
  }
}

/**
 * Delete message from queue (after successful processing)
 */
export async function deleteMessage(receiptHandle: string): Promise<void> {
  const command = new DeleteMessageCommand({
    QueueUrl: QUEUE_URL,
    ReceiptHandle: receiptHandle,
  });

  try {
    await sqsClient.send(command);
    console.log('Message deleted from queue');
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}
