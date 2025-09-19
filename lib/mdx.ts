import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export interface BlogPostMetadata {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readTime: string;
  category: string;
  featured?: boolean;
  image: string;
  tags: string[];
}

export interface BlogPost extends BlogPostMetadata {
  content: string;
  slug: string;
}

const contentDirectory = path.join(process.cwd(), 'content/blog');

export function getAllBlogPosts(): BlogPost[] {
  try {
    const fileNames = fs.readdirSync(contentDirectory);
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, '');
        const fullPath = path.join(contentDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        
        const { data, content } = matter(fileContents);
        const readTimeResult = readingTime(content);
        
        return {
          slug,
          id: slug,
          content,
          readTime: readTimeResult.text,
          ...data,
        } as BlogPost;
      });

    // Sort posts by publish date
    return allPostsData.sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  } catch (error) {
    console.warn('Error reading blog posts:', error);
    return [];
  }
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.mdx`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const readTimeResult = readingTime(content);

    return {
      slug,
      id: slug,
      content,
      readTime: readTimeResult.text,
      ...data,
    } as BlogPost;
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

export function getAllBlogPostSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(contentDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => fileName.replace(/\.mdx$/, ''));
  } catch (error) {
    console.warn('Error reading blog post slugs:', error);
    return [];
  }
}

export function getFeaturedPosts(): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter(post => post.featured);
}

export function getPostsByCategory(category: string): BlogPost[] {
  const allPosts = getAllBlogPosts();
  if (category === "All Articles") {
    return allPosts;
  }
  return allPosts.filter(post => post.category === category);
}

export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const allPosts = getAllBlogPosts();
  const currentPost = allPosts.find(post => post.slug === currentSlug);
  
  if (!currentPost) return [];
  
  return allPosts
    .filter(post => 
      post.slug !== currentSlug && 
      (post.category === currentPost.category || 
       post.tags.some(tag => currentPost.tags.includes(tag)))
    )
    .slice(0, limit);
}

export const BLOG_CATEGORIES = [
  "All Articles",
  "Cloud Computing", 
  "DevOps",
  "Tutorials",
  "Industry News",
  "Career Tips"
];