"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/lib/hooks/use-debounce";

export default function SearchBar({
  onSearch,
}: {
  onSearch?: (query: string) => void;
}) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300); // 300ms debounce

  // Trigger search when debounced query changes
  useEffect(() => {
    if (onSearch) onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative py-1.5 flex w-full md:max-w-sm items-center"
    >
      <Input
        type="search"
        placeholder="Search tests..."
        className="pr-10"
        value={query}
        onChange={handleChange}
      />
      <div className="absolute right-2 top-0 h-full px-3 font-main flex items-center text-muted-foreground">
        <Search className="h-4 w-4" />
      </div>
    </form>
  );
}
