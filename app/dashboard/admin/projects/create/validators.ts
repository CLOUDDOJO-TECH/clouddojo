import { z } from "zod";

// Available technologies for autocomplete
export const AVAILABLE_TECHNOLOGIES = [
  // AWS Services
  "AWS Lambda",
  "Amazon EC2",
  "Amazon S3",
  "Amazon RDS",
  "Amazon DynamoDB",
  "Amazon API Gateway",
  "Amazon CloudFront",
  "Amazon VPC",
  "Amazon ECS",
  "Amazon EKS",
  "Amazon CloudWatch",
  "AWS IAM",
  "Amazon SNS",
  "Amazon SQS",
  "AWS CloudFormation",
  "AWS CDK",

  // Azure Services
  "Azure Functions",
  "Azure Virtual Machines",
  "Azure Blob Storage",
  "Azure SQL Database",
  "Azure Cosmos DB",
  "Azure App Service",
  "Azure Kubernetes Service",

  // GCP Services
  "Google Cloud Functions",
  "Google Compute Engine",
  "Google Cloud Storage",
  "Google Cloud SQL",
  "Google Kubernetes Engine",

  // Container & Orchestration
  "Docker",
  "Kubernetes",
  "Helm",
  "Docker Compose",

  // CI/CD & DevOps
  "Jenkins",
  "GitHub Actions",
  "GitLab CI",
  "CircleCI",
  "Travis CI",
  "Terraform",
  "Ansible",
  "Chef",
  "Puppet",

  // Languages & Frameworks
  "Python",
  "Node.js",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Express.js",
  "Flask",
  "Django",
  "Go",
  "Java",
  "Spring Boot",

  // Databases
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "Elasticsearch",

  // Other
  "Git",
  "Nginx",
  "Apache",
  "GraphQL",
  "REST API",
] as const;

// Project Step Type
export const PROJECT_STEP_TYPES = [
  "INSTRUCTION",
  "QUIZ",
  "VALIDATION",
  "REFLECTION",
  "CHECKPOINT",
] as const;

// Project Type
export const PROJECT_TYPES = [
  "TUTORIAL",
  "CHALLENGE",
  "ASSESSMENT",
  "CAPSTONE",
] as const;

// Difficulty Levels
export const DIFFICULTY_LEVELS = [
  "BEGINER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
] as const;

// Zod schema for project basic info (Step 1)
export const projectBasicInfoSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .min(100, "Description must be at least 100 characters")
    .refine(
      (val) => {
        const wordCount = val.trim().split(/\s+/).length;
        return wordCount >= 20 && wordCount <= 500;
      },
      { message: "Description must be between 20-500 words" },
    ),
  projectType: z.enum(PROJECT_TYPES),
  difficulty: z.enum(DIFFICULTY_LEVELS),
  estimatedTime: z
    .number()
    .min(15, "Estimated time must be at least 15 minutes")
    .max(600, "Estimated time cannot exceed 600 minutes"),
  estimatedCost: z
    .number()
    .min(0, "Estimated cost cannot be negative")
    .max(10000, "Estimated cost cannot exceed $100.00"),
  thumbnailUrl: z
    .string()
    .min(1, "Thumbnail is required")
    .refine(
      (val) => {
        if (!val || val.trim() === "") return false;
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Must be a valid URL" },
    ),
  videoUrl: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Must be a valid URL" },
    ),
  isPremium: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

export type ProjectBasicInfo = z.infer<typeof projectBasicInfoSchema>;

// Zod schema for project content (Step 2)
export const projectContentSchema = z.object({
  prerequisites: z
    .array(z.string().min(1, "Prerequisite cannot be empty"))
    .min(1, "At least one prerequisite is required")
    .max(10, "Cannot have more than 10 prerequisites"),
  learningObjectives: z
    .array(
      z.string().min(5, "Learning objective must be at least 5 characters"),
    )
    .min(3, "At least 3 learning objectives are required")
    .max(10, "Cannot have more than 10 learning objectives"),
  keyTechnologies: z
    .array(z.string().min(1, "Technology cannot be empty"))
    .min(1, "At least one technology is required")
    .max(15, "Cannot have more than 15 technologies"),
});

