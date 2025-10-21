import { PrismaClient, DifficultyLevel, ProjectType, ProjectStepType } from '@prisma/client'

const prisma = new PrismaClient()

async function seedProjects() {
  console.log('🌱 Seeding hands-on labs projects...')

  // First, let's check if we have existing categories or create some
  const categories = await prisma.category.findMany()
  
  let awsCategory = categories.find(c => c.name.toLowerCase().includes('aws'))
  let kubernetesCategory = categories.find(c => c.name.toLowerCase().includes('kubernetes'))
  let devopsCategory = categories.find(c => c.name.toLowerCase().includes('devops'))
  
  // Create categories if they don't exist
  if (!awsCategory) {
    awsCategory = await prisma.category.create({
      data: {
        name: 'AWS',
        description: 'Amazon Web Services cloud platform projects'
      }
    })
  }
  
  if (!kubernetesCategory) {
    kubernetesCategory = await prisma.category.create({
      data: {
        name: 'Kubernetes',
        description: 'Container orchestration and cloud-native projects'
      }
    })
  }
  
  if (!devopsCategory) {
    devopsCategory = await prisma.category.create({
      data: {
        name: 'DevOps',
        description: 'Development and operations automation projects'
      }
    })
  }

  // Create sample projects
  const project1 = await prisma.project.create({
    data: {
      title: 'Set Up a Web App in the Cloud',
      description: 'Learn the basics of building a web app using AWS and VS Code. This will lay the foundation for your DevOps work.',
      categoryId: awsCategory.id,
      difficulty: DifficultyLevel.BEGINER,
      estimatedTime: 120, // 2 hours
      estimatedCost: 0, // Free tier
      thumbnailUrl: '/images/projects/aws-web-app.jpg',
      videoUrl: 'https://youtube.com/watch?v=example',
      prerequisites: ['Set Up An AWS Account for Free'],
      learningObjectives: [
        'Launch an EC2 instance',
        'Use VS Code to set up a remote SSH connection to your EC2 instance',
        'Install Maven and Java and generate a basic web app'
      ],
      keyTechnologies: ['Amazon EC2', 'VSCode'],
      isPremium: false,
      isPublished: true,
      projectType: ProjectType.TUTORIAL,
      steps: {
        create: [
          {
            stepNumber: 0,
            title: 'Before we start Step #1...',
            description: 'Set your learning objectives and understand what we\'re building today.',
            instructions: `# What are we here to do today?

In this project, I will demonstrate... I'm doing this project to learn...

*This is your space to reflect on your learning goals and document your journey.*`,
            expectedOutput: 'A clear statement of your learning objectives',
            validationCriteria: ['Response should be at least 50 characters'],
            mediaUrls: [],
            estimatedTime: 5,
            stepType: ProjectStepType.REFLECTION,
            isOptional: false
          },
          {
            stepNumber: 1,
            title: 'Set up an IAM user',
            description: 'Create a secure IAM user for this project instead of using your root account.',
            instructions: `# Setting up IAM User

First things first... do you have an IAM user?

## What is an IAM user? Why are we setting one up?

In AWS, a **user** is a person or a computer that can do things on the AWS cloud.

When you create an AWS account for the first time, the login you get is called the **root user** of the AWS account. AWS actually recommends to **not** use your root user for everyday tasks to protect it from security breaches.

You should create IAM users instead. If a root user is a master key to your AWS account, think of IAM users as key copies. IAM users have separate usernames and passwords to your root user, and you can set them to have limited access to your account's resources.

## Steps:
1. Head to your AWS Account as the root user
2. Open the **AWS IAM** console
3. Create a new IAM user with the following permissions:
   - EC2FullAccess
   - VPCFullAccess
4. Download the credentials and save them securely`,
            expectedOutput: 'IAM user created with appropriate permissions',
            validationCriteria: [
              'IAM user has been created',
              'User has EC2 and VPC permissions',
              'Credentials have been downloaded'
            ],
            mediaUrls: [],
            estimatedTime: 10,
            stepType: ProjectStepType.INSTRUCTION,
            isOptional: false
          },
          {
            stepNumber: 2,
            title: 'Launch an EC2 Instance',
            description: 'Set up your cloud development environment.',
            instructions: `# Launch Your EC2 Instance

Now let's create your cloud development server.

## What are we doing in this step?

In this step, I will... because...

## Instructions:

Start setting up an EC2 instance and name it **nextwork-devops-[enter your name]**.

1. Navigate to the EC2 Console
2. Click "Launch Instance"
3. Choose Amazon Linux 2 AMI
4. Select t2.micro (free tier eligible)
5. Create a new key pair and download it
6. Configure security group to allow SSH (port 22)
7. Launch the instance

## Security Group Configuration:
- Type: SSH
- Protocol: TCP
- Port Range: 22
- Source: My IP (for security)

Make sure to save your key pair file (.pem) in a secure location!`,
            expectedOutput: 'Running EC2 instance with proper security configuration',
            validationCriteria: [
              'EC2 instance is in running state',
              'Security group allows SSH access',
              'Key pair has been downloaded and saved'
            ],
            mediaUrls: [],
            estimatedTime: 15,
            stepType: ProjectStepType.INSTRUCTION,
            isOptional: false
          },
          {
            stepNumber: 3,
            title: 'Install VS Code',
            description: 'Set up your development environment.',
            instructions: `# Install VS Code and Extensions

Let's set up your local development environment to connect to your cloud server.

## Steps:
1. Download and install Visual Studio Code from code.visualstudio.com
2. Install the "Remote - SSH" extension
3. Install the "AWS Toolkit" extension (optional but helpful)

## Verify Installation:
- Open VS Code
- Check that the Remote - SSH extension is installed and active
- You should see a remote connection icon in the bottom left corner`,
            expectedOutput: 'VS Code installed with Remote SSH extension',
            validationCriteria: [
              'VS Code is installed',
              'Remote - SSH extension is active',
              'Can see remote connection option'
            ],
            mediaUrls: [],
            estimatedTime: 10,
            stepType: ProjectStepType.INSTRUCTION,
            isOptional: false
          },
          {
            stepNumber: 4,
            title: 'Connect to your EC2 Instance',
            description: 'Establish SSH connection from VS Code to your cloud server.',
            instructions: `# Connect VS Code with your EC2 Instance

Time to connect your local VS Code to your cloud development environment.

## Steps:
1. In VS Code, click the Remote Connection icon (bottom left)
2. Select "Connect to Host..." → "Configure SSH Hosts..."
3. Add your EC2 instance configuration:

\`\`\`
Host mydevserver
    HostName [YOUR-EC2-PUBLIC-IP]
    User ec2-user
    IdentityFile [PATH-TO-YOUR-PEM-FILE]
\`\`\`

4. Save the configuration
5. Connect to "mydevserver"
6. VS Code should open a new window connected to your EC2 instance

## Troubleshooting:
- Make sure your .pem file has correct permissions: \`chmod 400 your-key.pem\`
- Verify your EC2 instance is running
- Check security group allows SSH from your IP`,
            expectedOutput: 'VS Code successfully connected to EC2 instance',
            validationCriteria: [
              'SSH connection established',
              'VS Code shows remote connection status',
              'Can access EC2 file system through VS Code'
            ],
            mediaUrls: [],
            estimatedTime: 20,
            stepType: ProjectStepType.INSTRUCTION,
            isOptional: false
          },
          {
            stepNumber: 5,
            title: 'Install Apache Maven and Amazon Corretto',
            description: 'Set up Java development tools on your EC2 instance.',
            instructions: `# Install Development Tools

Let's install the tools we need for Java web development.

## What are we doing in this step?

In this step, I will install Maven and Java because...

## Installation Commands:

Connect to your EC2 instance through VS Code terminal and run:

\`\`\`bash
# Update the system
sudo yum update -y

# Install Amazon Corretto (Java)
sudo yum install -y java-11-amazon-corretto-devel

# Install Maven
sudo yum install -y maven

# Verify installations
java -version
mvn -version
\`\`\`

## Expected Output:
You should see version information for both Java and Maven indicating successful installation.`,
            expectedOutput: 'Java and Maven successfully installed',
            validationCriteria: [
              'Java 11 is installed and accessible',
              'Maven is installed and accessible',
              'Both tools show version information when queried'
            ],
            mediaUrls: [],
            estimatedTime: 10,
            stepType: ProjectStepType.INSTRUCTION,
            isOptional: false
          },
          {
            stepNumber: 6,
            title: 'Create the Application',
            description: 'Generate a basic web application using Maven.',
            instructions: `# Create Your Web Application

Time to create your first cloud-based web application!

## Generate Maven Project:

Run this command in your EC2 terminal:

\`\`\`bash
mvn archetype:generate \
  -DgroupId=com.clouddojo.webapp \
  -DartifactId=my-web-app \
  -DarchetypeArtifactId=maven-archetype-webapp \
  -DinteractiveMode=false
\`\`\`

## Explore Your Project:
1. Navigate to the created directory: \`cd my-web-app\`
2. Look at the project structure
3. Open \`src/main/webapp/index.jsp\` and customize it
4. Build the project: \`mvn clean package\`

## Customize Your App:
Edit the index.jsp file to include:
- Your name
- The date you created this project
- A message about what you learned

This will be part of your project documentation!`,
            expectedOutput: 'Functional web application created and customized',
            validationCriteria: [
              'Maven project generated successfully',
              'Project builds without errors',
              'index.jsp has been customized with personal information'
            ],
            mediaUrls: [],
            estimatedTime: 15,
            stepType: ProjectStepType.INSTRUCTION,
            isOptional: false
          },
          {
            stepNumber: 7,
            title: 'Delete Your Resources',
            description: 'Clean up AWS resources to avoid charges.',
            instructions: `# Before You Go - Delete Your Resources

You **MUST** delete your resources to avoid charges to your AWS account.

## Important Notes:
⚠️ **If you're doing Day Two of the 7 Day DevOps Challenge today...**

Did you know that **Day Two** of the 7 Day DevOps Challenge is going to pick up right where you left off here?

You don't have to delete your resources (so you won't have to repeat this project's steps) **IF** you're also doing Day Two's project today. Just make sure to:

1. Complete all your tasks **and**
2. Download today's documentation **before** heading to Day Two.

## Cleanup Steps:

1. **Terminate EC2 Instance:**
   - Go to EC2 Console
   - Select your instance
   - Instance State → Terminate Instance

2. **Delete Key Pair:**
   - EC2 Console → Key Pairs
   - Select your key pair → Delete

3. **Review Security Groups:**
   - Delete any custom security groups you created

## Verification:
- No running EC2 instances
- No unnecessary key pairs
- No custom security groups (unless needed for other projects)

**💡 Challenge yourself:** Can you delete everything on your own? Keeping track of your resources and deleting them at the end is a key skill that will help you avoid charges to your account.`,
            expectedOutput: 'All AWS resources properly cleaned up',
            validationCriteria: [
              'EC2 instance has been terminated',
              'Key pair has been deleted (if not needed)',
              'No unexpected charges on AWS account'
            ],
            mediaUrls: [],
            estimatedTime: 10,
            stepType: ProjectStepType.INSTRUCTION,
            isOptional: false
          },
          {
            stepNumber: 8,
            title: 'Share Your Work',
            description: 'Document and share your accomplishment.',
            instructions: `# Share Your Project!

Now it's time to **share** and let people know just what an amazing job you've done.

## 1. Share it on LinkedIn 🤝

It's so easy to share your documentation - all you have to do is:

• Select **Mission Accomplished** at the end of this page 👆

Your generated documentation will be perfect for sharing on LinkedIn to showcase your new cloud development skills!

## What You've Accomplished:

✅ Set up AWS IAM user for secure access
✅ Launched and configured an EC2 instance
✅ Connected VS Code to cloud development environment
✅ Installed Java and Maven on Linux
✅ Created and customized a web application
✅ Learned cloud resource management

## Download Your Documentation:

Your responses throughout this project have been compiled into a comprehensive project documentation that you can:
- Add to your portfolio
- Share on LinkedIn
- Include in job applications
- Use as a reference for future projects

**Congratulations on completing your first cloud development project!** 🎉`,
            expectedOutput: 'Project documentation ready for sharing',
            validationCriteria: [
              'All project steps completed',
              'Documentation generated',
              'Ready to share accomplishment'
            ],
            mediaUrls: [],
            estimatedTime: 5,
            stepType: ProjectStepType.REFLECTION,
            isOptional: false
          }
        ]
      }
    }
  })

  // Create a second sample project
  const project2 = await prisma.project.create({
    data: {
      title: 'Kubernetes Fundamentals',
      description: 'Learn container orchestration with Kubernetes. Deploy your first application to a Kubernetes cluster.',
      categoryId: kubernetesCategory.id,
      difficulty: DifficultyLevel.INTERMEDIATE,
      estimatedTime: 180, // 3 hours
      estimatedCost: 500, // $5.00
      thumbnailUrl: '/images/projects/kubernetes-basics.jpg',
      prerequisites: ['Docker fundamentals', 'Basic Linux knowledge'],
      learningObjectives: [
        'Set up a Kubernetes cluster',
        'Deploy applications using kubectl',
        'Understand pods, services, and deployments'
      ],
      keyTechnologies: ['Kubernetes', 'Docker', 'kubectl'],
      isPremium: true,
      isPublished: true,
      projectType: ProjectType.CHALLENGE,
      steps: {
        create: [
          {
            stepNumber: 0,
            title: 'Project Overview',
            description: 'Understand what we\'ll build and why Kubernetes matters.',
            instructions: `# Kubernetes Learning Journey

## What are we building?
In this project, you'll deploy a multi-container application to Kubernetes and learn the fundamentals of container orchestration.

## Learning Objectives:
- Set up a local Kubernetes cluster
- Deploy applications using YAML manifests
- Understand Kubernetes core concepts
- Implement service discovery and load balancing

## Prerequisites Check:
- [ ] Docker installed and running
- [ ] Basic understanding of containers
- [ ] Familiarity with YAML syntax
- [ ] Terminal/command line experience

Document your current experience with these technologies and what you hope to achieve.`,
            expectedOutput: 'Learning objectives and prerequisite assessment',
            validationCriteria: ['Clear learning goals documented'],
            mediaUrls: [],
            estimatedTime: 10,
            stepType: ProjectStepType.REFLECTION,
            isOptional: false
          },
          {
            stepNumber: 1,
            title: 'Set Up Kubernetes Cluster',
            description: 'Install and configure a local Kubernetes environment.',
            instructions: `# Set Up Your Kubernetes Environment

We'll use minikube for local development.

## Installation Steps:

### For macOS:
\`\`\`bash
brew install minikube kubectl
\`\`\`

### For Linux:
\`\`\`bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
\`\`\`

## Start Your Cluster:
\`\`\`bash
minikube start
kubectl cluster-info
\`\`\`

Verify your cluster is running and kubectl can connect to it.`,
            expectedOutput: 'Working Kubernetes cluster',
            validationCriteria: [
              'minikube cluster is running',
              'kubectl can communicate with cluster',
              'Cluster info shows master and DNS running'
            ],
            mediaUrls: [],
            estimatedTime: 20,
            stepType: ProjectStepType.INSTRUCTION,
            isOptional: false
          }
        ]
      }
    }
  })

  console.log('✅ Sample projects created successfully!')
  console.log(`📝 Project 1: ${project1.title} (${project1.id})`)
  console.log(`📝 Project 2: ${project2.title} (${project2.id})`)
  
  return { project1, project2 }
}

async function main() {
  try {
    await seedProjects()
  } catch (error) {
    console.error('❌ Error seeding projects:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run if this file is executed directly
main()

export { seedProjects }