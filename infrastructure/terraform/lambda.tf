# Lambda Functions Configuration

# IAM role for Lambda functions
resource "aws_iam_role" "lambda_execution" {
  name = "${var.project_name}-lambda-execution-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Attach AWS managed policy for Lambda VPC execution
resource "aws_iam_role_policy_attachment" "lambda_vpc_execution" {
  role       = aws_iam_role.lambda_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

# Attach secrets access policy
resource "aws_iam_role_policy_attachment" "lambda_secrets" {
  role       = aws_iam_role.lambda_execution.name
  policy_arn = aws_iam_policy.secrets_access.arn
}

# SQS access policy for Lambda
resource "aws_iam_policy" "lambda_sqs_access" {
  name = "${var.project_name}-lambda-sqs-access-${var.environment}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "sqs:SendMessage",
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ]
        Resource = [
          aws_sqs_queue.email_queue.arn,
          aws_sqs_queue.email_dlq.arn
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_sqs" {
  role       = aws_iam_role.lambda_execution.name
  policy_arn = aws_iam_policy.lambda_sqs_access.arn
}

# CloudWatch Logs policy
resource "aws_iam_policy" "lambda_logs" {
  name = "${var.project_name}-lambda-logs-${var.environment}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_execution.name
  policy_arn = aws_iam_policy.lambda_logs.arn
}

# Lambda Layer for shared dependencies
resource "aws_lambda_layer_version" "shared_dependencies" {
  filename            = "../aws-lambdas/shared-layer.zip" # Build this in your CI/CD
  layer_name          = "${var.project_name}-shared-deps-${var.environment}"
  compatible_runtimes = ["nodejs20.x"]
  description         = "Shared dependencies for email service Lambdas"

  # lifecycle {
  #   create_before_destroy = true
  # }
}

# 1. Email Orchestrator Lambda
resource "aws_lambda_function" "email_orchestrator" {
  filename         = "../aws-lambdas/email-orchestrator/function.zip"
  function_name    = "${var.project_name}-email-orchestrator-${var.environment}"
  role             = aws_iam_role.lambda_execution.arn
  handler          = "dist/handler.handler"
  source_code_hash = filebase64sha256("../aws-lambdas/email-orchestrator/function.zip")
  runtime          = "nodejs20.x"
  timeout          = 30
  memory_size      = 512

  vpc_config {
    subnet_ids         = aws_subnet.private[*].id
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      NODE_ENV              = "production"
      EMAIL_QUEUE_URL       = aws_sqs_queue.email_queue.url
      AWS_REGION           = var.aws_region
      RESEND_API_KEY_SECRET = aws_secretsmanager_secret.resend_api_key.name
      DATABASE_URL_SECRET   = aws_secretsmanager_secret.database_url.name
      REDIS_URL_SECRET      = aws_secretsmanager_secret.redis_url.name
    }
  }

  layers = [aws_lambda_layer_version.shared_dependencies.arn]

  tags = {
    Name = "${var.project_name}-email-orchestrator"
  }
}

# Function URL for Email Orchestrator
resource "aws_lambda_function_url" "email_orchestrator" {
  function_name      = aws_lambda_function.email_orchestrator.function_name
  authorization_type = "NONE" # Use custom auth in handler

  cors {
    allow_credentials = true
    allow_origins     = var.lambda_function_url_cors_origins
    allow_methods     = ["POST"]
    allow_headers     = ["content-type", "x-clouddojo-signature"]
    max_age           = 86400
  }
}

# 2. Queue Processor Lambda
resource "aws_lambda_function" "queue_processor" {
  filename         = "../aws-lambdas/queue-processor/function.zip"
  function_name    = "${var.project_name}-queue-processor-${var.environment}"
  role             = aws_iam_role.lambda_execution.arn
  handler          = "dist/handler.handler"
  source_code_hash = filebase64sha256("../aws-lambdas/queue-processor/function.zip")
  runtime          = "nodejs20.x"
  timeout          = 60
  memory_size      = 1024

  vpc_config {
    subnet_ids         = aws_subnet.private[*].id
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      NODE_ENV              = "production"
      RESEND_API_KEY_SECRET = aws_secretsmanager_secret.resend_api_key.name
      DATABASE_URL_SECRET   = aws_secretsmanager_secret.database_url.name
    }
  }

  layers = [aws_lambda_layer_version.shared_dependencies.arn]

  tags = {
    Name = "${var.project_name}-queue-processor"
  }
}

