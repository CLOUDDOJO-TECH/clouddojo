"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MessageSquare, Send, CheckCircle2, Loader2, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to send message");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Failed to send message. Please try again later.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#FAFAF9] dark:bg-background">
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
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-emerald-500/10 p-4">
              <MessageSquare className="h-12 w-12 text-emerald-500" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            Get in Touch
          </h1>
          <p className="text-lg text-foreground/60">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="space-y-6 lg:col-span-1">
            {/* Contact Cards */}
            <div className="rounded-xl border border-border bg-background/50 p-6 backdrop-blur">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                  <Mail className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <p className="text-sm text-foreground/60">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>
              <a
                href="mailto:support@clouddojo.tech"
                className="text-emerald-500 hover:underline"
              >
                support@clouddojo.tech
              </a>
            </div>

            <div className="rounded-xl border border-border bg-background/50 p-6 backdrop-blur">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-3">
                  <MessageSquare className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Live Chat</h3>
                  <p className="text-sm text-foreground/60">
                    Chat with our AI assistant
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="text-emerald-500 hover:underline"
              >
                Go to Dashboard
              </Link>
            </div>

            {/* Quick Links */}
            <div className="rounded-xl border border-border bg-background/50 p-6 backdrop-blur">
              <h3 className="mb-4 font-semibold text-foreground">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/demo"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    <span>→</span>
                    <span>Try Free Demo</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    <span>→</span>
                    <span>View Pricing</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    <span>→</span>
                    <span>Read Blog</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/features"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    <span>→</span>
                    <span>Explore Features</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* FAQ Callout */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6 backdrop-blur">
              <h3 className="mb-2 font-semibold text-foreground">
                Looking for Quick Answers?
              </h3>
              <p className="mb-4 text-sm text-foreground/80">
                Check out our FAQ section on the homepage for common questions.
              </p>
              <Link
                href="/#faq"
                className="text-sm font-semibold text-emerald-500 hover:underline"
              >
                View FAQ →
              </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-background/50 p-8 backdrop-blur">
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                Send us a Message
              </h2>

              {status === "success" ? (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center backdrop-blur">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-emerald-500/10 p-4">
                      <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    Message Sent Successfully!
                  </h3>
                  <p className="mb-6 text-foreground/80">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="rounded-lg border border-border bg-foreground px-6 py-3 font-semibold text-background transition-all hover:bg-foreground/90"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-foreground"
                    >
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-border dark:bg-background dark:text-foreground dark:focus:border-emerald-500"
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-foreground"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-border dark:bg-background dark:text-foreground dark:focus:border-emerald-500"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-semibold text-foreground"
                    >
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-border dark:bg-background dark:text-foreground dark:focus:border-emerald-500"
                    >
                      <option value="">Select a topic</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Billing Question">Billing Question</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Partnership Opportunity">Partnership Opportunity</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-semibold text-foreground"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-border dark:bg-background dark:text-foreground dark:focus:border-emerald-500"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  {/* Error Message */}
                  {status === "error" && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
                      {errorMessage}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-foreground px-6 py-4 font-semibold text-background transition-all hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-center text-sm text-foreground/60">
                    We typically respond within 24 hours during business days.
                  </p>
                </form>
              )}
            </div>
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
