import { FeatureTab, FeatureContent } from "./types";
import {
  IconRoadmapFillDuo18,
  IconEyeClosedOutlineDuo18,
  IconPrinter,
  IconMagnifier,
} from "./icons";

export const TABS: FeatureTab[] = [
  {
    id: "mapping",
    label: "Practice Tests",
    icon: IconRoadmapFillDuo18,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
  },
  {
    id: "friction",
    label: "Hands-on Labs",
    icon: IconEyeClosedOutlineDuo18,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
  },
  {
    id: "documentation",
    label: "Progress Tracking",
    icon: IconPrinter,
    iconColor: "text-pink-400",
    iconBg: "bg-pink-500/10",
  },
  {
    id: "source",
    label: "Multi-Cloud Support",
    icon: IconMagnifier,
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/10",
  },
];

export const CONTENT: Record<string, FeatureContent> = {
  mapping: {
    id: "mapping",
    title: "Practice like you're taking the real exam",
    description:
      "Get exam-ready with practice tests that mirror actual cloud certification exams. Our questions are updated regularly to match the latest exam patterns and cloud service updates.",
    description2:
      "Track your progress across multiple attempts, identify weak areas, and focus your study time where it matters most.",
    buttonText: "Start practicing",
    visualType: "mapping",
  },
  friction: {
    id: "friction",
    title: "Learn by doing, not just reading",
    description:
      "Spin up real cloud environments in seconds. Practice deploying infrastructure, configuring services, and troubleshooting issues in actual AWS, Azure, and GCP environments.",
    buttonText: "Launch a lab",
    visualType: "friction",
  },
  documentation: {
    id: "documentation",
    title: "See your growth in real-time",
    description:
      "Detailed analytics show exactly where you stand. Track your performance across different cloud providers, service categories, and difficulty levels.",
    description2:
      "Get personalized study recommendations based on your progress. Know when you're ready to book your certification exam with confidence.",
    buttonText: "View analytics",
    visualType: "documentation",
  },
  source: {
    id: "source",
    title: "Master every major cloud platform",
    description:
      "Don't lock yourself into one cloud provider. CloudDojo covers AWS, Azure, GCP, Oracle Cloud, Docker, and Kubernetes—giving you the flexibility to pursue any cloud career path.",
    buttonText: "Explore platforms",
    visualType: "source",
  },
};
