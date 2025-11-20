'use client';

import { useState } from 'react';
import { api } from '@/trpc/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Users,
  TrendingUp,
  Download,
  Eye,
  RefreshCw,
  Plus,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { SegmentDetailModal } from './SegmentDetailModal';
import { CustomSegmentCreator } from './CustomSegmentCreator';

export function AudienceManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<{
    type: string;
    value: string;
    name: string;
  } | null>(null);
  const [showCustomSegmentCreator, setShowCustomSegmentCreator] = useState(false);

  const { data, isLoading, refetch } = api.adminAudience.getSegments.useQuery({
    includeInactive,
    searchQuery: searchQuery.trim() || undefined,
  });

  const handleExportSegment = async (segmentType: string, segmentValue: string, segmentName: string) => {
    try {
      const result = await api.adminAudience.exportSegmentUsers.useQuery({
        segmentType,
        segmentValue,
      }).refetch();

      if (result.data) {
        const blob = new Blob([result.data.csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `segment-${segmentValue}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success(`Exported ${result.data.totalRecords} users from ${segmentName}`);
      }
    } catch (error) {
      toast.error('Failed to export segment');
    }
  };

  const getSegmentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      plan: 'bg-blue-500',
      lifecycle: 'bg-green-500',
      engagement: 'bg-purple-500',
      certification: 'bg-orange-500',
      custom: 'bg-pink-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  const getSegmentTypeIcon = (type: string) => {
    switch (type) {
      case 'plan':
        return '💳';
      case 'lifecycle':
        return '🔄';
      case 'engagement':
        return '🔥';
      case 'certification':
        return '🎓';
      default:
        return '📊';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading audiences...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search segments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => setIncludeInactive(!includeInactive)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {includeInactive ? 'Hide Inactive' : 'Show Inactive'}
          </Button>
          <Button onClick={() => setShowCustomSegmentCreator(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Custom Segment
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {data?.systemCount || 0} system, {data?.customCount || 0} custom
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Users Segmented</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.segments.reduce((sum, seg) => sum + seg.userCount, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all active segments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Largest Segment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.segments.length
                ? Math.max(...data.segments.map((s) => s.userCount))
                : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data?.segments.length
                ? data.segments.reduce((max, seg) =>
                    seg.userCount > max.userCount ? seg : max
                  ).name
                : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Segments Grid */}
      {!data || data.segments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No segments found matching your criteria
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.segments.map((segment) => (
            <Card key={segment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getSegmentTypeIcon(segment.segmentType)}</span>
                    <div>
                      <CardTitle className="text-base">{segment.name}</CardTitle>
                      <Badge
                        className={`${getSegmentTypeColor(segment.segmentType)} mt-1 text-xs`}
                      >
                        {segment.type === 'system' ? 'System' : 'Custom'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {segment.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* User Count */}
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Users</span>
                    </div>
                    <span className="text-lg font-bold">{segment.userCount.toLocaleString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        setSelectedSegment({
                          type: segment.segmentType,
                          value: segment.segmentValue,
                          name: segment.name,
                        })
                      }
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        handleExportSegment(
                          segment.segmentType,
                          segment.segmentValue,
                          segment.name
                        )
                      }
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Segment Detail Modal */}
      {selectedSegment && (
        <SegmentDetailModal
          segmentType={selectedSegment.type}
          segmentValue={selectedSegment.value}
          segmentName={selectedSegment.name}
          onClose={() => setSelectedSegment(null)}
        />
      )}

      {/* Custom Segment Creator */}
      <CustomSegmentCreator
        open={showCustomSegmentCreator}
        onClose={() => setShowCustomSegmentCreator(false)}
        onSuccess={() => {
          refetch();
          setShowCustomSegmentCreator(false);
        }}
      />
    </div>
  );
}
