// Client-side blog utilities (no file system operations)

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

export const BLOG_CATEGORIES = [
  "All Articles",
  "Cloud Computing", 
  "DevOps",
  "Tutorials",
  "Industry News",
  "Career Tips"
];

// Client-side filtering functions
export function getFeaturedPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter(post => post.featured);
}

export function getPostsByCategory(posts: BlogPost[], category: string): BlogPost[] {
  if (category === "All Articles") {
    return posts;
  }
  return posts.filter(post => post.category === category);
}

export function getRelatedPosts(posts: BlogPost[], currentSlug: string, limit: number = 3): BlogPost[] {
  const currentPost = posts.find(post => post.slug === currentSlug);
  
  if (!currentPost) return [];
  
  return posts
    .filter(post => 
      post.slug !== currentSlug && 
      (post.category === currentPost.category || 
       post.tags.some(tag => currentPost.tags.includes(tag)))
    )
    .slice(0, limit);
}