import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/dashboard/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Note: Role check is performed client-side in the admin page component
    // Middleware cannot access Prisma (edge runtime limitation)
    // For production, consider storing role in Clerk's publicMetadata
  }
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/",
    "/(api|trpc)(.*)",
    "/api/webhooks(.*)",
  ],
};
