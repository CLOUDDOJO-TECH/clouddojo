# Terraform Variables

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "clouddojo"
}

variable "database_url" {
  description = "PostgreSQL database URL"
  type        = string
  sensitive   = true
}

variable "resend_api_key" {
  description = "Resend API key"
  type        = string
  sensitive   = true
}

variable "redis_password" {
  description = "Redis password"
  type        = string
  sensitive   = true
  default     = ""
}

variable "lambda_function_url_cors_origins" {
  description = "Allowed origins for Lambda function URLs"
  type        = list(string)
  default     = ["https://clouddojo.tech", "https://*.clouddojo.tech"]
}

variable "email_queue_visibility_timeout" {
  description = "SQS visibility timeout in seconds"
  type        = number
  default     = 300
}

variable "email_queue_retention_period" {
  description = "SQS message retention period in seconds"
  type        = number
  default     = 345600 # 4 days
}
