"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SmartArrayInputProps {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  required?: boolean;
  description?: string;
  maxItems?: number;
  suggestions?: string[];
  className?: string;
}

export function SmartArrayInput({
  label,
  value,
  onChange,
  placeholder = "Type and press Enter",
  required = false,
  description,
  maxItems,
  suggestions = [],
  className,
}: SmartArrayInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse various array formats
  const parseArrayInput = (text: string): string[] => {
    // Remove common array brackets and quotes
    let cleaned = text
      .replace(/^\[|\]$/g, "") // Remove [ and ] at start/end
      .replace(/^{|}$/g, "") // Remove { and } at start/end
      .replace(/^"(.*)"$/g, "$1") // Remove surrounding quotes
      .replace(/^'(.*)'$/g, "$1"); // Remove surrounding single quotes

    // Split by common delimiters
    const delimiters = /[,;\n\r]+/;
    const items = cleaned
      .split(delimiters)
      .map(
        (item) =>
          item
            .trim()
            .replace(/^["']|["']$/g, "") // Remove quotes from each item
            .replace(/^-\s*/, "") // Remove leading dash (markdown lists)
            .replace(/^\*\s*/, "") // Remove leading asterisk
            .replace(/^\d+\.\s*/, ""), // Remove numbered list prefix
      )
      .filter((item) => item.length > 0);

    return items;
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");

    // Check if it looks like an array or list
    if (
      pastedText.includes(",") ||
      pastedText.includes("\n") ||
      pastedText.includes(";") ||
      pastedText.match(/^\[.*\]$/) ||
      pastedText.match(/^{.*}$/)
    ) {
      e.preventDefault();
      const parsedItems = parseArrayInput(pastedText);

      // Add all parsed items
      if (parsedItems.length > 0) {
        const newItems = [...value, ...parsedItems];
        const uniqueItems = Array.from(new Set(newItems)); // Remove duplicates
        const limitedItems = maxItems
          ? uniqueItems.slice(0, maxItems)
          : uniqueItems;
        onChange(limitedItems);
        setInputValue("");
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addItem(inputValue.trim());
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      // Remove last item if backspace on empty input
      removeItem(value.length - 1);
    }
  };

  const addItem = (item: string) => {
    if (!item.trim()) return;

    // Check for duplicates
    if (value.includes(item)) {
      setInputValue("");
      return;
    }

    // Check max items
    if (maxItems && value.length >= maxItems) {
      setInputValue("");
      return;
    }

    onChange([...value, item]);
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleSuggestionClick = (suggestion: string) => {
    addItem(suggestion);
    inputRef.current?.focus();
  };

  // Filter suggestions based on input
  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(s),
  );

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      <div className="space-y-2">
        {/* Display current items */}
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/50 dark:bg-muted/20 dark:border-muted">
            {value.map((item, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="gap-1 pr-1 pl-3 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 dark:border-emerald-500/30 hover:bg-emerald-500/20 dark:hover:bg-emerald-500/30"
              >
                {item}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 hover:bg-destructive/20 dark:hover:bg-destructive/30"
                  onClick={() => removeItem(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Input field */}
        <div className="relative">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onFocus={() => setShowSuggestions(inputValue.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            disabled={maxItems ? value.length >= maxItems : false}
          />

          {/* Suggestions dropdown */}
          {showSuggestions &&
            filteredSuggestions.length > 0 &&
            suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-background dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg shadow-lg dark:shadow-2xl max-h-48 overflow-y-auto">
                {filteredSuggestions.slice(0, 10).map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted dark:hover:bg-zinc-800 transition-colors border-b dark:border-zinc-800 last:border-b-0"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
        </div>

        {/* Helper text */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Press <kbd className="px-1.5 py-0.5 bg-muted rounded">Enter</kbd> to
            add • Paste array or list to auto-parse
          </span>
          {maxItems && (
            <span>
              {value.length}/{maxItems}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
