'use client';

import { useState } from 'react';
import { api } from '@/lib/trpc/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailHistoryViewer from './components/EmailHistoryViewer';
import EmailAnalyticsDashboard from './components/EmailAnalyticsDashboard';
import TemplateManager from './components/TemplateManager';
import CampaignManager from './components/CampaignManager';

export default function EmailAdminPage() {
  const [activeTab, setActiveTab] = useState('history');

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Email System Admin</h1>
        <p className="text-muted-foreground">
          Manage emails, view analytics, edit templates, and create campaigns
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="history">Email History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <EmailHistoryViewer />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <EmailAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <TemplateManager />
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <CampaignManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
