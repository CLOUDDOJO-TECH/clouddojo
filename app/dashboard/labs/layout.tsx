import { Metadata } from "next";
import { LabsBanner } from "./labs-banner";

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
    <>
      <LabsBanner />
      {children}
    </>
  );
}
