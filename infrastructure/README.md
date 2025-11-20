# CloudDojo Email Service Infrastructure

This directory contains Infrastructure as Code (IaC) for the CloudDojo email service built with AWS services.

## Architecture Overview

![Architecture Diagram](./architecture-diagram.png)

## Infrastructure Components

### AWS Services Used

1. **Lambda Functions** (5 total)
   - `email-orchestrator`: Entry point from Next.js app
   - `queue-processor`: Processes SQS queue and sends emails
   - `weekly-progress`: Weekly progress report campaign
   - `inactive-users`: Re-engagement campaign for inactive users
   - `resend-webhook`: Handles Resend webhook events

2. **SQS (Simple Queue Service)**
   - Main queue: Email message queue with retry logic
   - DLQ: Dead letter queue for failed emails

3. **ElastiCache Redis**
   - Deduplication (prevent sending duplicate emails)
   - Rate limiting
   - Caching email eligibility checks

4. **EventBridge**
   - Cron schedules for automated campaigns
   - Weekly Progress: Sundays at 10 AM UTC
   - Inactive Users: Daily at 2 PM UTC

5. **VPC (Virtual Private Cloud)**
   - Private subnets for Lambda and Redis
   - Public subnets for NAT Gateway
   - Internet access via NAT Gateway

6. **Secrets Manager**
   - Resend API key
   - Database URL
   - Redis connection details

7. **CloudWatch**
   - Logs for all Lambda functions
   - Alarms for DLQ messages

## Prerequisites

### Required Tools

