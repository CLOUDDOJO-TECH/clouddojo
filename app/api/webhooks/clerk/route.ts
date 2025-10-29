import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import * as seline from "@seline-analytics/web";
import { sendWelcomeEmail } from "@/lib/emails/send-email";

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  // console.log("Payload from clerk: ", payload);
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", {
      status: 400,
    });
  }

  // Handle the webhook
  const { id } = evt.data;
  // console.log("Payload from event:", evt.data);
  const eventType = evt.type;

  console.log(`Webhook with ID: ${id} and type: ${eventType}`);

  if (eventType === "user.created" || eventType === "user.updated") {
    // Extract user data from the webhook payload
    const { id: userId, email_addresses, first_name, last_name } = evt.data;

    if (!userId || !email_addresses || !email_addresses[0]?.email_address) {
      console.log("Missing user data in webhook payload!");
      return new Response("Error: Missing user data", { status: 400 });
    }

    try {
      // Check if user already exists by userId or email
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { userId: userId as string },
            { email: email_addresses[0].email_address },
          ],
        },
      });

      if (existingUser) {
        await prisma.user.update({
          where: { userId: existingUser.userId },
          data: {
            userId: userId as string,
            email: email_addresses[0].email_address,
            firstName: (first_name as string) || "User",
            lastName: (last_name as string) || "",
            role: "BASIC", // all new users are basic by default
          },
        });
      } else {
        // Create new user
        const newUser = await prisma.user.create({
          data: {
            userId: userId as string,
            email: email_addresses[0].email_address,
            firstName: (first_name as string) || "User",
            lastName: (last_name as string) || "",
          },
        });

        // Send welcome email to the new user
        try {
          await sendWelcomeEmail({
            email: newUser.email,
            username: newUser.firstName,
          });
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
          // Don't fail the whole process if email fails
        }

        // seline tracking
        // seline.track("user: signed up", {
        //   userId: newUser.userId,
        //   event: "user: signed up",
        //   userEmail: newUser.email,
        //   userName: `${newUser.firstName} ${newUser.lastName}`,
        //   userPlan: "free",
        // });

        // create seline user
        seline.setUser({
          userId: newUser.userId, // userId is a required field
          plan: "free",
          credits: 140,
        });
      }
      console.log(
        `Received webhook with ID ${id} and event type of ${eventType}`,
      );
      console.log("Webhook payload:", body);

      return new Response("User synced to database", { status: 200 });
    } catch (error) {
      console.error("Error syncing user to database:", error);
      return new Response("Error syncing user to database", { status: 500 });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
