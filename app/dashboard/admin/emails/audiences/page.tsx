import { requireAdmin } from '@/lib/utils/auth_utils';
import { AudienceManager } from './components/AudienceManager';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AudiencesPage() {
  await requireAdmin();

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard/admin/emails">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Email System
          </Link>
        </Button>
        <h1 className="text-4xl font-bold">Audience Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage user segments, create custom audiences, and sync to Resend
        </p>
      </div>

      {/* Main Content */}
      <AudienceManager />
    </div>
  );
}
