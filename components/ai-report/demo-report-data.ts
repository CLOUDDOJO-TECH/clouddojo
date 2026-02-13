import type { ReportData } from "./types";

export const demoReportData: ReportData = {
  summary: {
    testName: "AWS Solutions Architect Associate",
    overallScore: 68,
    totalQuestions: 65,
    correctAnswers: 44,
    incorrectAnswers: 21,
    timeSpent: "4320",
    testDate: new Date().toISOString(),
    improvement: 12,
  },
  categoryScores: [
    { name: "Compute (EC2, Lambda, ECS)", score: 82, questions: 14 },
    { name: "Networking (VPC, Route 53)", score: 45, questions: 12 },
    { name: "Storage (S3, EBS, EFS)", score: 78, questions: 10 },
    { name: "Security (IAM, KMS)", score: 55, questions: 11 },
    { name: "Databases (RDS, DynamoDB)", score: 73, questions: 9 },
    { name: "High Availability & Scaling", score: 61, questions: 9 },
  ],
  strengths: [
    "Strong understanding of EC2 instance types and placement groups — you correctly answered 11 out of 14 compute questions, including multi-part scenarios.",
    "Solid grasp of S3 storage classes and lifecycle policies. You consistently pick the most cost-effective storage tier.",
    "Good performance on DynamoDB partition key design and read/write capacity planning.",
    "You handle Lambda concurrency and timeout questions well, suggesting strong serverless fundamentals.",
  ],
  weaknesses: [
    "VPC peering vs. Transit Gateway — you've confused these in 4 of your last 6 attempts. This is a conceptual gap, not a careless mistake.",
    "IAM policy evaluation logic is inconsistent. You tend to miss questions involving cross-account roles and permission boundaries.",
    "Subnet design and CIDR allocation — you're selecting oversized subnets, suggesting uncertainty about IP address planning.",
    "Time pressure on multi-step architecture questions — you skip or rush these, even though you get similar questions right when untimed.",
  ],
  recommendations: [
    "Dedicate 45 minutes to reviewing VPC Peering vs Transit Gateway vs PrivateLink. Focus on when to use each, not just what they are. AWS re:Post has excellent comparison diagrams.",
    "Practice IAM policy evaluation with the AWS Policy Simulator. Build 3-4 cross-account scenarios and trace the permission flow yourself.",
    "Work through the VPC subnet calculator exercises — start with a /16 VPC and practice allocating /24 subnets for a 3-tier architecture across 3 AZs.",
    "On your next practice test, flag architecture questions to return to rather than rushing. Your accuracy on these jumps from 40% to 75% when you give yourself adequate time.",
  ],
  detailedAnalysis: `## Performance Overview

Over your last 5 attempts at the AWS Solutions Architect Associate exam, your scores have progressed from **56% to 68%** — a solid **12-point improvement** in two weeks. You're trending in the right direction, but you're not yet at the **72% passing threshold**.

**The good news:** Your compute and storage scores are already at passing level. These are your anchor domains — they're carrying your overall score.

**The concern:** Networking is dragging you down significantly. At 45%, it's your weakest area by a wide margin, and it accounts for nearly 20% of the exam. Improving networking by just 15 points would push your overall score above the passing line.

## Pattern Analysis

Looking across your attempts, a clear pattern emerges:

> "You understand individual AWS services well, but struggle when questions require you to connect multiple services together in a network architecture."

This explains why your VPC, peering, and subnet questions are weak while your individual service questions (EC2, S3, Lambda) are strong. The gap isn't in service knowledge — it's in **architectural thinking**.

## Key Insight

Your time-per-question data reveals something important: you spend an average of **45 seconds** on networking questions vs **72 seconds** on compute questions. You're not giving yourself enough time on your weakest area. This is likely because the questions feel uncomfortable, so you rush through them.

**Recommendation:** On your next attempt, deliberately spend 90 seconds minimum on any networking question before selecting an answer.`,
  timeDistribution: [
    { category: "Compute", time: 1080, count: 14 },
    { category: "Networking", time: 540, count: 12 },
    { category: "Storage", time: 720, count: 10 },
    { category: "Security", time: 780, count: 11 },
    { category: "Databases", time: 660, count: 9 },
    { category: "HA & Scaling", time: 540, count: 9 },
  ],
  performanceHistory: [
    { test: "Attempt 1", score: 56 },
    { test: "Attempt 2", score: 58 },
    { test: "Attempt 3", score: 62 },
    { test: "Attempt 4", score: 65 },
    { test: "Attempt 5", score: 68 },
  ],
  certificationReadiness: 72,
  topMissedTopics: [
    { topic: "VPC Peering & Transit Gateway", count: 5, importance: "High" },
    { topic: "IAM Cross-Account Roles", count: 4, importance: "High" },
    { topic: "Subnet Design & CIDR Blocks", count: 3, importance: "Medium" },
    { topic: "Auto Scaling Policies", count: 2, importance: "Medium" },
    { topic: "CloudFront Cache Behaviors", count: 2, importance: "Low" },
  ],
  studyPlan: [
    {
      title: "Fix Networking Fundamentals",
      description:
        "Your networking score is 27 points below your compute score. Focus on VPC architecture patterns — peering, Transit Gateway, and PrivateLink. Build a mental model of when each is appropriate.",
      resources: [
        "https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html",
        "https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html",
        "https://www.youtube.com/watch?v=qJIp0VO7GCs",
      ],
      priority: "High",
    },
    {
      title: "Strengthen IAM Policy Logic",
      description:
        "You're missing questions that involve policy evaluation across accounts. Practice tracing allow/deny logic through SCPs, identity policies, and resource policies.",
      resources: [
        "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html",
        "https://policysim.aws.amazon.com/",
        "https://www.youtube.com/watch?v=YQsK4MtsELU",
      ],
      priority: "High",
    },
    {
      title: "Practice Subnet Planning",
      description:
        "Work through CIDR allocation exercises for multi-AZ, multi-tier architectures. The goal is to allocate subnets without wasting IP addresses or creating overlap.",
      resources: [
        "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-subnets-commands-example.html",
        "https://cidr.xyz/",
      ],
      priority: "Medium",
    },
  ],
};

