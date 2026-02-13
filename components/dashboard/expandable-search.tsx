"use client";

import { useRef, useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface ExpandableSearchProps {
  onSearch: (query: string) => void;
}

export default function ExpandableSearch({ onSearch }: ExpandableSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleExpand = () => {
    setIsExpanded(true);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleClear = () => {
    setQuery("");
    setIsExpanded(false);
  };

  const handleBlur = () => {
    if (query === "") {
      setIsExpanded(false);
    }
  };

  return (
    <div
      onClick={() => !isExpanded && handleExpand()}
      className={cn(
        "inline-flex items-center h-9 rounded-md text-sm font-medium cursor-pointer",
        "bg-background hover:bg-muted/50 dark:ring-input border-input/50 dark:border-input",
        "relative border border-b-2 shadow-sm shadow-zinc-950/15 ring-1 ring-zinc-300",
        "overflow-hidden transition-[width] duration-300 ease-in-out",
        isExpanded ? "w-48 md:w-56" : "w-9"
      )}
    >
      <div className="flex items-center justify-center shrink-0 w-9 h-9">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search tests..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={handleBlur}
        className={cn(
          "h-full bg-transparent text-sm outline-none placeholder:text-muted-foreground min-w-0",
          "transition-[width,opacity] duration-300 ease-in-out",
          isExpanded ? "w-full pr-1 opacity-100" : "w-0 opacity-0"
        )}
        tabIndex={isExpanded ? 0 : -1}
      />
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.stopPropagation();
          handleClear();
        }}
        className={cn(
          "p-1 mr-1 rounded-sm hover:bg-muted shrink-0",
          "transition-opacity duration-200",
          isExpanded && query ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        tabIndex={-1}
      >
        <X className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    </div>
  );
}
