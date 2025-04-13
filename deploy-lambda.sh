#!/bin/bash

# Exit on error
set -e

# Function to delete existing resources
cleanup_resources() {
    echo "Cleaning up existing resources..."
    
    # Delete Lambda function if it exists
    if aws lambda get-function --function-name ai-analysis &> /dev/null; then
        echo "Deleting existing Lambda function..."
        aws lambda delete-function --function-name ai-analysis
    fi

    # Delete API Gateway if it exists
    EXISTING_API_ID=$(aws apigateway get-rest-apis --query 'items[?name==`ai-analysis-api`].id' --output text)
    if [ ! -z "$EXISTING_API_ID" ]; then
        echo "Deleting existing API Gateway..."
        aws apigateway delete-rest-api --rest-api-id $EXISTING_API_ID
    fi

    # Detach policies from role if it exists
    if aws iam get-role --role-name ai-analysis-lambda-role &> /dev/null; then
        echo "Detaching policies from existing role..."
        
        # Get and detach all attached policies
        ATTACHED_POLICIES=$(aws iam list-attached-role-policies --role-name ai-analysis-lambda-role --query 'AttachedPolicies[*].PolicyArn' --output text)
        for POLICY_ARN in $ATTACHED_POLICIES; do
            aws iam detach-role-policy --role-name ai-analysis-lambda-role --policy-arn $POLICY_ARN
        done

        # Delete the role
        echo "Deleting existing role..."
        aws iam delete-role --role-name ai-analysis-lambda-role
    fi

    # Delete custom policy if it exists
    EXISTING_POLICY_ARN=$(aws iam list-policies --scope Local --query 'Policies[?PolicyName==`ai-analysis-lambda-db-policy`].Arn' --output text)
    if [ ! -z "$EXISTING_POLICY_ARN" ]; then
        echo "Deleting existing custom policy..."
        aws iam delete-policy --policy-arn $EXISTING_POLICY_ARN
    fi

    echo "Cleanup completed."
}

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

# Get AWS account ID and region
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=$(aws configure get region)

echo "Using AWS Account: $AWS_ACCOUNT_ID"
echo "Using Region: $AWS_REGION"

# Check for required environment variables
if [ -z "$GEMINI_API_KEY" ] || [ -z "$DATABASE_URL" ]; then
    echo "Please set the following environment variables:"
    echo "GEMINI_API_KEY: Your Google Gemini API key"
    echo "DATABASE_URL: Your database connection string"
    exit 1
fi

# Ask if user wants to clean up existing resources
read -p "Do you want to clean up existing resources before deploying? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cleanup_resources
fi

# Generate a random API key for Lambda
LAMBDA_API_KEY=$(openssl rand -hex 32)

echo "Creating IAM role..."
# Create trust policy
echo '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}' > trust-policy.json

# Create IAM role
ROLE_ARN=""
if aws iam get-role --role-name ai-analysis-lambda-role &> /dev/null; then
    echo "Role already exists, using existing role..."
    ROLE_ARN=$(aws iam get-role --role-name ai-analysis-lambda-role --query 'Role.Arn' --output text)
else
    echo "Creating new role..."
    ROLE_ARN=$(aws iam create-role \
        --role-name ai-analysis-lambda-role \
        --assume-role-policy-document file://trust-policy.json \
        --query 'Role.Arn' \
        --output text)
fi

echo "Role ARN: $ROLE_ARN"

# Attach basic Lambda execution policy
echo "Attaching Lambda execution policy..."
aws iam attach-role-policy \
    --role-name ai-analysis-lambda-role \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole || true

# Create and attach RDS policy
echo "Creating and attaching RDS policy..."
POLICY_ARN=$(aws iam create-policy \
    --policy-name ai-analysis-lambda-db-policy \
    --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["rds-db:connect","rds:*"],"Resource":"*"}]}' \
    --query 'Policy.Arn' \
    --output text 2>/dev/null || \
    aws iam list-policies --scope Local --query 'Policies[?PolicyName==`ai-analysis-lambda-db-policy`].Arn' --output text)

