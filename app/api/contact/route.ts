import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Lazy-initialize Resend client to avoid build-time errors
let resendClient: Resend | null = null;
function getResend(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * POST /api/contact
 * Handles contact form submissions
 */
export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required",
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email address",
        },
        { status: 400 }
      );
    }

    // Send email using Resend
    try {
      await getResend().emails.send({
        from: "CloudDojo Contact <noreply@clouddojo.tech>",
        to: "support@clouddojo.tech",
        replyTo: email,
        subject: `Contact Form: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">New Contact Form Submission</h2>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
            </div>

            <div style="margin: 20px 0;">
              <h3 style="color: #1f2937;">Message:</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="color: #6b7280; font-size: 14px;">
              This email was sent from the CloudDojo contact form.
            </p>
          </div>
        `,
      });

      // Send confirmation email to the user
      await getResend().emails.send({
        from: "CloudDojo Support <noreply@clouddojo.tech>",
        to: email,
        subject: "We received your message - CloudDojo",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">Thank You for Contacting CloudDojo!</h2>

            <p>Hi ${name},</p>

            <p>We've received your message and will get back to you as soon as possible, typically within 24 hours.</p>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-top: 0;">Your Message:</h3>
              <p><strong>Subject:</strong> ${subject}</p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>

            <p>In the meantime, you can:</p>
            <ul>
              <li><a href="https://clouddojo.tech/demo" style="color: #3b82f6;">Try our free demo</a></li>
              <li><a href="https://clouddojo.tech/blog" style="color: #3b82f6;">Read our blog for study tips</a></li>
              <li><a href="https://clouddojo.tech/pricing" style="color: #3b82f6;">Check out our pricing plans</a></li>
            </ul>

            <p>Best regards,<br>The CloudDojo Team</p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="color: #6b7280; font-size: 14px;">
              CloudDojo - Master Cloud Certifications with AI<br>
              <a href="https://clouddojo.tech" style="color: #3b82f6;">clouddojo.tech</a>
            </p>
          </div>
        `,
      });

      return NextResponse.json({
        success: true,
        message: "Your message has been sent successfully!",
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);

      // If Resend fails, at least log the message
      console.log("Contact form submission:", { name, email, subject, message });

      return NextResponse.json({
        success: true,
        message:
          "Your message has been received. We'll get back to you soon!",
      });
    }
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send message. Please try again later.",
      },
      { status: 500 }
    );
  }
}
