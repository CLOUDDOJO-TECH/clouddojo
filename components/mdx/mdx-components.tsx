import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InfoIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";
import { PromoBanner } from "./PromoBanner";

// Custom components for MDX
const components: MDXComponents = {
  // Typography
  h1: ({ children, ...props }) => (
    <h1
      className="text-4xl text-primary font-bold tracking-tight mt-8 mb-6 first:mt-0 scroll-mt-20"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="text-3xl text-primary font-semibold tracking-tight mt-8 mb-4 scroll-mt-20"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="text-2xl text-primary font-semibold tracking-tight mt-6 mb-3 scroll-mt-20"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      className="text-xl text-primary font-semibold tracking-tight mt-6 mb-3 scroll-mt-20"
      {...props}
    >
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5
      className="text-lg text-primary font-semibold tracking-tight mt-4 mb-2 scroll-mt-20"
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6
      className="text-base text-primary font-semibold tracking-tight mt-4 mb-2 scroll-mt-20"
      {...props}
    >
      {children}
    </h6>
  ),

  // Paragraphs and text
  p: ({ children, ...props }) => (
    <p className="mb-4 leading-7 text-foreground/90" {...props}>
      {children}
    </p>
  ),

  // Lists
  ul: ({ children, ...props }) => (
    <ul className="mb-4 space-y-2 pl-6 list-disc" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mb-4 space-y-2 pl-6 list-decimal" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-7" {...props}>
      {children}
    </li>
  ),

  // Code blocks
  pre: ({ children, ...props }) => (
    <pre
      className="mb-6 overflow-x-auto rounded-lg bg-muted p-4 text-sm border"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }) => {
    const isInline = !className;

    if (isInline) {
      return (
        <code
          className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <code className={cn("font-mono text-sm", className)} {...props}>
        {children}
      </code>
    );
  },

  // Blockquotes
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mb-6 border-l-4 border-primary pl-6 italic text-muted-foreground"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Links
  a: ({ href, children, ...props }) => {
    // Check if this is a heading anchor link (has no href or href starts with #)
    const isHeadingAnchor = !href || href.startsWith("#");

    if (isHeadingAnchor) {
      return (
        <a
          href={href}
          className="no-underline hover:underline hover:underline-offset-4 transition-colors"
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <a
        href={href}
        className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },

  // Images
  img: ({ src, alt, ...props }) => (
    <Image
      src={src || ""}
      alt={alt || ""}
      width={800}
      height={400}
      className="rounded-lg border mb-6 max-w-full h-auto"
      {...props}
    />
  ),

  // Tables
  table: ({ children, ...props }) => (
    <div className="mb-6 overflow-x-auto">
      <table className="w-full border-collapse border border-border" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-muted" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
  tr: ({ children, ...props }) => (
    <tr className="border-b border-border" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th
      className="border border-border px-4 py-2 text-left font-semibold"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border border-border px-4 py-2" {...props}>
      {children}
    </td>
  ),

  // Horizontal rule
  hr: ({ ...props }) => <hr className="my-8 border-border" {...props} />,

  // Strong and emphasis
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
};

// Custom components for enhanced content
export const CustomComponents = {
  ...components,

  // Custom Alert component
  Alert: ({
    children,
    type = "info",
    title,
    ...props
  }: {
    children: React.ReactNode;
    type?: "info" | "warning" | "success" | "error";
    title?: string;
  }) => {
    const icons = {
      info: InfoIcon,
      warning: AlertTriangleIcon,
      success: CheckCircleIcon,
      error: XCircleIcon,
    };

    const Icon = icons[type];

    return (
      <Alert className="mb-6" {...props}>
        <Icon className="h-4 w-4" />
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>{children}</AlertDescription>
      </Alert>
    );
  },

  // Custom Card component
  InfoCard: ({
    title,
    description,
    children,
    ...props
  }: {
    title?: string;
    description?: string;
    children: React.ReactNode;
  }) => (
    <Card className="mb-6" {...props}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  ),

  // Code block with copy functionality
  CodeBlock: ({
    children,
    language,
    title,
    ...props
  }: {
    children: string;
    language?: string;
    title?: string;
  }) => (
    <div className="mb-6">
      {title && (
        <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-t-lg border border-b-0">
          <span className="text-sm font-mono text-muted-foreground">
            {title}
          </span>
          <Badge variant="outline" className="text-xs">
            {language || "code"}
          </Badge>
        </div>
      )}
      <pre
        className={cn(
          "overflow-x-auto bg-muted p-4 text-sm border font-mono",
          title ? "rounded-t-none" : "rounded-lg",
        )}
      >
        <code className={language ? `language-${language}` : ""}>
          {children}
        </code>
      </pre>
    </div>
  ),

  // Video component
  Video: ({ src, title, ...props }: { src: string; title?: string }) => (
    <div className="mb-6">
      <video
        controls
        className="w-full rounded-lg border"
        title={title}
        {...props}
      >
        <source src={src} />
        Your browser does not support the video tag.
      </video>
    </div>
  ),

  // Promotional Banner component
  PromoBanner,

  // Embed component for iframes
  Embed: ({
    src,
    title,
    height = "400",
    ...props
  }: {
    src: string;
    title?: string;
    height?: string;
  }) => (
    <div className="mb-6">
      <iframe
        src={src}
        title={title}
        height={height}
        className="w-full border rounded-lg"
        allowFullScreen
        {...props}
      />
    </div>
  ),
};

export default components;
