import { notFound } from "next/navigation";
import { getBlogPostBySlug, getAllBlogPostSlugs, getAllBlogPosts, getRelatedPosts } from "@/lib/mdx";
import { BlogPost } from "@/components/blog/BlogPost";

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllBlogPostSlugs();
  return slugs.map((slug) => ({
    id: slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { id } = await params;
  const post = getBlogPostBySlug(id);
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | CloudDojo Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : ["CloudDojo Team"],
      tags: Array.isArray(post.tags) ? post.tags : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const post = getBlogPostBySlug(id);

  if (!post) {
    notFound();
  }

  const allPosts = getAllBlogPosts();
  const relatedPosts = getRelatedPosts(allPosts, post.slug, 3);

  return <BlogPost post={post} relatedPosts={relatedPosts} />;
}