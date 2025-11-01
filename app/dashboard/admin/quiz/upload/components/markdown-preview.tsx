"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { Label } from "@/components/ui/label";

interface MarkdownPreviewProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  rows?: number;
}

export function MarkdownPreview({
  value,
  onChange,
  error,
  label = "Description",
  placeholder = "Enter description in Markdown format...",
  rows = 8,
}: MarkdownPreviewProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  // Calculate word count
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
  const isWithinRange = wordCount >= 50 && wordCount <= 125;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="description">
          {label} <span className="text-destructive">*</span>
        </Label>
        <span
          className={`text-xs ${
            isWithinRange
              ? "text-green-600 dark:text-green-400"
              : wordCount < 50
              ? "text-orange-600 dark:text-orange-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {wordCount}/50-125 words {isWithinRange && "✓"}
        </span>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "write" | "preview")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="mt-2">
          <Textarea
            id="description"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="font-mono text-sm"
          />
          <div className="mt-2 text-xs text-muted-foreground">
            <p className="font-medium mb-1">Markdown Tips:</p>
            <ul className="space-y-0.5">
              <li>• Use <code>### Heading</code> for section headers</li>
              <li>• Use <code>**bold**</code> for emphasis</li>
              <li>• Use <code>*italic*</code> for subtle emphasis</li>
              <li>• Use <code>- Item</code> for bullet lists</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-2">
          <div className="min-h-[200px] rounded-lg border bg-muted/30 p-4">
            {value.trim() ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h3: ({ node, ...props }) => (
                      <h3 className="text-lg font-semibold mt-4 mb-2 first:mt-0" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside space-y-1 my-2" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="text-sm" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="text-sm my-2" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-semibold text-foreground" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic" {...props} />
                    ),
                  }}
                >
                  {value}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Nothing to preview. Start writing in the "Write" tab.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
