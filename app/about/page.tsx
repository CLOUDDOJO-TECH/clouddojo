import Link from "next/link";
import {
  Target,
  Lightbulb,
  Users,
  Award,
  TrendingUp,
  Heart,
  Zap,
  Shield,
  Globe,
} from "lucide-react";

export default function AboutPage() {
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
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white">
            About CloudDojo
          </h1>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-400">
            We're on a mission to make cloud certification preparation
            accessible, effective, and enjoyable for everyone. Powered by AI,
            driven by results.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="mb-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                <Target className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Our Mission
              </h2>
            </div>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              To democratize cloud certification preparation by providing
              AI-powered, high-quality study materials that help students pass
              their exams with confidence. We believe everyone should have
              access to world-class exam prep, regardless of their background or
              budget.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                <Lightbulb className="h-8 w-8 text-purple-600 dark:text-purple-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Our Vision
              </h2>
            </div>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              To become the world's most trusted and effective cloud
              certification preparation platform, leveraging cutting-edge AI to
              create personalized learning experiences that adapt to each
              student's unique needs and learning style.
            </p>
          </div>
        </div>

        {/* The Story */}
        <div className="mb-16 rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
            Our Story
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            <p>
              CloudDojo was born from a simple frustration: preparing for cloud
              certifications was expensive, time-consuming, and often
              overwhelming. The available resources were either too generic,
              outdated, or prohibitively expensive.
            </p>
            <p>
              We saw an opportunity to leverage artificial intelligence to create
              a smarter, more personalized learning experience. By combining
              thousands of high-quality practice questions with AI-powered
              explanations and adaptive learning technology, we built a platform
              that helps students learn faster and retain knowledge better.
            </p>
            <p>
              Since launch, we've helped thousands of students pass their AWS,
              Azure, and GCP certifications. Our community continues to grow, and
              we're constantly improving our platform based on real student
              feedback and the latest developments in cloud technology.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Our Core Values
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Student-First
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Every decision we make is centered around helping our students
                succeed. Your success is our success.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-green-100 p-4 dark:bg-green-900">
                  <Zap className="h-8 w-8 text-green-600 dark:text-green-300" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Innovation
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We continuously leverage the latest AI technology to create
                better, more effective learning experiences.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-purple-100 p-4 dark:bg-purple-900">
                  <Award className="h-8 w-8 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Quality
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We maintain the highest standards for our content, ensuring
                accuracy and relevance to real certification exams.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-orange-100 p-4 dark:bg-orange-900">
                  <Shield className="h-8 w-8 text-orange-600 dark:text-orange-300" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Transparency
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We're honest about our pricing, our AI usage, and our data
                practices. No hidden fees or surprises.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-red-100 p-4 dark:bg-red-900">
                  <Heart className="h-8 w-8 text-red-600 dark:text-red-300" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Community
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We foster a supportive learning community where students help
                each other succeed.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-indigo-100 p-4 dark:bg-indigo-900">
                  <Globe className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Accessibility
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Quality education should be affordable and accessible to everyone,
                everywhere.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16 rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-8 dark:border-blue-800 dark:from-blue-950 dark:to-purple-950">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Our Impact
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-blue-600 dark:text-blue-400">
                10,000+
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                Students Trained
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-purple-600 dark:text-purple-400">
                5,000+
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                Practice Questions
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-green-600 dark:text-green-400">
                85%
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                Pass Rate
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-orange-600 dark:text-orange-400">
                20+
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                Certifications Covered
              </div>
            </div>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="mb-16 rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
            What Makes Us Different
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <Zap className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  AI-Powered Learning
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Unlike traditional platforms, we use advanced AI to provide
                  personalized explanations, identify your weak areas, and adapt
                  your study plan in real-time. Our AI chatbot is available 24/7
                  to answer your questions.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Real Exam Questions
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Our questions are modeled after real certification exams,
                  covering the latest exam blueprints and updates. We continuously
                  update our content to match current exam requirements.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                  <Award className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Comprehensive Analytics
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Track every aspect of your progress with detailed analytics.
                  Know exactly where you stand, what you need to improve, and when
                  you're ready to take the real exam.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                  <Heart className="h-5 w-5 text-orange-600 dark:text-orange-300" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Affordable Pricing
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We offer a free tier and affordable premium plans starting at
                  just $8.99/month. Get enterprise-quality prep at a fraction of
                  the cost of traditional courses.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-8 text-center dark:border-blue-800 dark:from-blue-950 dark:to-purple-950">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Join Our Community
          </h2>
          <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
            Ready to start your certification journey? Try CloudDojo free today
            and see why thousands of students trust us.
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