// --- New demo sections (AI Coach Brief, Action Items, Resources, Momentum) ---

export const demoCoachBrief = `Over your last 5 attempts, your scores have climbed from 56% to 68% — that's a **12-point improvement in two weeks**, which puts you ahead of the typical study pace for this certification.

You're strongest in **Compute and Storage**, where you're already scoring above the passing threshold. These domains are carrying your overall score and you should feel confident about them on exam day.

Your biggest opportunity is **Networking**, which is currently sitting at 45%. This single domain is the main thing keeping you below the 72% passing line. The pattern in your answers suggests this isn't a surface-level gap — you understand individual services fine, but struggle when questions ask you to **connect services together across VPCs and accounts**.

Here's what's encouraging: your improvement rate hasn't plateaued. Each attempt shows measurable progress, which means your study approach is working. You just need to redirect some of that effort toward your weakest areas.

**Bottom line:** You're roughly 3 weeks from being exam-ready if you focus your next study sessions on networking and IAM.`;

export const demoActionItems = [
  {
    id: "1",
    task: "Review VPC Peering vs Transit Gateway vs PrivateLink",
    detail:
      "You've confused these in 4 of your last 6 attempts. Spend 45 minutes understanding when to use each one.",
    timeEstimate: "45 min",
    priority: "High" as const,
    completed: false,
  },
  {
    id: "2",
    task: "Practice 5 IAM cross-account policy scenarios",
    detail:
      "Use the AWS Policy Simulator to build and trace cross-account role assumptions.",
    timeEstimate: "30 min",
    priority: "High" as const,
    completed: false,
  },
  {
    id: "3",
    task: "Complete a subnet planning exercise for a 3-tier, 3-AZ architecture",
    detail:
      "Start with a /16 VPC and allocate /24 subnets. Verify no overlaps and that you have room to grow.",
    timeEstimate: "20 min",
    priority: "Medium" as const,
    completed: false,
  },
  {
    id: "4",
    task: "Retake the Networking domain quiz — focus on accuracy, not speed",
    detail:
      "Spend at least 90 seconds per question. Your accuracy jumps from 40% to 75% when you don't rush.",
    timeEstimate: "25 min",
    priority: "Medium" as const,
    completed: false,
  },
  {
    id: "5",
    task: "Review your 3 most recent incorrect IAM answers",
    detail:
      "Read the explanations carefully and identify where your reasoning diverged from the correct logic.",
    timeEstimate: "15 min",
    priority: "Low" as const,
    completed: false,
  },
];

export const demoResources = [
  {
    category: "VPC & Networking",
    items: [
      {
        title: "AWS VPC Peering Guide",
        url: "https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html",
        type: "docs" as const,
        description: "Official AWS documentation — covers peering limitations and routing",
      },
      {
        title: "VPC Networking Deep Dive — re:Invent 2024",
        url: "https://www.youtube.com/watch?v=qJIp0VO7GCs",
        type: "video" as const,
        description: "55-min talk comparing peering, Transit Gateway, and PrivateLink with diagrams",
      },
      {
        title: "CIDR Subnet Calculator",
        url: "https://cidr.xyz/",
        type: "tool" as const,
        description: "Interactive tool to visualize and plan subnet allocations",
      },
    ],
  },
  {
    category: "IAM & Security",
    items: [
      {
        title: "IAM Policy Evaluation Logic",
        url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html",
        type: "docs" as const,
        description: "Understand how AWS evaluates allow/deny across policy types",
      },
      {
        title: "AWS Policy Simulator",
        url: "https://policysim.aws.amazon.com/",
        type: "tool" as const,
        description: "Test and debug IAM policies without deploying them",
      },
      {
        title: "Cross-Account Access Patterns",
        url: "https://www.youtube.com/watch?v=YQsK4MtsELU",
        type: "video" as const,
        description: "Walkthrough of assume-role patterns and permission boundaries",
      },
    ],
  },
  {
    category: "Architecture & Scaling",
    items: [
      {
        title: "AWS Well-Architected Labs",
        url: "https://www.wellarchitectedlabs.com/",
        type: "lab" as const,
        description: "Free hands-on labs covering reliability, performance, and cost optimization",
      },
      {
        title: "Auto Scaling Deep Dive",
        url: "https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html",
        type: "docs" as const,
        description: "Target tracking vs step scaling — when to use each policy type",
      },
    ],
  },
];

export const demoMomentum = {
  currentScore: 68,
  passingScore: 72,
  pointsNeeded: 4,
  weeklyImprovement: 4.5,
  estimatedWeeksToPass: 1,
  improvementTrend: "accelerating" as const,
  streakDays: 8,
  totalStudyHours: 12.5,
  attemptsUntilNextReport: 2,
};
