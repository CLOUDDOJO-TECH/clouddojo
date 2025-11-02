"use client";

import { useState, useRef } from "react";
import {
  Upload,
  Link as LinkIcon,
  X,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";

interface MediaUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
  required?: boolean;
  description?: string;
}

export function MediaUpload({
  label = "Media",
  value,
  onChange,
  accept = "image/*",
  maxSizeMB = 5,
  className,
  required = false,
  description,
}: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value || "");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    // Validate file type based on accept prop
    const acceptedTypes = accept.split(",").map((t) => t.trim());
    const isAccepted = acceptedTypes.some((type) => {
      if (type === "image/*") return file.type.startsWith("image/");
      if (type === "video/*") return file.type.startsWith("video/");
      return file.type === type;
    });

    if (!isAccepted) {
      const fileCategory = accept.includes("video")
        ? "video"
        : accept.includes("image")
          ? "image"
          : "file";
      setError(`Please select a valid ${fileCategory} file`);
      toast.error(`Please select a valid ${fileCategory} file`);
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("file", file);

      // Upload to API endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      if (data.url) {
        onChange(data.url);
        setUrlInput(data.url);
        toast.success("File uploaded successfully!");
      } else {
        throw new Error("No URL returned from upload");
      }
    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(urlInput);
      onChange(urlInput);
      setError("");
    } catch {
      setError("Please enter a valid URL");
    }
  };

  const handleClear = () => {
    onChange("");
    setUrlInput("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && fileInputRef.current) {
      // Manually set the files to the input element
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(files[0]);
      fileInputRef.current.files = dataTransfer.files;

      // Trigger the change event
      const event = new Event("change", { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };

  const isImage =
    value &&
    (value.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ||
      accept.includes("image"));

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <Label>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="url" className="gap-2">
            <LinkIcon className="h-4 w-4" />
            Enter URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-3 mt-3">
          <div
            className={cn(
              "relative border-2 border-dashed rounded-lg p-6 transition-colors",
              isUploading
                ? "border-primary bg-primary/5"
                : isDragging
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-emerald-500 hover:border-emerald-600",
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />

            <div className="flex flex-col items-center justify-center gap-2 text-center">
              {isUploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm font-medium">Uploading...</p>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Max file size: {maxSizeMB}MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="url" className="space-y-3 mt-3">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUrlSubmit();
                }
              }}
            />
            <Button type="button" onClick={handleUrlSubmit}>
              Add URL
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Preview */}
      {value && (
        <div className="relative border rounded-lg overflow-hidden bg-muted/30">
          {isImage ? (
            <div className="space-y-2">
              <div className="relative w-full h-48 bg-muted">
                <Image
                  src={value}
                  alt="Preview"
                  fill
                  className="object-contain"
                  unoptimized
                  onError={() => setError("Failed to load image")}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 shadow-lg"
                  onClick={handleClear}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground truncate px-4 pb-2">
                {value}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm truncate flex-1">{value}</p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
