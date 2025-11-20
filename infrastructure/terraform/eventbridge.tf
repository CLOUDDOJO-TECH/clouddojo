# EventBridge (CloudWatch Events) Configuration
# Cron jobs for scheduled email campaigns

# EventBridge rule for Weekly Progress Report
resource "aws_cloudwatch_event_rule" "weekly_progress" {
  name                = "${var.project_name}-weekly-progress-${var.environment}"
  description         = "Trigger weekly progress report every Sunday at 10 AM UTC"
  schedule_expression = "cron(0 10 ? * SUN *)"

  tags = {
    Name = "${var.project_name}-weekly-progress-rule"
  }
}

resource "aws_cloudwatch_event_target" "weekly_progress" {
  rule      = aws_cloudwatch_event_rule.weekly_progress.name
  target_id = "WeeklyProgressLambda"
  arn       = aws_lambda_function.weekly_progress.arn
}

resource "aws_lambda_permission" "allow_eventbridge_weekly" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.weekly_progress.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.weekly_progress.arn
}

# EventBridge rule for Inactive User Campaign
resource "aws_cloudwatch_event_rule" "inactive_users" {
  name                = "${var.project_name}-inactive-users-${var.environment}"
  description         = "Trigger inactive user re-engagement daily at 2 PM UTC"
  schedule_expression = "cron(0 14 * * ? *)"

  tags = {
    Name = "${var.project_name}-inactive-users-rule"
  }
}

resource "aws_cloudwatch_event_target" "inactive_users" {
  rule      = aws_cloudwatch_event_rule.inactive_users.name
  target_id = "InactiveUsersLambda"
  arn       = aws_lambda_function.inactive_users.arn
}

resource "aws_lambda_permission" "allow_eventbridge_inactive" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.inactive_users.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.inactive_users.arn
}

# Note: Add more EventBridge rules as needed for other campaigns
# Examples:
# - Monthly Certification Readiness: cron(0 0 1 * ? *)
# - Feature Adoption Nudge: cron(0 11 * * ? *)
# - AI Analysis Refresh: cron(0 0 * * ? *)
