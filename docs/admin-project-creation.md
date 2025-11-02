# Admin Project Creation Feature Documentation

## Overview

A comprehensive multi-step wizard for creating cloud computing projects in the admin panel. This feature allows administrators to create detailed, hands-on projects for students with full draft saving capabilities, media uploads, and markdown previews.

---

## Table of Contents

1. [Architecture](#architecture)
2. [Features](#features)
3. [File Structure](#file-structure)
4. [Components](#components)
5. [Server Actions](#server-actions)
6. [Database Schema](#database-schema)
7. [Draft System](#draft-system)
8. [Media Upload](#media-upload)
9. [Usage Guide](#usage-guide)
10. [Technical Details](#technical-details)

---

## Architecture

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Form Management**: React Hook Form + Zod validation
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **AI Integration**: Google Gemini 2.0 Flash
- **File Storage**: AWS S3
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS

### Design Pattern

The project creation follows a **multi-step wizard pattern** with:
- 5 discrete steps for data collection
- State management at parent component level
- Server-side validation and processing
- Atomic database operations with transactions
- Hybrid draft storage (localStorage + database)

---

## Features

### Core Features

1. **Multi-Step Wizard**
   - 5 steps: Basic Info → Content → Steps → Categories → Preview
   - Collapsible sidebar navigation
   - Progress indicator
   - Step validation before proceeding

2. **AI-Powered Metadata Generation**
   - Auto-generate project details from outline
   - Uses Gemini 2.0 Flash model
   - Structured output with Zod schemas
   - Generates: title, description, difficulty, time estimates, etc.

3. **Draft Management**
   - Hybrid storage: localStorage + PostgreSQL
   - Auto-save every 30 seconds
   - Manual save button
   - Restore prompt on return
   - Cross-device synchronization
   - Persistent across sessions

4. **Media Upload System**
   - Dual input: file upload or URL entry
   - AWS S3 integration
   - Drag-and-drop support
   - File type validation
   - Image preview
   - Toast notifications

5. **Markdown Editor with Preview**
   - Tab-based interface (Edit/Preview)
   - GitHub-flavored markdown support
   - Real-time preview
   - Syntax highlighting
   - Used for descriptions and instructions

6. **Dynamic Step Builder**
   - Add/remove/reorder steps
   - Collapsible step cards
   - Validation criteria per step
   - Multiple media per step
   - Step type selection

7. **Category Management**
   - Select existing categories
   - Create new categories inline
   - Auto-generate slugs
   - Multi-select support

---

## File Structure

```
app/dashboard/admin/projects/create/
├── page.tsx                      # Main wizard orchestrator
├── validators.ts                 # Zod schemas and types
├── actions.ts                    # Server actions (AI, project creation)
├── draft-actions.ts              # Server actions for drafts
├── draft-manager.ts              # Draft management utility
└── components/
    ├── step-1-basic-info.tsx     # Step 1: Basic project details
    ├── step-2-content.tsx        # Step 2: Prerequisites & objectives
    ├── step-3-steps.tsx          # Step 3: Project steps builder
    ├── step-4-categories.tsx     # Step 4: Category assignment
    └── step-5-preview.tsx        # Step 5: Final review & publish

components/ui/
├── media-upload.tsx              # Reusable media upload component
└── markdown-editor.tsx           # Markdown editor with preview

app/api/upload/
└── route.ts                      # File upload endpoint (S3)

prisma/
└── schema.prisma                 # Database schema (includes ProjectDraft)
```

---

## Components

### Main Wizard (`page.tsx`)

The orchestrator component that manages:
- Current step state
- Data collection for all steps
- Draft save/load operations
- Step navigation
- Final project submission

**Key Features:**
- Collapsible sidebar with step indicators
- Auto-save every 30 seconds
- Manual save draft button
- Last saved timestamp display
- Restore draft dialog on mount

### Step 1: Basic Info (`step-1-basic-info.tsx`)

Collects fundamental project information.

**Fields:**
- Title (required)
- Description (required, markdown)
- Project Type (TUTORIAL, CHALLENGE, ASSESSMENT, CAPSTONE)
- Difficulty Level (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
- Estimated Time (minutes)
- Estimated Cost (cents)
- Thumbnail (required, image upload/URL)
- Video (optional, video upload/URL)
- Premium flag
- Published flag

**Special Features:**
- AI Prefill button - generates metadata from outline
- Word count indicator (20-500 words)
- Markdown editor with preview
- Media upload with tabs (upload/URL)

### Step 2: Content (`step-2-content.tsx`)

Defines learning content and requirements.

**Fields:**
- Prerequisites (array of strings)
- Learning Objectives (array of strings)
- Key Technologies (autocomplete from 60+ options)

**Features:**
- Dynamic arrays with add/remove
- Technology autocomplete
- Validation for minimum items

### Step 3: Steps Builder (`step-3-steps.tsx`)

Most complex step - builds the project workflow.

**Per Step Fields:**
- Step Number (auto-assigned)
- Title (required)
- Short Description (optional)
- Instructions (required, markdown)
- Expected Output (optional)
- Step Type (INSTRUCTION, QUIZ, VALIDATION, REFLECTION, CHECKPOINT)
- Estimated Time (minutes)
- Validation Criteria (array)
- Media URLs (array, with upload support)
- Optional flag

**Features:**
- Collapsible step cards
- Up/down reordering
- Add/remove steps
- Markdown editor for instructions
- Media upload for each step
- Dynamic arrays for criteria and media

### Step 4: Categories (`step-4-categories.tsx`)

Assigns project to categories.

**Features:**
- Multi-select from existing categories
- Create new categories inline
- Auto-generate slugs from names
- Category preview

### Step 5: Preview (`step-5-preview.tsx`)

Final review before publishing.

**Features:**
- Complete project preview
- Collapsible sections
- Edit buttons for each step
- Validation before submission
- Publish button
- Progress indicator

---

## Server Actions

### Project Creation (`actions.ts`)

#### `generateProjectMetadata(outline: string)`

Uses Google Gemini AI to generate project metadata.

**Input:** Brief project outline/description
**Output:**
```typescript
{
  title: string;
  description: string;
  projectType: ProjectType;
  difficulty: DifficultyLevel;
  estimatedTime: number;
  estimatedCost: number;
}
```

**Features:**
- Structured output with Zod schemas
- Error handling with retries
- Toast notifications

#### `createProject(data: CompleteProject)`

Creates a complete project with all related data.

**Process:**
1. Validates input with Zod
2. Checks authentication (admin only)
3. Uses Prisma transaction for atomicity:
   - Creates new categories if needed
   - Creates Project record
   - Creates all ProjectStep records
   - Creates ProjectCategoryAssignment records
4. Revalidates `/dashboard/labs` path
5. Returns success with project ID

**Transaction ensures:**
- All or nothing - no partial projects
- Data consistency
- Referential integrity

### Draft Management (`draft-actions.ts`)

#### `saveDraftToServer(draft)`

Saves draft to database.

**Process:**
1. Checks authentication
2. Looks for existing user draft
3. Updates existing or creates new
4. Stores as JSON in `draftData` field
5. Extracts title for easy identification

#### `loadDraftFromServer()`

Retrieves user's most recent draft.

**Returns:**
```typescript
{
  success: boolean;
  draft?: ServerProjectDraft;
  error?: string;
}
```

#### `deleteDraftFromServer(draftId?)`

Deletes draft(s) from database.

#### `hasDraftOnServer()`

Checks if user has a draft.

**Returns:**
```typescript
{
  success: boolean;
  hasDraft: boolean;
  updatedAt?: Date;
}
```

---

## Database Schema

### ProjectDraft Model

```prisma
model ProjectDraft {
  id          String   @id @default(uuid())
  userId      String
  title       String?
  currentStep Int      @default(1)
  draftData   Json
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [userId], onDelete: Cascade)

  @@index([userId])
  @@index([updatedAt])
}
```

**Fields:**
- `id` - Unique identifier
- `userId` - Foreign key to User
- `title` - Project title for identification
- `currentStep` - Current wizard step (1-5)
- `draftData` - JSON containing all form data
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

**Indexes:**
- `userId` - Fast user draft lookups
- `updatedAt` - Quick retrieval of recent drafts

**Relations:**
- Belongs to User
- Cascade delete when user is deleted

---

## Draft System

### Architecture

**Hybrid Storage Strategy:**
1. **localStorage** - Fast, immediate access
2. **Database** - Persistent, cross-device

### Draft Manager (`draft-manager.ts`)

Utility module managing both storage layers.

#### Key Methods:

**`saveDraft(draft)`**
```typescript
// Saves to both localStorage and server
async saveDraft(draft: Omit<ProjectDraft, "savedAt">): Promise<boolean>
```
- Saves to localStorage immediately
- Sends to server asynchronously
- Returns success boolean

**`loadDraft()`**
```typescript
// Loads from localStorage first, then server
async loadDraft(): Promise<ProjectDraft | null>
```
- Checks localStorage first (fast)
- Falls back to server if not found
- Caches server data to localStorage
- Returns draft or null

**`hasDraft()`**
```typescript
// Checks both storage locations
async hasDraft(): Promise<boolean>
```
- Checks localStorage first
- Checks server if not in localStorage
- Returns boolean

**`clearDraft()`**
```typescript
// Clears both storage locations
async clearDraft(): Promise<void>
```
- Removes from localStorage
- Deletes from server
- No return value

**`getTimeAgo(timestamp)`**
```typescript
// Formats timestamp to human-readable
getTimeAgo(timestamp: string): string
```
- Returns: "just now", "5 minutes ago", "2 hours ago", etc.

### Auto-Save

Implemented in main wizard component:

```typescript
useEffect(() => {
  const autoSaveInterval = setInterval(() => {
    if (basicInfo || content || steps || categories) {
      saveDraft(); // Saves to both locations
    }
  }, 30000); // Every 30 seconds

  return () => clearInterval(autoSaveInterval);
}, [basicInfo, content, steps, categories, currentStep]);
```

### Restore Flow

1. Component mounts
2. Checks for existing draft (localStorage + server)
3. If found, shows dialog:
   - "Resume Draft" - Loads draft and continues
   - "Start Fresh" - Discards draft and starts new
4. Draft includes current step - user returns to exact position

---

## Media Upload

### MediaUpload Component (`media-upload.tsx`)

Reusable component for file uploads with dual input methods.

#### Features:

1. **Tab-Based Interface**
   - Upload File tab
   - Enter URL tab

2. **File Upload**
   - Drag-and-drop support
   - Click to browse
   - File type validation
   - Size validation (configurable)
   - Loading state
   - Progress indication

3. **URL Input**
   - Manual URL entry
   - URL validation
   - Support for external URLs (YouTube, etc.)

4. **Preview**
   - Image preview with Next.js Image
   - Video preview (future)
   - Clear/remove button
   - File info display

5. **Visual Feedback**
   - Emerald border by default
   - Border changes on drag-over
   - Toast notifications
   - Error messages

#### Props:

```typescript
interface MediaUploadProps {
  label?: string;              // Field label
  value?: string;              // Current URL value
  onChange: (url: string) => void; // Callback with URL
  accept?: string;             // File type filter
  maxSizeMB?: number;          // Max file size
  required?: boolean;          // Required field flag
  description?: string;        // Help text
  className?: string;          // Additional CSS
}
```

#### Usage:

```tsx
<MediaUpload
  label="Thumbnail"
  value={thumbnailUrl}
  onChange={(url) => setThumbnailUrl(url)}
  accept="image/*"
  maxSizeMB={5}
  required
  description="Upload an image or enter URL"
/>
```

### Upload API (`app/api/upload/route.ts`)

Server endpoint handling file uploads to S3.

#### Process:

1. **Authentication** - Verify user via Clerk
2. **Validation**
   - File type check
   - File size check (10MB limit)
3. **Upload to S3**
   - Generate unique filename (UUID)
   - Set content type
   - Set cache control
   - Upload to S3 bucket
4. **Return URL** - Public S3 URL

#### Configuration Required:

Environment variables in `.env`:
```env
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET_NAME=""
AWS_S3_REGION="us-east-1"
```

#### S3 Bucket Setup:

1. Create S3 bucket
2. Add bucket policy for public read:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

3. Disable "Block all public access"

#### Next.js Image Configuration:

Added to `next.config.ts`:
```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "your-bucket.s3.region.amazonaws.com",
      pathname: "/**",
    }
  ],
}
```

---

## Usage Guide

### For Administrators

#### Creating a New Project

1. **Navigate** to Admin Dashboard → Create Project
2. **Step 1: Basic Info**
   - Enter title and description
   - Optionally use AI Prefill for metadata
   - Upload thumbnail (required)
   - Upload video (optional)
   - Set project type and difficulty
   - Configure premium/published flags
3. **Step 2: Content**
   - Add prerequisites
   - Define learning objectives
   - Select key technologies
4. **Step 3: Steps**
   - Create project steps
   - Write instructions in markdown
   - Add validation criteria
   - Upload step media
   - Reorder as needed
5. **Step 4: Categories**
   - Select existing categories
   - Create new categories if needed
6. **Step 5: Preview**
   - Review all information
   - Edit any section if needed
   - Publish project

#### Using Draft System

**Manual Save:**
- Click "Save Draft" button in sidebar anytime
- Toast confirms save success

**Auto-Save:**
- Automatically saves every 30 seconds
- "Last saved X minutes ago" indicator

**Resuming Work:**
- Return to project creation page
- Dialog appears if draft exists
- Choose "Resume Draft" to continue
- Or "Start Fresh" to discard

**Cross-Device:**
- Draft saved to database
- Access from any device
- Login required

### For Developers

#### Adding New Step

1. Create component in `components/` folder
2. Define Zod schema in `validators.ts`
3. Add step to wizard array in `page.tsx`
4. Implement handler functions
5. Update CompleteProject type

#### Customizing AI Generation

Edit `actions.ts`:
```typescript
const prompt = `Your custom prompt here...`;
const schema = yourCustomSchema;
```

#### Extending Media Upload

Add new file types in `route.ts`:
```typescript
const ALLOWED_FILE_TYPES = [
  // Add new types here
];
```

---

## Technical Details

### Validation

All forms use **Zod schemas** for validation:
- Type safety
- Runtime validation
- Error messages
- Schema composition

Example:
```typescript
export const projectBasicInfoSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(100),
  projectType: z.enum(PROJECT_TYPES),
  // ... more fields
});
```

### State Management

**Lift state up pattern:**
- Parent component holds all step data
- Child components receive via props
- OnComplete callbacks update parent state
- Enables draft saving of complete state

### Error Handling

**Multiple layers:**
1. **Client validation** - Zod + React Hook Form
2. **Server validation** - Zod in server actions
3. **Database constraints** - Prisma schema
4. **User feedback** - Toast notifications

### Performance Optimizations

1. **Auto-save debouncing** - 30 second intervals
2. **localStorage cache** - Fast draft access
3. **Unoptimized images** - Direct S3 load for previews
4. **Code splitting** - Step components lazy loaded
5. **Database indexing** - Fast draft queries

### Security

1. **Authentication** - Clerk protects all routes
2. **Authorization** - Admin role check in server actions
3. **Input validation** - Zod schemas prevent injection
4. **File validation** - Type and size checks
5. **S3 upload** - Authenticated endpoint only

---

## Future Enhancements

### Potential Improvements

1. **Draft List View**
   - View all saved drafts
   - Delete individual drafts
   - Search/filter drafts

2. **Collaborative Editing**
   - Multiple admins working together
   - Real-time updates
   - Conflict resolution

3. **Version History**
   - Track project changes
   - Revert to previous versions
   - Audit trail

4. **Bulk Import**
   - Import projects from CSV/JSON
   - Template system
   - Duplicate existing projects

5. **Media Library**
   - Reusable media assets
   - Organize by project
   - Quick insert

6. **Advanced AI Features**
   - Generate step instructions
   - Suggest technologies
   - Content improvement suggestions

---

## Troubleshooting

### Common Issues

**Draft not loading:**
- Check browser localStorage
- Verify database connection
- Check user authentication

**Upload failing:**
- Verify AWS credentials
- Check S3 bucket permissions
- Ensure bucket policy is correct
- Check file size/type limits

**AI generation not working:**
- Verify GEMINI_API_KEY in .env
- Check API quota
- Review error logs

**Validation errors:**
- Check Zod schema requirements
- Verify all required fields
- Review error messages

---

## Maintenance

### Regular Tasks

1. **Monitor S3 costs** - Review bucket usage
2. **Clean old drafts** - Delete abandoned drafts
3. **Update AI prompts** - Improve generation quality
4. **Review error logs** - Fix common issues
5. **Update technology list** - Add new options

### Database Maintenance

```sql
-- Delete drafts older than 30 days
DELETE FROM "ProjectDraft"
WHERE "updatedAt" < NOW() - INTERVAL '30 days';

-- Count drafts per user
SELECT "userId", COUNT(*)
FROM "ProjectDraft"
GROUP BY "userId";
```

---

## API Reference

### Server Actions

#### `generateProjectMetadata(outline: string)`
- **Purpose:** Generate project metadata using AI
- **Input:** Brief project description
- **Output:** Project metadata object
- **Authentication:** Required

#### `createProject(data: CompleteProject)`
- **Purpose:** Create complete project in database
- **Input:** All project data from wizard
- **Output:** `{ success: boolean, projectId?: string }`
- **Authentication:** Admin required

#### `saveDraftToServer(draft: ProjectDraft)`
- **Purpose:** Save draft to database
- **Input:** Draft object with all step data
- **Output:** `{ success: boolean, draftId?: string }`
- **Authentication:** Required

#### `loadDraftFromServer()`
- **Purpose:** Load user's most recent draft
- **Output:** `{ success: boolean, draft?: ServerProjectDraft }`
- **Authentication:** Required

#### `deleteDraftFromServer(draftId?: string)`
- **Purpose:** Delete draft(s) from database
- **Input:** Optional draft ID (deletes all if omitted)
- **Output:** `{ success: boolean }`
- **Authentication:** Required

### Upload API

#### `POST /api/upload`
- **Purpose:** Upload file to S3
- **Content-Type:** `multipart/form-data`
- **Body:** FormData with `file` field
- **Response:**
  ```json
  {
    "success": true,
    "url": "https://bucket.s3.region.amazonaws.com/path",
    "fileName": "original.jpg",
    "fileSize": 12345,
    "fileType": "image/jpeg"
  }
  ```
- **Authentication:** Required
- **Limits:** 10MB, images/videos only

---

## Changelog

### Version 1.0.0 (Current)

**Initial Release:**
- Multi-step wizard implementation
- AI-powered metadata generation
- Draft system (localStorage + database)
- Media upload with S3
- Markdown editor with preview
- Dynamic step builder
- Category management
- Complete project preview

**Database:**
- ProjectDraft table added
- User relation configured
- Indexes for performance

**Components:**
- 5 step components
- MediaUpload component
- MarkdownEditor component
- Collapsible sidebar navigation

**Features:**
- Auto-save every 30 seconds
- Manual save draft button
- Cross-device synchronization
- Drag-and-drop uploads
- File type validation
- Toast notifications
- Error handling

---

## Credits

**Built With:**
- Next.js 15
- React 19
- Prisma ORM
- Clerk Auth
- shadcn/ui
- Tailwind CSS
- Google Gemini AI
- AWS S3

**Dependencies:**
- react-hook-form
- zod
- react-markdown
- remark-gfm
- @aws-sdk/client-s3
- sonner (toast notifications)

---

## License

Part of CloudDojo platform - proprietary software.

---

## Support

For issues or questions:
1. Check troubleshooting section
2. Review error logs
3. Contact development team

---

**Last Updated:** 2025-11-02
**Version:** 1.0.0
**Author:** Development Team
