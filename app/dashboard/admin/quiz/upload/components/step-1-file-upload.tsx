"use client";

import { useState, useCallback } from "react";
import { Upload, FileJson, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { validateQuizJSON, ValidationResult } from "../validators";

interface Step1FileUploadProps {
  onValidationComplete: (result: ValidationResult, fileName: string) => void;
}

export function Step1FileUpload({ onValidationComplete }: Step1FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setFileName(file.name);
    setValidationResult(null);

    try {
      // Read file
      const text = await file.text();

      // Parse JSON
      let jsonData;
      try {
        jsonData = JSON.parse(text);
      } catch (parseError) {
        setValidationResult({
          isValid: false,
          errors: [
            {
              questionNumber: "N/A",
              message: "Invalid JSON format. Please check your file syntax.",
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
        });
        setIsProcessing(false);
        return;
      }

      // Validate the JSON structure and questions
      const result = validateQuizJSON(jsonData);
      setValidationResult(result);

      // If validation passed, notify parent
      if (result.isValid) {
        setTimeout(() => {
          onValidationComplete(result, file.name);
        }, 500);
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        errors: [
          {
            questionNumber: "N/A",
            message: error instanceof Error ? error.message : "Failed to process file",
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
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onValidationComplete]);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const jsonFile = files.find((file) => file.name.endsWith(".json"));

      if (!jsonFile) {
        alert("Please upload a JSON file");
        return;
      }

      await processFile(jsonFile);
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.name.endsWith(".json")) {
        alert("Please upload a JSON file");
        return;
      }

      await processFile(file);
    },
    [processFile]
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Quiz JSON File</CardTitle>
          <CardDescription>
            Upload a JSON file containing quiz questions. The file should follow the required format.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-lg p-12 text-center transition-colors
              ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
              ${isProcessing ? "opacity-50 pointer-events-none" : "cursor-pointer hover:border-primary/50"}
            `}
          >
            <input
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />

            <div className="flex flex-col items-center gap-4">
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                  <p className="text-sm text-muted-foreground">Processing file...</p>
                </>
              ) : (
                <>
                  <div className="rounded-full bg-primary/10 p-4">
                    <FileJson className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Drop your JSON file here</p>
                    <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
                  </div>
                  <Button variant="secondary" size="sm" type="button">
                    <Upload className="h-4 w-4 mr-2" />
                    Select File
                  </Button>
                </>
              )}
            </div>
          </div>

          {fileName && !isProcessing && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Selected file: <span className="font-medium text-foreground">{fileName}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {validationResult.isValid ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Validation Passed
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Validation Failed
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Total Questions</p>
                <p className="text-2xl font-bold">{validationResult.stats.total}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Valid</p>
                <p className="text-2xl font-bold text-green-600">{validationResult.stats.valid}</p>
              </div>
              <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Invalid</p>
                <p className="text-2xl font-bold text-destructive">{validationResult.stats.invalid}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Multi-Select</p>
                <p className="text-2xl font-bold text-blue-600">{validationResult.stats.multiSelect}</p>
              </div>
            </div>

            {/* Errors */}
            {validationResult.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-medium mb-2">Found {validationResult.errors.length} error(s):</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {validationResult.errors.slice(0, 5).map((error, index) => (
                      <li key={index}>
                        Question {error.questionNumber}: {error.message}
                      </li>
                    ))}
                    {validationResult.errors.length > 5 && (
                      <li className="text-muted-foreground">
                        ... and {validationResult.errors.length - 5} more errors
                      </li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Warnings */}
            {validationResult.warnings.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-medium mb-2">Found {validationResult.warnings.length} warning(s):</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {validationResult.warnings.slice(0, 3).map((warning, index) => (
                      <li key={index}>
                        Question {warning.questionNumber}: {warning.message}
                      </li>
                    ))}
                    {validationResult.warnings.length > 3 && (
                      <li className="text-muted-foreground">
                        ... and {validationResult.warnings.length - 3} more warnings
                      </li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Success Message */}
            {validationResult.isValid && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  All questions are valid! You can proceed to the next step.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Format Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Expected JSON Format</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
{`[
  {
    "q_number": "1",
    "q_text": "What is Amazon S3?",
    "options": [
      {"A": "A database service"},
      {"B": "A storage service"},
      {"C": "A compute service"},
      {"D": "A networking service"}
    ],
    "correct_answer": "B",
    "explanation": "Amazon S3 is an object storage service...",
    "aws_service": "S3",
    "difficulty": "BEGINER"
  }
]`}
          </pre>
          <p className="text-xs text-muted-foreground mt-2">
            For multiple correct answers, use comma-separated values: <code>"correct_answer": "A, B"</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
