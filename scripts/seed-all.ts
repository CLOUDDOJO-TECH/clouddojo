#!/usr/bin/env ts-node

/**
 * All-in-one seed script
 * Seeds both project categories and sample projects
 * Run with: npx ts-node scripts/seed-all.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedAll() {
  console.log("🌱 Starting comprehensive database seeding...\n");

  try {
    // Step 1: Seed Project Categories
    console.log("📂 Step 1: Seeding Project Categories...");
    const categories = await seedProjectCategories();
    console.log(`✅ Created ${categories.length} categories\n`);

    // Step 2: Seed Sample Projects (optional - already handled by seed-projects.ts)
    console.log("📝 Step 2: Projects seeding...");
    console.log("   Run 'npx ts-node scripts/seed-projects.ts' to add sample projects\n");

    console.log("🎉 All seeding completed successfully!\n");
    console.log("📋 Summary:");
    console.log(`   - Categories: ${categories.length}`);
    console.log("\n📝 Next Steps:");
    console.log("   1. Add category images to /public/images/categories/");
    console.log("   2. Run seed-projects.ts to add sample projects");
    console.log("   3. Visit /dashboard/labs to see your work!");
  } catch (error) {
    console.error("\n❌ Error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function seedProjectCategories() {
  const categories = [
    {
      name: "All",
      slug: "all",
      description: "Browse all available projects across different topics",
      imageUrl: "/images/categories/all.jpg",
      sortOrder: 0,
    },
    {
      name: "Roadmaps",
      slug: "roadmaps",
      description: "Structured learning paths to master cloud technologies",
      imageUrl: "/images/categories/roadmaps.jpg",
      sortOrder: 1,
    },
    {
      name: "Specialty",
      slug: "specialty",
      description: "Specialized topics and advanced cloud certifications",
      imageUrl: "/images/categories/specialty.jpg",
      sortOrder: 2,
    },
    {
      name: "Tools",
      slug: "tools",
      description: "Learn essential cloud tools and services",
      imageUrl: "/images/categories/tools.jpg",
      sortOrder: 3,
    },
    {
      name: "Beginners Challenge",
      slug: "beginners-challenge",
      description: "Perfect projects for those starting their cloud journey",
      imageUrl: "/images/categories/beginners.jpg",
      sortOrder: 4,
    },
    {
      name: "7 Day DevOps Challenge",
      slug: "7-day-devops",
      description: "Complete DevOps projects in just 7 days",
      imageUrl: "/images/categories/devops.jpg",
      sortOrder: 5,
    },
    {
      name: "PRO",
      slug: "pro",
      description: "Advanced projects for experienced cloud professionals",
      imageUrl: "/images/categories/pro.jpg",
      sortOrder: 6,
    },
    {
      name: "AI Workspace",
      slug: "ai-workspace",
      description: "AI and machine learning cloud projects",
      imageUrl: "/images/categories/ai.jpg",
      sortOrder: 7,
    },
    {
      name: "New",
      slug: "new",
      description: "Recently added projects and latest content",
      imageUrl: "/images/categories/new.jpg",
      sortOrder: 8,
    },
  ];

  const results = [];

  for (const category of categories) {
    const result = await prisma.projectCategory.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl,
        sortOrder: category.sortOrder,
      },
      create: category,
    });

    results.push(result);
    console.log(`   ✓ ${result.name}`);
  }

  return results;
}

seedAll();