aws iam attach-role-policy \
    --role-name ai-analysis-lambda-role \
    --policy-arn $POLICY_ARN || true

# Wait for role to propagate
echo "Waiting for IAM role to propagate..."
sleep 10

# Build and package Lambda function
echo "Building Lambda function..."
cd lambda/ai-analysis
npm install
npm run build
zip -r function.zip dist/* node_modules/*
cd ../..

echo "Creating/Updating Lambda function..."
if aws lambda get-function --function-name ai-analysis &> /dev/null; then
    # Update existing function
    aws lambda update-function-code \
        --function-name ai-analysis \
        --zip-file fileb://lambda/ai-analysis/function.zip

    aws lambda update-function-configuration \
        --function-name ai-analysis \
        --runtime nodejs20.x \
        --handler dist/index.handler \
        --role $ROLE_ARN \
        --timeout 30 \
        --memory-size 512 \
        --environment "Variables={GEMINI_API_KEY=$GEMINI_API_KEY,LAMBDA_API_KEY=$LAMBDA_API_KEY,DATABASE_URL=$DATABASE_URL}"
else
    # Create new function
    aws lambda create-function \
        --function-name ai-analysis \
        --runtime nodejs20.x \
        --handler dist/index.handler \
        --role $ROLE_ARN \
        --zip-file fileb://lambda/ai-analysis/function.zip \
        --timeout 30 \
        --memory-size 512 \
        --environment "Variables={GEMINI_API_KEY=$GEMINI_API_KEY,LAMBDA_API_KEY=$LAMBDA_API_KEY,DATABASE_URL=$DATABASE_URL}"
fi

echo "Creating API Gateway..."
# Create API Gateway
API_ID=$(aws apigateway create-rest-api \
    --name ai-analysis-api \
    --description "API for AI Analysis Lambda" \
    --query 'id' \
    --output text)

echo "API Gateway ID: $API_ID"

# Get root resource ID
ROOT_RESOURCE_ID=$(aws apigateway get-resources \
    --rest-api-id $API_ID \
    --query 'items[?path==`/`].id' \
    --output text)

# Create resource
RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $ROOT_RESOURCE_ID \
    --path-part "analyze" \
    --query 'id' \
    --output text)

echo "Setting up API Gateway methods and integration..."
# Create POST method
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method POST \
    --authorization-type NONE

# Set up Lambda integration
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method POST \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri arn:aws:apigateway:${AWS_REGION}:lambda:path/2015-03-31/functions/arn:aws:lambda:${AWS_REGION}:${AWS_ACCOUNT_ID}:function:ai-analysis/invocations

# Enable CORS
aws apigateway put-method-response \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method POST \
    --status-code 200 \
    --response-parameters "method.response.header.Access-Control-Allow-Origin=true"

# Deploy API
echo "Deploying API..."
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name prod

# Add Lambda permission for API Gateway
echo "Adding Lambda permissions..."
aws lambda add-permission \
    --function-name ai-analysis \
    --statement-id apigateway-prod \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:${AWS_REGION}:${AWS_ACCOUNT_ID}:${API_ID}/*/*/analyze" || true

# Create .env.local with the new values
echo "Creating .env.local with new values..."
cat > .env.local << EOF
AWS_LAMBDA_AI_ANALYSIS_URL=https://${API_ID}.execute-api.${AWS_REGION}.amazonaws.com/prod/analyze
AWS_LAMBDA_API_KEY=${LAMBDA_API_KEY}
EOF

echo "Deployment complete!"
echo "API Endpoint: https://${API_ID}.execute-api.${AWS_REGION}.amazonaws.com/prod/analyze"
echo "Lambda API Key: ${LAMBDA_API_KEY}"
echo "These values have been saved to .env.local"

# Cleanup
rm trust-policy.json 