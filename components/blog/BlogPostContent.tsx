"use client";

import { BlogPost } from "@/lib/blog-client";
import { BlogCard } from "./BlogCard";
import { MDXContent } from "@/components/mdx/mdx-content";

interface BlogPostContentProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export const BlogPostContent = ({ post, relatedPosts }: BlogPostContentProps) => {

  return (
    <div className="space-y-16">
      {/* Main Content */}
      <article>
        <MDXContent content={post.content} />
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="space-y-8">
          <div className="border-t pt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Related Articles
              </h2>
              <p className="text-muted-foreground">Continue your learning journey with these related posts</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};