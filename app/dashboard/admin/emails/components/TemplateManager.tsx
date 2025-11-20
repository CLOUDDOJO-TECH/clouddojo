'use client';

import { useState } from 'react';
import { api } from '@/lib/trpc/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Eye, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export default function TemplateManager() {
  const { data: templates, isLoading, refetch } = api.adminEmail.getTemplates.useQuery();
  const updateMutation = api.adminEmail.updateTemplate.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    subject: '',
    htmlContent: '',
    isActive: true,
  });

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setEditForm({
      subject: template.subject || '',
      htmlContent: template.htmlContent || '',
      isActive: template.isActive,
    });
  };

  const handleSave = async () => {
    if (!editingTemplate) return;

    await updateMutation.mutateAsync({
      id: editingTemplate.id,
      ...editForm,
    });

    setEditingTemplate(null);
  };

  const handleToggleActive = async (template: any) => {
    await updateMutation.mutateAsync({
      id: template.id,
      isActive: !template.isActive,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Email Templates</CardTitle>
            <CardDescription>
              Manage email templates and customize content
            </CardDescription>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading templates...</div>
        ) : templates && templates.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Component Path</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <span className="font-medium">{template.name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{template.subject || 'N/A'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={template.isActive}
                          onCheckedChange={() => handleToggleActive(template)}
                        />
                        <Badge variant={template.isActive ? 'default' : 'secondary'}>
                          {template.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground font-mono">
                        {template.componentPath || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {format(new Date(template.updatedAt), 'MMM d, yyyy')}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(template)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Template: {template.name}</DialogTitle>
                            <DialogDescription>
                              Update the template subject and content
                            </DialogDescription>
                          </DialogHeader>
                          {editingTemplate?.id === template.id && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="subject">Subject Line</Label>
                                <Input
                                  id="subject"
                                  value={editForm.subject}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, subject: e.target.value })
                                  }
                                  placeholder="Enter email subject"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="htmlContent">HTML Content</Label>
                                <Textarea
                                  id="htmlContent"
                                  value={editForm.htmlContent}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, htmlContent: e.target.value })
                                  }
                                  placeholder="Enter HTML content"
                                  rows={15}
                                  className="font-mono text-xs"
                                />
                              </div>

                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="isActive"
                                  checked={editForm.isActive}
                                  onCheckedChange={(checked) =>
                                    setEditForm({ ...editForm, isActive: checked })
                                  }
                                />
                                <Label htmlFor="isActive">Template is active</Label>
                              </div>

                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleSave}
                                  disabled={updateMutation.isPending}
                                >
                                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 space-y-3">
            <div className="text-muted-foreground">No templates found</div>
            <p className="text-sm text-muted-foreground">
              Templates will appear here once you create them in the database
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
