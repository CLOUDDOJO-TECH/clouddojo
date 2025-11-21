# Demo Email Capture - Testing & Deployment Guide

> **Status**: ✅ Code complete, ready for database migration and testing
> **Branch**: `claude/review-frontend-plan-018cjU84AdJZTHYuomUZKLRr`
> **Phase**: 1 - Lead Capture & Activation, Task 1

---

## What Was Built

### 1. **Email Capture Modal Component**
**File**: `features/quiz/components/demo-email-capture.tsx`

**Features**:
- Clean, minimal modal design (consistent with design system)
- Email validation with regex
- Shows preview of locked content with value propositions
- Success/error handling with toast notifications
- Loading states during submission

**UI Elements**:
- Lock icon to indicate premium content
- Preview list of what's unlocked (4 items)
- Email input with Mail icon
- Submit button with loading state
- Privacy message at bottom

### 2. **API Endpoint**
**File**: `app/api/demo/capture-email/route.ts`

**Functionality**:
- POST endpoint at `/api/demo/capture-email`
- Email validation (format check)
- Score data validation (number types)
- Upsert logic (create new or update existing)
- Proper error handling with status codes
- Returns leadId on success

**Security**:
- Input validation on server side
- Regex email validation
- Type checking for all numeric fields
- Graceful error handling for duplicates

### 3. **Database Model**
**File**: `prisma/schema.prisma` (line 687)

**Schema**:
```prisma
model DemoLead {
  id             String   @id @default(uuid())
  email          String   @unique
  score          Int
  totalQuestions Int
  percentage     Int
  provider       String?
  createdAt      DateTime @default(now())
  convertedToUser Boolean @default(false)
}
```

**Fields**:
- `email`: Unique constraint for deduplication
- `score`, `totalQuestions`, `percentage`: Quiz performance data
- `provider`: Optional cloud provider (AWS, Azure, GCP, etc.)
- `convertedToUser`: Flag for tracking conversion to paid user

### 4. **Demo Page Integration**
**File**: `app/demo/page.tsx`

**Changes**:
- Added `showEmailCapture` and `emailSubmitted` state
- Trigger modal on quiz completion (line 94)
- Blur results until email submitted (line 362)
- Pass quiz data to modal component

**User Flow**:
```
Complete quiz → Modal appears → Enter email → Submit
                                    ↓
                            Results unblur + Success toast
```

---

## Deployment Steps

### Step 1: Database Migration

**Run this command in production environment**:
```bash
npx prisma migrate dev --name add_demo_lead_model
```

**Or in production**:
```bash
npx prisma migrate deploy
```

**Expected output**:
```
✓ Generated Prisma Client
✓ Applied 1 migration:
  └─ 20251120_add_demo_lead_model
```

**Verify migration**:
```bash
npx prisma studio
# Check that DemoLead table exists
```

### Step 2: Push Branch to Remote

**Already done** - all changes committed and pushed to:
```
Branch: claude/review-frontend-plan-018cjU84AdJZTHYuomUZKLRr
```

### Step 3: Deploy to Staging/Production

**Vercel deployment**:
- Push triggers automatic deployment
- Ensure `DATABASE_URL` and `DIRECT_DATABASE_URL` are set in Vercel environment variables
- Post-build will run `prisma generate` automatically

---

## Testing Checklist

### Manual Testing (Once Deployed)

#### Test 1: Email Capture Flow
- [ ] Navigate to `/demo`
- [ ] Select a provider (AWS/Azure/GCP)
- [ ] Click "Start Practice Quiz"
- [ ] Answer all 10 questions
- [ ] Click "View Results" on last question
- [ ] **Expected**: Modal appears with email form
- [ ] **Expected**: Results are blurred in background
- [ ] Enter valid email: `test@example.com`
- [ ] Click "Get My Full Results"
- [ ] **Expected**: Loading state shows "Unlocking..."
- [ ] **Expected**: Success toast appears
- [ ] **Expected**: Modal closes
- [ ] **Expected**: Results unblur and become interactive
- [ ] **Expected**: Subtitle changes to "Here's your full analysis"

