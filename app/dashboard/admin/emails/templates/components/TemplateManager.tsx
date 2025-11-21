'use client';

import { useState } from 'react';
import { api } from '@/trpc/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Plus,
  RefreshCw,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  Send,
  FileCode,
  Mail,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { EmailCategory } from '@prisma/client';
import { TemplateEditor } from './TemplateEditor';
import { TemplatePreview } from './TemplatePreview';
import { TestEmailDialog } from './TestEmailDialog';

export function TemplateManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<EmailCategory | 'ALL'>('ALL');
  const [isActive, setIsActive] = useState<boolean | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<'create' | 'edit' | null>(null);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const [testEmailTemplateId, setTestEmailTemplateId] = useState<string | null>(null);

  const { data, isLoading, refetch } = api.adminTemplate.getTemplates.useQuery({
    category: category === 'ALL' ? undefined : category,
    isActive: isActive === 'ALL' ? undefined : isActive,
    searchQuery: searchQuery.trim() || undefined,
    page,
    limit: 12,
  });

  const deleteMutation = api.adminTemplate.deleteTemplate.useMutation({
    onSuccess: () => {
      toast.success('Template deactivated successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const duplicateMutation = api.adminTemplate.duplicateTemplate.useMutation({
    onSuccess: (result) => {
      toast.success(`Template duplicated: ${result.template.name}`);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Deactivate template "${name}"? This will hide it from campaigns.`)) {
      deleteMutation.mutate({ id });
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateMutation.mutate({ id });
  };

  const getCategoryColor = (cat: EmailCategory) => {
    const colors: Record<EmailCategory, string> = {
      TRANSACTIONAL: 'bg-blue-500',
      MARKETING: 'bg-purple-500',
      NOTIFICATION: 'bg-orange-500',
      SYSTEM: 'bg-gray-500',
    };
    return colors[cat] || 'bg-gray-500';
  };

  const getCategoryIcon = (cat: EmailCategory) => {
    switch (cat) {
      case 'TRANSACTIONAL':
        return '💳';
      case 'MARKETING':
        return '📢';
      case 'NOTIFICATION':
        return '🔔';
      case 'SYSTEM':
        return '⚙️';
      default:
        return '📧';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading templates...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>

          {/* Category Filter */}
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value as EmailCategory | 'ALL');
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              <SelectItem value="TRANSACTIONAL">Transactional</SelectItem>
              <SelectItem value="MARKETING">Marketing</SelectItem>
              <SelectItem value="NOTIFICATION">Notification</SelectItem>
              <SelectItem value="SYSTEM">System</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={isActive === 'ALL' ? 'ALL' : isActive ? 'ACTIVE' : 'INACTIVE'}
            onValueChange={(value) => {
              setIsActive(value === 'ALL' ? 'ALL' : value === 'ACTIVE');
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active Only</SelectItem>
              <SelectItem value="INACTIVE">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setEditorMode('create')}>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.pagination.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data?.templates.filter((t) => t.isActive).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {data?.templates.filter((t) => !t.isActive).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.templates.reduce((sum, t) => sum + t.usageCount, 0) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates Grid */}
      {!data || data.templates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {searchQuery || category !== 'ALL' || isActive !== 'ALL'
              ? 'No templates found matching your filters'
              : 'No templates yet. Create your first template!'}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.templates.map((template) => (
              <Card
                key={template.id}
                className={`hover:shadow-lg transition-shadow ${
                  !template.isActive ? 'opacity-60' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-2xl">{getCategoryIcon(template.category)}</span>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{template.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge className={`${getCategoryColor(template.category)} text-xs`}>
                            {template.category}
                          </Badge>
                          {template.isActive ? (
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              <XCircle className="h-3 w-3 mr-1 text-gray-600" />
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setPreviewTemplateId(template.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedTemplate(template.id);
                            setEditorMode('edit');
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setTestEmailTemplateId(template.id)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send Test
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(template.id)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(template.id, template.name)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="mt-2">
                    {template.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Subject */}
                    <div className="p-2 bg-muted rounded text-sm">
                      <span className="font-medium">Subject:</span> {template.subject}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{template.usageCount} sent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileCode className="h-4 w-4 text-muted-foreground" />
                        <span>{(template.variables as string[] | null)?.length || 0} vars</span>
                      </div>
                    </div>

                    {/* Component Path */}
                    <div className="text-xs text-muted-foreground font-mono truncate">
                      {template.componentPath}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {data.pagination.page} of {data.pagination.totalPages} (
                {data.pagination.total} templates)
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === data.pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals/Dialogs */}
      {editorMode && (
        <TemplateEditor
          mode={editorMode}
          templateId={editorMode === 'edit' ? selectedTemplate : undefined}
          onClose={() => {
            setEditorMode(null);
            setSelectedTemplate(null);
          }}
          onSuccess={() => {
            refetch();
            setEditorMode(null);
            setSelectedTemplate(null);
          }}
        />
      )}

      {previewTemplateId && (
        <TemplatePreview
          templateId={previewTemplateId}
          onClose={() => setPreviewTemplateId(null)}
        />
      )}

      {testEmailTemplateId && (
        <TestEmailDialog
          templateId={testEmailTemplateId}
          onClose={() => setTestEmailTemplateId(null)}
        />
      )}
    </div>
  );
}
