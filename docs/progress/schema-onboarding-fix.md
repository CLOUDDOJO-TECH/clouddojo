# Troubleshooting Prisma Schema and TypeScript Type Mismatches

## Overview

This document outlines a series of issues we encountered with Prisma schema, TypeScript types, and database synchronization in the CloudDojo application. Specifically, these issues appeared when working with array fields in the `UserOnboarding` model and when database schema drifted from our Prisma schema definition.

## Problem 1: TypeScript Type Errors with Array Fields

### Issue

When attempting to update or create records with array fields in our `UserOnboarding` model, we encountered TypeScript errors:

```typescript
Object literal may only specify known properties, and 'platforms' does not exist in type 'Without<UserOnboardingUpdateInput, UserOnboardingUncheckedUpdateInput> & UserOnboardingUncheckedUpdateInput'.
```

Our original code attempted to directly assign arrays to Prisma fields:

```typescript
await prisma.userOnboarding.update({
  where: { userId },
  data: {
    experience: validatedData.experience,
    platforms: { set: validatedData.platforms || [] },
    certifications: { set: validatedData.certifications || [] },
    role: validatedData.role,
    focusArea: { set: validatedData.focusArea || [] },
    companyType: validatedData.companyType,
    companySize: validatedData.companySize,
    goals: { set: validatedData.goals || [] },
    preferredCertifications: { set: validatedData.preferredCertifications || [] },
    completedAt: new Date(),
  },
});
```

### Root Cause

When working with array fields in Prisma, you can't directly assign arrays to fields during create or update operations. Prisma expects a specific format using operations like `set`, `push`, etc. We also dropped some of the columns from the schema and created new ones mainly for the purpose of creating a new UI interface we were working on.



### Solution

We modified our code to use the `set` operation for array fields:

```typescript
await prisma.userOnboarding.update({
  where: { userId },
  data: {
    experience: validatedData.experience,
    platforms: { set: validatedData.platforms },      // Correct syntax
    certifications: { set: validatedData.certifications },
    role: validatedData.role,
    focusArea: { set: validatedData.focusArea },      // Correct syntax
    completedAt: new Date(),
  },
});
```

This ensures TypeScript recognizes the correct format for working with array fields in Prisma operations.

## Problem 2: Schema Drift and "Unknown argument" Errors

### Issue

When attempting to use `upsert` operations with our `UserOnboarding` model, we encountered an error:

```
Unknown argument `platforms`. Available options are marked with ?.
```

The error listed several fields that didn't exist in our Prisma schema but appeared to exist in the database:

```
?   companyType?: String | Null,
?   companySize?: String | Null,
?   goals?: UserOnboardingCreategoalsInput | String[],
?   preferredCertifications?: UserOnboardingCreatepreferredCertificationsInput | String[],
```

### Root Cause

Our database schema had drifted from our Prisma schema definition. The database contained additional fields (`companyType`, `companySize`, `goals`, `preferredCertifications`) that weren't reflected in our Prisma schema. This can happen when:

1. Database schema is modified directly without updating Prisma
2. Migrations are applied inconsistently
3. Different environments have different schema versions

### Solution

#### Step 1: Update the Prisma Schema

We updated our Prisma schema to exclude all fields that we were updating in the db.
```prisma
model UserOnboarding {
  id                      String    @id @default(uuid())
  userId                  String    @unique
  experience              String
  platforms               String[]
  certifications          String[]
  role                    String    @default("OTHER")
  focusArea               String[]
  completedAt             DateTime?
  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt
  // removed these fields to match the database
  companyType             String?
  companySize             String?
  goals                   String[]
  preferredCertifications String[]
  user                    User      @relation(fields: [userId], references: [userId], onDelete: Cascade)
}
```

#### Step 2: Create and Apply a Migration

We created a migration to synchronize our Prisma schema with the database:

```bash
npx prisma migrate dev --name update_user_onboarding_schema
```

#### Step 3: Update the Validation Schema

We updated our Zod validation schema to include the new fields:

```typescript
export const onboardingDataSchema = z.object({
  experience: z.string(),
  platforms: z.array(z.string()).optional().default([]),
  certifications: z.array(z.string()).optional().default([]),
  role: z.string(),
  focusArea: z.array(z.string()).optional().default([]),
  // removed these fields to match the database
  companyType: z.string().optional(),
  companySize: z.string().optional(),
  goals: z.array(z.string()).optional().default([]),
  preferredCertifications: z.array(z.string()).optional().default([]),
});
```

#### Step 4: Update the Code to Handle All Fields

We updated our data operations to include all fields and added null safety:

```typescript
await prisma.userOnboarding.update({
  where: { userId },
  data: {
    experience: validatedData.experience,
    platforms: validatedData.platforms,        // Error occurs here
    certifications: validatedData.certifications,
    role: validatedData.role,
    focusArea: validatedData.focusArea,        // Error occurs here
    completedAt: new Date(),
  },
});
```

## Problem 3: `upsert` Operation Causing Errors

### Issue

The `upsert` operation was causing errors because it attempted to directly assign array values:

```typescript
await prisma.userOnboarding.upsert({
  where: { userId },
  update: { ...validatedData, completedAt: new Date() },
  create: { userId, ...validatedData, completedAt: new Date() },
});
```

### Root Cause

The spread operator `...validatedData` doesn't properly handle the array field syntax required by Prisma. It attempts to assign array values directly rather than using the `set` operation.

### Solution

We replaced the `upsert` operation with separate `findUnique`, `update`, and `create` operations:

```typescript
// Check if onboarding record exists
const existingOnboarding = await prisma.userOnboarding.findUnique({
  where: { userId },
});

// Update or create onboarding data
if (existingOnboarding) {
  await prisma.userOnboarding.update({
    where: { userId },
    data: {
      experience: validatedData.experience,
      platforms: { set: validatedData.platforms || [] },
      // ... other fields
    },
  });
} else {
  await prisma.userOnboarding.create({
    data: {
      userId,
      experience: validatedData.experience,
      platforms: { set: validatedData.platforms || [] },
      // ... other fields
    },
  });
}
```

This approach gives us more explicit control over how fields are assigned and allows us to properly handle array fields.

## Best Practices for Preventing Schema Issues

1. **Always use migrations**: Avoid direct database schema changes; use Prisma migrations instead
   ```bash
   npx prisma migrate dev --name descriptive_name
   ```

2. **Regenerate Prisma client after schema changes**:
   ```bash
   npx prisma generate
   ```

3. **Check for schema drift regularly**:
   ```bash
   npx prisma migrate status
   ```

4. **Use proper array syntax in Prisma operations**:
   ```typescript
   // Correct
   platforms: { set: ['aws', 'gcp'] }

   // Incorrect
   platforms: ['aws', 'gcp']
   ```

5. **Add null safety to array operations**:
   ```typescript
   platforms: { set: validatedData.platforms || [] }
   ```

6. **Consider using transactions for complex operations**:
   ```typescript
   await prisma.$transaction([
     // Multiple operations that should succeed or fail together
   ]);
   ```

## Conclusion

**Pushing these changes to the production database, i ended up using this script**
```bash
psql "$DATABASE_URL" < safe-migration.sql
```
and the deploy the migration
```bash
npx prisma migrate deploy
```


By following these best practices, we were able to resolve the schema mismatch issues and ensure proper typing for our Prisma operations.

Thank You, Glen!
