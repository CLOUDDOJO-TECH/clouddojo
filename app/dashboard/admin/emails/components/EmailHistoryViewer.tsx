'use client';

import { useState } from 'react';
import { api } from '@/trpc/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  RefreshCw,
  Search,
  Eye,
  Trash2,
  Mail,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

type EmailStatus = 'QUEUED' | 'SENDING' | 'SENT' | 'DELIVERED' | 'OPENED' | 'CLICKED' | 'BOUNCED' | 'FAILED';
type EmailType = 'welcome' | 'quiz_basic' | 'quiz_milestone' | 'perfect_score' | 'badge_unlocked' | 'streak_milestone' | 'level_up' | 'feature_adoption' | 'ai_analysis_notification' | 'inactive_3day' | 'inactive_7day' | 'inactive_14day' | 'weekly_progress' | 'monthly_certification_readiness';

interface Filters {
  status?: EmailStatus;
  emailType?: EmailType;
  userSearch?: string;
  page: number;
  limit: number;
}

export function EmailHistoryViewer() {
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 20,
  });
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [previewEmailId, setPreviewEmailId] = useState<string | null>(null);

  // Queries
  const { data, isLoading, refetch } = api.adminEmail.getEmailLogs.useQuery(filters);
  const exportQuery = api.adminEmail.exportEmailLogs.useQuery(
    {
      status: filters.status,
      emailType: filters.emailType,
    },
    { enabled: false } // Only run when explicitly called
  );
  const previewQuery = api.adminEmail.previewEmail.useQuery(
    { emailLogId: previewEmailId! },
    { enabled: !!previewEmailId }
  );

  // Mutations
  const bulkResendMutation = api.adminEmail.bulkResendEmails.useMutation({
    onSuccess: (result) => {
      toast.success(result.message);
      setSelectedEmails([]);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const bulkDeleteMutation = api.adminEmail.bulkDeleteEmailLogs.useMutation({
    onSuccess: (result) => {
      toast.success(result.message);
      setSelectedEmails([]);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleBulkResend = () => {
    if (selectedEmails.length === 0) {
      toast.error('Please select emails to resend');
      return;
    }

    if (confirm(`Resend ${selectedEmails.length} email(s)?`)) {
      bulkResendMutation.mutate({ emailLogIds: selectedEmails });
    }
  };

  const handleBulkDelete = () => {
    if (selectedEmails.length === 0) {
      toast.error('Please select emails to delete');
      return;
    }

    if (confirm(`Delete ${selectedEmails.length} email log(s)? This action cannot be undone.`)) {
      bulkDeleteMutation.mutate({ emailLogIds: selectedEmails });
    }
  };

  const handleExport = async () => {
    const result = await exportQuery.refetch();
    if (result.data) {
      const blob = new Blob([result.data.csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `email-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success(`Exported ${result.data.totalRecords} records`);
    }
  };

  const toggleEmailSelection = (emailId: string) => {
    setSelectedEmails((prev) =>
      prev.includes(emailId) ? prev.filter((id) => id !== emailId) : [...prev, emailId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedEmails.length === data?.logs.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(data?.logs.map((log) => log.id) || []);
    }
  };

  const getStatusColor = (status: EmailStatus) => {
    const colors: Record<EmailStatus, string> = {
      QUEUED: 'bg-gray-500',
      SENDING: 'bg-blue-500',
      SENT: 'bg-green-500',
      DELIVERED: 'bg-green-600',
      OPENED: 'bg-purple-500',
      CLICKED: 'bg-pink-500',
      BOUNCED: 'bg-orange-500',
      FAILED: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter emails by status, type, or search users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) =>
                handleFilterChange('status', value === 'all' ? undefined : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="QUEUED">Queued</SelectItem>
                <SelectItem value="SENDING">Sending</SelectItem>
                <SelectItem value="SENT">Sent</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="OPENED">Opened</SelectItem>
                <SelectItem value="CLICKED">Clicked</SelectItem>
                <SelectItem value="BOUNCED">Bounced</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.emailType || 'all'}
              onValueChange={(value) =>
                handleFilterChange('emailType', value === 'all' ? undefined : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="welcome">Welcome</SelectItem>
                <SelectItem value="quiz_milestone">Quiz Milestone</SelectItem>
                <SelectItem value="badge_unlocked">Badge Unlocked</SelectItem>
                <SelectItem value="streak_milestone">Streak Milestone</SelectItem>
                <SelectItem value="level_up">Level Up</SelectItem>
                <SelectItem value="perfect_score">Perfect Score</SelectItem>
                <SelectItem value="feature_adoption">Feature Adoption</SelectItem>
                <SelectItem value="weekly_progress">Weekly Progress</SelectItem>
                <SelectItem value="monthly_certification_readiness">Monthly Readiness</SelectItem>
                <SelectItem value="inactive_3day">Inactive (3 days)</SelectItem>
                <SelectItem value="inactive_7day">Inactive (7 days)</SelectItem>
                <SelectItem value="inactive_14day">Inactive (14 days)</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={filters.userSearch || ''}
                onChange={(e) => handleFilterChange('userSearch', e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setFilters({ page: 1, limit: 20 });
                setSelectedEmails([]);
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport} disabled={exportQuery.isFetching}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedEmails.length > 0 && (
        <Alert>
          <AlertDescription className="flex items-center justify-between">
            <span>{selectedEmails.length} email(s) selected</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkResend}
                disabled={bulkResendMutation.isPending}
              >
                <Mail className="h-4 w-4 mr-2" />
                Resend Selected
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={bulkDeleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Email Table */}
      <Card>
        <CardHeader>
          <CardTitle>Email Logs</CardTitle>
          <CardDescription>
            {data?.pagination.total || 0} total emails
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : !data || data.logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No emails found matching your filters
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">
                        <Checkbox
                          checked={selectedEmails.length === data.logs.length}
                          onCheckedChange={toggleSelectAll}
                        />
                      </th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Type</th>
                      <th className="p-2 text-left">Recipient</th>
                      <th className="p-2 text-left">Subject</th>
                      <th className="p-2 text-left">Sent</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.logs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <Checkbox
                            checked={selectedEmails.includes(log.id)}
                            onCheckedChange={() => toggleEmailSelection(log.id)}
                          />
                        </td>
                        <td className="p-2">
                          <Badge className={getStatusColor(log.status as EmailStatus)}>
                            {log.status}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <span className="text-sm">{log.emailType}</span>
                        </td>
                        <td className="p-2">
                          <div>
                            <div className="font-medium text-sm">{log.to}</div>
                            {log.user && (
                              <div className="text-xs text-muted-foreground">
                                {log.user.firstName} {log.user.lastName}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-2 max-w-xs truncate">{log.subject || '-'}</td>
                        <td className="p-2 text-sm text-muted-foreground">
                          {log.sentAt ? format(new Date(log.sentAt), 'MMM d, HH:mm') : '-'}
                        </td>
                        <td className="p-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPreviewEmailId(log.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Page {data.pagination.page} of {data.pagination.totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={data.pagination.page === 1}
                    onClick={() => handleFilterChange('page', filters.page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={data.pagination.page === data.pagination.totalPages}
                    onClick={() => handleFilterChange('page', filters.page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <Dialog open={!!previewEmailId} onOpenChange={(open) => !open && setPreviewEmailId(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
            <DialogDescription>
              {previewQuery.data?.emailType} - {previewQuery.data?.subject}
            </DialogDescription>
          </DialogHeader>
          {previewQuery.isLoading ? (
            <div className="py-8 text-center">Loading preview...</div>
          ) : previewQuery.data ? (
            <div
              className="border rounded p-4"
              dangerouslySetInnerHTML={{ __html: previewQuery.data.htmlContent }}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
