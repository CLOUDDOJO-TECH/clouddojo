# Database Migration Guide

## Critical Fixes Applied

This migration adds missing gamification models and fixes critical bugs in the database schema.

### Changes Included

1. **FIXED: firstName unique constraint bug** - Removed @unique from User.firstName field
2. **ADDED: Gamification models** - UserXP, UserStreak, UserBadge, XPTransaction, DailyActivity, LeaderboardEntry, UserGamificationSettings
3. **ADDED: AI Analysis placeholders** - QuizAnalysis, DashboardAnalysis, TopicMastery

### Running the Migration

**IMPORTANT**: This migration must be run before deploying the updated code.

```bash
# Install dependencies (if not already installed)
pnpm install

# Generate and apply migration
pnpm exec prisma migrate dev --name add-gamification-models-and-fix-firstName

# Or in production
pnpm exec prisma migrate deploy
```

### Environment Variables Required

For webhook security, ensure these environment variables are set:

```bash
# Resend webhook signature verification
RESEND_WEBHOOK_SECRET=your_webhook_secret_from_resend
```

### Verification Steps

After running the migration, verify:

1. **Check migration applied successfully**:
   ```bash
   pnpm exec prisma migrate status
   ```

2. **Verify new tables exist**:
   ```sql
   \dt UserXP
   \dt UserStreak
   \dt UserBadge
   \dt XPTransaction
   \dt DailyActivity
   \dt LeaderboardEntry
   \dt UserGamificationSettings
   \dt QuizAnalysis
   \dt DashboardAnalysis
   \dt TopicMastery
   ```

3. **Check firstName constraint removed**:
   ```sql
   SELECT constraint_name
   FROM information_schema.table_constraints
   WHERE table_name = 'User' AND constraint_name LIKE '%firstName%';
   -- Should return no results
   ```

### Potential Issues

**Issue**: Multiple users with same firstName
**Solution**: This is now allowed! The unique constraint was a bug.

**Issue**: Existing data migration
**Solution**: New models will be populated as users interact with gamification features. Old users will get default records created on first access.

### Rollback (Emergency Only)

If you need to rollback:

```bash
pnpm exec prisma migrate resolve --rolled-back add-gamification-models-and-fix-firstName
```

**WARNING**: This will prevent the application from working with gamification features.
