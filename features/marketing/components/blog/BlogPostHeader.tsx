"use client";

import { BlogPost } from "@/data/blog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { EyebrowComp } from "../ui/eyebrow-comp";

interface BlogPostHeaderProps {
  post: BlogPost;
}

export const BlogPostHeader = ({ post }: BlogPostHeaderProps) => {
  const router = useRouter();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <Button
        variant="ghost"
        onClick={() => router.push("/blog")}
        className="gap-2 p-0 h-auto text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to Blog
      </Button>

      {/* Hero Section */}
      <div className="space-y-6">
        <div className="space-y-4">
          <Badge variant="secondary">{post.category}</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            {post.excerpt}
          </p>
        </div>

        {/* Author and Meta Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-y">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.author?.avatar || "/images/authors/default.jpg"} />
              <AvatarFallback>{post.author?.name?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.author?.name || "Unknown Author"}</p>
              <p className="text-sm text-muted-foreground">
                {post.author?.role || "Author"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{post.readTime}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="gap-2 p-2"
            >
              <Share2 size={16} />
              Share
            </Button>
          </div>
        </div>

        {/* Tags */}
        {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <EyebrowComp key={`${tag}-${index}`} title={tag} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
