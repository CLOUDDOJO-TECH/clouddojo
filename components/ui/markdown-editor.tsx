"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, Edit3 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  error?: string;
  description?: string;
  className?: string;
  onFixWithAI?: () => void;
  isEnhancing?: boolean;
}

export function MarkdownEditor({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 10,
  required = false,
  error,
  description,
  className,
  onFixWithAI,
  isEnhancing = false,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "edit" | "preview")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit" className="gap-2">
            <Edit3 className="h-4 w-4" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-2 relative">
          {isEnhancing ? (
            <div
              className="space-y-3 rounded-md border bg-muted/30 p-4"
              style={{ minHeight: `${rows * 24}px` }}
            >
              <div className="h-4 w-3/4 bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded animate-pulse" />
              <div className="h-4 w-full bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded animate-pulse" />
              <div className="h-4 w-full bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded animate-pulse" />
              <div className="h-4 w-full bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded animate-pulse" />
              <div className="h-4 w-full bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gradient-to-r from-muted via-muted-foreground/10 to-muted rounded animate-pulse" />
            </div>
          ) : (
            <Textarea
              id={id}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={rows}
              className="font-mono text-sm pr-12"
            />
          )}
          {onFixWithAI && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onFixWithAI}
                    disabled={isEnhancing}
                    className={cn(
                      "absolute bottom-2 right-2 h-8 w-8 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-sm transition-all",
                      isEnhancing && "animate-pulse",
                    )}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="18px"
                      height="18px"
                      viewBox="0 0 18 18"
                      className={cn(isEnhancing && "animate-spin")}
                    >
                      <path
                        d="M9.5 2.75L11.412 7.587L16.25 9.5L11.412 11.413L9.5 16.25L7.587 11.413L2.75 9.5L7.587 7.587L9.5 2.75Z"
                        fill="currentColor"
                        fillOpacity="0.3"
                      />
                      <path
                        d="M5.65799 2.99L4.39499 2.569L3.97399 1.306C3.83699 0.898 3.16199 0.898 3.02499 1.306L2.60399 2.569L1.34099 2.99C1.13699 3.058 0.998993 3.249 0.998993 3.464C0.998993 3.679 1.13699 3.87 1.34099 3.938L2.60399 4.359L3.02499 5.622C3.09299 5.826 3.28499 5.964 3.49999 5.964C3.71499 5.964 3.90599 5.826 3.97499 5.622L4.39599 4.359L5.65899 3.938C5.86299 3.87 6.00099 3.679 6.00099 3.464C6.00099 3.249 5.86199 3.058 5.65799 2.99Z"
                        fill="currentColor"
                      />
                      <path
                        d="M9.5 2.75L11.412 7.587L16.25 9.5L11.412 11.413L9.5 16.25L7.587 11.413L2.75 9.5L7.587 7.587L9.5 2.75Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fix with AI</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </TabsContent>

        <TabsContent value="preview" className="mt-2">
          <div
            className={cn(
              "min-h-[200px] rounded-md border bg-muted/30 p-4 prose prose-sm dark:prose-invert max-w-none",
              !value &&
                "flex items-center justify-center text-muted-foreground",
            )}
            style={{ minHeight: `${rows * 24}px` }}
          >
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <p className="text-sm">
                Nothing to preview yet. Start writing in the Edit tab.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
