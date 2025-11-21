# CloudDojo Codebase Structure

> Up-to-date guide to the CloudDojo codebase organization

**Last Updated:** 2025-01-19
**Structure**: Feature-based architecture

---

## 📂 Directory Overview

```
clouddojo/
├── app/                      # Next.js App Router
├── features/                 # Feature-based modules ⭐ NEW
├── components/               # Shared components only
├── lib/                      # Shared utilities
├── src/                      # tRPC infrastructure
├── config/                   # Configuration
├── prisma/                   # Database
├── docs/                     # Documentation
└── [other directories]
```

---

## 🎯 Feature-Based Architecture

All feature-specific code is now organized in `/features/` by domain:

```
features/
├── quiz/                     # Quiz & Practice
├── gamification/             # Streaks, XP, Badges
├── dashboard/                # Dashboard views
├── ai-analysis/              # AI Reports
├── projects/                 # Hands-on Labs
├── marketing/                # Landing pages
└── auth/                     # Authentication
```

### Feature Structure

Each feature folder follows this structure:

```
features/[feature-name]/
├── components/               # Feature components
├── hooks/                    # Feature hooks
├── utils/                    # Feature utilities
└── types/                    # Feature types
```

---

## 📁 Detailed Structure

### App Routes (`/app`)

```
app/
├── (actions)/                # Server Actions
│   ├── ai-analysis/
│   ├── leaderboard/
│   ├── onboarding/
│   ├── quiz/
│   ├── user/
│   └── project-categories/
│
├── api/                      # API Routes (webhooks, cron only)
│   ├── webhooks/
│   ├── cron/
│   └── upload/
│
├── dashboard/                # Dashboard pages
│   ├── page.tsx             # Main dashboard
│   ├── practice/            # Practice pages
│   ├── labs/                # Labs pages
│   ├── leaderboard/
│   ├── flashcards/
│   ├── settings/
│   ├── billing/
│   └── admin/
│
├── demo/                     # Public demo
├── quiz-builder/             # Custom quiz builder
├── quiz-session/             # Active quiz session
├── blog/                     # Blog pages
├── about/                    # About page
└── page.tsx                  # Homepage
```

### Features (`/features`)

#### Quiz Feature
```
features/quiz/
└── components/
    ├── provider-selector.tsx
    ├── question-card.tsx
    ├── results-summary.tsx
    ├── quiz-builder-filters.tsx
    └── practice-card.tsx
```

**Used by:**
- `/app/demo`
- `/app/quiz-builder`
- `/app/quiz-session`
- `/app/dashboard/practice`

#### Gamification Feature
```
features/gamification/
└── components/
    ├── activity-heatmap.tsx
    ├── streak-display.tsx
    └── daily-goal-card.tsx
```

**Used by:**
- `/app/dashboard` (Progress tab)

#### Dashboard Feature
```
features/dashboard/
├── components/
│   ├── performance-section.tsx
│   ├── recent-activity-section.tsx
│   ├── dashboard-loading.tsx
│   ├── test-card.tsx
│   └── [other components]
├── hooks/
│   └── useDashboardQueries.ts
└── utils/
    └── [dashboard utilities]
```

**Used by:**
- `/app/dashboard`

#### AI Analysis Feature
```
features/ai-analysis/
└── components/
    ├── premium-ai-analysis.tsx
    ├── analysis-dashboard.tsx
    └── [other AI components]
```

**Used by:**
- `/app/dashboard` (AI Report tab)

#### Projects Feature
```
features/projects/
└── components/
    ├── guidance-mode-explanation.tsx
    └── project-step-viewer.tsx
```

**Used by:**
- `/app/dashboard/labs`

#### Marketing Feature
```
features/marketing/
└── components/
    ├── herosection.tsx
    ├── testimonials.tsx
    ├── features-section.tsx
    ├── pricing/
    ├── blog/
    └── [other marketing components]
```

**Used by:**
- `/app/page.tsx` (homepage)
- `/app/about`
- Blog pages

### Shared Components (`/components`)

Only truly shared/reusable components remain here:

```
components/
├── ui/                       # shadcn/ui primitives
│   ├── button.tsx
│   ├── card.tsx
│   ├── tabs.tsx
│   └── [other UI components]
│
├── layout/                   # Shared layout components
│   ├── header.tsx
│   ├── footer.tsx
│   ├── navbar.tsx
│   └── mobile-nav.tsx
│
├── backgrounds/              # Shared background components
├── magicui/                  # Magic UI library
├── providers/                # Global providers
└── mode-toggle.tsx           # Theme toggle
```

### Shared Utilities (`/lib`)

```
lib/
├── prisma.ts                 # Database client
├── utils.ts                  # Utility functions
├── utils/                    # Utility modules
│   ├── format.ts
│   ├── validation.ts
│   ├── cn.ts
│   ├── auth.ts
│   └── database.ts
├── hooks/                    # Global hooks
│   ├── use-debounce.ts
│   └── useCurrentUser.ts
└── emails/                   # Email templates
```

### tRPC Infrastructure (`/src`)

```
src/
├── lib/trpc/
│   └── react.tsx             # tRPC client
└── server/
    ├── trpc.ts               # tRPC core
    ├── context.ts            # Request context
    └── routers/
        ├── _app.ts           # Root router
        ├── quiz.ts           # Quiz procedures
        └── gamification.ts   # Gamification procedures
```

---

## 🔧 Import Patterns