#### Test 2: Email Validation
- [ ] Complete quiz to reach results
- [ ] Try submitting without email
- [ ] **Expected**: Form validation error
- [ ] Enter invalid email: `notanemail`
- [ ] **Expected**: Error toast "Please enter a valid email address"
- [ ] Enter valid email
- [ ] **Expected**: Success

#### Test 3: Duplicate Email Handling
- [ ] Complete quiz with same email as before
- [ ] **Expected**: No error (upsert updates existing record)
- [ ] Verify in database that only one record exists

#### Test 4: Database Verification
- [ ] After successful submission, check database:
```sql
SELECT * FROM "DemoLead" ORDER BY "createdAt" DESC LIMIT 10;
```
- [ ] **Expected**: Record exists with:
  - email: test@example.com
  - score: (your score, e.g., 7)
  - totalQuestions: 10
  - percentage: (calculated, e.g., 70)
  - provider: "AWS" (or whatever you selected)
  - createdAt: recent timestamp
  - convertedToUser: false

#### Test 5: Error Handling
- [ ] Complete quiz
- [ ] Submit email
- [ ] While loading, disable network in DevTools
- [ ] **Expected**: Error toast "Something went wrong. Please try again."
- [ ] Re-enable network, try again
- [ ] **Expected**: Success

#### Test 6: Visual Design Review
- [ ] Modal appearance:
  - [ ] Sparkles icon with emerald background
  - [ ] "Unlock Your Full Results" title centered
  - [ ] Preview box with lock icon
  - [ ] 4 checkmark items (performance, analysis, recommendations, comparison)
  - [ ] Email input with mail icon
  - [ ] Primary button styling
  - [ ] Privacy message at bottom