- **Terraform** >= 1.0 ([Install](https://developer.hashicorp.com/terraform/install))
- **AWS CLI** ([Install](https://aws.amazon.com/cli/))
- **Node.js** >= 20.x (for building Lambda functions)
- **pnpm** (for dependency management)

### Required Credentials

1. **AWS Account**
   - IAM user with administrator access or specific permissions for:
     - Lambda, SQS, VPC, ElastiCache, Secrets Manager, EventBridge, CloudWatch

2. **Environment Variables**
   - `DATABASE_URL`: PostgreSQL connection string
   - `RESEND_API_KEY`: Resend API key from https://resend.com

## Setup Instructions

### Step 1: Configure AWS Credentials

```bash
# Configure AWS CLI with your credentials
aws configure

# Enter your:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (e.g., us-east-1)
# - Default output format (json)

# Verify
aws sts get-caller-identity
```

### Step 2: Prepare Environment Variables

```bash
cd infrastructure/terraform

# Copy example variables file
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars with your values
nano terraform.tfvars
```

Example `terraform.tfvars`:

```hcl
aws_region  = "us-east-1"
environment = "production"

# Your database URL (from Vercel, Supabase, or your DB provider)
database_url = "postgresql://user:password@host:5432/clouddojo?sslmode=require"

# Your Resend API key
resend_api_key = "re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Redis password (optional)
redis_password = ""

# CORS origins
lambda_function_url_cors_origins = [
  "https://clouddojo.tech",
  "https://*.clouddojo.tech"
]
```

### Step 3: Build Lambda Functions

Before running Terraform, you need to build and package the Lambda functions.

```bash
# From the root of the project
cd aws-lambdas

# Build each Lambda function
for dir in email-orchestrator queue-processor resend-webhook; do
  cd $dir
  pnpm install
  pnpm run build
  pnpm run package
  cd ..
done

# Build scheduled campaigns
cd scheduled-campaigns
pnpm install
pnpm run build
# Package individual handlers
zip -r weekly-progress.zip dist node_modules -x "*.ts" "*.md"
zip -r inactive-users.zip dist node_modules -x "*.ts" "*.md"
cd ..
```

### Step 4: Initialize Terraform

```bash
cd ../infrastructure/terraform

# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Review the output carefully - you should see:
# - VPC and networking resources
# - SQS queues
# - ElastiCache Redis cluster
# - Lambda functions
# - EventBridge rules
# - Secrets Manager secrets
```

### Step 5: Deploy Infrastructure

```bash
# Apply Terraform configuration
terraform apply

# Type 'yes' when prompted

# ⏱️  Deployment takes ~10-15 minutes
# ElastiCache Redis is the slowest (~5-10 minutes)
```

### Step 6: Save Outputs

After deployment, save the important outputs:

```bash
# Get Lambda function URLs
terraform output email_orchestrator_url
terraform output resend_webhook_url

# Get SQS queue URL
terraform output sqs_queue_url

# Get Redis endpoint
terraform output redis_endpoint
```

**Add these to your Next.js environment variables:**

```env
# .env.production
EMAIL_ORCHESTRATOR_URL=<output from terraform>
RESEND_WEBHOOK_URL=<output from terraform>
```

### Step 7: Configure Resend Webhooks

1. Go to https://resend.com/webhooks
2. Click "Add Webhook"
3. Enter the webhook URL from Terraform output
4. Select events:
   - `email.delivered`
   - `email.opened`
   - `email.clicked`
   - `email.bounced`
   - `email.complained`
5. Save webhook

### Step 8: Run Database Migration

```bash
# From root of project
cd ../..

# Run Prisma migration
pnpm prisma migrate dev --name add_email_service
```

## Verification

### Test Email Orchestrator

```bash
# Get the email orchestrator URL
ORCHESTRATOR_URL=$(cd infrastructure/terraform && terraform output -raw email_orchestrator_url)

# Send test email event
curl -X POST $ORCHESTRATOR_URL \
  -H "Content-Type: application/json" \
  -H "x-clouddojo-signature: test" \
  -d '{
    "eventType": "user.created",
    "userId": "test-user-id",
    "eventData": {
      "username": "Test User",
      "email": "test@example.com"
    }
  }'
```

### Check CloudWatch Logs

```bash
# View orchestrator logs
aws logs tail /aws/lambda/clouddojo-email-orchestrator-production --follow

# View queue processor logs
aws logs tail /aws/lambda/clouddojo-queue-processor-production --follow
```

### Monitor SQS Queue

```bash
# Check queue metrics
aws sqs get-queue-attributes \
  --queue-url $(cd infrastructure/terraform && terraform output -raw sqs_queue_url) \
  --attribute-names ApproximateNumberOfMessages ApproximateNumberOfMessagesNotVisible
```

## Monitoring & Alerts

### CloudWatch Dashboards

Create a CloudWatch dashboard:

1. Go to AWS Console > CloudWatch > Dashboards
2. Create new dashboard: `clouddojo-email-service`
3. Add widgets for:
   - Lambda invocations
   - Lambda errors
   - Lambda duration
   - SQS queue depth
   - DLQ message count
   - Redis CPU utilization

### Recommended Alarms

```bash
# DLQ messages alarm (already created by Terraform)
# Lambda errors alarm (add manually)
# Redis memory alarm (add manually)
```

## Cost Estimation

Monthly costs (for 10,000 users, ~50,000 emails/month):

| Service | Cost |
|---------|------|
| Lambda (100K invocations) | ~$2 |
| SQS (100K messages) | ~$0.05 |
| ElastiCache Redis (t4g.micro) | ~$11 |
| NAT Gateway | ~$32 |
| CloudWatch Logs | ~$2.50 |
| Secrets Manager | ~$2.50 |
| **Total AWS** | **~$50/month** |
| Resend (50K emails) | ~$20/month |
| **Grand Total** | **~$70/month** |

## Troubleshooting

### Lambda timeout errors

If Lambdas are timing out:
- Check VPC configuration (NAT Gateway working?)
- Verify Redis connectivity
- Check database connection

```bash
# Test VPC connectivity
aws lambda invoke \
  --function-name clouddojo-email-orchestrator-production \
  --payload '{"test": true}' \
  response.json
```

### Emails not sending

1. Check SQS queue for messages
2. Check DLQ for failed messages
3. Verify Resend API key in Secrets Manager
4. Check CloudWatch logs for errors

### Redis connection issues

```bash
# Check Redis cluster status
aws elasticache describe-cache-clusters \
  --cache-cluster-id clouddojo-redis-production \
  --show-cache-node-info
```

## Cleanup

To destroy all infrastructure:

```bash
cd infrastructure/terraform

# Preview destruction
terraform plan -destroy

# Destroy all resources
terraform destroy

# Type 'yes' when prompted

# Note: This will delete:
# - All Lambda functions
# - SQS queues (and messages)
# - Redis cluster (and data)
# - VPC and networking
# - Secrets (after 7-day recovery window)
```

## Alternative: CloudFormation

If you prefer CloudFormation over Terraform:

```bash
cd infrastructure/cloudformation

aws cloudformation create-stack \
  --stack-name clouddojo-email-service \
  --template-body file://email-service.yaml \
  --parameters \
    ParameterKey=Environment,ParameterValue=production \
    ParameterKey=DatabaseURL,ParameterValue="your-db-url" \
    ParameterKey=ResendAPIKey,ParameterValue="your-resend-key" \
  --capabilities CAPABILITY_IAM
```

**Note:** CloudFormation template is a backup/simplified version. Terraform is recommended for production.

## Support

For issues:
1. Check CloudWatch logs
2. Review [AWS Lambda documentation](https://docs.aws.amazon.com/lambda/)
3. Review [Terraform AWS Provider docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
