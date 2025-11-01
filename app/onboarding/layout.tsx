import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding | Clouddojo",
  description:
    "Start your cloud certification journey with CloudDojo. Get unlimited practice tests, AI-powered insights, and personalized study plans for AWS, Azure, and GCP exams. Save with yearly billing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
