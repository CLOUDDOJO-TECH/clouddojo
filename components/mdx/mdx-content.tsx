"use client";

import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { CustomComponents } from './mdx-components';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { useEffect, useState } from 'react';

interface MDXContentProps {
  content: string;
}

export function MDXContent({ content }: MDXContentProps) {
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const serializeContent = async () => {
      try {
        const serialized = await serialize(content, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeHighlight,
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: 'wrap' }],
            ],
            development: process.env.NODE_ENV === 'development',
          },
        });
        setMdxSource(serialized);
      } catch (error) {
        console.error('Error serializing MDX content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    serializeContent();
  }, [content]);

  if (isLoading) {
    return (
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
          <div className="h-4 bg-muted rounded w-4/5"></div>
        </div>
      </div>
    );
  }

  if (!mdxSource) {
    return (
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-muted-foreground">Error loading content.</p>
      </div>
    );
  }

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <MDXRemote {...mdxSource} components={CustomComponents} />
    </div>
  );
}