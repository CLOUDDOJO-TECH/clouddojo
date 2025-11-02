"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { getProviderLogo } from "../../upload/lib/provider-logos";
import { ProviderIcon } from "../../upload/components/provider-icon";

interface QuizWithQuestions {
  id: string;
  title: string;
  description: string | null;
  providers: string[];
  isPublic: boolean;
  free: boolean | null;
  level: string | null;
  duration: number | null;
  thumbnail: string | null;
  createdAt: Date;
  updatedAt: Date;
  questions: Array<{
    id: string;
    content: string;
    isMultiSelect: boolean;
    correctAnswer: string[];
    explanation: string | null;
    options: Array<{
      id: string;
      content: string;
      isCorrect: boolean;
    }>;
  }>;
}

interface PreviewClientProps {
  quiz: QuizWithQuestions;
}

const difficultyColors = {
  BEGINER:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
  INTERMEDIATE:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
  ADVANCED:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
  EXPERT: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
};

export default function PreviewClient({ quiz }: PreviewClientProps) {
  const router = useRouter();

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/admin/quiz/manage">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Manage Quizzes
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quiz Preview</h1>
            <p className="text-muted-foreground mt-2">
              Read-only view of quiz details
            </p>
          </div>
          <Link href={`/dashboard/admin/quiz/edit/${quiz.id}`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Quiz
            </Button>
          </Link>
        </div>
      </div>

      {/* Quiz Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quiz Information</CardTitle>
          <CardDescription>Details about this quiz</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div>
            <p className="text-sm text-muted-foreground">Title</p>
            <p className="font-semibold text-lg">{quiz.title}</p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Duration</p>
              <div className="flex items-center gap-1 font-medium">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{quiz.duration || "-"} min</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Questions</p>
              <div className="flex items-center gap-1 font-medium">
                <FileText className="h-4 w-4" />
                <span className="text-sm">{quiz.questions.length}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Difficulty</p>
              {quiz.level ? (
                <Badge
                  className={
                    difficultyColors[
                      quiz.level as keyof typeof difficultyColors
                    ]
                  }
                >
                  {quiz.level.charAt(0) + quiz.level.slice(1).toLowerCase()}
                </Badge>
              ) : (
                <span className="text-xs text-muted-foreground">-</span>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Access</p>
              <Badge variant={quiz.free ? "default" : "secondary"}>
                {quiz.free ? "Free" : "Premium"}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Visibility</p>
              <Badge variant={quiz.isPublic ? "default" : "outline"}>
                {quiz.isPublic ? "Public" : "Private"}
              </Badge>
            </div>
          </div>

          {/* Providers */}
          {quiz.providers && quiz.providers.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Providers/Platforms
              </p>
              <div className="flex flex-wrap gap-4">
                {quiz.providers.map((provider) => {
                  const logoUrl = getProviderLogo(provider);
                  return (
                    <div
                      key={provider}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <ProviderIcon
                        provider={provider}
                        logoUrl={logoUrl}
                        className="w-8 h-8"
                      />
                      <span className="text-xs font-medium text-center">
                        {provider}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Separator */}
          <div className="border-t" />

          {/* Description */}
          {quiz.description && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <div className="prose prose-sm dark:prose-invert max-w-none bg-muted/30 rounded-lg p-4">
                <ReactMarkdown
                  components={{
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-base font-semibold mt-3 mb-2 first:mt-0"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc list-inside space-y-1 my-2"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="text-sm" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="text-sm my-1" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong
                        className="font-semibold text-foreground"
                        {...props}
                      />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic" {...props} />
                    ),
                  }}
                >
                  {quiz.description}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Thumbnail */}
          {quiz.thumbnail && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Thumbnail</p>
              <img
                src={quiz.thumbnail}
                alt="Quiz thumbnail"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Questions ({quiz.questions.length})</CardTitle>
          <CardDescription>All questions in this quiz</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quiz.questions.map((question, index) => (
              <div
                key={question.id}
                className="border rounded-lg p-4 space-y-3"
              >
                {/* Question Header */}
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs">
                    Q{index + 1}
                  </Badge>
                  {question.isMultiSelect && (
                    <Badge variant="secondary" className="text-xs">
                      Multi-Select
                    </Badge>
                  )}
                </div>

                {/* Question Content */}
                <p className="font-medium">{question.content}</p>

                {/* Options */}
                <div className="space-y-2">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={option.id}
                      className={`p-3 rounded-lg border ${
                        option.isCorrect
                          ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900"
                          : "bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-sm">
                          {String.fromCharCode(65 + optIndex)}.
                        </span>
                        <span className="flex-1 text-sm">{option.content}</span>
                        {option.isCorrect && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-800"
                          >
                            Correct
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                {question.explanation && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-900">
                    <p className="font-medium text-sm text-blue-900 dark:text-blue-300 mb-1">
                      Explanation:
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
