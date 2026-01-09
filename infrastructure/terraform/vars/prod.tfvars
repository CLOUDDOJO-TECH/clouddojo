# Example Terraform Variables
# Copy this file to terraform.tfvars and fill in your values

aws_region  = "us-east-1"
environment = "production"

# Database URL (from Vercel Postgres or your DB provider)
database_url = "postgresql://clouddojodb_owner:npg_72XuUHOEYFyg@ep-silent-bar-a2tr7kfk-pooler.eu-central-1.aws.neon.tech/clouddojodb?sslmode=require"

# Resend API key (from https://resend.com/api-keys)
resend_api_key = "re_Uz2TbUzH_KETRWSHDmBiCDUbW3Ze3BHBJ"

# Redis password (optional, leave empty for no password)
redis_password = ""

# CORS origins for Lambda function URLs
lambda_function_url_cors_origins = [
  "https://clouddojo.tech",
  "https://www.clouddojo.tech",
  "https://app.clouddojo.tech",
  "https://*"
]
