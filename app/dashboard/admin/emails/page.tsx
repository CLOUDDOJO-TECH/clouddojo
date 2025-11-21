import { requireAdmin } from '@/lib/utils/auth_utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmailHistoryViewer } from './components/EmailHistoryViewer';
import { EmailAnalyticsDashboard } from './components/EmailAnalyticsDashboard';
import { AudienceManager } from './audiences/components/AudienceManager';
import { TemplateManager } from './templates/components/TemplateManager';
import { ArrowLeft, Mail, BarChart3, Users, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AdminEmailsPage() {
  await requireAdmin();

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/dashboard/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin Dashboard
            </Link>
          </Button>
          <h1 className="text-4xl font-bold">Email System Management</h1>
          <p className="text-muted-foreground mt-2">
            Monitor emails, view analytics, and manage campaigns
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="history" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[800px]">
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email History
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="audiences" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Audiences
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <EmailHistoryViewer />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <EmailAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="audiences" className="space-y-4">
          <AudienceManager />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <TemplateManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
