import { Blog } from "@/components/blog/Blog";
import { getAllBlogPosts } from "@/lib/mdx";

export const metadata = {
  title: "Blog | CloudDojo",
  description: "Stay updated on cloud technology with expert insights, tutorials, and industry trends from CloudDojo's blog.",
  openGraph: {
    title: "CloudDojo Blog",
    description: "Expert insights on cloud computing, DevOps, and career development",
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  return <Blog posts={posts} />;
}