- [ ] Blurred results:
  - [ ] CSS blur applied correctly
  - [ ] Pointer events disabled (can't click)
  - [ ] Text selection disabled
  - [ ] Opacity reduced (40%)

#### Test 7: Conversion Psychology Elements
- [ ] Modal shows what's unlocked (progressive disclosure)
- [ ] Results visible but blurred (visual FOMO)
- [ ] Lock icon signals premium content
- [ ] Specific benefits listed (not generic)
- [ ] Privacy message builds trust
- [ ] No way to close modal (commitment)

---

## Analytics to Track (Future)

### Key Metrics

**Conversion Metrics**:
1. **Lead capture rate**: `(emails captured / quiz completions) * 100`
   - Target: 30-40%
2. **Email → signup rate**: `(signups from demo / emails captured) * 100`
   - Track via campaign parameter or email matching

**Engagement Metrics**:
1. **Modal abandonment**: Users who see modal but don't submit
2. **Time to submit**: Seconds from modal open to submit
3. **Invalid email attempts**: Number of validation errors

**Quality Metrics**:
1. **Average score of leads**: Higher scores = more engaged users
2. **Provider distribution**: Which providers attract most leads
3. **Conversion by score**: Do high scorers convert more?

### Implementation (Phase 3)

**Add event tracking**:
```typescript
// In DemoEmailCapture.tsx
analytics.track('demo_email_modal_viewed', {
  score,
  totalQuestions,
  percentage
});

analytics.track('demo_email_submitted', {
  email,
  score,
  percentage,
  provider
});

// In app/demo/page.tsx
analytics.track('demo_quiz_completed', {
  score: correctAnswersCount,
  total: questions?.length,
  provider: selectedProvider
});
```

---

## Expected Results

### Business Impact

**Conservative Estimate**:
- 30% lead capture rate (300 emails per 1,000 quiz completions)
- 5% email → signup conversion (15 signups per 1,000 quiz completions)
- **Result**: 1.5% demo → signup rate

**Optimistic Estimate**:
- 40% lead capture rate (400 emails per 1,000 quiz completions)
- 10% email → signup conversion (40 signups per 1,000 quiz completions)
- **Result**: 4% demo → signup rate

### User Experience

**Positive**:
- Clear value proposition before asking for email
- Non-intrusive modal (appears at natural completion point)
- Instant gratification (results unlock immediately)
- Privacy-focused messaging

**Potential Concerns**:
- Can't close modal (intentional, but some users may feel trapped)
- Can't see results without email (creates barrier)

**Mitigation**:
- Modal appears after sunk cost (10 mins of quiz time)
- Clear preview of what's being unlocked
- Privacy message: "Unsubscribe anytime"

---

## Code Quality Verification

### TypeScript

**Status**: ✅ No errors in new code
- All components properly typed
- tRPC mutations type-safe
- Props interfaces defined
- Event handlers typed correctly

**Note**: Pre-existing TypeScript errors in codebase (unrelated files in `to-delete/` folder)

### Design System Compliance

**Status**: ✅ Follows design guidelines
- ✅ Uses Satoshi font (var(--font-satoshi))
- ✅ Minimal design (no gradients, no shadows)
- ✅ Clean borders (border-border)
- ✅ Proper spacing (gap-3, gap-4, p-4, p-6)
- ✅ Consistent colors (emerald-500, muted-foreground)
- ✅ Responsive design (sm: breakpoints)

### Performance

**Considerations**:
- Modal renders on demand (not on initial page load)
- Blur effect uses CSS (hardware accelerated)
- No heavy dependencies added
- API call only on submit (not on modal open)

---

## Troubleshooting

### Issue: Modal doesn't appear
**Check**:
1. Quiz completed successfully? (all 10 questions answered)
2. `handleNext` called on last question? (currentQuestionIndex === 9)
3. Console errors? (check browser DevTools)

**Debug**:
```typescript
// Add in handleNext:
console.log('Quiz complete, showing modal', {
  currentQuestionIndex,
  questionsLength: questions?.length,
  showEmailCapture
});
```

### Issue: Results not blurring
**Check**:
1. `emailSubmitted` state is false?
2. CSS classes applied? (inspect element)

**Debug**:
```typescript
// Add in render:
console.log('Results blur state:', {
  emailSubmitted,
  className: emailSubmitted ? '' : 'blur-sm pointer-events-none select-none opacity-40'
});
```

### Issue: API error 500
**Check**:
1. Database connected? (verify DATABASE_URL)
2. Prisma migration ran? (check DemoLead table exists)
3. Server logs? (check Vercel logs or console)

**Debug**:
```bash
# Check if table exists
npx prisma studio
# Or query directly
psql $DATABASE_URL -c "SELECT * FROM \"DemoLead\" LIMIT 1;"
```

### Issue: Duplicate email error (409)
**Expected behavior**: Upsert should update existing record
**Check**:
1. Verify upsert logic in API route (line 31-46)
2. Check database logs

**Fix**: Already handled with upsert - if you see 409, it means upsert failed

---

## Next Steps

### After Successful Testing

1. **Mark task complete** ✅
2. **Update todo list**: Move to Task 2
3. **Continue Phase 1**: Unified Activation Flow
4. **Monitor metrics**: Track lead capture rate

### Phase 1, Task 2: Unified Activation Flow

**Goal**: Remove activation valley of death
**Approach**:
- Create 5-question diagnostic quiz
- Merge with profile creation
- Auto-redirect after signup
- Show personalized dashboard

**Expected impact**: +50% activation rate, -30% early churn

---

## Conclusion

✅ **Code complete**: All files created and committed
✅ **Design compliant**: Minimal, clean, intuitive
✅ **Type-safe**: Full TypeScript support
✅ **Conversion-focused**: Progressive disclosure + FOMO

**Ready for**:
1. Database migration (`npx prisma migrate deploy`)
2. Deployment to staging/production
3. Manual testing with checklist above
4. Analytics implementation (future)

**Expected outcome**: 30-40% lead capture rate from demo quiz completions, building a qualified email list for nurture campaigns and future conversion to paid users.
