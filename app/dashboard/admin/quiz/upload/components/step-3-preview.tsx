"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Users,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QuizMetadata, ParsedQuestion, ValidationResult } from "../validators";
import { createQuizFromJSON } from "../actions";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getProviderLogo } from "../lib/provider-logos";

interface Step3PreviewProps {
  metadata: QuizMetadata;
  validationResult: ValidationResult;
  fileName: string;
  onBack: () => void;
}

export function Step3Preview({
  metadata,
  validationResult,
  fileName,
  onBack,
}: Step3PreviewProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    quizId?: string;
  } | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(
    new Set(),
  );

  const toggleQuestion = (index: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setUploadResult(null);

    try {
      const result = await createQuizFromJSON(
        metadata,
        validationResult.validQuestions,
      );
      setUploadResult(result);

      if (result.success && result.quizId) {
        // Redirect after success
        setTimeout(() => {
          router.push(`/dashboard/admin`);
        }, 2000);
      }
    } catch (error) {
      setUploadResult({
        success: false,
        error: error instanceof Error ? error.message : "Failed to create quiz",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const difficultyColors = {
    BEGINER:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    INTERMEDIATE:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    ADVANCED:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
    EXPERT: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
  };

  return (
    <div className="space-y-6">
      {/* Upload Result */}
      {uploadResult && (
        <Alert variant={uploadResult.success ? "default" : "destructive"}>
          {uploadResult.success ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>
            {uploadResult.success ? uploadResult.message : uploadResult.error}
          </AlertDescription>
        </Alert>
      )}

      {/* Quiz Metadata Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Summary</CardTitle>
          <CardDescription>
            Review the quiz details before uploading
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div>
            <p className="text-sm text-muted-foreground">Title</p>
            <p className="font-semibold text-lg">{metadata.title}</p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Duration</p>
              <div className="flex items-center gap-1 font-medium">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{metadata.duration} min</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Questions</p>
              <div className="flex items-center gap-1 font-medium">
                <FileText className="h-4 w-4" />
                <span className="text-sm">{validationResult.stats.valid}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Difficulty</p>
              <Badge className={difficultyColors[metadata.level]}>
                {metadata.level.charAt(0) +
                  metadata.level.slice(1).toLowerCase()}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Access</p>
              <Badge variant={metadata.free ? "default" : "secondary"}>
                {metadata.free ? "Free" : "Premium"}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Visibility</p>
              <Badge variant={metadata.isPublic ? "default" : "outline"}>
                {metadata.isPublic ? "Public" : "Private"}
              </Badge>
            </div>
            {/* Providers */}
            {metadata.providers && metadata.providers.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Providers/Platforms
                </p>
                <div className="flex flex-wrap gap-2">
                  {metadata.providers.map((provider) => {
                    const logoUrl = getProviderLogo(provider);
                    return (
                      <Badge
                        key={provider}
                        variant="secondary"
                        className="flex items-center gap-2 px-3 py-1.5"
                      >
                        {logoUrl && (
                          <img
                            src={logoUrl}
                            alt={provider}
                            className="w-4 h-4 object-contain"
                          />
                        )}
                        <span>{provider}</span>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="border-t" />

          {/* Description with Markdown */}
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
                {metadata.description}
              </ReactMarkdown>
            </div>
          </div>

          {metadata.thumbnail && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Thumbnail</p>
              <img
                src={metadata.thumbnail}
                alt="Quiz thumbnail"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Source file: {fileName}
          </div>
        </CardContent>
      </Card>

      {/* Validation Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Validation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Total Questions</p>
              <p className="text-2xl font-bold">
                {validationResult.stats.total}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Valid</p>
              <p className="text-2xl font-bold text-green-600">
                {validationResult.stats.valid}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Multi-Select</p>
              <p className="text-2xl font-bold text-blue-600">
                {validationResult.stats.multiSelect}
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Warnings</p>
              <p className="text-2xl font-bold text-orange-600">
                {validationResult.warnings.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Questions Preview</CardTitle>
          <CardDescription>
            Click on any question to expand and view details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {validationResult.validQuestions
              .slice(0, 10)
              .map((question, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => toggleQuestion(index)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          Q{index + 1}
                        </Badge>
                        {question.isMultiSelect && (
                          <Badge variant="secondary" className="text-xs">
                            Multi-Select
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium line-clamp-2">
                        {question.content}
                      </p>
                    </div>
                    {expandedQuestions.has(index) ? (
                      <ChevronUp className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    )}
                  </div>

                  {expandedQuestions.has(index) && (
                    <div className="mt-3 space-y-2 border-t pt-3">
                      <div className="space-y-1">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`text-xs p-2 rounded ${
                              option.isCorrect
                                ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900"
                                : "bg-muted/50"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span className="font-medium">
                                {String.fromCharCode(65 + optIndex)}.
                              </span>
                              <span className="flex-1">{option.content}</span>
                              {option.isCorrect && (
                                <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-2 rounded text-xs">
                          <p className="font-medium text-blue-900 dark:text-blue-300 mb-1">
                            Explanation:
                          </p>
                          <p className="text-blue-800 dark:text-blue-200">
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            {validationResult.validQuestions.length > 10 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                ... and {validationResult.validQuestions.length - 10} more
                questions
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} disabled={isUploading}>
          Back to Edit
        </Button>
        <Button
          onClick={handleUpload}
          disabled={isUploading || uploadResult?.success}
          size="lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Quiz...
            </>
          ) : uploadResult?.success ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Quiz Created!
            </>
          ) : (
            `Create Quiz with ${validationResult.stats.valid} Questions`
          )}
        </Button>
      </div>
    </div>
  );
}
