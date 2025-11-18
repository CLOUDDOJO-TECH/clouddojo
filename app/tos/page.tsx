import Link from "next/link";
import { FileText, Scale, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function TermsOfServicePage() {
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
              <FileText className="h-12 w-12 text-emerald-500" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            Terms of Service
          </h1>
          <p className="text-lg text-foreground/60">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Quick Summary */}
        <div className="mb-12 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-8 backdrop-blur">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            Quick Summary
          </h2>
          <p className="mb-4 text-foreground/80">
            In plain English, here's what you're agreeing to:
          </p>
          <ul className="space-y-2 text-foreground/80">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
              <span>You can use CloudDojo to prepare for cloud certifications</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
              <span>We provide practice questions, AI assistance, and study tools</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
              <span>Your subscription auto-renews unless you cancel</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
              <span>Use the platform responsibly and don't share your account</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-500" />
              <span>We're not affiliated with AWS, Azure, or GCP certification programs</span>
            </li>
          </ul>
        </div>

        {/* Terms Content */}
        <div className="space-y-8 rounded-2xl border border-border bg-background/50 p-8 backdrop-blur">
          {/* Agreement to Terms */}
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
              <Scale className="h-6 w-6 text-emerald-500" />
              1. Agreement to Terms
            </h2>
            <p className="leading-relaxed text-foreground/80">
              By accessing or using CloudDojo ("Service", "Platform", "we", "us", or "our"),
              you agree to be bound by these Terms of Service. If you disagree with any part
              of these terms, you may not access the Service. These Terms apply to all
              visitors, users, and others who access or use the Service.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              2. Description of Service
            </h2>
            <p className="mb-4 leading-relaxed text-foreground/80">
              CloudDojo provides an AI-powered cloud certification preparation platform
              offering:
            </p>
            <ul className="list-inside list-disc space-y-2 text-foreground/80">
              <li>Practice questions and simulated exams for cloud certifications</li>
              <li>AI-powered explanations and study assistance</li>
              <li>Progress tracking and performance analytics</li>
              <li>Flashcards and study materials</li>
              <li>Personalized study plans and recommendations</li>
            </ul>
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
              <p className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                <span>
                  <strong>Important:</strong> CloudDojo is an independent study platform
                  and is not affiliated with, endorsed by, or sponsored by Amazon Web Services
                  (AWS), Microsoft Azure, Google Cloud Platform (GCP), or any certification
                  body. Our content is designed to help you prepare but does not guarantee
                  certification success.
                </span>
              </p>
            </div>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              3. Account Registration and Security
            </h2>
            <div className="space-y-4 text-foreground/80">
              <p className="leading-relaxed">
                To use certain features of the Service, you must register for an account.
                When you register:
              </p>
              <ul className="list-inside list-disc space-y-2">
                <li>You must provide accurate, current, and complete information</li>
                <li>You must maintain and promptly update your account information</li>
                <li>You are responsible for maintaining the confidentiality of your password</li>
                <li>You are responsible for all activities under your account</li>
                <li>You must immediately notify us of any unauthorized use</li>
                <li>You may not share your account with others</li>
                <li>You must be at least 13 years old to create an account</li>
              </ul>
            </div>
          </section>

          {/* Subscription and Payment */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              4. Subscription and Payment Terms
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  4.1 Subscription Plans
                </h3>
                <ul className="list-inside list-disc space-y-2 text-foreground/80">
                  <li><strong>Free:</strong> Limited access to basic features</li>
                  <li><strong>Pro:</strong> Full access to practice questions and basic AI features</li>
                  <li><strong>Gold:</strong> Unlimited access with advanced AI tutoring and analytics</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  4.2 Billing and Renewal
                </h3>
                <ul className="list-inside list-disc space-y-2 text-foreground/80">
                  <li>Subscriptions auto-renew at the end of each billing period</li>
                  <li>You will be charged automatically unless you cancel before renewal</li>
                  <li>Prices are subject to change with 30 days notice to active subscribers</li>
                  <li>All payments are processed securely through LemonSqueezy or Polar</li>
                  <li>Payments are non-refundable except as required by law</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  4.3 Cancellation
                </h3>
                <p className="leading-relaxed text-foreground/80">
                  You may cancel your subscription at any time through your account settings
                  or billing portal. Cancellation takes effect at the end of your current
                  billing period. You will retain access until that date.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  4.4 Refund Policy
                </h3>
                <p className="leading-relaxed text-foreground/80">
                  We offer a 7-day money-back guarantee for first-time subscribers. To
                  request a refund, contact support@clouddojo.tech within 7 days of your
                  initial purchase.
                </p>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              5. Acceptable Use Policy
            </h2>
            <p className="mb-4 leading-relaxed text-foreground/80">
              You agree NOT to:
            </p>
            <ul className="list-inside list-disc space-y-2 text-foreground/80">
              <li>Violate any laws or regulations</li>
              <li>Share your account credentials with others</li>
              <li>Copy, reproduce, or redistribute our content without permission</li>
              <li>Use automated systems (bots, scrapers) to access the Service</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Upload malicious code or viruses</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Impersonate others or provide false information</li>
              <li>Use the Service for any commercial purpose without our consent</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              6. Intellectual Property Rights
            </h2>
            <div className="space-y-4 text-foreground/80">
              <p className="leading-relaxed">
                The Service and its original content, features, and functionality are and
                will remain the exclusive property of CloudDojo and its licensors. The
                Service is protected by copyright, trademark, and other laws.
              </p>
              <p className="leading-relaxed">
                Our trademarks and trade dress may not be used in connection with any
                product or service without our prior written consent.
              </p>
              <p className="leading-relaxed">
                <strong>Your Content:</strong> You retain all rights to the content you
                create on our platform (notes, study plans, etc.). By using our Service,
                you grant us a limited license to use your content to provide the Service.
              </p>
            </div>
          </section>

          {/* AI Services */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              7. AI-Powered Features
            </h2>
            <p className="mb-4 leading-relaxed text-foreground/80">
              CloudDojo uses artificial intelligence (AI) services to enhance your learning
              experience. By using our AI features:
            </p>
            <ul className="list-inside list-disc space-y-2 text-foreground/80">
              <li>You understand that AI-generated explanations are for educational purposes</li>
              <li>AI responses may occasionally contain errors or inaccuracies</li>
              <li>You should verify important information from official sources</li>
              <li>Your interactions with AI may be used to improve the Service</li>
              <li>AI services are provided by third parties (OpenAI, Google, DeepSeek)</li>
            </ul>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              8. Disclaimers and Limitations
            </h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <strong>IMPORTANT:</strong> THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE"
                  WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                </p>
              </div>
              <ul className="list-inside list-disc space-y-2 text-foreground/80">
                <li>We do not guarantee that the Service will be uninterrupted or error-free</li>
                <li>We do not guarantee certification exam success</li>
                <li>We are not responsible for third-party content or services</li>
                <li>Content may contain inaccuracies or errors</li>
                <li>The Service may be modified or discontinued at any time</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              9. Limitation of Liability
            </h2>
            <p className="leading-relaxed text-foreground/80">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, CLOUDDOJO SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS
              OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS
              OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 text-foreground/80">
              <li>Your access to or use of (or inability to use) the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access, use, or alteration of your content</li>
            </ul>
          </section>

          {/* Account Termination */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              10. Account Termination
            </h2>
            <p className="mb-4 leading-relaxed text-foreground/80">
              We may terminate or suspend your account and access to the Service immediately,
              without prior notice, for any reason, including:
            </p>
            <ul className="list-inside list-disc space-y-2 text-foreground/80">
              <li>Breach of these Terms of Service</li>
              <li>Fraudulent, abusive, or illegal activity</li>
              <li>Extended periods of inactivity</li>
              <li>Upon your request for account deletion</li>
            </ul>
            <p className="mt-4 leading-relaxed text-foreground/80">
              You may terminate your account at any time through your account settings.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              11. Governing Law and Disputes
            </h2>
            <p className="leading-relaxed text-foreground/80">
              These Terms shall be governed by and construed in accordance with the laws
              of the jurisdiction in which CloudDojo operates, without regard to its conflict
              of law provisions. Any disputes arising from these Terms or your use of the
              Service shall be resolved through binding arbitration, except where prohibited
              by law.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              12. Changes to Terms
            </h2>
            <p className="leading-relaxed text-foreground/80">
              We reserve the right to modify or replace these Terms at any time. If a
              revision is material, we will provide at least 30 days notice prior to any
              new terms taking effect. Your continued use of the Service after changes
              become effective constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              13. Contact Information
            </h2>
            <p className="leading-relaxed text-foreground/80">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="mt-4 space-y-2 text-foreground/80">
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:legal@clouddojo.tech"
                  className="text-emerald-500 hover:underline"
                >
                  legal@clouddojo.tech
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
            Ready to Get Started?
          </h3>
          <p className="mb-6 text-foreground/60">
            By signing up, you agree to these Terms of Service and our Privacy Policy.
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
