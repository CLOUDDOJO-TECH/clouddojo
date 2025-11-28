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
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-5xl font-bold text-foreground">
            About CloudDojo
          </h1>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-foreground/60">
            We're on a mission to make cloud certification preparation
            accessible, effective, and enjoyable for everyone. Powered by AI,
            driven by results.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="mb-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-emerald-500/10 p-3">
                <Target className="h-8 w-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Our Mission
              </h2>
            </div>
            <p className="leading-relaxed text-foreground/80">
              To democratize cloud certification preparation by providing
              AI-powered, high-quality study materials that help students pass
              their exams with confidence. We believe everyone should have
              access to world-class exam prep, regardless of their background or
              budget.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-emerald-500/10 p-3">
                <Lightbulb className="h-8 w-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Our Vision
              </h2>
            </div>
            <p className="leading-relaxed text-foreground/80">
              To become the world's most trusted and effective cloud
              certification preparation platform, leveraging cutting-edge AI to
              create personalized learning experiences that adapt to each
              student's unique needs and learning style.
            </p>
          </div>
        </div>

        {/* The Story */}
        <div className="mb-16 rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-6 text-3xl font-bold text-foreground">
            Our Story
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-foreground/80">
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
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
            Our Core Values
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-emerald-500/10 p-4">
                  <Users className="h-8 w-8 text-emerald-500" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Student-First
              </h3>
              <p className="text-foreground/60">
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
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Innovation
              </h3>
              <p className="text-foreground/60">
                We continuously leverage the latest AI technology to create
                better, more effective learning experiences.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-emerald-500/10 p-4">
                  <Award className="h-8 w-8 text-emerald-500" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Quality
              </h3>
              <p className="text-foreground/60">
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
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Transparency
              </h3>
              <p className="text-foreground/60">
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
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Community
              </h3>
              <p className="text-foreground/60">
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
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Accessibility
              </h3>
              <p className="text-foreground/60">
                Quality education should be affordable and accessible to everyone,
                everywhere.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-8 backdrop-blur">
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
            Our Impact
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-emerald-500">
                10,000+
              </div>
              <div className="text-foreground/80">
                Students Trained
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-emerald-500">
                5,000+
              </div>
              <div className="text-foreground/80">
                Practice Questions
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-green-600 dark:text-green-400">
                85%
              </div>
              <div className="text-foreground/80">
                Pass Rate
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-orange-600 dark:text-orange-400">
                20+
              </div>
              <div className="text-foreground/80">
                Certifications Covered
              </div>
            </div>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="mb-16 rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-6 text-3xl font-bold text-foreground">
            What Makes Us Different
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                  <Zap className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  AI-Powered Learning
                </h3>
                <p className="text-foreground/80">
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
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Real Exam Questions
                </h3>
                <p className="text-foreground/80">
                  Our questions are modeled after real certification exams,
                  covering the latest exam blueprints and updates. We continuously
                  update our content to match current exam requirements.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                  <Award className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Comprehensive Analytics
                </h3>
                <p className="text-foreground/80">
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
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Affordable Pricing
                </h3>
                <p className="text-foreground/80">
                  We offer a free tier and affordable premium plans starting at
                  just $8.99/month. Get enterprise-quality prep at a fraction of
                  the cost of traditional courses.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-border bg-background/50 p-8 text-center backdrop-blur">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Join Our Community
          </h2>
          <p className="mb-6 text-lg text-foreground/80">
            Ready to start your certification journey? Try CloudDojo free today
            and see why thousands of students trust us.
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
            � {new Date().getFullYear()} CloudDojo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
