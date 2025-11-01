import { z } from "zod";

// Type definitions matching the seed file format
export interface QuestionData {
  q_number: string;
  q_text: string;
  options: { [key: string]: string }[];
  correct_answer: string;
  explanation?: string;
  aws_service?: string;
  difficulty?: string;
}

export interface ParsedQuestion {
  content: string;
  options: {
    content: string;
    isCorrect: boolean;
  }[];
  isMultiSelect: boolean;
  correctAnswers: string[];
  explanation?: string;
  awsService?: string;
  difficultyLevel?: string;
  questionNumber: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  validQuestions: ParsedQuestion[];
  invalidQuestions: { question: QuestionData; error: string }[];
  stats: {
    total: number;
    valid: number;
    invalid: number;
    multiSelect: number;
  };
}

export interface ValidationError {
  questionNumber: string;
  message: string;
  field?: string;
}

export interface ValidationWarning {
  questionNumber: string;
  message: string;
}

// Available providers/platforms
export const AVAILABLE_PROVIDERS = [
  "AWS",
  "Azure",
  "GCP",
  "Oracle Cloud",
  "Kubernetes",
  "Docker",
  "Terraform",
  "Ansible",
  "Jenkins",
  "GitHub Actions",
  "GitLab CI",
  "Helm",
  "CompTIA",
  "SANS",
  "Cisco",
  "Red Hat",
  "VMware",
  "HashiCorp",
] as const;

// Zod schema for quiz metadata
export const quizMetadataSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .refine(
      (val) => {
        const wordCount = val.trim().split(/\s+/).length;
        return wordCount >= 10 && wordCount <= 500;
      },
      { message: "Description must be between 10-500 words" },
    ),
  providers: z
    .array(z.string())
    .min(1, "Select at least one provider/platform"),
  duration: z
    .number()
    .min(1, "Duration must be at least 1 minute")
    .max(300, "Duration cannot exceed 300 minutes"),
  categoryId: z.string().optional(),
  categoryName: z.string().optional(),
  thumbnail: z
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
  level: z.enum(["BEGINER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
  free: z.boolean(),
  isPublic: z.boolean(),
  isNew: z.boolean().optional(),
});

export type QuizMetadata = z.infer<typeof quizMetadataSchema>;

/**
 * Parse correct answer string and return array of answer letters
 * Handles "A", "A, B", "A,B,C" formats
 */
export function parseCorrectAnswers(correctAnswer: string): string[] {
  return correctAnswer
    .split(/,\s*/)
    .filter(Boolean)
    .map((answer) => answer.trim().toUpperCase());
}

/**
 * Validate a single question
 */
export function validateQuestion(
  question: QuestionData,
  questionIndex: number,
): { isValid: boolean; error?: string; parsed?: ParsedQuestion } {
  const errors: string[] = [];

  // Check required fields
  if (!question.q_text || question.q_text.trim() === "") {
    errors.push("Question text is required");
  }

  if (!question.options || !Array.isArray(question.options)) {
    errors.push("Options must be an array");
  } else if (question.options.length < 2) {
    errors.push(
      `Must have at least 2 options (has ${question.options.length})`,
    );
  } else if (question.options.length > 5) {
    errors.push(
      `Cannot have more than 5 options (has ${question.options.length})`,
    );
  }

  if (!question.correct_answer || question.correct_answer.trim() === "") {
    errors.push("Correct answer is required");
  }

  // If basic validation failed, return early
  if (errors.length > 0) {
    return {
      isValid: false,
      error: errors.join(", "),
    };
  }

  // Parse options
  const options = question.options.map((option) => Object.values(option)[0]);

  // Parse correct answers
  const correctAnswers = parseCorrectAnswers(question.correct_answer);

  // Validate correct answer letters are valid (A, B, C, D, E)
  const validLetters = ["A", "B", "C", "D", "E"];
  const invalidAnswers = correctAnswers.filter(
    (answer) => !validLetters.includes(answer),
  );

  if (invalidAnswers.length > 0) {
    errors.push(
      `Invalid correct answer letters: ${invalidAnswers.join(", ")}. Must be A, B, C, D, or E`,
    );
  }

  // Validate correct answers exist in options
  const maxOptionIndex = options.length - 1;
  const maxOptionLetter = String.fromCharCode(65 + maxOptionIndex); // A=65
  const outOfRangeAnswers = correctAnswers.filter((answer) => {
    const index = answer.charCodeAt(0) - 65;
    return index > maxOptionIndex;
  });

  if (outOfRangeAnswers.length > 0) {
    errors.push(
      `Correct answers ${outOfRangeAnswers.join(", ")} are out of range. Question only has options A-${maxOptionLetter}`,
    );
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      error: errors.join(", "),
    };
  }

  // Build parsed question
  const isMultiSelect = correctAnswers.length > 1;
  const parsedQuestion: ParsedQuestion = {
    content: question.q_text.trim(),
    options: options.map((optionText, index) => {
      const optionLetter = String.fromCharCode(65 + index);
      return {
        content: optionText.trim(),
        isCorrect: correctAnswers.includes(optionLetter),
      };
    }),
    isMultiSelect,
    correctAnswers,
    explanation: question.explanation?.trim() || "",
    awsService: question.aws_service?.trim(),
    difficultyLevel: question.difficulty?.trim() || "Medium",
    questionNumber: question.q_number || `${questionIndex + 1}`,
  };

  return {
    isValid: true,
    parsed: parsedQuestion,
  };
}

