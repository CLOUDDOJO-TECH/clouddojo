import type React from "react";
import "../styles/globals.css";
import { Inter } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Providers from "@/components/providers";
import { Spotlight } from "@/components/spotlight";
import Script from 'next/script';
import * as seline from '@seline-analytics/web';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const selineToken = process.env.ELINE_TOKEN;
seline.init({
  // Token is *required* when tracking subdomains or multiple domains.
  token: selineToken,
  // By default, we track all page views automatically.
  // But if you want manual tracking with seline.page(), you can set autoPageView to false.
  autoPageView: false,
  // Skip tracking of provided pages, wildcard * is supported
  skipPatterns: ['/about', '/blog/*'],
  // Mask parts of pages that match provided patterns, wildcard * is supported
  maskPatterns: ['/customer/*/order/*'],
  // Set to true to automatically set an ID to visitor's browser as a first-party cookie when you identify them.
  cookieOnIdentify: true,
});

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CloudDojo | Master Cloud Certifications with AI",
  description: "CloudDojo helps you prepare for AWS, Azure, and GCP cloud certification exams with AI-powered practice tests, personalized readiness reports, and intelligent study plans.",
  keywords: [
    "cloud certification",
    "AWS certification",
    "Azure certification",
    "GCP certification",
    "cloud exams",
    "practice tests",
    "AI exam preparation",
    "certification readiness",
    "CloudDojo",
    "IT certifications",
    "cloud computing",
    "cloud training",
    "cloud learning",
    "cloud skills",
    "cloud knowledge",
    "cloud education",
    "cloud career",
    "aws training",
    "azure training",
    "gcp training",
    "aws practice tests",
    "azure practice tests",
    "gcp practice tests",
    "aws exam prep",
    "azure exam prep",
    "gcp exam prep",
    "cloud certification prep",
    "aws practice exams",
    "azure practice exams",
    "gcp practice exams",
    "cloud certification practice",
    "cloud certification study",
  ],
  openGraph: {
    title: "CloudDojo | Master Cloud Certifications with AI",
    description:
      "Prepare for AWS, Azure, and Google Cloud exams with AI-driven practice tests and personalized study plans.",
    url: "https://clouddojo.tech",
    siteName: "CloudDojo",
    images: [
      {
        url: "/images/open-graph-image.png",
        width: 1200,
        height: 630,
        alt: "CloudDojo Open Graph Image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CloudDojo | AI-Powered Cloud Certification Prep",
    description:
      "Get cloud certified faster with CloudDojo. AI insights, personalized feedback, and smart study tools.",
    images: ["/images/open-graph-image.png"],
    creator: "@glen_miracle4",
  },
  metadataBase: new URL("https://clouddojo.tech"),
};


export default function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <html lang="en" className="dark:dark">
      <head>
      </head>
      <body className={`${inter.className} dark:bg-gray-900`}>
        <Script src="https://app.lemonsqueezy.com/js/lemon.js" strategy="beforeInteractive" defer />
        <Script async src="https://cdn.seline.com/seline.js" data-token="9b13f9d446740a0"></Script>
        <Providers>
          <Spotlight
            className="-top-40 left-0 md:-top-20 md:left-60"
            fill="white"
          />
          <SpeedInsights />
          <Analytics />
          {children}
        </Providers>
      </body>
    </html>
  );
}
