# Clerk Configuration for Activation Flow

## Environment Variables

Add these to your Vercel/production environment and `.env.local`:

```bash
# Clerk redirect URLs
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/activation
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard

# For existing users, redirect to dashboard
# For new signups, redirect to activation flow
```

## Vercel Configuration

1. Go to Vercel project settings
2. Navigate to Environment Variables
3. Add the following:
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` = `/activation`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` = `/dashboard`
4. Redeploy

## Clerk Dashboard Configuration

1. Go to https://dashboard.clerk.com
2. Select your application
3. Navigate to **Paths** settings
4. Set:
   - **After sign up** → `/activation`
   - **After sign in** → `/dashboard`

## How It Works

### New User Flow
```
User clicks "Sign Up"
      ↓
Clerk modal opens
      ↓
User completes signup
      ↓
Clerk webhook creates User record
      ↓
Auto-redirect to /activation
      ↓
User completes activation (profile + quiz)
      ↓
Redirect to /dashboard (now populated with first quiz)
```

### Existing User Flow
```
User clicks "Sign In"
      ↓
Clerk modal opens
      ↓
User signs in
      ↓
Auto-redirect to /dashboard
```

### Middleware Protection

The activation flow is protected by middleware that checks:
1. If user is authenticated (Clerk)
2. If user has completed onboarding
3. If not, redirect to `/activation`
4. If yes, allow access to `/dashboard`

## Testing

### Local Testing

1. Create `.env.local` if it doesn't exist:
```bash
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/activation
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
```

2. Start development server:
```bash
npm run dev
```

3. Test signup flow:
   - Go to `/sign-up` (or click Sign Up button)
   - Complete signup
   - Should redirect to `/activation` automatically

4. Test signin flow:
   - Sign out
   - Go to `/sign-in`
   - Sign in with existing account
   - Should redirect to `/dashboard` automatically

### Production Testing

1. Deploy to staging/preview
2. Test complete signup flow
3. Verify redirect to `/activation`
4. Complete activation flow
5. Verify `hasCompletedOnboarding` flag is set
6. Sign out and sign back in
7. Verify redirect to `/dashboard` (not `/activation`)

## Troubleshooting

### Issue: Redirect not working

**Check**:
1. Environment variables are set in Vercel
2. Clerk dashboard paths are configured
3. Redeploy after changing environment variables

**Debug**:
```javascript
// Add to any page to check env vars
console.log('Sign up URL:', process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL);
console.log('Sign in URL:', process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL);
```

### Issue: Users bypass activation

**Solution**: Add middleware check in `/middleware.ts`:

```typescript
export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Check onboarding status for protected routes
  if (userId && req.nextUrl.pathname.startsWith('/dashboard')) {
    const user = await prisma.user.findUnique({
      where: { userId },
      select: { hasCompletedOnboarding: true }
    });

    if (!user?.hasCompletedOnboarding) {
      return NextResponse.redirect(new URL('/activation', req.url));
    }
  }

  // ... existing middleware logic
});
```

### Issue: Activation page accessible to completed users

**Solution**: Add check in `/app/activation/page.tsx`:

```typescript
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/react";

export default function ActivationPage() {
  const router = useRouter();
  const { data: user } = trpc.user.getCurrentUser.useQuery();

  useEffect(() => {
    if (user?.hasCompletedOnboarding) {
      router.push("/dashboard");
    }
  }, [user?.hasCompletedOnboarding, router]);

  // ... rest of component
}
```

## Rollout Strategy

### Phase 1: Soft Launch (Week 1)
- Deploy activation flow
- Set environment variables
- Configure Clerk redirects
- Test with internal team

### Phase 2: A/B Test (Week 2)
- 10% of new signups → `/activation`
- 90% of new signups → `/onboarding` (old flow)
- Track metrics:
  - Activation completion rate
  - Time to first quiz
  - 7-day retention

### Phase 3: Gradual Rollout (Week 3)
- 50% of new signups → `/activation`
- 50% of new signups → `/onboarding`
- Monitor for issues
- Gather user feedback

### Phase 4: Full Rollout (Week 4)
- 100% of new signups → `/activation`
- Remove old `/onboarding` page
- Update documentation
- Celebrate 🎉

## Metrics to Track

### Activation Metrics
- **Completion rate**: `(completed activation / started activation) * 100`
- **Time to completion**: Average time from signup to dashboard
- **Drop-off by step**:
  - Profile completion
  - Quiz completion
  - Dashboard arrival

### Comparison with Old Flow
- Activation rate (new vs old)
- Time to first quiz (new vs old)
- 7-day retention (new vs old)

### Expected Results
- **Activation rate**: +50% (from 40% to 60%)
- **Time to first quiz**: -67% (from 15 min to 5 min)
- **7-day retention**: +30% (from 50% to 65%)

## Migration Plan for Existing Users

**Note**: Activation flow is only for NEW signups. Existing users continue to use `/dashboard` normally.

If you want to migrate existing users:

1. **Optional**: Create migration script:
```typescript
// scripts/migrate-to-activation.ts
import { prisma } from "@/lib/prisma";

async function migrateUsers() {
  // Find users who haven't completed onboarding
  const incompleteUsers = await prisma.user.findMany({
    where: { hasCompletedOnboarding: false }
  });

  console.log(`Found ${incompleteUsers.length} users to migrate`);

  // Send email: "Complete your profile to unlock features"
  // Link to /activation
}
```

2. **Recommended**: Leave existing users as-is, only apply to new signups.

## Summary

✅ **Environment variables**: Set redirect URLs
✅ **Clerk dashboard**: Configure paths
✅ **Middleware**: Protect activation flow
✅ **Testing**: Verify both signup and signin flows
✅ **Rollout**: Gradual deployment with A/B testing

**Expected outcome**: 50% higher activation rate, 67% faster time to first quiz, better 7-day retention.