export type ProjectContent = z.infer<typeof projectContentSchema>;

// Zod schema for a single project step (Step 3)
export const projectStepSchema = z.object({
  stepNumber: z.number().int().positive(),
  title: z
    .string()
    .min(3, "Step title must be at least 3 characters")
    .max(100, "Step title cannot exceed 100 characters"),
  description: z
    .string()
    .max(200, "Step description cannot exceed 200 characters")
    .optional(),
  instructions: z
    .string()
    .min(20, "Instructions must be at least 20 characters"),
  expectedOutput: z
    .string()
    .max(500, "Expected output cannot exceed 500 characters")
    .optional(),
  validationCriteria: z.array(z.string().min(1)).default([]),
  mediaUrls: z.array(z.string().url("Must be a valid URL")).default([]),
  estimatedTime: z
    .number()
    .min(1, "Step must take at least 1 minute")
    .max(300, "Step cannot exceed 300 minutes"),
  stepType: z.enum(PROJECT_STEP_TYPES).default("INSTRUCTION"),
  isOptional: z.boolean().default(false),
});

export type ProjectStep = z.infer<typeof projectStepSchema>;

// Zod schema for project steps array
export const projectStepsSchema = z.object({
  steps: z
    .array(projectStepSchema)
    .min(1, "At least one step is required")
    .max(50, "Cannot have more than 50 steps"),
});

export type ProjectSteps = z.infer<typeof projectStepsSchema>;

// Zod schema for new category creation
export const newCategorySchema = z.object({
  name: z
    .string()
    .min(3, "Category name must be at least 3 characters")
    .max(50),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
  description: z
    .string()
    .max(200, "Description cannot exceed 200 characters")
    .optional(),
  imageUrl: z.string().url("Must be a valid URL").optional(),
  sortOrder: z.number().int().min(0).default(0),
});

export type NewCategory = z.infer<typeof newCategorySchema>;

// Zod schema for category assignment (Step 4)
export const projectCategoriesSchema = z.object({
  categoryIds: z
    .array(z.string())
    .min(1, "At least one category must be selected"),
  newCategories: z.array(newCategorySchema).default([]),
});

export type ProjectCategories = z.infer<typeof projectCategoriesSchema>;

// Complete project schema (all steps combined)
export const completeProjectSchema = projectBasicInfoSchema
  .merge(projectContentSchema)
  .merge(projectStepsSchema)
  .merge(projectCategoriesSchema);

export type CompleteProject = z.infer<typeof completeProjectSchema>;

// Result types
export interface CreateProjectResult {
  success: boolean;
  projectId?: string;
  error?: string;
  message?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: string[];
}

// JSON upload format validation
export const projectJSONSchema = z.object({
  title: z.string(),
  description: z.string(),
  projectType: z.enum(PROJECT_TYPES),
  difficulty: z.enum(DIFFICULTY_LEVELS),
  estimatedTime: z.number(),
  estimatedCost: z.number(),
  thumbnailUrl: z.string(),
  videoUrl: z.string().optional(),
  isPremium: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  prerequisites: z.array(z.string()),
  learningObjectives: z.array(z.string()),
  keyTechnologies: z.array(z.string()),
  categories: z.array(z.string()),
  steps: z.array(
    z.object({
      stepNumber: z.number(),
      title: z.string(),
      description: z.string().optional(),
      instructions: z.string(),
      expectedOutput: z.string().optional(),
      validationCriteria: z.array(z.string()).optional(),
      mediaUrls: z.array(z.string()).optional(),
      estimatedTime: z.number(),
      stepType: z.enum(PROJECT_STEP_TYPES).optional(),
      isOptional: z.boolean().optional(),
    }),
  ),
});

export type ProjectJSON = z.infer<typeof projectJSONSchema>;

/**
 * Validate project JSON data
 */
export function validateProjectJSON(jsonData: any): ValidationResult {
  try {
    projectJSONSchema.parse(jsonData);
    return {
      isValid: true,
      errors: [],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return {
        isValid: false,
        errors,
      };
    }
    return {
      isValid: false,
      errors: [{ field: "general", message: "Validation failed" }],
    };
  }
}

/**
 * Generate slug from name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
