# Contributing to CloudDojo

Thank you for your interest in contributing to CloudDojo! This guide will help you get started and understand our coding standards and organizational practices.

---

## 📚 Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Coding Standards](#coding-standards)
4. [Backend Patterns](#backend-patterns)
5. [Component Guidelines](#component-guidelines)
6. [Git Workflow](#git-workflow)
7. [Testing](#testing)
8. [Documentation](#documentation)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Clerk account (for authentication)
- LemonSqueezy account (for payments)

### Setup

```bash
# Clone the repository
git clone https://github.com/glenmiracle18/clouddojo.git
cd clouddojo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your environment variables

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

---

## 📁 Project Structure

```
clouddojo/
├── app/                      # Next.js App Router
│   ├── (actions)/           # Server Actions
│   ├── api/                 # API Routes (webhooks, cron only)
│   ├── dashboard/           # Dashboard pages
│   └── [other pages]/
│
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   ├── dashboard/          # Dashboard components
│   ├── gamification/       # Gamification components
│   └── [feature]/          # Feature-specific components
│
├── src/                     # tRPC infrastructure
│   ├── lib/trpc/           # tRPC client setup
│   └── server/             # tRPC server
│       ├── trpc.ts         # tRPC core
│       ├── context.ts      # Request context
│       └── routers/        # tRPC routers
│
├── lib/                     # Shared utilities
│   ├── prisma.ts           # Database client
│   ├── utils.ts            # Utility functions
│   ├── utils/              # Utility modules
│   ├── hooks/              # React hooks
│   └── emails/             # Email templates
│
├── config/                  # Configuration
│   ├── constants.ts        # App constants
│   └── lemonsqueezy.ts     # Payment config
│
├── prisma/                  # Database
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
│
├── styles/                  # Global styles
├── public/                  # Static assets
├── docs/                    # Documentation
├── scripts/                 # Build/utility scripts
└── to-delete/              # Files marked for deletion
```

---

## 🎨 Coding Standards

### TypeScript

- **Always use TypeScript** - No JavaScript files in the codebase
- Use strict mode (`"strict": true` in tsconfig.json)
- Prefer explicit types over `any`
- Use type inference when obvious

```typescript
// ✅ Good
const user: User = await getUser(id);
const count = users.length; // Type inferred

// ❌ Bad
const user: any = await getUser(id);
```

### Naming Conventions

#### Files and Directories

- **Components:** Use kebab-case (e.g., `user-profile.tsx`, `quiz-card.tsx`)
- **Utilities:** Use kebab-case (e.g., `format-price.ts`, `validate-email.ts`)
- **Types:** Use kebab-case (e.g., `user-types.ts`)
- **Constants:** Use kebab-case (e.g., `api-constants.ts`)

```
✅ Good:
  components/dashboard/user-profile.tsx
  lib/utils/format-price.ts

❌ Bad:
  components/dashboard/UserProfile.tsx
  lib/utils/formatPrice.ts
```

#### Variables and Functions

- **Variables:** Use camelCase (e.g., `userName`, `quizScore`)
- **Functions:** Use camelCase (e.g., `getUserProfile`, `calculateScore`)
- **React Components:** Use PascalCase (e.g., `UserProfile`, `QuizCard`)
- **Constants:** Use SCREAMING_SNAKE_CASE (e.g., `API_URL`, `MAX_ATTEMPTS`)
- **Types/Interfaces:** Use PascalCase (e.g., `User`, `QuizAttempt`)

```typescript
// ✅ Good
const userName = "John";
const MAX_SCORE = 100;
interface User { ... }
export function UserProfile() { ... }

// ❌ Bad
const UserName = "John";
const max_score = 100;
interface user { ... }
export function userProfile() { ... }
```

### Component Organization

Group components by feature, not by type:

```
✅ Good:
  components/
    ├── dashboard/
    │   ├── user-profile.tsx
    │   ├── quiz-stats.tsx
    │   └── activity-chart.tsx
    └── gamification/
        ├── streak-display.tsx
        └── badge-grid.tsx

❌ Bad:
  components/
    ├── cards/
    ├── charts/
    ├── forms/
    └── modals/
```

### Import Organization

Organize imports in this order:

1. React and Next.js
2. External libraries
3. Internal utilities (@/lib)
4. Internal components (@/components)
5. Types
6. Styles

```typescript
// ✅ Good
import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/src/lib/trpc/react";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import "./styles.css";

// ❌ Bad - Random order
import "./styles.css";
import { User } from "@/types/user";
import { useState } from "react";
import { Button } from "@/components/ui/button";
```

### Path Aliases

Always use path aliases instead of relative imports:

```typescript
// ✅ Good
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

// ❌ Bad
import { prisma } from "../../../lib/prisma";
import { Button } from "../../components/ui/button";
```

### Code Formatting

- Use Prettier for consistent formatting
- 2 spaces for indentation
- Single quotes for strings
- Trailing commas in objects/arrays
- Semicolons required

```typescript
// ✅ Good
const user = {
  name: 'John',
  age: 30,
};

// ❌ Bad
const user = {
  name: "John",
  age: 30
}
```

---

## 🔧 Backend Patterns

We use **three backend patterns** for different use cases. See [Backend Patterns Guide](./docs/BACKEND_PATTERNS.md) for details.

### Quick Reference

| Pattern | Use For | Location |
|---------|---------|----------|
| **tRPC** | Data fetching, type-safe APIs | `/src/server/routers/` |
| **Server Actions** | Form submissions, simple mutations | `/app/(actions)/` |
| **API Routes** | Webhooks, cron jobs, external integrations | `/app/api/` |

### Example: Adding a New Feature

```typescript
// 1. Create tRPC router for data fetching
// src/server/routers/analytics.ts
export const analyticsRouter = router({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.analytics.findMany({
      where: { userId: ctx.userId },
    });
  }),
});

// 2. Create Server Action for mutations
// app/(actions)/analytics/track-event.ts
"use server";

export async function trackEvent(formData: FormData) {
  const { userId } = await auth();
  const eventName = formData.get("event") as string;

  await prisma.analytics.create({
    data: { userId, eventName },
  });

  revalidatePath("/dashboard");
}

// 3. Use in component
// components/analytics/stats-card.tsx
export function StatsCard() {
  const { data } = trpc.analytics.getStats.useQuery();

  return (
    <form action={trackEvent}>
      {/* ... */}
    </form>
  );
}
```

---

## 🧩 Component Guidelines

### Component Structure

```tsx
"use client"; // Only if needed

import { useState } from "react";
import { trpc } from "@/src/lib/trpc/react";

// Props interface
interface UserProfileProps {
  userId: string;
  onUpdate?: () => void;
}

// Component
export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  // 1. Hooks
  const [isEditing, setIsEditing] = useState(false);
  const { data: user } = trpc.user.getProfile.useQuery({ userId });

  // 2. Event handlers
  const handleEdit = () => {
    setIsEditing(true);
  };

  // 3. Derived state
  const displayName = user?.name || "Anonymous";

  // 4. Effects (if needed)
  // useEffect(...)

  // 5. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Component Best Practices

- ✅ Keep components small and focused
- ✅ Extract reusable logic into custom hooks
- ✅ Use composition over prop drilling
- ✅ Prefer server components when possible
- ✅ Add loading and error states
- ❌ Don't mix business logic with UI
- ❌ Don't use `any` types
- ❌ Don't fetch data in components (use tRPC)

### Accessibility

- Use semantic HTML
- Add ARIA labels when needed
- Ensure keyboard navigation works
- Test with screen readers

```tsx
// ✅ Good - Accessible button
<button
  onClick={handleClick}
  aria-label="Close dialog"
  className="..."
>
  <X className="h-4 w-4" />
</button>

// ❌ Bad - Not accessible
<div onClick={handleClick}>
  <X className="h-4 w-4" />
</div>
```

---

## 🌳 Git Workflow

### Branch Naming

```
feature/add-quiz-builder
fix/streak-calculation-bug
refactor/organize-components
docs/update-contributing-guide
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add custom quiz builder with advanced filtering
fix: correct streak freeze logic to prevent negative values
refactor: migrate demo page from API routes to tRPC
docs: add backend patterns documentation
chore: update dependencies to latest versions
```

### Commit Message Format

```
<type>: <short description>

[optional body]

[optional footer]
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactor
- `docs:` Documentation
- `style:` Formatting, missing semicolons
- `test:` Adding tests
- `chore:` Maintenance tasks

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Write/update tests
4. Update documentation
5. Run linter and tests
6. Create pull request
7. Wait for review
8. Address feedback
9. Merge after approval

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console.log or debugger statements
```

---

## 🧪 Testing

### Test File Location

Co-locate tests with components:

```
components/
  ├── dashboard/
  │   ├── user-profile.tsx
  │   └── user-profile.test.tsx
```

### Test Naming

```typescript
describe("UserProfile", () => {
  it("should render user name", () => {
    // ...
  });

  it("should handle edit mode", () => {
    // ...
  });

  it("should validate form inputs", () => {
    // ...
  });
});
```

### Test Coverage Goals

- **Unit Tests:** 70%+ coverage
- **Integration Tests:** Key user flows
- **E2E Tests:** Critical paths

---

## 📝 Documentation

### Code Comments

- Document **why**, not **what**
- Use JSDoc for functions
- Explain complex algorithms
- Document edge cases

```typescript
/**
 * Calculate XP required for a given level
 * Uses exponential formula: 100 * (level ^ 1.5)
 * This creates a smooth progression curve that gets harder at higher levels
 */
function calculateXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}
```

### README Files

Add README.md to feature directories:

```markdown
# Quiz Builder

Custom quiz builder with advanced filtering options.

## Features
- Provider selection (AWS, Azure, GCP, etc.)
- Difficulty filtering
- Question type filtering
- Timed and exam modes

## Usage
See `/docs/quiz-builder.md` for detailed documentation.
```

### Documentation Updates

When adding a feature:
1. Update relevant docs in `/docs/`
2. Add JSDoc comments to exported functions
3. Update README if needed
4. Add examples to CONTRIBUTING.md

---

## 🐛 Reporting Issues

### Bug Reports

Include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment (OS, browser, Node version)

### Feature Requests

Include:
- Clear description of the feature
- Use case / problem it solves
- Proposed solution
- Alternative solutions considered

---

## 📋 Checklist Before Submitting PR

- [ ] Code follows style guidelines
- [ ] TypeScript types are correct (no `any`)
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No console.log or debugger statements
- [ ] Imports use path aliases (@/)
- [ ] Components use kebab-case filenames
- [ ] Backend pattern is appropriate (tRPC vs Server Actions vs API Routes)
- [ ] Accessibility considered
- [ ] Error handling added
- [ ] Loading states added
- [ ] Self-reviewed code

---

## 💡 Tips for Contributors

### For New Contributors

1. Start with issues labeled `good first issue`
2. Read the [Backend Patterns Guide](./docs/BACKEND_PATTERNS.md)
3. Review [tRPC Migration Plan](./docs/TRPC_MIGRATION_PLAN.md)
4. Ask questions in discussions

### Common Pitfalls

❌ Using relative imports instead of path aliases
❌ Creating API routes for data fetching (use tRPC)
❌ Not using TypeScript types
❌ PascalCase for component filenames
❌ Mixing backend patterns without reason

### Getting Help

- Check `/docs/` for documentation
- Ask in GitHub Discussions
- Review existing code for patterns
- Read the [Backend Patterns Guide](./docs/BACKEND_PATTERNS.md)

---

## 🙏 Thank You!

Thank you for contributing to CloudDojo! Your contributions help make cloud learning better for everyone.

---

**Maintainers:** Development Team
**Last Updated:** 2025-01-19
**Questions?** Open a discussion on GitHub
