# Terraform Outputs

output "sqs_queue_url" {
  description = "Email queue URL"
  value       = aws_sqs_queue.email_queue.url
}

output "sqs_dlq_url" {
  description = "Email dead letter queue URL"
  value       = aws_sqs_queue.email_dlq.url
}

output "lambda_functions" {
  description = "Lambda function ARNs"
  value = {
    email_orchestrator = aws_lambda_function.email_orchestrator.arn
    queue_processor    = aws_lambda_function.queue_processor.arn
    weekly_progress    = aws_lambda_function.weekly_progress.arn
    inactive_users     = aws_lambda_function.inactive_users.arn
    resend_webhook     = aws_lambda_function.resend_webhook.arn
  }
}

output "function_urls" {
  description = "Lambda function URLs"
  value = {
    email_orchestrator = aws_lambda_function_url.email_orchestrator.function_url
    resend_webhook     = aws_lambda_function_url.resend_webhook.function_url
  }
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = aws_subnet.private[*].id
}

output "eventbridge_rules" {
  description = "EventBridge rule names"
  value = {
    weekly_progress = aws_cloudwatch_event_rule.weekly_progress.name
    inactive_users  = aws_cloudwatch_event_rule.inactive_users.name
  }
}
