import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Cloud Certification Practice Questions | Try CloudDojo Demo",
  description:
    "Try CloudDojo free with real AWS, Azure, and GCP certification practice questions. Experience AI-powered explanations and instant feedback. No signup required.",
  keywords: [
    "free AWS practice questions",
    "cloud certification practice test",
    "AWS exam sample questions",
    "Azure practice questions",
    "GCP practice test",
    "free certification quiz",
    "cloud certification demo",
    "AWS SAA practice",
    "free cloud exam prep",
    "certification practice questions",
  ],
  openGraph: {
    title: "Try CloudDojo Free - Sample Cloud Certification Questions",
    description:
      "Experience real AWS, Azure, and GCP certification practice questions with AI-powered explanations. Try 10 questions free - no signup required.",
    type: "website",
    url: "https://clouddojo.tech/demo",
    images: [
      {
        url: "/images/open-graph-image.png",
        width: 1200,
        height: 630,
        alt: "CloudDojo Demo - Free Practice Questions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Try CloudDojo Free - Cloud Certification Practice Questions",
    description:
      "Real AWS, Azure, GCP practice questions with AI explanations. Try free now!",
    images: ["/images/open-graph-image.png"],
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
