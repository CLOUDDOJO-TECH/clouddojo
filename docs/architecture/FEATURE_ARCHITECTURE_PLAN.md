# Feature-Based Architecture Reorganization Plan

## 🎯 Goals

1. **Feature-based structure** - Group code by feature/domain, not by type
2. **Separate marketing from app** - Clear distinction between public pages and authenticated app
3. **Fix all imports** - Update imports as we move files
4. **Maintain functionality** - Ensure nothing breaks

---

## 📂 Proposed Structure

```
clouddojo/
├── app/
│   ├── (marketing)/          # Marketing/Landing pages (public)
│   │   ├── page.tsx          # Homepage
│   │   ├── about/
│   │   ├── pricing/
│   │   ├── blog/
│   │   └── layout.tsx        # Marketing layout
│   │
│   ├── (app)/                # Main application (authenticated)
│   │   ├── dashboard/        # Dashboard pages
│   │   ├── quiz-builder/
│   │   ├── quiz-session/
│   │   └── layout.tsx        # App layout
│   │
│   ├── demo/                 # Public demo (outside auth)
│   ├── (actions)/            # Server Actions (keep as is)
│   └── api/                  # API Routes (keep as is)
│
├── features/                 # Feature-based modules
│   ├── quiz/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types/
│   │
│   ├── gamification/
│   │   ├── components/       # Activity heatmap, streak, daily goal
│   │   ├── hooks/
│   │   └── types/
│   │
│   ├── dashboard/
│   │   ├── components/       # Performance, activity sections
│   │   ├── hooks/
│   │   └── utils/
│   │
│   ├── ai-analysis/
│   │   ├── components/
│   │   ├── utils/
│   │   └── types/
│   │
│   ├── projects/
│   │   ├── components/
│   │   └── types/
│   │
│   └── auth/
│       ├── components/       # Sign in/up components
│       └── utils/
│
├── components/               # Shared/common components
│   ├── ui/                   # shadcn/ui primitives
│   ├── layout/               # Headers, footers, sidebars
│   ├── backgrounds/          # Shared backgrounds
│   └── magicui/              # Magic UI library
│
├── lib/                      # Shared utilities (keep as is)
│   ├── prisma.ts
│   ├── utils/
│   ├── hooks/                # Global hooks
│   └── emails/
│
└── src/                      # tRPC infrastructure (keep as is)
    ├── lib/trpc/
    └── server/routers/
```

---

## 🔄 Migration Steps

### Phase 1: Create Structure
1. Create `/features` directory
2. Create marketing route group `app/(marketing)`
3. Create app route group `app/(app)`

### Phase 2: Move Marketing Components
- `/components/landing/*` → `/features/marketing/components/`
- `/components/hero-section.tsx` → `/features/marketing/components/`
- `/components/testimonials.tsx` → `/features/marketing/components/`
- `/components/blog/*` → `/features/marketing/components/`

### Phase 3: Move Feature Components

**Quiz Feature:**
- `/components/demo/*` → `/features/quiz/components/`
- `/components/quiz-builder/*` → `/features/quiz/components/`
- `/app/dashboard/practice/` components → `/features/quiz/components/`

**Gamification Feature:**
- `/components/gamification/*` → `/features/gamification/components/`
- Create `/features/gamification/hooks/` for custom hooks

**Dashboard Feature:**
- `/components/dashboard/*` → `/features/dashboard/components/`
- `/app/dashboard/hooks/*` → `/features/dashboard/hooks/`
- `/app/dashboard/utils/*` → `/features/dashboard/utils/`

**AI Analysis Feature:**
- `/components/ai-report/*` → `/features/ai-analysis/components/`
- `/app/(actions)/ai-analysis/*` stays (server actions)

**Projects/Labs Feature:**
- `/components/labs/*` → `/features/projects/components/`
- Project-related components → `/features/projects/components/`

### Phase 4: Update Imports
- Update all imports from old paths to new paths
- Use path aliases (@/)
- Test incrementally

### Phase 5: Clean Up
- Remove empty directories
- Update path alias in tsconfig if needed
- Run build to verify

---

## 📋 Component Mapping

### Marketing Components (→ features/marketing)
```
components/
├── landing/           → features/marketing/components/landing/
├── hero-section.tsx   → features/marketing/components/hero-section.tsx
├── testimonials.tsx   → features/marketing/components/testimonials.tsx
├── blog/              → features/marketing/components/blog/
├── pricing-card.tsx   → features/marketing/components/pricing-card.tsx
└── cta-section.tsx    → features/marketing/components/cta-section.tsx
```

### Quiz Components (→ features/quiz)
```
components/
├── demo/              → features/quiz/components/demo/
├── quiz-builder/      → features/quiz/components/builder/
└── practice-card.tsx  → features/quiz/components/practice-card.tsx
```

### Gamification (→ features/gamification)
```
components/
└── gamification/      → features/gamification/components/
```

### Dashboard (→ features/dashboard)
```
components/
└── dashboard/         → features/dashboard/components/
```

### AI Analysis (→ features/ai-analysis)
```
components/
└── ai-report/         → features/ai-analysis/components/
```

### Projects (→ features/projects)
```
components/
└── labs/              → features/projects/components/
```

### Keep in /components (Shared)
```
components/
├── ui/                # shadcn/ui primitives
├── layout/            # Shared layout components
├── backgrounds/       # Shared backgrounds
├── magicui/           # Magic UI library
├── providers/         # Global providers
└── mode-toggle.tsx    # Shared utilities
```

---

## 🔧 Import Update Strategy

### Before:
```typescript
import { QuizCard } from "@/components/demo/quiz-card";
import { StreakDisplay } from "@/components/gamification/streak-display";
```

### After:
```typescript
import { QuizCard } from "@/features/quiz/components/demo/quiz-card";
import { StreakDisplay } from "@/features/gamification/components/streak-display";
```

### Or with barrel exports:
```typescript
// features/quiz/components/index.ts
export * from "./demo/quiz-card";
export * from "./builder/quiz-builder-filters";

// Usage
import { QuizCard } from "@/features/quiz/components";
```

---

## ✅ Benefits

1. **Clear separation** - Marketing vs App code is obvious
2. **Feature isolation** - All quiz code in one place
3. **Easy onboarding** - New devs know where to find things
4. **Better scalability** - Add features without cluttering
5. **Reduced coupling** - Features are self-contained
6. **Easier testing** - Test features in isolation

---

## 🚀 Execution Order

1. ✅ Create directory structure
2. ✅ Move marketing components
3. ✅ Move quiz feature
4. ✅ Move gamification feature
5. ✅ Move dashboard feature
6. ✅ Move AI analysis feature
7. ✅ Move projects feature
8. ✅ Update all imports
9. ✅ Test build
10. ✅ Commit changes

---

**Status**: Ready to execute
**Estimated Time**: 2-3 hours
**Risk Level**: Medium (requires careful import updates)
