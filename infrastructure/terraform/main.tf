# CloudDojo Email Service Infrastructure
# Terraform Configuration

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # runn the following commands first to create a bucket and apply the rules
  # BUCKET CREATION
  # aws s3api create-bucket \
  #   --bucket clouddojo-terraform-state \
  #   --region us-east-1
  #
  # BUCKET VERSIONING
  # aws s3api put-bucket-versioning \
  #   --bucket clouddojo-terraform-state \
  #   --versioning-configuration Status=Enabled
  #
  # BUCKET POLICIES
  #aws s3api put-bucket-encryption \
  # --bucket clouddojo-terraform-state \
  # --server-side-encryption-configuration '{
  #   "Rules": [{
  #     "ApplyServerSideEncryptionByDefault": {
  #       "SSEAlgorithm": "AES256"
  #     }
  #   }]
  # }'
  #
  # ACCESS BLOCK
  # aws s3api put-public-access-block \
  # --bucket clouddojo-terraform-state \
  # --public-access-block-configuration \
  #   "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"


  # AFTER YOU DO ALL OF THESE, YOU CAN THEN GO AHEAD TO RUN THE FOLLOWING COMMANDS TO INITIALIZE THE TERRAFORM STATE
  # terraform init


  # in case i want to use my dynamodb and s3:
  # backend "s3" {
  # bucket         = "clouddojo-terraform-state"
  # key            = "email-service/terraform.tfstate"
  # region         = "us-east-1"
  # dynamodb_table = "clouddojo-terraform-state-lock"
  # encrypt        = true

  # Terraform Cloud configuration (local execution mode)
  cloud {
    organization = "clouddojo_tech"

    workspaces {
      name = "cldj"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "CloudDojo"
      Service     = "EmailService"
      ManagedBy   = "Terraform"
      Environment = var.environment
    }
  }
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
