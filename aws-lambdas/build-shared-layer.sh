#!/bin/bash
set -e

echo "🔨 Building shared Lambda layer..."

# Create temporary directory structure
rm -rf /tmp/lambda-layer
mkdir -p /tmp/lambda-layer/nodejs/node_modules

# Copy shared code
echo "📦 Copying shared utilities..."
cp -r shared /tmp/lambda-layer/nodejs/

# Create package.json for shared dependencies
echo "📝 Creating package.json..."
cat > /tmp/lambda-layer/nodejs/package.json << 'EOF'
{
  "name": "clouddojo-shared-layer",
  "version": "1.0.0",
  "dependencies": {
    "@prisma/client": "^7.0.0",
    "@prisma/extension-accelerate": "^1.3.0",
    "@prisma/adapter-pg": "^7.0.0",
    "@aws-sdk/client-sqs": "^3.600.0",
    "ioredis": "^5.4.1",
    "resend": "^4.0.1"
  }
}
EOF

# Install dependencies
echo "📦 Installing dependencies..."
cd /tmp/lambda-layer/nodejs
npm install --production

# Create ZIP
echo "📦 Creating shared-layer.zip..."
cd /tmp/lambda-layer
zip -r shared-layer.zip . -q

# Move to aws-lambdas directory
mv shared-layer.zip /Users/glen/Desktop/Developers/clouddojo/aws-lambdas/

echo "✅ Shared layer built successfully!"
ls -lh /Users/glen/Desktop/Developers/clouddojo/aws-lambdas/shared-layer.zip

# Cleanup
rm -rf /tmp/lambda-layer
