import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

// Define the valid changeFrequency values
type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL of your website
  const baseUrl = 'https://clouddojo.tech'
  
  // Current date for lastModified (formatted as ISO string)
  const currentDate = new Date().toISOString()
  
  // Main Pages
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.9,
    },
  ]
  
  // Authentication & Onboarding
  const authPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/onboarding`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.8,
    },
  ]
  
  // Dashboard & Core Features
  const dashboardPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/dashboard`,
      lastModified: currentDate,
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dashboard/practice`,
      lastModified: currentDate,
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dashboard/profile`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/dashboard/flashcards`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.7,
    },
  ]
  
  // Additional Pages
  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/tos`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.5,
    },
  ]
  
  // Resources & Company
  const resourcePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.6,
    },
  ]
  
  // Feature Pages
  const featurePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/features`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/enterprise`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.7,
    },
  ]
  
  // Fetch Practice Tests from database
  let practiceTests: MetadataRoute.Sitemap = []
  try {
    const tests = await prisma.quiz.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
      where: {
        isPublic: true, // Only include published tests
      },
    })
    
    practiceTests = tests.map(test => ({
      url: `${baseUrl}/dashboard/practice/${test.id}`,
      lastModified: test.updatedAt.toISOString(),
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error fetching practice tests for sitemap:', error)
    // Continue with empty array if there's an error
  }
  
  // Combine all page groups into a single sitemap array
  return [
    ...mainPages,
    ...authPages,
    ...dashboardPages,
    ...legalPages,
    ...resourcePages,
    ...featurePages,
    ...practiceTests, // Add the dynamic practice test pages
  ]
}