"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckUser } from "@/app/(actions)/user/check-user";
import { CreateUser } from "@/app/(actions)/user/create-user";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [isCreating, setIsCreating] = useState(false);
  const [isUserCreated, setIsUserCreated] = useState(false);

  // Query to check if user exists
  const { data: checkedUser, error: checkError } = useQuery({
    queryKey: ["checkUser"],
    queryFn: () => CheckUser(),
    enabled: isLoaded && !!user,
  });

  // Mutation to create user
  const createUserMutation = useMutation({
    mutationFn: () => CreateUser({
      userId: user?.id as string,
      email: user?.primaryEmailAddress?.emailAddress as string,
      firstName: user?.firstName as string,
      lastName: user?.lastName as string,
    }),
    onSuccess: (data) => {
      if (data.isCreated) {
        setIsUserCreated(true);
        toast.success("Profile created successfully!");
      } else {
        toast.error(data.error || "Failed to create profile");
      }
    },
    onError: (error) => {
      console.error("Error creating user:", error);
      toast.error("Failed to create profile");
    }
  });

  useEffect(() => {
    if (checkedUser?.exists) {
      setIsUserCreated(true);
      toast.success("Profile already exists!");
    } else {
      setIsUserCreated(false);
    }
  }, [checkedUser]);

  const createUserProfile = async () => {
    if (!user) return;
    
    setIsCreating(true);
    try {
      await createUserMutation.mutateAsync();
    } finally {
      setIsCreating(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="container max-w-4xl mx-auto p-4 md:p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (checkError) {
    return (
      <div className="container max-w-4xl mx-auto p-4 md:p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              Error loading profile. Please try again later.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent>
          {user && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                {user.imageUrl && (
                  <img 
                    src={user.imageUrl} 
                    alt="Profile" 
                    className="h-16 w-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="text-xl font-medium">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>

              {!isUserCreated && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-md p-4">
                  <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Complete Your Profile Setup</h4>
                  <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                    We need to create your profile in our database to track your quiz attempts and progress.
                  </p>
                  <Button 
                    onClick={createUserProfile} 
                    disabled={isCreating || createUserMutation.isPending || isUserCreated}
                    className="mt-3"
                  >
                    {isCreating || createUserMutation.isPending ? "Creating..." : "Complete Setup"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
          {isUserCreated && (
            <Button onClick={() => window.location.href = "/dashboard/practice"}>
              Go to Practice Tests
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 