# SQS trigger for Queue Processor
resource "aws_lambda_event_source_mapping" "sqs_trigger" {
  event_source_arn = aws_sqs_queue.email_queue.arn
  function_name    = aws_lambda_function.queue_processor.arn
  batch_size       = 5
  enabled          = true

  function_response_types = ["ReportBatchItemFailures"]
}

# 3. Weekly Progress Lambda
resource "aws_lambda_function" "weekly_progress" {
  filename         = "../aws-lambdas/scheduled-campaigns/weekly-progress.zip"
  function_name    = "${var.project_name}-weekly-progress-${var.environment}"
  role             = aws_iam_role.lambda_execution.arn
  handler          = "dist/weekly-progress.handler"
  source_code_hash = filebase64sha256("../aws-lambdas/scheduled-campaigns/weekly-progress.zip")
  runtime          = "nodejs20.x"
  timeout          = 300
  memory_size      = 1024

  vpc_config {
    subnet_ids         = aws_subnet.private[*].id
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      NODE_ENV            = "production"
      EMAIL_QUEUE_URL     = aws_sqs_queue.email_queue.url
      DATABASE_URL_SECRET = aws_secretsmanager_secret.database_url.name
      REDIS_URL_SECRET    = aws_secretsmanager_secret.redis_url.name
    }
  }

  layers = [aws_lambda_layer_version.shared_dependencies.arn]

  tags = {
    Name = "${var.project_name}-weekly-progress"
  }
}

# 4. Inactive Users Lambda
resource "aws_lambda_function" "inactive_users" {
  filename         = "../aws-lambdas/scheduled-campaigns/inactive-users.zip"
  function_name    = "${var.project_name}-inactive-users-${var.environment}"
  role             = aws_iam_role.lambda_execution.arn
  handler          = "dist/inactive-users.handler"
  source_code_hash = filebase64sha256("../aws-lambdas/scheduled-campaigns/inactive-users.zip")
  runtime          = "nodejs20.x"
  timeout          = 300
  memory_size      = 1024

  vpc_config {
    subnet_ids         = aws_subnet.private[*].id
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      NODE_ENV            = "production"
      EMAIL_QUEUE_URL     = aws_sqs_queue.email_queue.url
      DATABASE_URL_SECRET = aws_secretsmanager_secret.database_url.name
      REDIS_URL_SECRET    = aws_secretsmanager_secret.redis_url.name
    }
  }

  layers = [aws_lambda_layer_version.shared_dependencies.arn]

  tags = {
    Name = "${var.project_name}-inactive-users"
  }
}

# 5. Resend Webhook Lambda
resource "aws_lambda_function" "resend_webhook" {
  filename         = "../aws-lambdas/resend-webhook/function.zip"
  function_name    = "${var.project_name}-resend-webhook-${var.environment}"
  role             = aws_iam_role.lambda_execution.arn
  handler          = "dist/handler.handler"
  source_code_hash = filebase64sha256("../aws-lambdas/resend-webhook/function.zip")
  runtime          = "nodejs20.x"
  timeout          = 30
  memory_size      = 512

  vpc_config {
    subnet_ids         = aws_subnet.private[*].id
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      NODE_ENV            = "production"
      DATABASE_URL_SECRET = aws_secretsmanager_secret.database_url.name
    }
  }

  layers = [aws_lambda_layer_version.shared_dependencies.arn]

  tags = {
    Name = "${var.project_name}-resend-webhook"
  }
}

# Function URL for Resend Webhook
resource "aws_lambda_function_url" "resend_webhook" {
  function_name      = aws_lambda_function.resend_webhook.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = false
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["content-type", "svix-signature"]
    max_age           = 86400
  }
}

# Outputs
output "email_orchestrator_url" {
  description = "Email Orchestrator Function URL"
  value       = aws_lambda_function_url.email_orchestrator.function_url
}

output "resend_webhook_url" {
  description = "Resend Webhook Function URL"
  value       = aws_lambda_function_url.resend_webhook.function_url
}
