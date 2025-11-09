export interface Certification {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  provider: "aws" | "gcp" | "oracle" | "comptia";
  level?: "foundational" | "associate" | "professional" | "specialty";
}

export const certifications: Certification[] = [
  // AWS Certifications
  {
    id: "aws-cloud-practitioner",
    name: "AWS Cloud Practitioner",
    description:
      "Foundational understanding of AWS Cloud concepts, services, and terminology",
    imagePath: "/cert-badges/aws/aws-cloud-practitioner.png",
    provider: "aws",
    level: "foundational",
  },
  {
    id: "aws-solutions-architect",
    name: "AWS Solutions Architect Associate",
    description:
      "Design and deploy scalable systems on AWS with best practices",
    imagePath: "/cert-badges/aws/aws-solutions-architect.png",
    provider: "aws",
    level: "associate",
  },
  {
    id: "aws-developer-associate",
    name: "AWS Developer Associate",
    description: "Develop and maintain applications on the AWS platform",
    imagePath: "/cert-badges/aws/aws-developer associate.png",
    provider: "aws",
    level: "associate",
  },
  {
    id: "aws-solutions-architect-professional",
    name: "AWS Solutions Architect Professional",
    description:
      "Advanced technical skills in designing distributed applications on AWS",
    imagePath: "/cert-badges/aws/aws-solutions-architect-proffessional.png",
    provider: "aws",
    level: "professional",
  },
  {
    id: "aws-devops-engineer",
    name: "AWS DevOps Engineer Professional",
    description: "Provision, operate, and manage distributed systems on AWS",
    imagePath: "/cert-badges/aws/aws-devops-engineer.png",
    provider: "aws",
    level: "professional",
  },
  {
    id: "aws-security-specialty",
    name: "AWS Security Specialty",
    description: "Expertise in securing the AWS platform and workloads",
    imagePath: "/cert-badges/aws/aws-security-specialty.png",
    provider: "aws",
    level: "specialty",
  },
  {
    id: "aws-machine-learning-specialty",
    name: "AWS Machine Learning Specialty",
    description: "Design, implement, and maintain ML solutions on AWS",
    imagePath: "/cert-badges/aws/aws-machine-learning-specialty.png",
    provider: "aws",
    level: "specialty",
  },
  {
    id: "aws-machine-learning-associate",
    name: "AWS Machine Learning Associate",
    description: "Build and deploy machine learning solutions on AWS",
    imagePath: "/cert-badges/aws/aws-machine-learning-associate.png",
    provider: "aws",
    level: "associate",
  },
  {
    id: "aws-advanced-networking",
    name: "AWS Advanced Networking Specialty",
    description: "Design and implement AWS and hybrid network architectures",
    imagePath: "/cert-badges/aws/aws-advanced-networking.png",
    provider: "aws",
    level: "specialty",
  },
  {
    id: "aws-data-eng-associate",
    name: "AWS Data Engineer Associate",
    description:
      "Build and maintain data pipelines and analytics solutions on AWS",
    imagePath: "/cert-badges/aws/aws-data-eng-associate.png",
    provider: "aws",
    level: "associate",
  },
  {
    id: "aws-ai-practitioner",
    name: "AWS AI Practitioner",
    description: "Foundational knowledge of AI and ML services on AWS",
    imagePath: "/cert-badges/aws/aws-ai-practitioner.png",
    provider: "aws",
    level: "foundational",
  },

  // Google Cloud Certifications
  {
    id: "gcp-associate-cloud-eng",
    name: "Google Cloud Associate Cloud Engineer",
    description:
      "Deploy applications, monitor operations, and manage enterprise solutions",
    imagePath: "/cert-badges/gcp/gcp-associate-cloud-eng.png",
    provider: "gcp",
    level: "associate",
  },
  {
    id: "gcp-proffessional-cloud-architect",
    name: "Google Cloud Professional Cloud Architect",
    description:
      "Design, develop, and manage robust, secure, and scalable cloud architecture",
    imagePath: "/cert-badges/gcp/gcp-proffessional-cloud-architect.png",
    provider: "gcp",
    level: "professional",
  },
  {
    id: "gcp-proffessional-data-eng",
    name: "Google Cloud Professional Data Engineer",
    description: "Design and build data processing systems on Google Cloud",
    imagePath: "/cert-badges/gcp/gcp-proffessional-data-eng.png",
    provider: "gcp",
    level: "professional",
  },
  {
    id: "gcp-prof-cloud-devops-eng",
    name: "Google Cloud Professional Cloud DevOps Engineer",
    description:
      "Implement site reliability engineering practices using Google Cloud",
    imagePath: "/cert-badges/gcp/gcp-prof-cloud-devops-eng.png",
    provider: "gcp",
    level: "professional",
  },
  {
    id: "gcp-prof-ml-eng",
    name: "Google Cloud Professional Machine Learning Engineer",
    description: "Design, build, and productionize ML models on Google Cloud",
    imagePath: "/cert-badges/gcp/gcp-prof-ml-eng.png",
    provider: "gcp",
    level: "professional",
  },
  {
    id: "gcp-prof-coud-sec-eng",
    name: "Google Cloud Professional Cloud Security Engineer",
    description:
      "Configure access controls and implement security best practices",
    imagePath: "/cert-badges/gcp/gcp-prof-coud-sec-eng.png",
    provider: "gcp",
    level: "professional",
  },
  {
    id: "gcp-prof-sec-ops-eng",
    name: "Google Cloud Professional Security Operations Engineer",
    description: "Implement and manage security operations on Google Cloud",
    imagePath: "/cert-badges/gcp/gcp-prof-sec-ops-eng.png",
    provider: "gcp",
    level: "professional",
  },
  {
    id: "gcp-ai-leader",
    name: "Google Cloud AI Leader",
    description: "Leadership in driving AI transformation using Google Cloud",
    imagePath: "/cert-badges/gcp/gcp-ai-leader.png",
    provider: "gcp",
    level: "professional",
  },

  // Oracle Certifications
  {
    id: "oracle-cloud-infra-eng",
    name: "Oracle Cloud Infrastructure Engineer",
    description:
      "Design and architect solutions on Oracle Cloud Infrastructure",
    imagePath: "/cert-badges/oracle/oracle-cloud-infra-eng.png",
    provider: "oracle",
    level: "professional",
  },
];
