'use client';

import { useState } from 'react';
import { api } from '@/lib/trpc/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Mail, Eye, MousePointer, AlertTriangle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

export default function EmailAnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<{ fromDate?: Date; toDate?: Date }>({});
  const { data, isLoading, refetch } = api.adminEmail.getEmailAnalytics.useQuery(dateRange);
  const { data: templatePerf } = api.adminEmail.getTemplatePerformance.useQuery(dateRange);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-muted-foreground">Loading analytics...</div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Analytics</h2>
          <p className="text-muted-foreground">Performance metrics and insights</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{data.overview.totalSent.toLocaleString()}</div>
              <Mail className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Delivered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {data.overview.totalDelivered.toLocaleString()}
              </div>
              <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {data.rates.deliveryRate}% delivery rate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Opened</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{data.overview.totalOpened.toLocaleString()}</div>
              <Eye className="w-8 h-8 text-purple-500 opacity-50" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {data.rates.openRate}% open rate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clicked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {data.overview.totalClicked.toLocaleString()}
              </div>
              <MousePointer className="w-8 h-8 text-indigo-500 opacity-50" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {data.rates.clickRate}% click rate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bounced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {data.overview.totalBounced.toLocaleString()}
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500 opacity-50" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {data.rates.bounceRate}% bounce rate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{data.overview.totalFailed.toLocaleString()}</div>
              <AlertTriangle className="w-8 h-8 text-red-500 opacity-50" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {data.rates.failureRate}% failure rate
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Volume */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Email Volume (Last 30 Days)</CardTitle>
            <CardDescription>Number of emails sent per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.dailyVolume}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), 'MMM d')}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => format(new Date(value as string), 'MMM d, yyyy')}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="Emails Sent"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Email Status Distribution</CardTitle>
            <CardDescription>Breakdown by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.byStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.status}: ${entry.count}`}
                >
                  {data.byStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Type Volume */}
        <Card>
          <CardHeader>
            <CardTitle>Email Volume by Type</CardTitle>
            <CardDescription>Total emails sent per type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.byEmailType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="emailType" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#6366f1" name="Email Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Template Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Template Performance</CardTitle>
            <CardDescription>Open rates by email type</CardDescription>
          </CardHeader>
          <CardContent>
            {templatePerf && templatePerf.length > 0 ? (
              <div className="space-y-3">
                {templatePerf.slice(0, 8).map((template, index) => (
                  <div key={template.emailType} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{template.emailType}</span>
                      <span className="text-muted-foreground">
                        {template.openRate.toFixed(1)}% open · {template.clickRate.toFixed(1)}% click
                      </span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                        style={{ width: `${Math.min(100, template.openRate)}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {template.totalSent} sent · {template.opened} opened · {template.clicked}{' '}
                      clicked
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No template performance data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
