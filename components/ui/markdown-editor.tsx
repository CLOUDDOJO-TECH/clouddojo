"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "edit" | "preview")}>
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

        <TabsContent value="edit" className="mt-2">
          <Textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="font-mono text-sm"
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-2">
          <div
            className={cn(
              "min-h-[200px] rounded-md border bg-muted/30 p-4 prose prose-sm dark:prose-invert max-w-none",
              !value && "flex items-center justify-center text-muted-foreground"
            )}
            style={{ minHeight: `${rows * 24}px` }}
          >
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-sm">Nothing to preview yet. Start writing in the Edit tab.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
