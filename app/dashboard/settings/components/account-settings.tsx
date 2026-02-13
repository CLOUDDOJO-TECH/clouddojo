"use client";

import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Cog,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function AccountSettings() {
  const { user } = useUser();
  const { openUserProfile } = useClerk();

  if (!user) {
    return (
      <div className="space-y-6">
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-44" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-8 w-36 rounded-md" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const mailLink = `mailto:${user.primaryEmailAddress?.emailAddress}`;
  return (
    <div className="space-y-6">
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            {user.imageUrl && (
              <img
                src={user.imageUrl}
                alt="Profile"
                className="h-14 w-14 rounded-full object-cover ring-2 ring-border"
              />
            )}
            <div className="space-y-0.5">
              <h3 className="text-base font-semibold">
                {user.firstName} {user.lastName}
              </h3>
              <a
                href={`mailto:${user.primaryEmailAddress?.emailAddress}`}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {user.primaryEmailAddress?.emailAddress}
              </a>
              {user.createdAt && (
                <p className="text-[11px] text-muted-foreground">
                  Joined {format(new Date(user.createdAt), "MMMM yyyy")}
                </p>
              )}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => openUserProfile()}
            className="group gap-2 border-dashed"
          >
            <Cog className="h-3.5 w-3.5 group-hover:animate-spin transition-all duration-300" />
            Manage Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
