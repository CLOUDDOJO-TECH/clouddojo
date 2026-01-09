# Example Terraform Variables
# Copy this file to terraform.tfvars and fill in your values

aws_region  = "us-east-1"
environment = "production"

# Database URL (from Vercel Postgres or your DB provider)
database_url = "postgresql://postgres:password@localhost:5432/clouddojo?schema=public"

# Resend API key (from https://resend.com/api-keys)
resend_api_key = "re_NfnvQVEs_KXNU4xcMcJZUh9ZS9SyKMKaG"

# Redis password (optional, leave empty for no password)
redis_password = ""

# CORS origins for Lambda function URLs
lambda_function_url_cors_origins = [
  "https://clouddojo.tech",
  "https://www.clouddojo.tech",
  "https://app.clouddojo.tech",
  "http://localhost:3000",
  "https://*"
]
