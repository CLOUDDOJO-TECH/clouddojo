'use client';

import { useState } from 'react';
import { api } from '@/trpc/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Code, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface TemplatePreviewProps {
  templateId: string;
  onClose: () => void;
}

export function TemplatePreview({ templateId, onClose }: TemplatePreviewProps) {
  const [customVariables, setCustomVariables] = useState<Record<string, any>>({});

  const { data: template } = api.adminTemplate.getTemplate.useQuery({ id: templateId });

  const { data: preview, isLoading, refetch } = api.adminTemplate.previewTemplate.useQuery({
    id: templateId,
    variables: Object.keys(customVariables).length > 0 ? customVariables : undefined,
  });

  const handleVariableChange = (key: string, value: string) => {
    setCustomVariables((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRefreshPreview = () => {
    refetch();
    toast.success('Preview refreshed');
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Template Preview: {template?.name}</DialogTitle>
          <DialogDescription>{template?.subject}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="preview" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="html">
              <Code className="h-4 w-4 mr-2" />
              HTML Source
            </TabsTrigger>
          </TabsList>

          {/* Custom Variables */}
          {template?.variables && (template.variables as string[]).length > 0 && (
            <Card className="mt-4">
              <CardContent className="pt-4">
                <Label className="text-sm font-medium mb-2 block">
                  Customize Variables (Optional)
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {(template.variables as string[]).map((variable) => (
                    <div key={variable}>
                      <Label htmlFor={variable} className="text-xs text-muted-foreground">
                        {variable}
                      </Label>
                      <Input
                        id={variable}
                        value={customVariables[variable] || ''}
                        onChange={(e) => handleVariableChange(variable, e.target.value)}
                        placeholder={`Enter ${variable}...`}
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRefreshPreview}
                  className="mt-3"
                >
                  Refresh Preview
                </Button>
              </CardContent>
            </Card>
          )}

          <TabsContent value="preview" className="mt-4">
            {isLoading ? (
              <div className="text-center py-8">Loading preview...</div>
            ) : preview ? (
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  srcDoc={preview.html}
                  className="w-full h-[600px]"
                  title="Email Preview"
                  sandbox="allow-same-origin"
                />
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Failed to load preview
              </div>
            )}
          </TabsContent>

          <TabsContent value="html" className="mt-4">
            {preview && (
              <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[600px] text-xs">
                <code>{preview.html}</code>
              </pre>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
