"use strict";
/**
 * AWS SQS Client for Email Queue
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueEmail = queueEmail;
exports.deleteMessage = deleteMessage;
const client_sqs_1 = require("@aws-sdk/client-sqs");
const sqsClient = new client_sqs_1.SQSClient({
    region: process.env.AWS_REGION || 'us-east-1',
});
const QUEUE_URL = process.env.EMAIL_QUEUE_URL || '';
/**
 * Send email to SQS queue
 */
async function queueEmail(message) {
    const command = new client_sqs_1.SendMessageCommand({
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
    }
    catch (error) {
        console.error('Error queuing message:', error);
        throw error;
    }
}
/**
 * Delete message from queue (after successful processing)
 */
async function deleteMessage(receiptHandle) {
    const command = new client_sqs_1.DeleteMessageCommand({
        QueueUrl: QUEUE_URL,
        ReceiptHandle: receiptHandle,
    });
    try {
        await sqsClient.send(command);
        console.log('Message deleted from queue');
    }
    catch (error) {
        console.error('Error deleting message:', error);
        throw error;
    }
}
