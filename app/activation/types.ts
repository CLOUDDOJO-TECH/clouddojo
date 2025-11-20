export type ExperienceLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type CloudPlatform = "AWS" | "Azure" | "GCP" | "Kubernetes" | "Terraform" | "Docker";

export type UserRole = "STUDENT" | "DEVELOPER" | "DEVOPS" | "CLOUD_ENGINEER" | "ARCHITECT" | "OTHER";

export interface ProfileData {
  experience: ExperienceLevel;
  platform: CloudPlatform;
  certification: string;
  role: UserRole;
}

export interface ActivationState {
  step: 1 | 2 | 3;
  profile: Partial<ProfileData>;
  quizAnswers: Record<string, string[]>;
  quizAttemptId: string | null;
  score: {
    correct: number;
    total: number;
  };
}

export interface CertificationOption {
  id: string;
  name: string;
  difficulty: "associate" | "professional" | "specialty" | "foundational";
}

// Certification mappings by platform
export const CERTIFICATIONS_BY_PLATFORM: Record<CloudPlatform, CertificationOption[]> = {
  AWS: [
    { id: "aws-saa", name: "AWS Solutions Architect Associate", difficulty: "associate" },
    { id: "aws-dev", name: "AWS Developer Associate", difficulty: "associate" },
    { id: "aws-sysops", name: "AWS SysOps Administrator", difficulty: "associate" },
    { id: "aws-sap", name: "AWS Solutions Architect Professional", difficulty: "professional" },
    { id: "aws-devops-pro", name: "AWS DevOps Engineer Professional", difficulty: "professional" },
  ],
  Azure: [
    { id: "az-900", name: "Azure Fundamentals", difficulty: "foundational" },
    { id: "az-104", name: "Azure Administrator", difficulty: "associate" },
    { id: "az-204", name: "Azure Developer", difficulty: "associate" },
    { id: "az-305", name: "Azure Solutions Architect", difficulty: "professional" },
  ],
  GCP: [
    { id: "gcp-ace", name: "Associate Cloud Engineer", difficulty: "associate" },
    { id: "gcp-pca", name: "Professional Cloud Architect", difficulty: "professional" },
    { id: "gcp-pde", name: "Professional Data Engineer", difficulty: "professional" },
  ],
  Kubernetes: [
    { id: "cka", name: "Certified Kubernetes Administrator (CKA)", difficulty: "associate" },
    { id: "ckad", name: "Certified Kubernetes Application Developer", difficulty: "associate" },
    { id: "cks", name: "Certified Kubernetes Security Specialist", difficulty: "specialty" },
  ],
  Terraform: [
    { id: "terraform-associate", name: "HashiCorp Terraform Associate", difficulty: "associate" },
  ],
  Docker: [
    { id: "dca", name: "Docker Certified Associate", difficulty: "associate" },
  ],
};
