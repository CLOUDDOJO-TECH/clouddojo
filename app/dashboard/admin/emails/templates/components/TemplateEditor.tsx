'use client';

import { useState, useEffect } from 'react';
import { api } from '@/trpc/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { EmailCategory } from '@prisma/client';
import { Plus, X } from 'lucide-react';

interface TemplateEditorProps {
  mode: 'create' | 'edit';
  templateId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function TemplateEditor({ mode, templateId, onClose, onSuccess }: TemplateEditorProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: '',
    componentPath: '',
    category: 'NOTIFICATION' as EmailCategory,
    isActive: true,
    variables: [] as string[],
  });
  const [newVariable, setNewVariable] = useState('');

  // Fetch existing template if editing
  const { data: template, isLoading: isLoadingTemplate } = api.adminTemplate.getTemplate.useQuery(
    { id: templateId! },
    { enabled: mode === 'edit' && !!templateId }
  );

  // Populate form data when template is loaded
  useEffect(() => {
    if (template && mode === 'edit') {
      setFormData({
        name: template.name,
        description: template.description || '',
        subject: template.subject,
        componentPath: template.componentPath,
        category: template.category,
        isActive: template.isActive,
        variables: (template.variables as string[]) || [],
      });
    }
  }, [template, mode]);

  const createMutation = api.adminTemplate.createTemplate.useMutation({
    onSuccess: (result) => {
      toast.success(`Template created: ${result.template.name}`);
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = api.adminTemplate.updateTemplate.useMutation({
    onSuccess: (result) => {
      toast.success(`Template updated: ${result.template.name}`);
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Template name is required');
      return;
    }
    if (!formData.subject.trim()) {
      toast.error('Subject is required');
      return;
    }
    if (!formData.componentPath.trim()) {
      toast.error('Component path is required');
      return;
    }

    const data = {
      ...formData,
      variables: formData.variables.length > 0 ? formData.variables : undefined,
    };

    if (mode === 'create') {
      createMutation.mutate(data);
    } else if (templateId) {
      updateMutation.mutate({
        id: templateId,
        ...data,
      });
    }
  };

  const handleAddVariable = () => {
    const trimmed = newVariable.trim();
    if (trimmed && !formData.variables.includes(trimmed)) {
      setFormData({
        ...formData,
        variables: [...formData.variables, trimmed],
      });
      setNewVariable('');
    }
  };

  const handleRemoveVariable = (variable: string) => {
    setFormData({
      ...formData,
      variables: formData.variables.filter((v) => v !== variable),
    });
  };

  if (mode === 'edit' && isLoadingTemplate) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <div className="text-center py-8">Loading template...</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New Template' : 'Edit Template'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Define a new email template for your campaigns'
              : 'Update the template configuration'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Welcome Email"
                className="mt-1"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Unique identifier for this template
              </p>
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of when this template is used..."
                className="mt-1"
                rows={2}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="subject">Subject Line *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Welcome to CloudDojo!"
                className="mt-1"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="componentPath">Component Path *</Label>
              <Input
                id="componentPath"
                value={formData.componentPath}
                onChange={(e) => setFormData({ ...formData, componentPath: e.target.value })}
                placeholder="lib/emails/welcome-email.tsx"
                className="mt-1 font-mono text-sm"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Path to React Email component (relative to project root)
              </p>
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value: EmailCategory) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRANSACTIONAL">Transactional</SelectItem>
                  <SelectItem value="MARKETING">Marketing</SelectItem>
                  <SelectItem value="NOTIFICATION">Notification</SelectItem>
                  <SelectItem value="SYSTEM">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 mt-8">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          {/* Variables */}
          <div>
            <Label>Template Variables</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Add variables that this template uses (e.g., username, score, certificationName)
            </p>

            {formData.variables.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.variables.map((variable) => (
                  <Badge key={variable} variant="secondary">
                    {variable}
                    <button
                      type="button"
                      onClick={() => handleRemoveVariable(variable)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={newVariable}
                onChange={(e) => setNewVariable(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddVariable();
                  }
                }}
                placeholder="Variable name (e.g., username)"
                className="font-mono text-sm"
              />
              <Button type="button" variant="outline" onClick={handleAddVariable}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {mode === 'create' ? 'Create Template' : 'Update Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
