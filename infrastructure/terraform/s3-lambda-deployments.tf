# S3 Bucket for Lambda Deployment Packages

resource "aws_s3_bucket" "lambda_deployments" {
  bucket = "${var.project_name}-lambda-deployments-${var.environment}"

  tags = {
    Name        = "Lambda Deployment Packages"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_versioning" "lambda_deployments" {
  bucket = aws_s3_bucket.lambda_deployments.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "lambda_deployments" {
  bucket = aws_s3_bucket.lambda_deployments.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "lambda_deployments" {
  bucket = aws_s3_bucket.lambda_deployments.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Upload Lambda deployment packages to S3
resource "aws_s3_object" "shared_layer" {
  bucket = aws_s3_bucket.lambda_deployments.id
  key    = "layers/shared-layer.zip"
  source = "../../aws-lambdas/shared-layer.zip"
  etag   = filemd5("../../aws-lambdas/shared-layer.zip")
}

resource "aws_s3_object" "email_orchestrator" {
  bucket = aws_s3_bucket.lambda_deployments.id
  key    = "functions/email-orchestrator.zip"
  source = "../../aws-lambdas/email-orchestrator/function.zip"
  etag   = filemd5("../../aws-lambdas/email-orchestrator/function.zip")
}

resource "aws_s3_object" "queue_processor" {
  bucket = aws_s3_bucket.lambda_deployments.id
  key    = "functions/queue-processor.zip"
  source = "../../aws-lambdas/queue-processor/function.zip"
  etag   = filemd5("../../aws-lambdas/queue-processor/function.zip")
}

resource "aws_s3_object" "resend_webhook" {
  bucket = aws_s3_bucket.lambda_deployments.id
  key    = "functions/resend-webhook.zip"
  source = "../../aws-lambdas/resend-webhook/function.zip"
  etag   = filemd5("../../aws-lambdas/resend-webhook/function.zip")
}

resource "aws_s3_object" "inactive_users" {
  bucket = aws_s3_bucket.lambda_deployments.id
  key    = "functions/inactive-users.zip"
  source = "../../aws-lambdas/scheduled-campaigns/inactive-users.zip"
  etag   = filemd5("../../aws-lambdas/scheduled-campaigns/inactive-users.zip")
}

resource "aws_s3_object" "weekly_progress" {
  bucket = aws_s3_bucket.lambda_deployments.id
  key    = "functions/weekly-progress.zip"
  source = "../../aws-lambdas/scheduled-campaigns/weekly-progress.zip"
  etag   = filemd5("../../aws-lambdas/scheduled-campaigns/weekly-progress.zip")
}
