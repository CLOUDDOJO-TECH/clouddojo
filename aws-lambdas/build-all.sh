#!/bin/bash
set -e

echo "🔨 Building all Lambda functions..."
echo ""

# Email Orchestrator
echo "📦 Building email-orchestrator..."
cd email-orchestrator
pnpm install
npm run build
npm run package
cd ..
echo "✅ email-orchestrator built"
echo ""

# Queue Processor
echo "📦 Building queue-processor..."
cd queue-processor
pnpm install
npm run build
npm run package
cd ..
echo "✅ queue-processor built"
echo ""

# Resend Webhook
echo "📦 Building resend-webhook..."
cd resend-webhook
pnpm install
npm run build
npm run package
cd ..
echo "✅ resend-webhook built"
echo ""

# Scheduled Campaigns
echo "📦 Building scheduled-campaigns..."
cd scheduled-campaigns
pnpm install
npm run build
npm run package:inactive
npm run package:weekly
cd ..
echo "✅ scheduled-campaigns built"
echo ""

echo "🎉 All Lambda functions built successfully!"
echo ""
echo "Generated ZIP files:"
ls -lh email-orchestrator/*.zip queue-processor/*.zip resend-webhook/*.zip scheduled-campaigns/*.zip
