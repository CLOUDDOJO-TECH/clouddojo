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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              CloudDojo
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/demo"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                Try Demo
              </Link>
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
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
          <h1 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white">
            Everything You Need to Pass
          </h1>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-400">
            CloudDojo combines AI technology, comprehensive practice questions,
            and powerful analytics to give you the best certification exam
            preparation experience.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/demo"
              className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
            >
              Try It Free
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border-2 border-gray-300 bg-white px-8 py-3 font-semibold text-gray-700 transition-all hover:scale-105 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:bg-blue-950"
            >
              View Pricing
            </Link>
          </div>
        </div>

        {/* Core Features Grid */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Core Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* AI-Powered Explanations */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 inline-block rounded-lg bg-blue-100 p-4 dark:bg-blue-900">
                <Brain className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                AI-Powered Explanations
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get intelligent, context-aware explanations for every question.
                Our AI breaks down complex concepts into easy-to-understand
                answers tailored to your level.
              </p>
            </div>

            {/* Practice Questions */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 inline-block rounded-lg bg-green-100 p-4 dark:bg-green-900">
                <BookOpen className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                5,000+ Practice Questions
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access thousands of exam-quality questions covering all major
                cloud certifications. Questions are continuously updated to match
                current exam objectives.
              </p>
            </div>

            {/* AI Chatbot */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 inline-block rounded-lg bg-purple-100 p-4 dark:bg-purple-900">
                <MessageSquare className="h-8 w-8 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                24/7 AI Study Assistant
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Chat with our AI tutor anytime, anywhere. Ask questions, clarify
                concepts, or get study tips - your personal study buddy never
                sleeps.
              </p>
            </div>

            {/* Progress Tracking */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 inline-block rounded-lg bg-orange-100 p-4 dark:bg-orange-900">
                <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-300" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                Detailed Progress Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor your performance with comprehensive analytics. Track
                accuracy, time spent, topics mastered, and exam readiness in
                real-time.
              </p>
            </div>

            {/* Simulated Exams */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 inline-block rounded-lg bg-red-100 p-4 dark:bg-red-900">
                <Clock className="h-8 w-8 text-red-600 dark:text-red-300" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                Timed Practice Exams
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Take full-length practice exams that simulate the real testing
                experience. Build confidence and improve your time management
                skills.
              </p>
            </div>

            {/* Weak Area Identification */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 inline-block rounded-lg bg-indigo-100 p-4 dark:bg-indigo-900">
                <Target className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                Weak Area Identification
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI automatically identifies topics where you're struggling and
                provides focused practice to help you improve faster.
              </p>
            </div>

            {/* Flashcards */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 inline-block rounded-lg bg-pink-100 p-4 dark:bg-pink-900">
                <Zap className="h-8 w-8 text-pink-600 dark:text-pink-300" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                Interactive Flashcards
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Reinforce your learning with spaced repetition flashcards. Perfect
                for quick review sessions and memorizing key concepts.
              </p>
            </div>

            {/* Performance Analytics */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 inline-block rounded-lg bg-teal-100 p-4 dark:bg-teal-900">
                <BarChart3 className="h-8 w-8 text-teal-600 dark:text-teal-300" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                Advanced Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Visualize your progress with charts and graphs. Understand your
                strengths and weaknesses at a glance with detailed reports.
              </p>
            </div>

            {/* Personalized Study Plans */}
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 inline-block rounded-lg bg-amber-100 p-4 dark:bg-amber-900">
                <Sparkles className="h-8 w-8 text-amber-600 dark:text-amber-300" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                Personalized Study Plans
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get a customized study roadmap based on your goals, timeline, and
                current knowledge level. AI adapts your plan as you progress.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
            CloudDojo vs Traditional Prep
          </h2>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                      CloudDojo
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Traditional Courses
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
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
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
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
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
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
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      Practice Questions
                    </td>
                    <td className="px-6 py-4 text-center text-blue-600 dark:text-blue-400">
                      5,000+
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">
                      500-1,000
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
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
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
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
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      Price (Monthly)
                    </td>
                    <td className="px-6 py-4 text-center text-blue-600 dark:text-blue-400">
                      $8.99+
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">
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
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
            More Features You'll Love
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="shrink-0">
                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                  <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  Study Anywhere
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
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
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  Multi-Cloud Support
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Prepare for AWS, Azure, GCP, and other major cloud and DevOps
                  certifications all in one platform.
                </p>
              </div>
            </div>

            <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="shrink-0">
                <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                  <Lock className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  Secure & Private
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
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
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  Active Community
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
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
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  Exam Readiness Score
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
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
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  Study Tips & Resources
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Access curated study guides, tips, and resources to help you
                  prepare more effectively and efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-8 text-center dark:border-blue-800 dark:from-blue-950 dark:to-purple-950">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Ready to Experience the Difference?
          </h2>
          <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
            Start your free trial today and see why CloudDojo is the smartest way
            to prepare for cloud certifications.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/demo"
              className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
            >
              Try Free Demo
            </Link>
            <Link
              href="/onboarding"
              className="rounded-lg border-2 border-gray-300 bg-white px-8 py-3 font-semibold text-gray-700 transition-all hover:scale-105 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:bg-blue-950"
            >
              Sign Up Free
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            No credit card required • 7-day money-back guarantee
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Privacy Policy
            </Link>
            <Link
              href="/tos"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Contact
            </Link>
            <Link
              href="/about"
              className="hover:text-blue-600 dark:hover:text-blue-400"
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
