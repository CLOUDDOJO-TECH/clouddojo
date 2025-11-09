import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { FileText, ExternalLink, BookOpen } from "lucide-react";

interface DocumentationModalProps {
  projectId: string;
  children: React.ReactNode;
}

export function DocumentationModal({
  projectId,
  children,
}: DocumentationModalProps) {
  const [open, setOpen] = useState(false);
  const { getToken } = useAuth();

  // Fetch project documentation
  const { data: project, isLoading } = useQuery({
    queryKey: ["project-documentation", projectId],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch(`/api/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch project documentation");
      }

      return response.json();
    },
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Project Documentation
          </DialogTitle>
          <DialogDescription>
            Reference materials and resources for this project
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <DocumentationSkeleton />
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="references">References</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[500px] mt-4">
              <TabsContent value="overview" className="space-y-4 pr-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Project Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {project?.description || "No description available."}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Learning Objectives</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {project?.learningObjectives &&
                    project.learningObjectives.length > 0 ? (
                      <ul className="space-y-2">
                        {project.learningObjectives.map(
                          (objective: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span className="text-sm">{objective}</span>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No learning objectives specified.
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Technologies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project?.technologies &&
                      project.technologies.length > 0 ? (
                        project.technologies.map((tech: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {tech}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No technologies specified.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="space-y-4 pr-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Project Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {project?.resources && project.resources.length > 0 ? (
                      <div className="space-y-3">
                        {project.resources.map((resource: any, index: number) => (
                          <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                          >
                            <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">
                                {resource.title || resource.url}
                              </p>
                              {resource.description && (
                                <p className="text-xs text-muted-foreground">
                                  {resource.description}
                                </p>
                              )}
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No resources available for this project.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="references" className="space-y-4 pr-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">External References</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {project?.externalLinks && project.externalLinks.length > 0 ? (
                      <div className="space-y-3">
                        {project.externalLinks.map((link: any, index: number) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                          >
                            <ExternalLink className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">
                                {link.title || link.url}
                              </p>
                              {link.description && (
                                <p className="text-xs text-muted-foreground">
                                  {link.description}
                                </p>
                              )}
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No external references available.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DocumentationSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <div className="space-y-3">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
