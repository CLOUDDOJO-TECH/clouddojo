import {
  Cloud,
  Settings,
  Award,
  Users,
  Target,
  Code,
  Database,
  Shield,
  Rocket,
  Brain,
} from "lucide-react";
import { OnboardingStep } from "../../types/onboarding";

export interface onboardingData {
  id: number;
  title: string;
  subtitle: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  type: "single" | "multiple";
  category: string;
  options: {
    id: string;
    title: string;
    desc: string;
  }[];
}

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "What's your cloud experience?",
    subtitle: "Help us understand your current level",
    icon: Cloud,
    type: "single",
    category: "experience",
    options: [
      {
        id: "beginner",
        title: "Just Getting Started",
        desc: "New to cloud technologies",
      },
      {
        id: "intermediate",
        title: "Some Experience",
        desc: "Used cloud services, want to certify",
      },
      {
        id: "advanced",
        title: "Experienced",
        desc: "Working with cloud, need specific certs",
      },
      {
        id: "expert",
        title: "Cloud Professional",
        desc: "Looking for advanced certifications",
      },
    ],
  },
  {
    id: 2,
    title: "Which Platforms interest you?",
    subtitle: "Select all platforms you're interested in",
    icon: Settings,
    type: "multiple",
    category: "platforms",
    options: [
      {
        id: "aws",
        title: "Amazon Web Services",
        desc: "Most popular cloud platform",
        color: "orange",
      },
      {
        id: "azure",
        title: "Microsoft Azure",
        desc: "Enterprise-focused cloud",
        color: "blue",
      },
      {
        id: "gcp",
        title: "Google Cloud Platform",
        desc: "Data & AI focused",
        color: "green",
      },
      {
        id: "docker",
        title: "Docker",
        desc: "Container platform",
        color: "blue",
      },
      {
        id: "kubernetes",
        title: "Kubernetes",
        desc: "Container orchestration",
        color: "blue",
      },
      {
        id: "oracle",
        title: "Oracle Cloud",
        desc: "Database and enterprise apps",
        color: "red",
      },
      {
        id: "cloudflare",
        title: "Cloudflare",
        desc: "Edge computing and CDN",
        color: "orange",
      },
    ],
  },
  {
    id: 3,
    title: "Target certifications?",
    subtitle: "Select all certifications you're interested in pursuing",
    icon: Award,
    type: "multiple",
    category: "certifications",
    options: [], // Options are now handled by CertificationGrid component
  },
  {
    id: 4,
    title: "What's your current role?",
    subtitle: "This helps us recommend relevant jobs",
    icon: Users,
    type: "single",
    category: "role",
    options: [
      {
        id: "student",
        title: "Student/Recent Graduate",
        desc: "Looking to break into cloud",
      },
      {
        id: "developer",
        title: "Software Developer",
        desc: "Want to add cloud skills",
      },
      {
        id: "sysadmin",
        title: "System Administrator",
        desc: "Moving to cloud infrastructure",
      },
      {
        id: "devops",
        title: "DevOps Engineer",
        desc: "Expanding cloud expertise",
      },
      {
        id: "architect",
        title: "Solutions Architect",
        desc: "Deepening cloud knowledge",
      },
      {
        id: "other",
        title: "Other Role",
        desc: "Different background, cloud curious",
      },
    ],
  },
  {
    id: 5,
    title: "Areas of focus?",
    subtitle: "What cloud areas interest you most?",
    icon: Target,
    type: "multiple",
    category: "focusArea",
    options: [
      {
        id: "ai-ml",
        title: "AI & Machine Learning",
        desc: "Deep learning, ML models, AI services",
        icon: Brain,
      },
      {
        id: "compute",
        title: "Compute & Containers",
        desc: "EC2, Lambda, Kubernetes",
        icon: Code,
      },
      {
        id: "storage",
        title: "Storage & Databases",
        desc: "S3, RDS, NoSQL solutions",
        icon: Database,
      },
      {
        id: "security",
        title: "Security & Compliance",
        desc: "IAM, encryption, governance",
        icon: Shield,
      },
      {
        id: "networking",
        title: "Networking & CDN",
        desc: "VPC, load balancers, CloudFront",
        icon: Settings,
      },
      {
        id: "devops",
        title: "DevOps & Automation",
        desc: "CI/CD, Infrastructure as Code",
        icon: Rocket,
      },
    ],
  },
];
