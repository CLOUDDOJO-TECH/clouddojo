import type React from "react";
import "../styles/globals.css";
import { Inter } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Spotlight } from "@/components/spotlight";
import Script from 'next/script';
import * as seline from '@seline-analytics/web';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@/components/theme-provider";
// fonts
import { Poppins, Lora, JetBrains_Mono, Kaushan_Script, Playwrite_AU_VIC } from 'next/font/google';
import Providers from "@/components/providers/providers";
import localFont from "next/font/local";

// Poppins (Sans-serif)
export const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'], // Specify weights you want to use
});

export const playwrite_au_vic = Playwrite_AU_VIC({
  display: 'swap',
  variable: '--font-playwrite-au-vic',
  weight: ['400', '100', '200', '300'], // Specify weights you want to use
});

export const kaushan_script = Kaushan_Script({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-kaushan-script',
  weight: ['400'], // Specify weights you want to use
});

// Lora (Serif)
export const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
  weight: ['400', '700'], // Specify weights you want to use
});

// JetBrains Mono (Monospace)
export const jetbrains_mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

const satoshi = localFont({
  src: [
    { path: "/fonts/Satoshi-Black.ttf", weight: "800" },
    { path: "/fonts/Satoshi-Bold.ttf", weight: "700" },
    { path: "/fonts/Satoshi-Medium.ttf", weight: "500" },
    { path: "/fonts/Satoshi-Regular.ttf", weight: "400" },
  ],
  variable: "--font-satoshi",
});

export const dynamic = 'force-dynamic';

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
    <html lang="en" suppressHydrationWarning className={`dark:dark ${poppins.variable} ${playwrite_au_vic} ${kaushan_script} ${lora.variable} ${jetbrains_mono.variable} ${satoshi.variable}`}>
      <head>
      </head>
      <body className={`${inter.className} overflow-x-hidden antialiased`}>
        <Script src="https://app.lemonsqueezy.com/js/lemon.js" strategy="beforeInteractive" defer />
        <Script async src="https://cdn.seline.com/seline.js" data-token="9b13f9d446740a0"></Script>
        <div className="relative">
          <Providers>
            <SpeedInsights />
            <Analytics />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="fixed inset-0 z-0 bg-background">
                <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:35px_35px] opacity-30 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
              </div>
              <div className="relative z-10">
                {children}
              </div>
            </ThemeProvider>
          </Providers>
        </div>
      </body>
    </html>
  );
}
