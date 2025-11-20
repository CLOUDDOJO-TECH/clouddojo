'use client';

import { useState } from 'react';
import { api } from '@/lib/trpc/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { format } from 'date-fns';
import { Search, RefreshCw, Mail, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

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

  const { data, isLoading, refetch } = api.adminEmail.getEmailLogs.useQuery(filters);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, offset: 0 }));
  };

  const handlePageChange = (direction: 'next' | 'prev') => {
    setFilters((prev) => ({
      ...prev,
      offset: direction === 'next' ? prev.offset + prev.limit : Math.max(0, prev.offset - prev.limit),
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Email History</CardTitle>
            <CardDescription>
              View and filter all email logs. Total emails: {data?.totalCount || 0}
            </CardDescription>
          </div>
          <Button onClick={() => refetch()} size="sm" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
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
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setFilters({ status: undefined, emailType: undefined, userSearch: '', limit: 50, offset: 0 })}
          >
            Clear Filters
          </Button>
        </div>

        {/* Email Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Sent At</TableHead>
                <TableHead>Opened At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : data?.logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No emails found
                  </TableCell>
                </TableRow>
              ) : (
                data?.logs.map((log) => {
                  const StatusIcon = statusIcons[log.status as keyof typeof statusIcons];
                  return (
                    <TableRow key={log.id}>
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
  );
}
