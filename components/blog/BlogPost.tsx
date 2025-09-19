"use client";

import { BlogPost as BlogPostType } from "@/lib/blog-client";
import { BlogPostHeader } from "./BlogPostHeader";
import { BlogPostContent } from "./BlogPostContent";
import { ReadingProgress } from "./ReadingProgress";
import { BackToTop } from "./BackToTop";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface BlogPostProps {
  post: BlogPostType;
  relatedPosts: BlogPostType[];
}

export const BlogPost = ({ post, relatedPosts }: BlogPostProps) => {
  return (
    <div className="min-h-screen">
      <ReadingProgress />
      <div className="container mx-auto">
        <Navbar />
        <main>
          <div className="py-16 px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              <BlogPostHeader post={post} />
              <BlogPostContent post={post} relatedPosts={relatedPosts} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
      <BackToTop />
    </div>
  );
};