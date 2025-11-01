import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Clouddojo",
  description:
    "Master cloud technologies through hands-on projects and interactive labs. Build real-world AWS, Azure, and GCP solutions with step-by-step guidance, roadmaps, and practical exercises to advance your cloud skills.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
