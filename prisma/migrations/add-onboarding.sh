#!/bin/bash

# Run Prisma migration to add the UserOnboarding model
echo "Running Prisma migration for onboarding schema changes..."
npx prisma migrate dev --name add-user-onboarding

# Generate updated Prisma client
echo "Generating updated Prisma client..."
npx prisma generate

echo "Migration completed successfully!"
echo "You can now implement the onboarding flow for new users." 