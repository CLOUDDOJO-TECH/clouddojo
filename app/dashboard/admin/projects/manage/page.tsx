import { requireAdmin } from "@/lib/utils/auth_utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";

export default async function ManageProjectsPage() {
  // Server-side protection
  const user = await requireAdmin();

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div>
          <Link href="/dashboard/admin">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Manage Projects</h1>
              <p className="text-muted-foreground mt-2">
                View, edit, and manage all hands-on projects
              </p>
            </div>
            <Link href="/dashboard/admin/projects/create">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Placeholder - To be implemented with data table */}
        <div className="border rounded-lg p-12 text-center bg-muted/30">
          <h3 className="text-lg font-semibold mb-2">Project Management Coming Soon</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The project list and management interface will be implemented here.
          </p>
          <Link href="/dashboard/admin/projects/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
