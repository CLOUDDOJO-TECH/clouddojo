import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

/**
 * Checks if the current user has admin privileges
 * @throws Redirects to /dashboard if not admin
 * @returns User object if admin
 */
export async function requireAdmin() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { userId },
    select: {
      userId: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
    redirect("/dashboard");
  }

  return user;
}

/**
 * Checks if the current user is an admin (returns boolean)
 * @returns true if admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  const user = await prisma.user.findUnique({
    where: { userId },
    select: { role: true },
  });

  return user?.role === "ADMIN" || user?.role === "SUPERADMIN";
}

/**
 * Gets the current user's role
 * @returns User role or null if not found
 */
export async function getCurrentUserRole() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { userId },
    select: { role: true },
  });

  return user?.role || null;
}
