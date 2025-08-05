interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Process the content to handle markdown elements
  const processedContent = content
    // Handle bold text with blue color
    .replace(/\*\*(.*?)\*\*/g, '<span class="text-foreground font-bold">$1</span>')
    // Handle headers with blue color
    .replace(/## (.*)/g, '<h2 class="text-xl font-bold mt-3 mb-2 text-foreground">$1</h2>')
    .replace(
      /> "(.*?)"/g,
      '<blockquote class="border-l-4 border-emerald-500 pl-4 italic my-2 py-2 text-foreground bg-emerald-50 rounded-r-md">$1</blockquote>',
    )
    .replace(
      /```([\s\S]*?)```/g,
      '<pre class="bg-gray-100 p-4 rounded-md my-2 overflow-x-auto font-mono text-sm border border-gray-200">$1</pre>',
    )
    // Reduce double newline spacing
    .replace(/\n\n/g, "<br/>")
    .replace(
      /\n([0-9]+)\. (.*)/g,
      '<div class="ml-6 my-2 flex"><span class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-foreground/60 text-sm font-medium mr-3">$1</span> <span>$2</span></div>',
    );

  return <div className="space-y-2" dangerouslySetInnerHTML={{ __html: processedContent }} />;
} 