### Feature Components

```typescript
// ✅ Good - Explicit feature imports
import { QuestionCard } from "@/features/quiz/components/question-card";
import { StreakDisplay } from "@/features/gamification/components/streak-display";
import { PerformanceSection } from "@/features/dashboard/components/performance-section";
```

### Shared Components

```typescript
// ✅ Good - Shared component imports
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { DotGrid } from "@/components/backgrounds/dot-grid";
```

### Utilities

```typescript
// ✅ Good - Utility imports
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { useDebouce } from "@/lib/hooks/use-debounce";
```

### tRPC

```typescript
// ✅ Good - tRPC imports
import { trpc } from "@/src/lib/trpc/react";
import { quizRouter } from "@/src/server/routers/quiz";
```

---

## 📊 Component Distribution

### Before Reorganization
```
components/
├── demo/                     # Quiz components
├── quiz-builder/             # Quiz components
├── gamification/             # Gamification components
├── dashboard/                # Dashboard components
├── ai-report/                # AI components
├── landing/                  # Marketing components
├── ui/                       # Shared UI
└── [50+ loose files]         # Unorganized
```

### After Reorganization
```
features/                     # Feature-specific
└── [organized by domain]

components/                   # Truly shared only
└── [UI, layout, backgrounds]
```

**Result:**
- 200+ components organized by feature
- Clear separation of concerns
- Easy to find related code
- Reduced coupling between features

---

## 🎯 When to Use Each Directory

### Use `/features/[feature]` when:
✅ Component is specific to a feature/domain
✅ Used only within that feature's pages
✅ Contains feature-specific business logic
✅ Tightly coupled with feature data

**Examples:**
- QuestionCard → `/features/quiz/components/`
- StreakDisplay → `/features/gamification/components/`
- PerformanceSection → `/features/dashboard/components/`

### Use `/components` when:
✅ Component is truly reusable across features
✅ Pure UI component with no business logic
✅ Part of design system (shadcn/ui)
✅ Shared layout component (header, footer)

**Examples:**
- Button → `/components/ui/`
- Header → `/components/layout/`
- DotGrid → `/components/backgrounds/`

### Use `/lib` when:
✅ Utility function used across features
✅ Global React hook
✅ Database client
✅ Email templates

**Examples:**
- formatPrice → `/lib/utils.ts`
- useDebounce → `/lib/hooks/`
- prisma → `/lib/prisma.ts`

---

## 🚀 Benefits of This Structure

1. **Feature Isolation**
   - All quiz code in one place
   - Easy to find and modify
   - Reduced coupling

2. **Clear Boundaries**
   - Marketing vs App code obvious
   - Shared vs Feature-specific clear
   - Backend patterns documented

3. **Easier Onboarding**
   - New devs know where to look
   - Predictable structure
   - Self-documenting organization

4. **Better Scalability**
   - Add features without cluttering
   - Remove features easily
   - Independent development

5. **Improved Maintainability**
   - Related code co-located
   - Clear dependencies
   - Easier refactoring

---

## 📝 Adding New Features

When adding a new feature:

1. **Create feature directory:**
   ```bash
   mkdir -p features/[feature-name]/{components,hooks,utils,types}
   ```

2. **Add components:**
   ```
   features/[feature-name]/components/[component-name].tsx
   ```

3. **Add hooks:**
   ```
   features/[feature-name]/hooks/use-[hook-name].ts
   ```

4. **Import correctly:**
   ```typescript
   import { Component } from "@/features/[feature-name]/components/[component-name]";
   ```

5. **Document in this file** ✅

---

## 🔄 Migration Notes

This structure was implemented in January 2025 as part of the "Phase 2" codebase reorganization.

**What Changed:**
- Created `/features` directory
- Moved 200+ components to feature folders
- Updated 100+ import statements
- Removed duplicate code
- Organized loose components

**What Stayed the Same:**
- `/app` routing structure
- Shared component library
- Backend patterns (tRPC, Server Actions, API Routes)
- Database schema

---

## 📚 Related Documentation

- [Contributing Guide](../CONTRIBUTING.md) - Code standards and conventions
- [Backend Patterns](./BACKEND_PATTERNS.md) - When to use tRPC vs Server Actions
- [Feature Architecture Plan](./FEATURE_ARCHITECTURE_PLAN.md) - Original reorganization plan
- [tRPC Migration Plan](./TRPC_MIGRATION_PLAN.md) - tRPC migration guide
- [Gamification Plan](./GAMIFICATION_PLAN.md) - Gamification strategy

---

## ❓ FAQ

### Q: Where do I put a new component?

**A:** Ask yourself:
- Is it specific to one feature? → `/features/[feature]/components/`
- Is it reusable across features? → `/components/`
- Is it a UI primitive? → `/components/ui/`

### Q: What about components used by 2-3 features?

**A:** If it's used by multiple features but still domain-specific, keep it in the primary feature. If truly generic, move to `/components/`.

### Q: Can features import from other features?

**A:** Try to avoid it. If you need to share code between features:
1. Consider if it should be in `/components/` or `/lib/`
2. If truly feature-specific but shared, create a shared feature
3. Document the dependency

### Q: Where do Server Actions go?

**A:** Server Actions stay in `/app/(actions)/` organized by feature. This is a Next.js convention we're keeping.

---

**Maintainers:** Development Team
**Last Updated:** 2025-01-19
**Status:** Active
