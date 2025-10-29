#!/usr/bin/env ts-node

/**
 * Standalone script to seed project categories
 * Run with: npx ts-node scripts/seed-categories.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

async function seedCategories() {
  console.log("🌱 Starting to seed project categories...\n");

  try {
    let created = 0;
    let updated = 0;

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

      // Check if it was a new record or update
      const exists = await prisma.projectCategory.findFirst({
        where: { slug: category.slug },
        select: { createdAt: true, updatedAt: true },
      });

      if (exists?.createdAt.getTime() === exists?.updatedAt.getTime()) {
        created++;
        console.log(`✅ Created: ${result.name}`);
      } else {
        updated++;
        console.log(`🔄 Updated: ${result.name}`);
      }
    }

    console.log("\n🎉 Seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Created: ${created} categories`);
    console.log(`   - Updated: ${updated} categories`);
    console.log(`   - Total: ${categories.length} categories\n`);
  } catch (error) {
    console.error("\n❌ Error seeding categories:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedCategories();
