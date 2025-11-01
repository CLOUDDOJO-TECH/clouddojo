import Header from "@/components/header";
import Navbar from "@/components/navbar";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Pricing | Clouddojo",
  description:
    "Choose the perfect CloudDojo plan for your cloud certification journey. Get unlimited practice tests, AI-powered insights, and personalized study plans for AWS, Azure, and GCP exams. Save with yearly billing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`overflow-x-hidden  antialiased`}>
        <div className="relative">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
          >
            <div className="fixed inset-0 z-0 bg-background">
              <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:35px_35px] opacity-30 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
            </div>
            <div className="relative z-10">
              <div className="container mx-auto h-[100dvh] px-4">
                <Navbar />
                {children}
              </div>
            </div>
          </ThemeProvider>
        </div>
        <Analytics />
      </body>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
    </html>
  );
}
