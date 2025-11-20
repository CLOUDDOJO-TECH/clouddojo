"use client";

import { useState } from "react";
import { BLOG_CATEGORIES, getFeaturedPosts, getPostsByCategory, BlogPost } from "@/lib/blog-client";
import { BlogHeader } from "./BlogHeader";
import { BlogCard } from "./BlogCard";
import { BackToTop } from "./BackToTop";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface BlogProps {
  posts: BlogPost[];
}

export const Blog = ({ posts }: BlogProps) => {
  const [selectedCategory, setSelectedCategory] = useState(BLOG_CATEGORIES[0]);
  
  const featuredPosts = getFeaturedPosts(posts);
  const filteredPosts = getPostsByCategory(posts, selectedCategory);
  
  // For "All Articles", show all posts. For specific categories, show all posts in that category
  const regularPosts = selectedCategory === "All Articles" 
    ? filteredPosts  // Show all posts including featured ones
    : filteredPosts.filter(post => !post.featured); // For specific categories, exclude featured to avoid duplication

  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        <Navbar />
        <main>
          <section className="flex font-sans flex-col gap-16 py-16 px-4 max-w-7xl mx-auto">
            {/* Section Header */}
            <BlogHeader
              title="Stay Updated On Cloud Technology"
              subtitle="Get the latest insights and trends in cloud computing, DevOps, and career development, all in one place"
              categories={BLOG_CATEGORIES}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            {/* Featured Posts Section */}
            {selectedCategory === "All Articles" && featuredPosts.length > 0 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold">Featured Articles</h2>
                <div className="grid gap-8 md:grid-cols-2">
                  {featuredPosts.map((post) => (
                    <BlogCard key={post.id} post={post} featured />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Posts Grid */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {selectedCategory === "All Articles" ? "All Articles" : selectedCategory}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {regularPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
              
              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No articles found in this category.</p>
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
      <BackToTop />
    </div>
  );
};