"use client";

import { BlogPost } from "@/lib/blog-client";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/blog/${post.slug}`);
  };

  if (featured) {
    return (
      <div 
        onClick={handleClick}
        className="group relative overflow-hidden rounded-2xl cursor-pointer transition-transform hover:scale-[1.02] h-[400px]"
        style={{ backgroundImage: `url('${post.image}')` }}
      >
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${post.image}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 p-8 h-full flex flex-col justify-end text-white space-y-4">
          <div className="space-y-4">
            <Badge className="bg-white/20 text-white hover:bg-white/30 w-fit">
              🔥 Featured
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              {post.title}
            </h2>
            <p className="text-white/90 text-lg line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{post.readTime}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white group-hover:gap-3 transition-all">
              <span className="font-medium">Read Article</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article 
      onClick={handleClick}
      className="group cursor-pointer space-y-4 p-6 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 hover:border-foreground/30 hover:-translate-y-1"
    >
      <div className="aspect-video overflow-hidden rounded-lg bg-muted relative group-hover:scale-[1.02] transition-transform duration-300">
        <div 
          className="h-full w-full bg-cover bg-center relative"
          style={{ backgroundImage: `url('${post.image}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-3 right-3">
            <span className="text-2xl opacity-80">{post.category === "Cloud Computing" ? "☁️" : post.category === "DevOps" ? "⚙️" : post.category === "Tutorials" ? "📚" : post.category === "Career Tips" ? "💼" : post.category === "Industry News" ? "🚀" : "📰"}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {post.category}
          </Badge>
          {post.featured && (
            <Badge className="text-xs bg-orange-100 text-orange-800 hover:bg-orange-100">
              Featured
            </Badge>
          )}
        </div>
        
        <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        
        <p className="text-muted-foreground line-clamp-2">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.author?.avatar || "/images/authors/default.jpg"} />
              <AvatarFallback>{post.author?.name?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">{post.author?.name || "Unknown Author"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};