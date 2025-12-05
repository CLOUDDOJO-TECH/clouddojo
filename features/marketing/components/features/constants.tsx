import { FeatureTab, FeatureContent } from "./types";
import {
  IconRoadmapFillDuo18,
  IconEyeClosedOutlineDuo18,
  IconPrinter,
  IconMagnifier,
  IconFeather,
  IconBookOpen,
  IconHammer,
  IconBadgeSparkle,
} from "./icons";

export const TABS: FeatureTab[] = [
  {
    id: "tests",
    label: "Practice Tests",
    icon: IconFeather,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
  },
  {
    id: "ai_feedback",
    label: "AI Feedback",
    icon: IconBookOpen,
    iconColor: "text-pink-400",
    iconBg: "bg-pink-500/10",
  },
  {
    id: "projects",
    label: "Hands-on Projects",
    icon: IconHammer,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
  },
  {
    id: "leaderboard",
    label: "leaderboard",
    icon: IconBadgeSparkle,
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/10",
  },
];

export const CONTENT: Record<string, FeatureContent> = {
  tests: {
    id: "tests",
    title: "Practice like you're taking the real exam",
    description:
      "High quality and well currated scenario based practice tests with hints allow your mind to learn faster. No more 100 page documents and a bunch of disjointed screenshots.",
    buttonText: "Start practicing",
    visualType: "mapping",
  },
  ai_feedback: {
    id: "ai_feedback",
    title: "Let AI point out where you can improve",
    description:
      "To hell with the old way of learning. Our AI-powered feedback system will help you identify areas for improvement and provide personalized recommendations to help you succeed.",
    buttonText: "Launch a lab",
    visualType: "friction",
  },
  projects: {
    id: "projects",
    title: "Don't just consume content",
    description:
      "Practice deploying infrastructure, configuring services, and troubleshooting issues in actual AWS, Azure, and GCP environments. Become the most hireable cloud engineer.",
    description2:
      "Get personalized study recommendations based on your progress. Know when you're ready to book your certification exam with confidence.",
    buttonText: "View analytics",
    visualType: "documentation",
  },
  leaderboard: {
    id: "leaderboard",
    title: "Rank your way up to the top",
    description:
      "See how you stack up against other learners and experts in the cloud community. Rank your way up to the top and earn badges for your achievements.",
    buttonText: "Explore platforms",
    visualType: "source",
  },
};
