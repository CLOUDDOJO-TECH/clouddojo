'use client';

import { useState } from 'react';
import { api } from '@/lib/trpc/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Search, RefreshCw, Mail, CheckCircle, XCircle, Clock, Eye, Download, Trash2, Send } from 'lucide-react';
import { toast } from 'sonner';

const statusColors = {
  PENDING: 'bg-gray-500',
  SENDING: 'bg-blue-500',
  SENT: 'bg-green-500',
  DELIVERED: 'bg-green-600',
  OPENED: 'bg-purple-500',
  CLICKED: 'bg-indigo-500',
  BOUNCED: 'bg-orange-500',
  FAILED: 'bg-red-500',
};

const statusIcons = {
  PENDING: Clock,
  SENDING: Mail,
  SENT: CheckCircle,
  DELIVERED: CheckCircle,
  OPENED: Eye,
  CLICKED: CheckCircle,
  BOUNCED: XCircle,
  FAILED: XCircle,
};

export default function EmailHistoryViewer() {
  const [filters, setFilters] = useState({
    status: undefined,
    emailType: undefined,
    userSearch: '',
    limit: 50,
    offset: 0,
  });

  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [previewEmailId, setPreviewEmailId] = useState<string | null>(null);

  const { data, isLoading, refetch } = api.adminEmail.getEmailLogs.useQuery(filters);
  const { data: previewData, isLoading: previewLoading } = api.adminEmail.previewEmail.useQuery(
    { emailLogId: previewEmailId! },
    { enabled: !!previewEmailId }
  );

  const bulkResendMutation = api.adminEmail.bulkResendEmails.useMutation({
    onSuccess: (result) => {
      toast.success(result.message);
      setSelectedEmails([]);
      refetch();
    },
    onError: () => {
      toast.error('Failed to resend emails');
    },
  });

  const bulkDeleteMutation = api.adminEmail.bulkDeleteEmailLogs.useMutation({
    onSuccess: (result) => {
      toast.success(result.message);
      setSelectedEmails([]);
      refetch();
    },
    onError: () => {
      toast.error('Failed to delete emails');
    },
  });

  const exportQuery = api.adminEmail.exportEmailLogs.useQuery(
    {
      status: filters.status as any,
      emailType: filters.emailType as any,
    },
    { enabled: false }
  );

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, offset: 0 }));
  };

  const handlePageChange = (direction: 'next' | 'prev') => {
    setFilters((prev) => ({
      ...prev,
      offset: direction === 'next' ? prev.offset + prev.limit : Math.max(0, prev.offset - prev.limit),
    }));
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

  const handleBulkResend = () => {
    if (selectedEmails.length === 0) {
      toast.error('Please select emails to resend');
      return;
    }
    bulkResendMutation.mutate({ emailLogIds: selectedEmails });
  };

  const handleBulkDelete = () => {
    if (selectedEmails.length === 0) {
      toast.error('Please select emails to delete');
      return;
    }
    if (confirm(`Are you sure you want to delete ${selectedEmails.length} email logs?`)) {
      bulkDeleteMutation.mutate({ emailLogIds: selectedEmails });
    }
  };

  const handleExport = async () => {
    const result = await exportQuery.refetch();
    if (result.data) {
      // Create blob and download
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

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Email History</CardTitle>
              <CardDescription>
                View and filter all email logs. Total emails: {data?.totalCount || 0}
                {selectedEmails.length > 0 && ` (${selectedEmails.length} selected)`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExport} size="sm" variant="outline" disabled={exportQuery.isFetching}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={() => refetch()} size="sm" variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search by user or email..."
                value={filters.userSearch}
                onChange={(e) => handleFilterChange('userSearch', e.target.value)}
                className="w-full"
              />
            </div>
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
                <SelectItem value="PENDING">Pending</SelectItem>
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
            <Button
              variant="outline"
              onClick={() => {
                setFilters({ status: undefined, emailType: undefined, userSearch: '', limit: 50, offset: 0 });
                setSelectedEmails([]);
              }}
            >
              Clear Filters
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedEmails.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">{selectedEmails.length} selected</span>
              <div className="flex gap-2 ml-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkResend}
                  disabled={bulkResendMutation.isPending}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Resend Selected
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleBulkDelete}
                  disabled={bulkDeleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          )}

          {/* Email Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={data?.logs.length > 0 && selectedEmails.length === data?.logs.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead>Opened At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : data?.logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No emails found
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.logs.map((log) => {
                    const StatusIcon = statusIcons[log.status as keyof typeof statusIcons];
                    return (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedEmails.includes(log.id)}
                            onCheckedChange={() => toggleEmailSelection(log.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              statusColors[log.status as keyof typeof statusColors]
                            } text-white`}
                          >
                            {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{log.emailType}</span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm font-medium">{log.to}</div>
                            <div className="text-xs text-muted-foreground">
                              {log.user?.firstName} {log.user?.lastName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{log.subject || 'N/A'}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {log.sentAt ? format(new Date(log.sentAt), 'MMM d, yyyy HH:mm') : '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {log.openedAt
                              ? format(new Date(log.openedAt), 'MMM d, yyyy HH:mm')
                              : '-'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPreviewEmailId(log.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {data && data.totalCount > 0 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filters.offset + 1} to {Math.min(filters.offset + filters.limit, data.totalCount)} of{' '}
                {data.totalCount} emails
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange('prev')}
                  disabled={filters.offset === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange('next')}
                  disabled={!data.hasMore}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Preview Dialog */}
      <Dialog open={!!previewEmailId} onOpenChange={(open) => !open && setPreviewEmailId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
            <DialogDescription>
              {previewData?.emailType && `Type: ${previewData.emailType}`}
            </DialogDescription>
          </DialogHeader>
          {previewLoading ? (
            <div className="py-12 text-center text-muted-foreground">Loading preview...</div>
          ) : previewData ? (
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="text-sm font-medium">Subject:</div>
                <div className="text-lg">{previewData.subject}</div>
              </div>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewData.htmlContent }}
                />
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              Failed to load preview
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
