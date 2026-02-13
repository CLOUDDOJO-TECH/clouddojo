"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const sortOptions = [
  { id: "newest", label: "Newest" },
  { id: "popular", label: "Most Popular" },
  { id: "duration", label: "Duration" },
] as const;

const levelOptions = [
  { id: "all", label: "All Levels" },
  { id: "BEGINER", label: "Beginner" },
  { id: "INTERMEDIATE", label: "Intermediate" },
  { id: "ADVANCED", label: "Advanced" },
  { id: "EXPERT", label: "Expert" },
];

const topicOptions = [
  { id: "ec2", label: "EC2" },
  { id: "kubernetes", label: "Kubernetes" },
  { id: "docker", label: "Docker" },
];

type SortBy = "newest" | "popular" | "duration";

interface SortFilterPopoverProps {
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  onFilter: (filters: { topics: string[]; level: string }) => void;
}

export default function SortFilterPopover({
  sortBy,
  onSortChange,
  onFilter,
}: SortFilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [pendingSortBy, setPendingSortBy] = useState<SortBy>(sortBy);
  const [levelOpen, setLevelOpen] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);

  const activeCount =
    selectedTopics.length +
    (selectedLevel !== "all" ? 1 : 0) +
    (sortBy !== "newest" ? 1 : 0);

  const handleTopicChange = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleClear = () => {
    setSelectedTopics([]);
    setSelectedLevel("all");
    setPendingSortBy("newest");
    onSortChange("newest");
    onFilter({ topics: [], level: "all" });
    setIsOpen(false);
  };

  const handleApply = () => {
    onSortChange(pendingSortBy);
    onFilter({ topics: selectedTopics, level: selectedLevel });
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setPendingSortBy(sortBy);
    }
    setIsOpen(open);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-9 gap-1.5 px-3">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline-flex text-sm">Sort & Filter</span>
          {activeCount > 0 && (
            <Badge
              variant="secondary"
              className="rounded-full px-1.5 py-0 text-xs min-w-[1.25rem] flex items-center justify-center"
            >
              {activeCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-4 mx-4 mt-2 rounded-xl" align="end">
        <div className="space-y-4">
          {/* Sort By */}
          <div>
            <h4 className="font-medium text-sm mb-2">Sort by</h4>
            <RadioGroup
              value={pendingSortBy}
              onValueChange={(v) => setPendingSortBy(v as SortBy)}
              className="flex flex-col space-y-1"
            >
              {sortOptions.map((opt) => (
                <div key={opt.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt.id} id={`sort-${opt.id}`} />
                  <Label
                    htmlFor={`sort-${opt.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Level */}
          <div>
            <button
              type="button"
              onClick={() => setLevelOpen(!levelOpen)}
              className="flex items-center justify-between w-full"
            >
              <h4 className="font-medium text-sm">Level</h4>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${levelOpen ? "rotate-180" : ""}`} />
            </button>
            {levelOpen && (
              <RadioGroup
                value={selectedLevel}
                onValueChange={setSelectedLevel}
                className="flex flex-col space-y-1 mt-2"
              >
                {levelOptions.map((level) => (
                  <div key={level.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={level.id} id={`level-${level.id}`} />
                    <Label
                      htmlFor={`level-${level.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {level.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          <Separator />

          {/* Topics */}
          <div>
            <button
              type="button"
              onClick={() => setTopicsOpen(!topicsOpen)}
              className="flex items-center justify-between w-full"
            >
              <h4 className="font-medium text-sm">Topics</h4>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${topicsOpen ? "rotate-180" : ""}`} />
            </button>
            {topicsOpen && (
              <div className="flex flex-col space-y-1.5 mt-2">
                {topicOptions.map((topic) => (
                  <div key={topic.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`topic-${topic.id}`}
                      checked={selectedTopics.includes(topic.id)}
                      onCheckedChange={() => handleTopicChange(topic.id)}
                    />
                    <Label
                      htmlFor={`topic-${topic.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {topic.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-sm h-8"
            >
              Clear
            </Button>
            <Button size="sm" onClick={handleApply} className="text-sm h-8">
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
