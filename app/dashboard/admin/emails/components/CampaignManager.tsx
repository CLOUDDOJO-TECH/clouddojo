'use client';

import { useState } from 'react';
import { api } from '@/lib/trpc/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, RefreshCw, Calendar, Users, Mail, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const statusColors = {
  DRAFT: 'bg-gray-500',
  SCHEDULED: 'bg-blue-500',
  SENDING: 'bg-orange-500',
  SENT: 'bg-green-500',
  CANCELLED: 'bg-red-500',
};

export default function CampaignManager() {
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const { data: campaigns, isLoading, refetch } = api.adminEmail.getCampaigns.useQuery({
    status: filterStatus as any,
  });

  const createMutation = api.adminEmail.createCampaign.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateDialogOpen(false);
      setNewCampaign({
        name: '',
        emailType: 'welcome',
        subject: '',
        scheduledFor: '',
      });
    },
  });

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    emailType: 'welcome' as any,
    subject: '',
    scheduledFor: '',
  });

  const handleCreateCampaign = async () => {
    await createMutation.mutateAsync({
      name: newCampaign.name,
      emailType: newCampaign.emailType,
      subject: newCampaign.subject,
      scheduledFor: newCampaign.scheduledFor ? new Date(newCampaign.scheduledFor) : undefined,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Email Campaigns</CardTitle>
            <CardDescription>Create and manage email campaigns</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                  <DialogDescription>
                    Set up a new email campaign to send to your users
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaignName">Campaign Name</Label>
                    <Input
                      id="campaignName"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                      placeholder="e.g., Monthly Newsletter - January 2025"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailType">Email Type</Label>
                    <Select
                      value={newCampaign.emailType}
                      onValueChange={(value) =>
                        setNewCampaign({ ...newCampaign, emailType: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="welcome">Welcome</SelectItem>
                        <SelectItem value="quiz_milestone">Quiz Milestone</SelectItem>
                        <SelectItem value="badge_unlocked">Badge Unlocked</SelectItem>
                        <SelectItem value="streak_milestone">Streak Milestone</SelectItem>
                        <SelectItem value="level_up">Level Up</SelectItem>
                        <SelectItem value="feature_adoption">Feature Adoption</SelectItem>
                        <SelectItem value="weekly_progress">Weekly Progress</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject Line</Label>
                    <Input
                      id="subject"
                      value={newCampaign.subject}
                      onChange={(e) =>
                        setNewCampaign({ ...newCampaign, subject: e.target.value })
                      }
                      placeholder="Enter email subject line"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scheduledFor">Schedule For (Optional)</Label>
                    <Input
                      id="scheduledFor"
                      type="datetime-local"
                      value={newCampaign.scheduledFor}
                      onChange={(e) =>
                        setNewCampaign({ ...newCampaign, scheduledFor: e.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty to save as draft
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateCampaign}
                      disabled={
                        !newCampaign.name || !newCampaign.subject || createMutation.isPending
                      }
                    >
                      {createMutation.isPending ? 'Creating...' : 'Create Campaign'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter */}
        <div className="flex gap-2">
          <Select
            value={filterStatus || 'all'}
            onValueChange={(value) =>
              setFilterStatus(value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="SENDING">Sending</SelectItem>
              <SelectItem value="SENT">Sent</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Campaigns Table */}
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading campaigns...</div>
        ) : campaigns && campaigns.campaigns.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scheduled For</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Sent Count</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-xs text-muted-foreground">{campaign.subject}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{campaign.emailType}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[campaign.status as keyof typeof statusColors]} text-white`}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {campaign.scheduledFor ? (
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {format(new Date(campaign.scheduledFor), 'MMM d, yyyy HH:mm')}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-1" />
                        {campaign.targetSegments.length > 0
                          ? campaign.targetSegments.join(', ')
                          : 'All users'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-1" />
                        {campaign.sentCount || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {format(new Date(campaign.createdAt), 'MMM d, yyyy')}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <div className="text-muted-foreground">No campaigns found</div>
            <p className="text-sm text-muted-foreground">
              Create your first campaign to get started
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
