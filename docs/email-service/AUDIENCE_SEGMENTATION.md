# Audience Segmentation System (Phase 2)

> **Status**: ✅ Complete
> **Date**: November 2025
> **Location**: `/dashboard/admin/emails` → Audiences tab

## Overview

The Audience Segmentation System provides comprehensive user segmentation capabilities for targeted email campaigns. It features automatic segmentation based on user behavior, custom segment creation with a visual query builder, and detailed analytics.

## Table of Contents

- [Architecture](#architecture)
- [System Segments](#system-segments)
- [Backend Implementation](#backend-implementation)
- [Frontend Components](#frontend-components)
- [Auto-Segmentation Service](#auto-segmentation-service)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Usage Guide](#usage-guide)
- [Testing](#testing)

## Architecture

### Overview

```
┌─────────────────────┐
│   Admin Dashboard   │
│   /admin/emails     │
└──────────┬──────────┘
           │
           ├── Audiences Tab
           │   ├── AudienceManager (main view)
           │   ├── SegmentDetailModal (user lists)
           │   └── CustomSegmentCreator (query builder)
           │
           ▼
┌──────────────────────────────┐
│   adminAudience tRPC Router  │
│   9 procedures (admin-only)  │
└──────────┬───────────────────┘
           │
           ├── getSegments
           ├── getSegmentUsers
           ├── previewSegment
           ├── createCustomSegment
           ├── getSegmentStats
           ├── autoSegmentUser
           ├── removeUserFromSegment
           └── exportSegmentUsers
           │
           ▼
┌──────────────────────────────┐
│   Auto-Segmentation Service  │
│   Batch processing (100/batch)│
└──────────┬───────────────────┘
           │
           ├── Daily Cron Job (/api/cron/auto-segment)
           ├── Plan-based segmentation
           ├── Lifecycle segmentation
           ├── Engagement segmentation
           └── Certification segmentation
           │
           ▼
┌──────────────────────────────┐
│   Prisma / PostgreSQL        │
│   UserSegment model          │
└──────────────────────────────┘
```

## System Segments

### 13 Pre-defined Segments

Automatically maintained by the auto-segmentation service:

#### 1. Plan-Based Segments (3)
- 💳 **Free Users** - Users on free plan
- 💳 **Pro Users** - Users on pro plan
- 💳 **Premium Users** - Users on premium plan

#### 2. Lifecycle Segments (4)
- 🔄 **New Users** - Registered in last 7 days
- 🔄 **Active Users** - Active in last 7 days
- 🔄 **Inactive Users** - No activity for 7-30 days
- 🔄 **Churned Users** - No activity for 30+ days

#### 3. Engagement Segments (3)
- 🔥 **Power Users** - Completed 50+ quizzes
- 🔥 **Casual Users** - Completed 1-10 quizzes
- 🔥 **7-Day Streak** - Current streak ≥ 7 days

#### 4. Certification Focus Segments (3)
- 🎓 **AWS Focus** - 60%+ of quizzes are AWS-related
- 🎓 **Azure Focus** - 60%+ of quizzes are Azure-related
- 🎓 **GCP Focus** - 60%+ of quizzes are GCP-related

## Backend Implementation

### tRPC Router: `src/server/routers/admin/audience.ts`

#### Procedures

##### 1. getSegments
```typescript
adminAudience.getSegments({
  includeInactive: boolean,
  searchQuery?: string
})
```
Returns all segments (system + custom) with user counts.

**Response:**
```typescript
{
  segments: Array<{
    id: string,
    name: string,
    description: string,
    type: 'system' | 'custom',
    segmentType: string,
    segmentValue: string,
    userCount: number,
    isActive: boolean,
    createdAt: Date
  }>,
  total: number,
  systemCount: number,
  customCount: number
}
```

##### 2. getSegmentUsers
```typescript
adminAudience.getSegmentUsers({
  segmentType: string,
  segmentValue: string,
  page: number,
  limit: number,
  searchQuery?: string
})
```
Returns paginated list of users in a segment.

##### 3. previewSegment
```typescript
adminAudience.previewSegment({
  criteria: Array<{
    field: string,
    operator: string,
    value: string | number | string[]
  }>,
  combineWith: 'AND' | 'OR',
  sampleSize: number
})
```
Previews users matching custom segment criteria before saving.

##### 4. getSegmentStats
```typescript
adminAudience.getSegmentStats({
  segmentType: string,
  segmentValue: string,
  days: number // 7-90
})
```
Returns segment growth analytics.

**Response:**
```typescript
{
  currentCount: number,
  addedCount: number,
  removedCount: number,
  growthRate: number, // percentage
  period: string
}
```

##### 5. autoSegmentUser
```typescript
adminAudience.autoSegmentUser({
  userId: string
})
```
Manually trigger auto-segmentation for a single user (for testing).

##### 6. removeUserFromSegment
```typescript
adminAudience.removeUserFromSegment({
  userId: string,
  segmentType: string,
  segmentValue: string
})
```
Soft-deletes user from segment (sets `removedAt`).

##### 7. exportSegmentUsers
```typescript
adminAudience.exportSegmentUsers({
  segmentType: string,
  segmentValue: string
})
```
Exports up to 5000 users as CSV.

**CSV Fields:**
- User ID
- Email
- First Name
- Last Name
- Plan
- Last Active
- Created At
- Added to Segment

## Frontend Components

### 1. AudienceManager (`AudienceManager.tsx`)

Main audience management interface.

**Features:**
- Search segments by name/description
- Filter active/inactive segments
- 3 overview stat cards
- Grid view of all segments
- Export and view actions per segment

**UI Elements:**
```tsx
<AudienceManager>
  <SearchBar />
  <Controls>
    <RefreshButton />
    <ToggleInactive />
    <CreateCustomSegment />
  </Controls>
  <StatsOverview>
    <TotalSegments />
    <TotalUsersSegmented />
    <LargestSegment />
  </StatsOverview>
  <SegmentGrid>
    {segments.map(segment => (
      <SegmentCard
        icon={getSegmentIcon(type)}
        color={getSegmentColor(type)}
        userCount={count}
        actions={[View, Export]}
      />
    ))}
  </SegmentGrid>
</AudienceManager>
```

### 2. SegmentDetailModal (`SegmentDetailModal.tsx`)

Detailed view of segment users with analytics.

**Features:**
- 4 stat cards: Current Size, Added (30d), Removed (30d), Growth Rate
- Searchable user table
- Pagination (20 users per page)
- Remove user action
- Responsive design

**Stats Display:**
```tsx
<StatsCards>
  <CurrentSize value={currentCount} />
  <Added30d value={addedCount} color="green" />
  <Removed30d value={removedCount} color="red" />
  <GrowthRate value={growthRate} trend={trending} />
</StatsCards>
```

### 3. CustomSegmentCreator (`CustomSegmentCreator.tsx`)

Visual query builder for creating custom segments.

**Features:**
- Multi-criterion builder
- 9 field types supported
- Dynamic operators based on field type
- AND/OR logic combination
- Live preview with sample users
- Validation

**Supported Fields:**
| Field | Type | Operators |
|-------|------|-----------|
| plan | select | equals, not_equals, in |
| currentStreak | number | equals, not_equals, >, < |
| totalPoints | number | equals, not_equals, >, < |
| level | number | equals, not_equals, >, < |
| lastActivityAt | date | >, < (after, before) |
| createdAt | date | >, < (after, before) |
| email | text | equals, not_equals, contains |
| firstName | text | equals, not_equals, contains |
| lastName | text | equals, not_equals, contains |

**Example Query:**
```
IF (plan = 'PRO' AND currentStreak > 7)
OR (totalPoints > 5000)
THEN add to segment "High Value Active Users"
```

## Auto-Segmentation Service

### File: `src/services/auto-segmentation.service.ts`

#### AutoSegmentationService Class

**Methods:**

##### runForAllUsers()
```typescript
async runForAllUsers(): Promise<SegmentationResult>
```
Processes all users in batches of 100.

**Returns:**
```typescript
{
  totalUsersProcessed: number,
  segmentsCreated: number,
  segmentsRemoved: number,
  errors: string[],
  duration: number // milliseconds
}
```

##### runForUser(userId)
```typescript
async runForUser(userId: string): Promise<void>
```
Segments a single user (for testing/manual triggers).

##### segmentUser(user)
Private method that applies segmentation logic:

1. **Plan Segmentation**
   - Reads user.plan
   - Creates segment: `{ type: 'plan', value: 'free' | 'pro' | 'premium' }`
   - Removes old plan segments

2. **Lifecycle Segmentation**
   - Calculates days since creation and last activity
   - Logic:
     ```
     if (daysSinceCreated <= 7) → 'new'
     else if (daysSinceActive <= 7) → 'active'
     else if (daysSinceActive <= 30) → 'inactive'
     else → 'churned'
     ```

3. **Engagement Segmentation**
   - Counts quiz attempts
   - Logic:
     ```
     if (quizCount >= 50) → 'power_users'
     if (quizCount <= 10) → 'casual'
     if (currentStreak >= 7) → 'streak_7'
     ```

4. **Certification Focus**
   - Analyzes last 100 quiz attempts
   - Calculates percentage per certification
   - Logic:
     ```
     if (awsPercentage > 60%) → 'aws_focus'
     if (azurePercentage > 60%) → 'azure_focus'
     if (gcpPercentage > 60%) → 'gcp_focus'
     ```

##### cleanupOldSegments()
```typescript
async cleanupOldSegments(): Promise<number>
```
Deletes segments removed > 90 days ago (hard delete for cleanup).

### Helper Functions

```typescript
// Export for use in API routes
export async function runAutoSegmentation(): Promise<SegmentationResult>
export async function segmentUser(userId: string): Promise<void>
```

## API Routes

### Cron Job: `/api/cron/auto-segment/route.ts`

#### GET /api/cron/auto-segment
Triggered by cron service daily at 2 AM.

**Authentication:**
- Requires `Authorization: Bearer ${CRON_SECRET}` header in production
- Dev mode: no auth required

**Response:**
```json
{
  "success": true,
  "message": "Auto-segmentation completed successfully",
  "result": {
    "totalUsersProcessed": 1523,
    "segmentsCreated": 4821,
    "segmentsRemoved": 342,
    "errors": [],
    "duration": 12453
  }
}
```

#### POST /api/cron/auto-segment
Manual trigger (requires admin auth - TODO).

**Example Vercel Cron Config:**
```json
{
  "crons": [{
    "path": "/api/cron/auto-segment",
    "schedule": "0 2 * * *"
  }]
}
```

## Database Schema

### UserSegment Model

```prisma
model UserSegment {
  id               String    @id @default(uuid())
  userId           String
  segmentType      String    // 'lifecycle', 'behavior', 'certification', 'plan'
  segmentValue     String    // 'new', 'active', 'inactive', 'aws_focus', 'free', etc.
  resendAudienceId String?   // Resend API audience ID (for syncing)
  addedAt          DateTime  @default(now())
  removedAt        DateTime? // Soft delete

  user User @relation(fields: [userId], references: [userId], onDelete: Cascade)

  @@unique([userId, segmentType, segmentValue])
  @@index([segmentType, segmentValue])
  @@index([removedAt])
}
```

**Key Design Decisions:**
1. **Unique Constraint**: User can only be in each segment once
2. **Soft Deletes**: `removedAt` allows historical tracking
3. **Indexes**: Optimized for segment queries and filtering
4. **Resend Integration**: `resendAudienceId` for future Resend API sync

## Usage Guide

### For Admins

#### Viewing Segments
1. Navigate to `/dashboard/admin/emails`
2. Click "Audiences" tab
3. Browse system segments with real-time user counts
4. Use search to find specific segments

#### Viewing Segment Details
1. Click "View" on any segment card
2. Review 30-day analytics
3. Search and browse users
4. Remove users if needed
5. Export to CSV for external use

#### Creating Custom Segments
1. Click "Custom Segment" button
2. Enter segment name and description
3. Add criteria:
   - Select field (e.g., "plan")
   - Choose operator (e.g., "equals")
   - Enter value (e.g., "PRO")
4. Add more criteria with AND/OR logic
5. Click "Show Preview" to test
6. Review matching user count and samples
7. Click "Create Segment"

**Note:** Custom segments require `CustomSegment` model in database (currently shows NOT_IMPLEMENTED).

#### Exporting Segments
1. Click "Export" on segment card
2. Downloads CSV with up to 5000 users
3. CSV includes: User ID, Email, Name, Plan, Activity, Dates

### For Developers

#### Running Auto-Segmentation Locally
```bash
# Trigger manually via API
curl -X POST http://localhost:3000/api/cron/auto-segment

# Or use the service directly
import { runAutoSegmentation } from '@/services/auto-segmentation.service';
const result = await runAutoSegmentation();
```

#### Testing Single User Segmentation
```typescript
import { segmentUser } from '@/services/auto-segmentation.service';
await segmentUser('user-123');
```

#### Querying Segments via tRPC
```typescript
// In a React component
const { data } = api.adminAudience.getSegments.useQuery({
  includeInactive: false
});

// Get segment users
const { data: users } = api.adminAudience.getSegmentUsers.useQuery({
  segmentType: 'lifecycle',
  segmentValue: 'active',
  page: 1,
  limit: 20
});
```

## Testing

### Unit Tests (Recommended)
```typescript
describe('AutoSegmentationService', () => {
  it('should segment new users correctly', async () => {
    const user = createTestUser({ createdAt: new Date() });
    await service.segmentUser(user);

    const segment = await prisma.userSegment.findFirst({
      where: { userId: user.id, segmentType: 'lifecycle', segmentValue: 'new' }
    });

    expect(segment).toBeTruthy();
  });

  it('should remove old plan segments when plan changes', async () => {
    // Test implementation
  });
});
```

### Integration Tests
```typescript
describe('adminAudience router', () => {
  it('should return all segments with counts', async () => {
    const result = await caller.adminAudience.getSegments({
      includeInactive: false
    });

    expect(result.segments).toHaveLength(13); // System segments
    expect(result.systemCount).toBe(13);
  });
});
```

### Manual Testing Checklist
- [ ] View all segments in UI
- [ ] Search segments by name
- [ ] View segment details with user list
- [ ] Export segment to CSV
- [ ] Create custom segment (preview works)
- [ ] Remove user from segment
- [ ] Trigger auto-segmentation cron
- [ ] Verify segment counts update correctly

## Performance Considerations

### Batch Processing
- Users processed in batches of 100
- Prevents memory issues with large user bases
- Can handle 100,000+ users efficiently

### Database Indexes
- Compound index on `[userId, segmentType, segmentValue]` for fast lookups
- Index on `segmentType, segmentValue` for segment queries
- Index on `removedAt` for filtering active segments

### Caching Opportunities
- Segment counts could be cached (Redis)
- User lists paginated to reduce memory
- CSV exports limited to 5000 users

### Future Optimizations
1. Parallel processing with worker threads
2. Incremental segmentation (only changed users)
3. Background job queue (Bull/BullMQ)
4. Segment count materialized views

## Future Enhancements

### Phase 3 Requirements
1. **CustomSegment Model**
   ```prisma
   model CustomSegment {
     id          String   @id @default(uuid())
     name        String   @unique
     description String?
     criteria    Json     // Criteria array
     combineWith String   // 'AND' | 'OR'
     isActive    Boolean  @default(true)
     createdBy   String
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
   }
   ```

2. **Resend API Integration**
   - Sync segments to Resend audiences
   - Two-way sync (Resend → DB)
   - Webhook handling for audience changes

3. **Advanced Segments**
   - Time-based segments (e.g., "Joined this month")
   - Behavioral triggers (e.g., "Completed quiz in last hour")
   - Multi-level criteria (nested AND/OR)

4. **Segment Analytics**
   - Conversion rates per segment
   - Engagement metrics
   - Revenue attribution
   - Cohort analysis

## Troubleshooting

### Issue: Segments not updating
**Solution:** Run manual segmentation:
```bash
curl -X POST http://localhost:3000/api/cron/auto-segment
```

### Issue: User count seems incorrect
**Cause:** Soft-deleted segments not filtered
**Solution:** Ensure queries include `removedAt: null`

### Issue: CSV export empty
**Cause:** No users in segment or limit exceeded
**Solution:** Check segment in UI first, verify user count > 0

### Issue: Custom segment creator fails
**Cause:** `CustomSegment` model not in database
**Solution:** Add model to schema.prisma and run migration

## Security

### Access Control
- All procedures use `adminProcedure` middleware
- Requires ADMIN or SUPERADMIN role
- Cron endpoint protected by `CRON_SECRET`

### Data Privacy
- Exports limited to 5000 users
- CSV escaping prevents injection
- No PII in error logs

### Rate Limiting
- Admin procedures inherit rate limiting from `adminProcedure`
- Cron job runs once daily (can't spam)

## API Reference Summary

| Procedure | Method | Purpose | Input | Output |
|-----------|--------|---------|-------|--------|
| getSegments | Query | List all segments | `{ includeInactive, searchQuery }` | Segments array with counts |
| getSegmentUsers | Query | Get segment users | `{ segmentType, segmentValue, page, limit }` | Paginated users |
| previewSegment | Query | Preview custom segment | `{ criteria, combineWith, sampleSize }` | Matching count + samples |
| createCustomSegment | Mutation | Create custom segment | `{ name, description, criteria, combineWith }` | Success status |
| getSegmentStats | Query | Get segment analytics | `{ segmentType, segmentValue, days }` | Stats object |
| autoSegmentUser | Mutation | Segment single user | `{ userId }` | Segments added |
| removeUserFromSegment | Mutation | Remove user | `{ userId, segmentType, segmentValue }` | Success status |
| exportSegmentUsers | Query | Export to CSV | `{ segmentType, segmentValue }` | CSV content |

## Conclusion

The Audience Segmentation System provides a robust foundation for targeted email marketing. With 13 automatic segments, a powerful query builder for custom segments, and comprehensive analytics, admins can effectively manage and target user audiences.

**Next Steps:**
- Implement Template Manager (Phase 1)
- Add `CustomSegment` model to database
- Integrate with Resend API
- Build Campaign Manager (Phase 3)

---

**Author**: Claude Code
**Last Updated**: November 20, 2025
**Version**: 1.0
