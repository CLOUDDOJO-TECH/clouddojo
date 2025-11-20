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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface SegmentDetailModalProps {
  segmentType: string;
  segmentValue: string;
  segmentName: string;
  onClose: () => void;
}

export function SegmentDetailModal({
  segmentType,
  segmentValue,
  segmentName,
  onClose,
}: SegmentDetailModalProps) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: users, isLoading: usersLoading, refetch: refetchUsers } = api.adminAudience.getSegmentUsers.useQuery({
    segmentType,
    segmentValue,
    page,
    limit: 20,
    searchQuery: searchQuery.trim() || undefined,
  });

  const { data: stats } = api.adminAudience.getSegmentStats.useQuery({
    segmentType,
    segmentValue,
    days: 30,
  });

  const removeUserMutation = api.adminAudience.removeUserFromSegment.useMutation({
    onSuccess: () => {
      toast.success('User removed from segment');
      refetchUsers();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleRemoveUser = (userId: string) => {
    if (confirm('Remove this user from the segment?')) {
      removeUserMutation.mutate({ userId, segmentType, segmentValue });
    }
  };

  const getPlanBadgeColor = (plan: string) => {
    const colors: Record<string, string> = {
      FREE: 'bg-gray-500',
      PRO: 'bg-blue-500',
      PREMIUM: 'bg-purple-500',
    };
    return colors[plan] || 'bg-gray-500';
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{segmentName}</DialogTitle>
          <DialogDescription>
            {segmentType} segment • {users?.pagination.total || 0} users
          </DialogDescription>
        </DialogHeader>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Current Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{stats.currentCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Added (30d)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-green-600">+{stats.addedCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Removed (30d)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-red-600">-{stats.removedCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Growth Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1">
                  {stats.growthRate > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : stats.growthRate < 0 ? (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  ) : (
                    <Minus className="h-4 w-4 text-gray-600" />
                  )}
                  <span
                    className={`text-xl font-bold ${
                      stats.growthRate > 0
                        ? 'text-green-600'
                        : stats.growthRate < 0
                        ? 'text-red-600'
                        : ''
                    }`}
                  >
                    {stats.growthRate}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Controls */}
        <div className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => refetchUsers()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Users Table */}
        <div className="mt-4">
          {usersLoading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : !users || users.users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-2 text-sm font-medium">User</th>
                      <th className="text-left p-2 text-sm font-medium">Plan</th>
                      <th className="text-left p-2 text-sm font-medium">Last Active</th>
                      <th className="text-left p-2 text-sm font-medium">Added</th>
                      <th className="text-left p-2 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.users.map((user) => (
                      <tr key={user.userId} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <div>
                            <div className="font-medium text-sm">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge className={getPlanBadgeColor(user.plan || 'FREE')}>
                            {user.plan || 'FREE'}
                          </Badge>
                        </td>
                        <td className="p-2 text-sm text-muted-foreground">
                          {user.lastActivityAt
                            ? format(new Date(user.lastActivityAt), 'MMM d, yyyy')
                            : 'Never'}
                        </td>
                        <td className="p-2 text-sm text-muted-foreground">
                          {user.addedAt
                            ? format(new Date(user.addedAt), 'MMM d, yyyy')
                            : '-'}
                        </td>
                        <td className="p-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveUser(user.userId)}
                            disabled={removeUserMutation.isPending}
                          >
                            Remove
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
                  Page {users.pagination.page} of {users.pagination.totalPages} ({users.pagination.total} total users)
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
                    disabled={page === users.pagination.totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
