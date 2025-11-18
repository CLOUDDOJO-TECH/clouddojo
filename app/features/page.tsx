import Link from "next/link";
import {
  Brain,
  MessageSquare,
  TrendingUp,
  Zap,
  Clock,
  Target,
  BookOpen,
  BarChart3,
  Sparkles,
  CheckCircle2,
  Award,
  Users,
  Smartphone,
  Globe,
  Lock,
  Lightbulb,
} from "lucide-react";

export default function FeaturesPage() {
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
            <div className="flex items-center gap-4">
              <Link
                href="/demo"
                className="text-foreground/60 transition-colors hover:text-emerald-500"
              >
                Try Demo
              </Link>
              <Link
                href="/"
                className="text-foreground/60 transition-colors hover:text-emerald-500"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-5xl font-bold text-foreground">
            Everything You Need to Pass
          </h1>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-foreground/60">
            CloudDojo combines AI technology, comprehensive practice questions,
            and powerful analytics to give you the best certification exam
            preparation experience.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/demo"
              className="rounded-lg border border-border bg-foreground px-8 py-3 font-semibold text-background transition-all hover:bg-foreground/90"
            >
              Try It Free
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-border bg-background px-8 py-3 font-semibold text-foreground transition-all hover:bg-foreground/5"
            >
              View Pricing
            </Link>
          </div>
        </div>

        {/* Core Features Grid */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
            Core Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* AI-Powered Explanations */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:bg-foreground/5 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 inline-block rounded-lg bg-emerald-500/10 p-4">
                <Brain className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                AI-Powered Explanations
              </h3>
              <p className="text-foreground/60">
                Get intelligent, context-aware explanations for every question.
                Our AI breaks down complex concepts into easy-to-understand
                answers tailored to your level.
              </p>
            </div>

            {/* Practice Questions */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:bg-foreground/5 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 inline-block rounded-lg bg-green-100 p-4 dark:bg-green-900">
                <BookOpen className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                5,000+ Practice Questions
              </h3>
              <p className="text-foreground/60">
                Access thousands of exam-quality questions covering all major
                cloud certifications. Questions are continuously updated to match
                current exam objectives.
              </p>
            </div>

            {/* AI Chatbot */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:bg-foreground/5 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 inline-block rounded-lg bg-emerald-500/10 p-4">
                <MessageSquare className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                24/7 AI Study Assistant
              </h3>
              <p className="text-foreground/60">
                Chat with our AI tutor anytime, anywhere. Ask questions, clarify
                concepts, or get study tips - your personal study buddy never
                sleeps.
              </p>
            </div>

            {/* Progress Tracking */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:bg-foreground/5 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 inline-block rounded-lg bg-orange-100 p-4 dark:bg-orange-900">
                <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-300" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                Detailed Progress Tracking
              </h3>
              <p className="text-foreground/60">
                Monitor your performance with comprehensive analytics. Track
                accuracy, time spent, topics mastered, and exam readiness in
                real-time.
              </p>
            </div>

            {/* Simulated Exams */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:bg-foreground/5 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 inline-block rounded-lg bg-red-100 p-4 dark:bg-red-900">
                <Clock className="h-8 w-8 text-red-600 dark:text-red-300" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                Timed Practice Exams
              </h3>
              <p className="text-foreground/60">
                Take full-length practice exams that simulate the real testing
                experience. Build confidence and improve your time management
                skills.
              </p>
            </div>

            {/* Weak Area Identification */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:bg-foreground/5 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 inline-block rounded-lg bg-indigo-100 p-4 dark:bg-indigo-900">
                <Target className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                Weak Area Identification
              </h3>
              <p className="text-foreground/60">
                Our AI automatically identifies topics where you're struggling and
                provides focused practice to help you improve faster.
              </p>
            </div>

            {/* Flashcards */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:bg-foreground/5 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 inline-block rounded-lg bg-pink-100 p-4 dark:bg-pink-900">
                <Zap className="h-8 w-8 text-pink-600 dark:text-pink-300" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                Interactive Flashcards
              </h3>
              <p className="text-foreground/60">
                Reinforce your learning with spaced repetition flashcards. Perfect
                for quick review sessions and memorizing key concepts.
              </p>
            </div>

            {/* Performance Analytics */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:bg-foreground/5 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 inline-block rounded-lg bg-teal-100 p-4 dark:bg-teal-900">
                <BarChart3 className="h-8 w-8 text-teal-600 dark:text-teal-300" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                Advanced Analytics
              </h3>
              <p className="text-foreground/60">
                Visualize your progress with charts and graphs. Understand your
                strengths and weaknesses at a glance with detailed reports.
              </p>
            </div>

            {/* Personalized Study Plans */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:bg-foreground/5 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 inline-block rounded-lg bg-amber-100 p-4 dark:bg-amber-900">
                <Sparkles className="h-8 w-8 text-amber-600 dark:text-amber-300" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">
                Personalized Study Plans
              </h3>
              <p className="text-foreground/60">
                Get a customized study roadmap based on your goals, timeline, and
                current knowledge level. AI adapts your plan as you progress.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
            CloudDojo vs Traditional Prep
          </h2>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-500">
                      CloudDojo
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-foreground/60">
                      Traditional Courses
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 text-foreground/80">
                      AI-Powered Explanations
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-500" />
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">
                      ✕
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-foreground/80">
                      24/7 AI Tutor
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-500" />
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">
                      ✕
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-foreground/80">
                      Personalized Study Plans
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-500" />
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">
                      Limited
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-foreground/80">
                      Practice Questions
                    </td>
                    <td className="px-6 py-4 text-center text-emerald-500">
                      5,000+
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/60">
                      500-1,000
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-foreground/80">
                      Real-Time Analytics
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-500" />
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">
                      Basic
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-foreground/80">
                      Mobile Access
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-500" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle2 className="mx-auto h-5 w-5 text-green-500" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-foreground/80">
                      Price (Monthly)
                    </td>
                    <td className="px-6 py-4 text-center text-emerald-500">
                      $8.99+
                    </td>
                    <td className="px-6 py-4 text-center text-foreground/60">
                      $29-99
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
            More Features You'll Love
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="shrink-0">
                <div className="rounded-lg bg-emerald-500/10 p-3">
                  <Smartphone className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Study Anywhere
                </h3>
                <p className="text-sm text-foreground/60">
                  Access CloudDojo on any device - desktop, tablet, or phone.
                  Your progress syncs automatically across all devices.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="shrink-0">
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                  <Globe className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Multi-Cloud Support
                </h3>
                <p className="text-sm text-foreground/60">
                  Prepare for AWS, Azure, GCP, and other major cloud and DevOps
                  certifications all in one platform.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="shrink-0">
                <div className="rounded-lg bg-emerald-500/10 p-3">
                  <Lock className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Secure & Private
                </h3>
                <p className="text-sm text-foreground/60">
                  Your data is encrypted and secure. We never sell your personal
                  information to third parties.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="shrink-0">
                <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900">
                  <Users className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Active Community
                </h3>
                <p className="text-sm text-foreground/60">
                  Join thousands of students preparing for their certifications.
                  Share tips, ask questions, and learn together.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="shrink-0">
                <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900">
                  <Award className="h-6 w-6 text-red-600 dark:text-red-300" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Exam Readiness Score
                </h3>
                <p className="text-sm text-foreground/60">
                  Know exactly when you're ready to take the real exam with our
                  AI-powered readiness assessment.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="shrink-0">
                <div className="rounded-lg bg-indigo-100 p-3 dark:bg-indigo-900">
                  <Lightbulb className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Study Tips & Resources
                </h3>
                <p className="text-sm text-foreground/60">
                  Access curated study guides, tips, and resources to help you
                  prepare more effectively and efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-border bg-background/50 p-8 text-center backdrop-blur">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Ready to Experience the Difference?
          </h2>
          <p className="mb-6 text-lg text-foreground/80">
            Start your free trial today and see why CloudDojo is the smartest way
            to prepare for cloud certifications.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/demo"
              className="rounded-lg border border-border bg-foreground px-8 py-3 font-semibold text-background transition-all hover:bg-foreground/90"
            >
              Try Free Demo
            </Link>
            <Link
              href="/onboarding"
              className="rounded-lg border border-border bg-background px-8 py-3 font-semibold text-foreground transition-all hover:bg-foreground/5"
            >
              Sign Up Free
            </Link>
          </div>
          <p className="mt-4 text-sm text-foreground/60">
            No credit card required • 7-day money-back guarantee
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-foreground/60">
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-emerald-500"
            >
              Privacy Policy
            </Link>
            <Link
              href="/tos"
              className="transition-colors hover:text-emerald-500"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-emerald-500"
            >
              Contact
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-emerald-500"
            >
              About
            </Link>
          </div>
          <p className="mt-4">
            © {new Date().getFullYear()} CloudDojo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
