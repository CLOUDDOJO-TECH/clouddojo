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

export function AccountSettings() {
  const { user } = useUser();
  const { openUserProfile } = useClerk();

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const mailLink = `mailto:${user.primaryEmailAddress?.emailAddress}`;
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Your basic account information and verification status.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="flex items-center space-x-4">
            {user.imageUrl && (
              <img
                src={user.imageUrl}
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover border-2 border-border"
              />
            )}
            <div className="space-y-2 font-light">
              <h3 className="text-2xl font-semibold">
                {user.firstName} {user.lastName}
              </h3>
              <a
                href={`mailto:${user.primaryEmailAddress?.emailAddress}`}
                className="flex items-center gap-2 text-sm md:text-sm  text-muted-foreground dark:hover:text-accent/80 hover:text-primary/70"
              >
                {user.primaryEmailAddress?.emailAddress}
              </a>
              {user.createdAt && (
                <div className="flex items-center  gap-2 text-sm text-muted-foreground">
                  <span className="flex items-centergap-2 tracking-tight">
                    Joined
                  </span>
                  <span className="font-semibold text-forground p-1 px-2 text-xs ">
                    {format(new Date(user.createdAt), "MMMM yyyy")}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-end">
            {/*<ManageAccountDialog />*/}
            <Button
              variant="glass"
              onClick={() => openUserProfile()}
              className="justify-end items-end group gap-1.5 -m-2 border dark:border-muted-foreground border-gray-300 hover:bg-muted"
            >
              <Cog className="h-4 w-4 mr-2  group-hover:animate-spin group-hover:h-5 group-hover:w-5 transition-all duration-300 " />
              Manage Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
