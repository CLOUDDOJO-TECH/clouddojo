# Template Manager System (Phase 1)

> **Status**: ✅ Complete
> **Date**: November 2025
> **Location**: `/dashboard/admin/emails` → Templates tab

## Overview

The Template Manager provides comprehensive email template management capabilities for CloudDojo's email system. Admins can create, edit, preview, test, and monitor React Email templates through an intuitive interface.

## Table of Contents

- [Architecture](#architecture)
- [Features](#features)
- [Backend Implementation](#backend-implementation)
- [Frontend Components](#frontend-components)
- [Database Schema](#database-schema)
- [Usage Guide](#usage-guide)
- [Template Categories](#template-categories)
- [Testing](#testing)
- [API Reference](#api-reference)

## Architecture

### Overview

```
┌─────────────────────┐
│   Admin Dashboard   │
│   /admin/emails     │
└──────────┬──────────┘
           │
           ├── Templates Tab
           │   ├── TemplateManager (list view)
           │   ├── TemplateEditor (create/edit)
           │   ├── TemplatePreview (live preview)
           │   └── TestEmailDialog (send tests)
           │
           ▼
┌──────────────────────────────┐
│   adminTemplate tRPC Router  │
│   11 procedures (admin-only) │
└──────────┬───────────────────┘
           │
           ├── getTemplates
           ├── getTemplate
           ├── createTemplate
           ├── updateTemplate
           ├── deleteTemplate
           ├── permanentlyDeleteTemplate
           ├── previewTemplate
           ├── sendTestEmail
           ├── getTemplateAnalytics
           ├── duplicateTemplate
           └── getTemplateCategories
           │
           ▼
┌──────────────────────────────┐
│   Prisma / PostgreSQL        │
│   EmailTemplate model        │
└──────────────────────────────┘
```

## Features

### Core Capabilities

1. **Template CRUD Operations**
   - Create new templates with metadata
   - Edit existing templates
   - Soft delete (deactivate)
   - Hard delete (only if unused)
   - Duplicate templates

2. **Template Preview**
   - Live rendering of React Email components
   - Custom variable substitution
   - HTML source view
   - iframe preview for visual testing

3. **Test Email Sending**
   - Send test emails to any address
   - Custom variable values
   - Immediate testing before deployment

4. **Template Management**
   - Search by name, description, or subject
   - Filter by category (Transactional, Marketing, Notification, System)
   - Filter by status (Active/Inactive)
   - Pagination (12 templates per page)
   - Sortable grid view

5. **Analytics & Monitoring**
   - Usage statistics (30-day window)
   - Delivery, open, and click rates
   - Recent sends tracking
   - Category-based organization

## Backend Implementation

### tRPC Router: `src/server/routers/admin/template.ts`

#### 1. getTemplates

Retrieves paginated list of templates with filtering.

```typescript
adminTemplate.getTemplates({
  category?: EmailCategory,
  isActive?: boolean,
  searchQuery?: string,
  page: number,
  limit: number // max 50
})
```

**Response:**
```typescript
{
  templates: Array<{
    id: string,
    name: string,
    description: string | null,
    subject: string,
    componentPath: string,
    category: EmailCategory,
    isActive: boolean,
    variables: string[] | null,
    usageCount: number,
    createdAt: Date,
    updatedAt: Date
  }>,
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

#### 2. getTemplate

Fetches single template with detailed statistics.

```typescript
adminTemplate.getTemplate({
  id: string
})
```

**Response includes:**
- Full template details
- Usage count (total)
- Recent 5 sends
- 30-day stats: sent, delivered, opened, clicked
- Delivery rate, open rate, click rate

#### 3. createTemplate

Creates a new email template.

```typescript
adminTemplate.createTemplate({
  name: string,
  description?: string,
  subject: string,
  componentPath: string, // e.g., "lib/emails/welcome-email.tsx"
  category: EmailCategory,
  isActive: boolean,
  variables?: string[]
})
```

**Validation:**
- Name must be unique
- Subject required
- Component path required
- Returns created template

#### 4. updateTemplate

Updates existing template.

```typescript
adminTemplate.updateTemplate({
  id: string,
  name?: string,
  description?: string,
  subject?: string,
  componentPath?: string,
  category?: EmailCategory,
  isActive?: boolean,
  variables?: string[]
})
```

**Validation:**
- Template must exist
- New name must be unique
- Partial updates supported

#### 5. deleteTemplate

Soft deletes template (sets `isActive = false`).

```typescript
adminTemplate.deleteTemplate({
  id: string
})
```

#### 6. permanentlyDeleteTemplate

Hard deletes template (only if no usage).

```typescript
adminTemplate.permanentlyDeleteTemplate({
  id: string
})
```

**Protection:**
- Prevents deletion if template has email logs
- Returns error with usage count

#### 7. previewTemplate

Renders template with sample data.

```typescript
adminTemplate.previewTemplate({
  id?: string,
  componentPath?: string,
  variables?: Record<string, any>
})
```

**Features:**
- Dynamic import of React Email component
- Renders with provided or sample variables
- Returns HTML string

**Default Sample Data:**
```typescript
{
  username: 'John Doe',
  email: 'john@example.com',
  score: 85,
  certificationName: 'AWS Solutions Architect'
}
```

#### 8. sendTestEmail

Sends test email to specified address.

```typescript
adminTemplate.sendTestEmail({
  templateId: string,
  toEmail: string,
  variables?: Record<string, any>
})
```

**Features:**
- Prefixes subject with `[TEST]`
- Uses sendEmail service
- Supports custom variables

#### 9. getTemplateAnalytics

Retrieves usage analytics for template(s).

```typescript
adminTemplate.getTemplateAnalytics({
  templateId?: string, // omit for all templates
  days: number // 7-90, default 30
})
```

**Response:**
```typescript
{
  total: number,
  delivered: number,
  opened: number,
  clicked: number,
  failed: number,
  bounced: number,
  deliveryRate: number, // percentage
  openRate: number,
  clickRate: number,
  bounceRate: number,
  period: string
}
```

#### 10. duplicateTemplate

Creates copy of existing template.

```typescript
adminTemplate.duplicateTemplate({
  id: string
})
```

**Behavior:**
- Appends " (Copy)" to name
- Handles naming conflicts with counter
- Sets `isActive = false` by default
- Copies all metadata and variables

#### 11. getTemplateCategories

Returns category counts.

```typescript
adminTemplate.getTemplateCategories()
```

**Response:**
```typescript
Array<{
  category: EmailCategory,
  count: number
}>
```

## Frontend Components

### 1. TemplateManager (`TemplateManager.tsx`)

Main template list view with comprehensive management features.

**Features:**
- **Search Bar**: Real-time search by name, description, or subject
- **Category Filter**: Filter by Transactional, Marketing, Notification, System
- **Status Filter**: Show active, inactive, or all templates
- **Stats Cards**: Total Templates, Active, Inactive, Total Sent
- **Grid View**: 12 templates per page with cards
- **Actions Menu**: Preview, Edit, Send Test, Duplicate, Deactivate

**Template Card Display:**
```tsx
<TemplateCard>
  <Icon>{getCategoryIcon(category)}</Icon>
  <Name>{template.name}</Name>
  <Badges>
    <CategoryBadge color={getCategoryColor(category)} />
    <StatusBadge isActive={template.isActive} />
  </Badges>
  <Description>{template.description}</Description>
  <Subject>{template.subject}</Subject>
  <Stats>
    <UsageCount>{template.usageCount} sent</UsageCount>
    <VariableCount>{variables.length} vars</VariableCount>
  </Stats>
  <ComponentPath>{template.componentPath}</ComponentPath>
  <ActionsMenu />
</TemplateCard>
```

**Pagination:**
- 12 templates per page
- Previous/Next buttons
- Page counter display

### 2. TemplateEditor (`TemplateEditor.tsx`)

Full-featured template creation and editing dialog.

**Form Fields:**
1. **Template Name*** (unique)
2. **Description** (optional, textarea)
3. **Subject Line*** (max 200 chars)
4. **Component Path*** (React Email component, e.g., `lib/emails/welcome.tsx`)
5. **Category*** (select: Transactional, Marketing, Notification, System)
6. **Active Status** (switch)
7. **Variables** (dynamic list with add/remove)

**Variable Management:**
- Add variables by name (e.g., "username", "score")
- Remove variables with X button
- Display as badges
- Enter key to add
- No duplicates allowed

**Validation:**
- Required fields checked
- Unique name validation
- Real-time error feedback
- Disabled submit during mutation

**Modes:**
- **Create**: Empty form, creates new template
- **Edit**: Pre-populated form, updates existing template

### 3. TemplatePreview (`TemplatePreview.tsx`)

Live template preview with customization.

**Features:**
- **Two Tabs**:
  - Preview: iframe rendering of HTML
  - HTML Source: Raw HTML code view

- **Variable Customization**:
  - Input fields for each template variable
  - Real-time preview updates
  - Refresh button to re-render

- **Preview Display**:
  - Sandboxed iframe (600px height)
  - Full email rendering
  - Responsive design

**Example Usage:**
```typescript
// User clicks "Preview" on template
<TemplatePreview
  templateId="template-123"
  onClose={() => setPreviewId(null)}
/>

// Renders template with default or custom variables
// Shows live HTML in iframe
// Allows source code inspection
```

### 4. TestEmailDialog (`TestEmailDialog.tsx`)

Send test emails with custom data.

**Features:**
- **Recipient Field**: Email address input with validation
- **Variable Fields**: Custom inputs for each template variable
- **Send Button**: Triggers test email send
- **Loading State**: Disabled during send

**Validation:**
- Required email address
- Email format validation (regex)
- Template variables optional

**Example Flow:**
```
1. User clicks "Send Test" on template
2. Dialog opens with recipient field
3. User enters test@example.com
4. User customizes variables (optional)
5. User clicks "Send Test Email"
6. Backend sends email via Resend
7. Success toast shown
8. Dialog closes
```

## Database Schema

### EmailTemplate Model

```prisma
model EmailTemplate {
  id            String   @id @default(uuid())
  name          String   @unique
  description   String?
  subject       String

  componentPath String   // React Email component path
  category      EmailCategory
  isActive      Boolean  @default(true)

  variables     Json?    // Array of variable names

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  emailLogs     EmailLog[]
}

enum EmailCategory {
  TRANSACTIONAL
  MARKETING
  NOTIFICATION
  SYSTEM
}
```

**Indexes:**
- `name` (unique)
- `category` (for filtering)
- `isActive` (for active template queries)

**Design Decisions:**
1. **Unique Name**: Templates identified by unique names
2. **Soft Delete**: `isActive` flag for deactivation
3. **Component Path**: Points to React Email TSX file
4. **Variables as JSON**: Flexible array of variable names
5. **Category Enum**: Enforced categorization

## Template Categories

### 1. TRANSACTIONAL 💳
User-triggered, time-sensitive emails.

**Examples:**
- Welcome Email (new user signup)
- Password Reset
- Payment Confirmation
- Receipt/Invoice
- Account Verification

**Characteristics:**
- High priority
- Expected by user
- Time-sensitive
- Personalized

### 2. MARKETING 📢
Promotional and engagement emails.

**Examples:**
- Feature Announcements
- Product Updates
- Newsletters
- Promotional Offers
- Event Invitations

**Characteristics:**
- Opt-in/opt-out
- Scheduled sends
- Campaign-based
- A/B testable

### 3. NOTIFICATION 🔔
System alerts and updates.

**Examples:**
- Quiz Milestone (Level Up)
- Badge Unlocked
- Streak Milestone
- Feature Adoption
- Daily Summary

**Characteristics:**
- Triggered by events
- Informational
- Regular cadence
- User preferences

### 4. SYSTEM ⚙️
Internal system communications.

**Examples:**
- Error Alerts
- Admin Notifications
- System Maintenance
- Data Export Ready
- Backup Reports

**Characteristics:**
- Internal use
- Automated
- Critical information
- Technical content

## Usage Guide

### For Admins

#### Creating a Template

1. Navigate to `/dashboard/admin/emails` → Templates tab
2. Click "New Template" button
3. Fill in the form:
   - **Name**: "Welcome Email" (must be unique)
   - **Description**: "Sent to new users upon registration"
   - **Subject**: "Welcome to CloudDojo!"
   - **Component Path**: "lib/emails/welcome-email.tsx"
   - **Category**: Transactional
   - **Active**: Toggle on
   - **Variables**: Add "username", "email"
4. Click "Create Template"
5. Success toast appears
6. Template appears in grid

#### Editing a Template

1. Find template in grid
2. Click ⋮ menu → "Edit"
3. Update desired fields
4. Click "Update Template"
5. Changes saved

#### Previewing a Template

1. Click ⋮ menu → "Preview"
2. (Optional) Customize variables
3. View rendered email in Preview tab
4. View HTML source in HTML tab
5. Click "Refresh Preview" after variable changes

#### Sending a Test Email

1. Click ⋮ menu → "Send Test"
2. Enter recipient email
3. (Optional) Customize variables
4. Click "Send Test Email"
5. Check inbox for test email

#### Duplicating a Template

1. Click ⋮ menu → "Duplicate"
2. Template copied with " (Copy)" suffix
3. Edit the duplicate as needed

#### Deactivating a Template

1. Click ⋮ menu → "Deactivate"
2. Confirm action
3. Template marked inactive (grayed out)
4. No longer available for new campaigns

### For Developers

#### Creating React Email Components

Templates must be React Email components:

```tsx
// lib/emails/welcome-email.tsx
import { Html, Head, Body, Container, Text, Button } from '@react-email/components';

interface WelcomeEmailProps {
  username: string;
  email: string;
}

export default function WelcomeEmail({ username, email }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Text>Welcome, {username}!</Text>
          <Text>We're excited to have you at {email}.</Text>
          <Button href="https://clouddojo.com/dashboard">
            Get Started
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
```

**Best Practices:**
- Use TypeScript for type safety
- Define props interface
- Keep styles inline (email compatibility)
- Use React Email components
- Test across email clients

#### Registering a Template

```typescript
// Via admin UI or API
const template = await api.adminTemplate.createTemplate.mutate({
  name: 'Welcome Email',
  description: 'Sent to new users',
  subject: 'Welcome to CloudDojo!',
  componentPath: 'lib/emails/welcome-email.tsx',
  category: 'TRANSACTIONAL',
  isActive: true,
  variables: ['username', 'email'],
});
```

#### Using Templates in Code

```typescript
import { sendEmail } from '@/lib/emails/send-email';

// Send email using template
await sendEmail({
  to: user.email,
  subject: template.subject,
  emailType: template.name,
  templateData: {
    username: user.firstName,
    email: user.email,
  },
});
```

## Testing

### Manual Testing Checklist

- [ ] Create new template
- [ ] Edit template name, subject, variables
- [ ] Search templates by name
- [ ] Filter by category (all 4 categories)
- [ ] Filter by status (active/inactive)
- [ ] Preview template with default variables
- [ ] Preview template with custom variables
- [ ] Send test email (check inbox)
- [ ] Duplicate template
- [ ] Deactivate template
- [ ] Attempt to delete template with usage (should fail)
- [ ] Delete unused template permanently
- [ ] Verify pagination (if > 12 templates)

### Integration Tests

```typescript
describe('adminTemplate router', () => {
  it('should create template successfully', async () => {
    const result = await caller.adminTemplate.createTemplate({
      name: 'Test Template',
      subject: 'Test Subject',
      componentPath: 'lib/emails/test.tsx',
      category: 'NOTIFICATION',
      isActive: true,
    });

    expect(result.success).toBe(true);
    expect(result.template.name).toBe('Test Template');
  });

  it('should prevent duplicate names', async () => {
    await expect(
      caller.adminTemplate.createTemplate({
        name: 'Existing Template',
        // ...
      })
    ).rejects.toThrow('already exists');
  });

  it('should prevent deleting templates with usage', async () => {
    // Create template and email log
    // ...
    await expect(
      caller.adminTemplate.permanentlyDeleteTemplate({ id })
    ).rejects.toThrow('Cannot delete template');
  });
});
```

## API Reference Summary

| Procedure | Type | Purpose | Auth |
|-----------|------|---------|------|
| getTemplates | Query | Paginated list with filters | Admin |
| getTemplate | Query | Single template with stats | Admin |
| createTemplate | Mutation | Create new template | Admin |
| updateTemplate | Mutation | Update existing template | Admin |
| deleteTemplate | Mutation | Soft delete template | Admin |
| permanentlyDeleteTemplate | Mutation | Hard delete (if unused) | Admin |
| previewTemplate | Query | Render template HTML | Admin |
| sendTestEmail | Mutation | Send test email | Admin |
| getTemplateAnalytics | Query | Usage statistics | Admin |
| duplicateTemplate | Mutation | Copy template | Admin |
| getTemplateCategories | Query | Category counts | Admin |

## Performance Considerations

### Database Queries

**Optimized Queries:**
- `getTemplates`: Single query with includes
- `getTemplate`: Parallel queries for stats
- `getTemplateAnalytics`: Optimized date filtering

**Indexes:**
- Unique index on `name`
- Index on `category` for filters
- Index on `isActive` for active queries

### Frontend Optimization

**Pagination:**
- 12 templates per page reduces initial load
- Lazy loading of preview components
- Debounced search input

**Caching:**
- React Query cache for template lists
- Preview results cached per template
- Automatic cache invalidation on updates

### Email Rendering

**Performance:**
- Dynamic imports for React Email components
- Server-side rendering (no client JS)
- HTML caching for previews
- Async email sending (non-blocking)

## Security

### Access Control
- All procedures use `adminProcedure` middleware
- Requires ADMIN or SUPERADMIN role
- No public template access

### Input Validation
- Zod schemas for all inputs
- Email format validation
- Path traversal prevention
- XSS prevention in template data

### Data Protection
- Component paths validated
- Variables sanitized
- Preview rendering sandboxed
- Test emails rate limited (via sendEmail service)

## Future Enhancements

### Phase 2 Additions

1. **Template Builder UI**
   - Visual drag-and-drop editor
   - Monaco code editor integration
   - Real-time preview while editing
   - Template version history

2. **Advanced Features**
   - A/B testing for templates
   - Template inheritance/layouts
   - Multi-language support
   - Template tags/labels

3. **Integration Improvements**
   - Resend template sync
   - Template performance analytics
   - Click tracking heatmaps
   - Spam score checking

4. **Collaboration**
   - Template approval workflow
   - Comments and feedback
   - Change history
   - Team permissions

## Troubleshooting

### Issue: Preview fails to render
**Cause:** Component path incorrect or component has errors
**Solution:**
1. Check component path exists
2. Verify component exports default function
3. Check component syntax errors
4. Ensure all imports resolve

### Issue: Test email not received
**Cause:** Resend API issues or email blocked
**Solution:**
1. Check spam folder
2. Verify Resend API key
3. Check Resend dashboard logs
4. Ensure email address valid

### Issue: Duplicate name error
**Cause:** Template name already exists
**Solution:**
1. Use unique template name
2. Check if old template was soft-deleted
3. Permanently delete old template first

### Issue: Cannot delete template
**Cause:** Template has email logs
**Solution:**
1. Use soft delete (deactivate) instead
2. Only hard delete if template never used
3. Archive old campaigns before deletion

## Conclusion

The Template Manager provides a comprehensive solution for managing email templates in CloudDojo. With full CRUD operations, live previewing, testing capabilities, and detailed analytics, admins have complete control over their email communication strategy.

**Key Benefits:**
- Centralized template management
- Easy testing before deployment
- Usage analytics for optimization
- Type-safe React Email components
- Flexible categorization
- Comprehensive search and filtering

**Next Steps:**
- Integrate with Campaign Manager (Phase 3)
- Add template version control
- Implement A/B testing
- Build visual template editor

---

**Author**: Claude Code
**Last Updated**: November 20, 2025
**Version**: 1.0
**Phase**: 1 of 3 (Template Manager)
