import { User } from "@prisma/client";
import Link from "next/link";
import { Upload, Plus, FolderKanban } from "lucide-react";

interface AdminClientProps {
  user: Pick<User, "userId" | "email" | "firstName" | "lastName" | "role">;
}

export default function AdminClient({ user }: AdminClientProps) {
  return (
    <div className="w-full max-w-full p-4 md:p-6 overflow-x-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your platform settings and user data
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* User Management Card */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">User Management</h3>
            <p className="text-sm text-muted-foreground mb-4">
              View and manage user accounts
            </p>
            <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Manage Users
            </button>
          </div>

          {/* Quiz Management Card */}
          <Link href="/dashboard/admin/quiz/manage">
            <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
              <h3 className="font-semibold text-lg mb-2">Quiz Management</h3>
              <p className="text-sm text-muted-foreground mb-4">
                View, edit, and manage quizzes
              </p>
              <div className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-center">
                Manage Quizzes
              </div>
            </div>
          </Link>

          {/* Upload Quiz Card - NEW */}
          <Link href="/dashboard/admin/quiz/upload">
            <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Upload Quiz</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Upload JSON file to create new quiz
              </p>
              <div className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-center">
                Upload Now
              </div>
            </div>
          </Link>

          {/* Analytics Card */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Analytics</h3>
            <p className="text-sm text-muted-foreground mb-4">
              View platform statistics
            </p>
            <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              View Analytics
            </button>
          </div>

          {/* Project Management Card */}
          <Link href="/dashboard/admin/projects/manage">
            <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
              <div className="flex items-center gap-2 mb-2">
                <FolderKanban className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Project Management</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                View, edit, and manage projects
              </p>
              <div className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-center">
                Manage Projects
              </div>
            </div>
          </Link>

          {/* Create Project Card */}
          <Link href="/dashboard/admin/projects/create">
            <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Create Project</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Build a new hands-on project from scratch
              </p>
              <div className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-center">
                Create Now
              </div>
            </div>
          </Link>

          {/* Subscription Management Card */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Subscriptions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage user subscriptions
            </p>
            <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Manage Subscriptions
            </button>
          </div>

          {/* System Settings Card */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">System Settings</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Configure platform settings
            </p>
            <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Settings
            </button>
          </div>
        </div>

        {/* User Info Card */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Current User Info</h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium">Name:</span> {user.firstName}{" "}
              {user.lastName}
            </p>
            <p>
              <span className="font-medium">Role:</span>{" "}
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                {user.role}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
