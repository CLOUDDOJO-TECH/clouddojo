# Development Rules & Best Practices

## Next.js 15 Data Fetching Patterns

### When to Use Server Components vs API Routes

#### Server Components (Preferred for data fetching)
**Use when:**
- Fetching data for initial page render
- Data is needed immediately when page loads
- You want better SEO and faster initial load

```tsx
// app/page.tsx - Server Component
async function Page() {
  const posts = await db.posts.findMany() // Direct DB call
  return <PostList posts={posts} />
}
```

**Benefits:**
- More efficient (no extra HTTP request)
- Direct database access
- Better performance
- Better SEO

---

#### API Routes + Client-side fetch
**Use when:**
- Data is fetched based on user interaction (clicks, form input)
- Loading data conditionally or after initial render
- Need the same endpoint for multiple clients (web, mobile, external)
- Performing mutations (POST, PUT, DELETE)

```tsx
// app/api/posts/route.ts
export async function GET() {
  const posts = await db.posts.findMany()
  return Response.json(posts)
}

// In client component
const [posts, setPosts] = useState([])
const loadPosts = async () => {
  const res = await fetch('/api/posts')
  setPosts(await res.json())
}
```

**Benefits:**
- Triggered by user actions
- Conditional loading
- Shared across multiple clients
- Mutations and form submissions

---

### General Rule for Data Fetching:
- **Server Components** = initial page data
- **API Routes + client fetch** = interactive/conditional data loading

Server Components are more efficient for initial data since they eliminate the extra HTTP request and can directly access your database.

---

### Resources:
- [Next.js Data Fetching patterns](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)

---

## Project-Specific Rules

### ⚠️ IMPORTANT: Always Use React Query + API Routes

**Rule:** Never access the database directly from components, even in Server Components. Always go through API routes and use React Query for data fetching and mutations.

### Example Application

#### 1. Create API Route
```tsx
// app/api/admin/projects/route.ts
export async function GET() {
  const projects = await prisma.project.findMany()
  return Response.json(projects)
}

export async function POST(req: Request) {
  const data = await req.json()
  const project = await prisma.project.create({ data })
  return Response.json(project)
}
```

#### 2. Create React Query Hook
```tsx
// lib/hooks/useProjects.ts
import { useQuery, useMutation } from "@tanstack/react-query"

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/admin/projects")
      return res.json()
    },
  })
}

export function useCreateProject() {
  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      return res.json()
    },
  })
}
```

#### 3. Use in Client Component
```tsx
// app/dashboard/admin/projects/page.tsx
"use client"

import { useProjects, useCreateProject } from "@/lib/hooks/useProjects"

export default function AdminProjectsPage() {
  const { data: projects, isLoading } = useProjects()
  const createProject = useCreateProject()

  const handleCreate = async (data) => {
    await createProject.mutateAsync(data)
  }

  if (isLoading) return <div>Loading...</div>

  return <ProjectsList projects={projects} />
}
```

**Why this pattern:**
- ✅ Consistent data layer (all data through API routes)
- ✅ React Query handles caching, refetching, optimistic updates
- ✅ Better error handling and loading states
- ✅ API routes can be reused by other clients
- ✅ Clear separation of concerns

---

*Last updated: 2025-10-29*
