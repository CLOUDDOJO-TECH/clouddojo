import Link from "next/link";
import { Shield, Mail, Lock, Eye, Database, UserCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold text-foreground"
            >
              CloudDojo
            </Link>
            <Link
              href="/"
              className="text-foreground/60 transition-colors hover:text-emerald-500"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-emerald-500/10 p-4">
              <Shield className="h-12 w-12 text-emerald-500" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            Privacy Policy
          </h1>
          <p className="text-lg text-foreground/60">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-background/50 p-6 text-center backdrop-blur">
            <Lock className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
            <h3 className="font-semibold text-foreground">
              Encrypted
            </h3>
            <p className="text-sm text-foreground/60">
              Your data is secure
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background/50 p-6 text-center backdrop-blur">
            <Eye className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
            <h3 className="font-semibold text-foreground">
              Transparent
            </h3>
            <p className="text-sm text-foreground/60">
              Clear practices
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background/50 p-6 text-center backdrop-blur">
            <UserCheck className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
            <h3 className="font-semibold text-foreground">
              Your Control
            </h3>
            <p className="text-sm text-foreground/60">
              You own your data
            </p>
          </div>
        </div>

        {/* Privacy Policy Content */}
        <div className="space-y-8 rounded-2xl border border-border bg-background/50 p-8 backdrop-blur">
          {/* Introduction */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              1. Introduction
            </h2>
            <p className="leading-relaxed text-foreground/80">
              Welcome to CloudDojo ("we," "our," or "us"). We are committed to
              protecting your personal information and your right to privacy. This
              Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you use our cloud certification preparation
              platform at clouddojo.tech.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
              <Database className="h-6 w-6 text-emerald-500" />
              2. Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  2.1 Information You Provide
                </h3>
                <ul className="list-inside list-disc space-y-2 text-foreground/80">
                  <li>
                    <strong>Account Information:</strong> Name, email address,
                    password when you create an account
                  </li>
                  <li>
                    <strong>Profile Information:</strong> Certification goals,
                    experience level, learning preferences
                  </li>
                  <li>
                    <strong>Payment Information:</strong> Billing details processed
                    securely through our payment providers (LemonSqueezy, Polar)
                  </li>
                  <li>
                    <strong>User Content:</strong> Your quiz answers, study
                    progress, notes, and interactions with our AI chatbot
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  2.2 Information Collected Automatically
                </h3>
                <ul className="list-inside list-disc space-y-2 text-foreground/80">
                  <li>
                    <strong>Usage Data:</strong> Pages viewed, features used, time
                    spent, quiz performance
                  </li>
                  <li>
                    <strong>Device Information:</strong> Browser type, operating
                    system, IP address
                  </li>
                  <li>
                    <strong>Analytics Data:</strong> We use Amplitude, Seline
                    Analytics, and Vercel Analytics
                  </li>
                  <li>
                    <strong>Cookies:</strong> Essential cookies for authentication
                    and preferences
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              3. How We Use Your Information
            </h2>
            <ul className="list-inside list-disc space-y-2 text-foreground/80">
              <li>Provide and maintain our certification preparation services</li>
              <li>
                Personalize your learning experience with AI-powered recommendations
              </li>
              <li>Track your progress and provide performance analytics</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send important updates about your account and our services</li>
              <li>Improve our platform and develop new features</li>
              <li>Detect, prevent, and address technical issues or fraud</li>
              <li>
                Communicate with you about educational content and features (with
                your consent)
              </li>
            </ul>
          </section>

          {/* AI and Data Processing */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              4. AI and Data Processing
            </h2>
            <p className="mb-4 leading-relaxed text-foreground/80">
              CloudDojo uses AI services (OpenAI, Google Gemini, DeepSeek) to:
            </p>
            <ul className="list-inside list-disc space-y-2 text-foreground/80">
              <li>Generate personalized explanations for quiz answers</li>
              <li>Provide intelligent study recommendations</li>
              <li>Power our AI chatbot for study assistance</li>
              <li>Analyze your performance and identify weak areas</li>
            </ul>
            <p className="mt-4 leading-relaxed text-foreground/80">
              <strong>Important:</strong> Your quiz responses and study data may be
              processed by these AI services. We do not share personally
              identifiable information with AI providers beyond what's necessary for
              service functionality.
            </p>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              5. How We Share Your Information
            </h2>
            <div className="space-y-4">
              <p className="leading-relaxed text-foreground/80">
                We may share your information with:
              </p>
              <ul className="list-inside list-disc space-y-2 text-foreground/80">
                <li>
                  <strong>Service Providers:</strong> Authentication (Clerk),
                  Payments (LemonSqueezy, Polar), Email (Resend), Analytics
                  (Amplitude, Seline), Infrastructure (Vercel, AWS)
                </li>
                <li>
                  <strong>AI Providers:</strong> OpenAI, Google, DeepSeek for
                  AI-powered features
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or to
                  protect our rights
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a merger,
                  sale, or acquisition
                </li>
              </ul>
              <p className="leading-relaxed text-foreground/80">
                <strong>We never sell your personal data to third parties.</strong>
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
              <Lock className="h-6 w-6 text-emerald-500" />
              6. Data Security
            </h2>
            <p className="leading-relaxed text-foreground/80">
              We implement industry-standard security measures to protect your
              data:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 text-foreground/80">
              <li>Encryption in transit (HTTPS/TLS) and at rest</li>
              <li>Secure authentication via Clerk</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and data minimization</li>
              <li>
                Secure database infrastructure with Prisma and PostgreSQL
              </li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              7. Your Privacy Rights
            </h2>
            <p className="mb-4 leading-relaxed text-foreground/80">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-inside list-disc space-y-2 text-foreground/80">
              <li>
                <strong>Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong>Correction:</strong> Update or correct your information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your account and
                data
              </li>
              <li>
                <strong>Data Portability:</strong> Export your data in a
                machine-readable format
              </li>
              <li>
                <strong>Opt-out:</strong> Unsubscribe from marketing communications
              </li>
              <li>
                <strong>Object:</strong> Object to certain data processing
                activities
              </li>
            </ul>
            <p className="mt-4 leading-relaxed text-foreground/80">
              To exercise these rights, contact us at{" "}
              <a
                href="mailto:privacy@clouddojo.tech"
                className="text-emerald-500 hover:underline"
              >
                privacy@clouddojo.tech
              </a>
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              8. Data Retention
            </h2>
            <p className="leading-relaxed text-foreground/80">
              We retain your personal data for as long as necessary to provide our
              services and comply with legal obligations. When you delete your
              account:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 text-foreground/80">
              <li>Your profile and personal information are permanently deleted</li>
              <li>
                Quiz results and progress data are anonymized for analytics
                purposes
              </li>
              <li>Some data may be retained to comply with legal requirements</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              9. Children's Privacy
            </h2>
            <p className="leading-relaxed text-foreground/80">
              CloudDojo is not intended for children under 13 years of age. We do
              not knowingly collect personal information from children under 13. If
              you believe we have collected information from a child under 13,
              please contact us immediately.
            </p>
          </section>

          {/* International Data Transfers */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              10. International Data Transfers
            </h2>
            <p className="leading-relaxed text-foreground/80">
              Your information may be transferred to and processed in countries
              other than your country of residence. We ensure appropriate safeguards
              are in place to protect your data in compliance with applicable laws.
            </p>
          </section>

          {/* Updates to Policy */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              11. Updates to This Policy
            </h2>
            <p className="leading-relaxed text-foreground/80">
              We may update this Privacy Policy from time to time. We will notify
              you of any material changes by posting the new policy on this page and
              updating the "Last updated" date. Your continued use of CloudDojo
              after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
              <Mail className="h-6 w-6 text-emerald-500" />
              12. Contact Us
            </h2>
            <p className="leading-relaxed text-foreground/80">
              If you have questions or concerns about this Privacy Policy or our
              data practices, please contact us:
            </p>
            <div className="mt-4 space-y-2 text-foreground/80">
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:privacy@clouddojo.tech"
                  className="text-emerald-500 hover:underline"
                >
                  privacy@clouddojo.tech
                </a>
              </p>
              <p>
                <strong>Support:</strong>{" "}
                <a
                  href="mailto:support@clouddojo.tech"
                  className="text-emerald-500 hover:underline"
                >
                  support@clouddojo.tech
                </a>
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href="/contact"
                  className="text-emerald-500 hover:underline"
                >
                  clouddojo.tech/contact
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-border bg-background/50 p-8 text-center backdrop-blur">
          <h3 className="mb-3 text-2xl font-bold text-foreground">
            Ready to Start Learning?
          </h3>
          <p className="mb-6 text-foreground/60">
            Join thousands of students preparing for cloud certifications with
            CloudDojo.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/demo"
              className="rounded-lg border border-border bg-foreground px-8 py-3 font-semibold text-background transition-all hover:bg-foreground/90"
            >
              Try Demo
            </Link>
            <Link
              href="/onboarding"
              className="rounded-lg border border-border bg-background px-8 py-3 font-semibold text-foreground transition-all hover:bg-foreground/5"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 py-8 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-foreground/60">
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-emerald-500">
              Privacy Policy
            </Link>
            <Link href="/tos" className="transition-colors hover:text-emerald-500">
              Terms of Service
            </Link>
            <Link href="/contact" className="transition-colors hover:text-emerald-500">
              Contact
            </Link>
            <Link href="/about" className="transition-colors hover:text-emerald-500">
              About
            </Link>
          </div>
          <p className="mt-4">© {new Date().getFullYear()} CloudDojo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
