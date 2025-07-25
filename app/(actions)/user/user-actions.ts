'use server';

import prisma from '@/lib/prisma';
import { getSignedInUserOrThrow } from '@/lib/utils/database_utils';
import { auth } from '@clerk/nextjs/server';
import { User } from '@prisma/client';

// Define return type for better type safety and documentation
type UserWithSubscriptions = User & {
  Subscriptions: Array<{
    SubscriptionPlan: {
      id: string;
      name: string;
      price: string;
      isUsageBased: boolean;
      [key: string]: any; // Allow for additional fields
    };
    [key: string]: any; // Allow for additional fields
  }>;
};

/**
 * Retrieves the current user's profile with subscription information
 * 
 * @returns The user data with subscriptions or redirects to sign in
 * @throws Will redirect if user is not authenticated or not found in the database
 */
export const getCurrentUserProfile = async () => {
  try {
    const { userId: clerkUserId, redirectToSignIn } = await auth();

    if (!clerkUserId) {
      return redirectToSignIn();
    }

    const user = await prisma.user.findUnique({
        where: {
            userId: clerkUserId,
        },
        include: {
            Subscriptions: true
        }
    })

    const userPlan = await prisma.lsUserSubscription.findFirst({
      where: {
        userId: clerkUserId
      },
      include: {
        SubscriptionPlan: true
      }
    })






    
    
    if (!user) {
      console.warn(`User with clerk ID ${clerkUserId} not found in database`);
      return redirectToSignIn();
    }
    

    return {user, userPlan}
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error; // Re-throw to be handled by the caller
  }
}