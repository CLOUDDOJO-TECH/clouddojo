import { User } from "@prisma/client";

interface AdminClientProps {
  user: Pick<User, "userId" | "email" | "firstName" | "lastName" | "role">;
}

export default function AdminClient({ user }: AdminClientProps) {
  return (
    <div className="container mx-auto p-6">
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
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Quiz Management</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create and edit quizzes
            </p>
            <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Manage Quizzes
            </button>
          </div>

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
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Project Management</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage hands-on projects
            </p>
            <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Manage Projects
            </button>
          </div>

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
