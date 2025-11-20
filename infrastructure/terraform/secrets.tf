# AWS Secrets Manager Configuration

# Resend API Key
resource "aws_secretsmanager_secret" "resend_api_key" {
  name                    = "${var.project_name}/resend-api-key-${var.environment}"
  description             = "Resend API key for email service"
  recovery_window_in_days = 7

  tags = {
    Name = "${var.project_name}-resend-api-key"
  }
}

resource "aws_secretsmanager_secret_version" "resend_api_key" {
  secret_id     = aws_secretsmanager_secret.resend_api_key.id
  secret_string = var.resend_api_key
}

# Database URL
resource "aws_secretsmanager_secret" "database_url" {
  name                    = "${var.project_name}/database-url-${var.environment}"
  description             = "PostgreSQL database connection URL"
  recovery_window_in_days = 7

  tags = {
    Name = "${var.project_name}-database-url"
  }
}

resource "aws_secretsmanager_secret_version" "database_url" {
  secret_id     = aws_secretsmanager_secret.database_url.id
  secret_string = var.database_url
}

# Redis URL (constructed from ElastiCache)
resource "aws_secretsmanager_secret" "redis_url" {
  name                    = "${var.project_name}/redis-url-${var.environment}"
  description             = "Redis connection URL"
  recovery_window_in_days = 7

  tags = {
    Name = "${var.project_name}-redis-url"
  }
}

resource "aws_secretsmanager_secret_version" "redis_url" {
  secret_id = aws_secretsmanager_secret.redis_url.id
  secret_string = jsonencode({
    url      = "redis://${aws_elasticache_cluster.redis.cache_nodes[0].address}:${aws_elasticache_cluster.redis.cache_nodes[0].port}"
    host     = aws_elasticache_cluster.redis.cache_nodes[0].address
    port     = aws_elasticache_cluster.redis.cache_nodes[0].port
    password = var.redis_password
  })
}

# IAM policy for Lambda to access secrets
resource "aws_iam_policy" "secrets_access" {
  name        = "${var.project_name}-lambda-secrets-access-${var.environment}"
  description = "Allow Lambda functions to read secrets"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = [
          aws_secretsmanager_secret.resend_api_key.arn,
          aws_secretsmanager_secret.database_url.arn,
          aws_secretsmanager_secret.redis_url.arn
        ]
      }
    ]
  })
}
