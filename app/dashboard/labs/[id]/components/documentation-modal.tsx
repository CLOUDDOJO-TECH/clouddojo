"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  FileText,
  Share,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface DocumentationModalProps {
  projectId: string;
  children: React.ReactNode;
}

export function DocumentationModal({ projectId, children }: DocumentationModalProps) {
  const { getToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: documentation, isLoading } = useQuery({
    queryKey: ["documentation", projectId],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch(`/api/projects/${projectId}/documentation`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch documentation");
      }
      
      return response.json();
    },
    enabled: open,
  });

  const handleCopyToClipboard = async () => {
    if (!documentation?.documentation) return;
    
    try {
      await navigator.clipboard.writeText(documentation.documentation);
      setCopied(true);
      toast.success("Documentation copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownloadMarkdown = () => {
    if (!documentation?.documentation) return;
    
    const blob = new Blob([documentation.documentation], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${documentation.projectTitle.replace(/\s+/g, '-').toLowerCase()}-documentation.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Documentation downloaded!");
  };

  const handleShareLinkedIn = () => {
    if (!documentation?.documentation) return;
    
    const title = `Just completed: ${documentation.projectTitle}`;
    const summary = `I just completed the "${documentation.projectTitle}" hands-on lab project! 🚀`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`;
    
    window.open(url, '_blank', 'width=600,height=600');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Project Documentation
          </DialogTitle>
          <DialogDescription>
            Your automatically generated project documentation is ready for download or sharing.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        ) : documentation ? (
          <div className="space-y-4 flex-1 min-h-0">
            {/* Documentation Info */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <h3 className="font-semibold">{documentation.projectTitle}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>By {documentation.userName}</span>
                  <span>•</span>
                  <span>
                    Completed {new Date(documentation.completedAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>{Math.round(documentation.timeSpent / 60)} hours</span>
                  {documentation.achievements > 0 && (
                    <>
                      <span>•</span>
                      <Badge variant="secondary">
                        {documentation.achievements} achievements
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button onClick={handleDownloadMarkdown} className="gap-2">
                <Download className="h-4 w-4" />
                Download MD
              </Button>
              
              <Button variant="outline" onClick={handleCopyToClipboard} className="gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
              
              <Button variant="outline" onClick={handleShareLinkedIn} className="gap-2">
                <Share className="h-4 w-4" />
                Share on LinkedIn
              </Button>
              
              <Button variant="outline" asChild>
                <a 
                  href={`data:text/markdown;charset=utf-8,${encodeURIComponent(documentation.documentation)}`}
                  download={`${documentation.projectTitle.replace(/\s+/g, '-').toLowerCase()}-documentation.md`}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in New Tab
                </a>
              </Button>
            </div>

            <Separator />

            {/* Documentation Preview */}
            <ScrollArea className="flex-1 border rounded-lg p-4">
              <div className="whitespace-pre-wrap font-mono text-sm">
                {documentation.documentation}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documentation available</h3>
            <p className="text-muted-foreground">
              Complete the project to generate documentation.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}