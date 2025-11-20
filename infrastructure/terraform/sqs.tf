# SQS Email Queue Configuration

# Main email queue
resource "aws_sqs_queue" "email_queue" {
  name                       = "${var.project_name}-email-queue-${var.environment}"
  visibility_timeout_seconds = var.email_queue_visibility_timeout
  message_retention_seconds  = var.email_queue_retention_period
  max_message_size           = 262144 # 256 KB
  delay_seconds              = 0
  receive_wait_time_seconds  = 20 # Long polling

  # Dead letter queue configuration
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.email_dlq.arn
    maxReceiveCount     = 3
  })

  tags = {
    Name = "${var.project_name}-email-queue"
  }
}

# Dead letter queue for failed emails
resource "aws_sqs_queue" "email_dlq" {
  name                       = "${var.project_name}-email-dlq-${var.environment}"
  message_retention_seconds  = 1209600 # 14 days
  receive_wait_time_seconds  = 20

  tags = {
    Name = "${var.project_name}-email-dlq"
  }
}

# Queue policy
resource "aws_sqs_queue_policy" "email_queue_policy" {
  queue_url = aws_sqs_queue.email_queue.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = [
          "sqs:SendMessage",
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ]
        Resource = aws_sqs_queue.email_queue.arn
      }
    ]
  })
}

# CloudWatch alarms for DLQ
resource "aws_cloudwatch_metric_alarm" "dlq_messages" {
  alarm_name          = "${var.project_name}-email-dlq-messages-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = 300
  statistic           = "Average"
  threshold           = 10
  alarm_description   = "Alert when DLQ has messages (failed emails)"
  treat_missing_data  = "notBreaching"

  dimensions = {
    QueueName = aws_sqs_queue.email_dlq.name
  }

  # TODO: Add SNS topic for alerts
  # alarm_actions = [aws_sns_topic.alerts.arn]
}