/**
 * Validate entire quiz JSON
 */
export function validateQuizJSON(jsonData: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const validQuestions: ParsedQuestion[] = [];
  const invalidQuestions: { question: QuestionData; error: string }[] = [];

  // Check if data is an array
  if (!Array.isArray(jsonData)) {
    return {
      isValid: false,
      errors: [
        {
          questionNumber: "N/A",
          message: "JSON must be an array of questions",
        },
      ],
      warnings: [],
      validQuestions: [],
      invalidQuestions: [],
      stats: {
        total: 0,
        valid: 0,
        invalid: 0,
        multiSelect: 0,
      },
    };
  }

  // Check if array is empty
  if (jsonData.length === 0) {
    return {
      isValid: false,
      errors: [
        {
          questionNumber: "N/A",
          message: "JSON array is empty. Please provide at least one question",
        },
      ],
      warnings: [],
      validQuestions: [],
      invalidQuestions: [],
      stats: {
        total: 0,
        valid: 0,
        invalid: 0,
        multiSelect: 0,
      },
    };
  }

  // Validate each question
  jsonData.forEach((question: any, index: number) => {
    const result = validateQuestion(question, index);

    if (result.isValid && result.parsed) {
      validQuestions.push(result.parsed);

      // Add warning if question has no explanation
      if (!result.parsed.explanation || result.parsed.explanation === "") {
        warnings.push({
          questionNumber: question.q_number || `${index + 1}`,
          message: "Missing explanation",
        });
      }
    } else {
      invalidQuestions.push({
        question,
        error: result.error || "Unknown error",
      });
      errors.push({
        questionNumber: question.q_number || `${index + 1}`,
        message: result.error || "Unknown error",
      });
    }
  });

  // Calculate stats
  const multiSelectCount = validQuestions.filter((q) => q.isMultiSelect).length;

  return {
    isValid: invalidQuestions.length === 0 && validQuestions.length > 0,
    errors,
    warnings,
    validQuestions,
    invalidQuestions,
    stats: {
      total: jsonData.length,
      valid: validQuestions.length,
      invalid: invalidQuestions.length,
      multiSelect: multiSelectCount,
    },
  };
}

/**
 * Validate quiz metadata form
 */
export function validateQuizMetadata(data: any): {
  isValid: boolean;
  errors?: Record<string, string>;
  data?: QuizMetadata;
} {
  try {
    const parsed = quizMetadataSchema.parse(data);
    return {
      isValid: true,
      data: parsed,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      return {
        isValid: false,
        errors,
      };
    }
    return {
      isValid: false,
      errors: { general: "Validation failed" },
    };
  }
}
