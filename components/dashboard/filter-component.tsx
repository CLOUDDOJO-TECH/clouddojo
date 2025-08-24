"use client";

import { useState } from "react";
import { Check, X, ChevronDown, Filter } from "lucide-react";

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

// Define our filter options
const topicOptions = [
  { id: "aws", label: "AWS" },
  { id: "ec2", label: "EC2" },
  { id: "google-cloud", label: "Google" },
  { id: "azure", label: "Azure" },
  { id: "kubernetes", label: "Kubernetes" },
  { id: "docker", label: "Docker" },
];

const levelOptions = [
  { id: "all", label: "All Levels" },
  { id: "BEGINER", label: "Beginner" },
  { id: "INTERMEDIATE", label: "Intermediate" },
  { id: "ADVANCED", label: "Advanced" },
  { id: "EXPERT", label: "Expert" },
];

interface FilterComponentProps {
  onFilter: (filters: { topics: string[]; level: string }) => void;
}

export default function FilterComponent({ onFilter }: FilterComponentProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [isOpen, setIsOpen] = useState(false);

  const handleTopicChange = (topicId: string) => {
    const newTopics = selectedTopics.includes(topicId)
      ? selectedTopics.filter((id) => id !== topicId)
      : [...selectedTopics, topicId];
    setSelectedTopics(newTopics);
    onFilter({ topics: newTopics, level: selectedLevel });
  };

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    onFilter({ topics: selectedTopics, level: value });
  };

  const clearFilters = () => {
    setSelectedTopics([]);
    setSelectedLevel("all");
    onFilter({ topics: [], level: "all" });
  };

  const applyFilters = () => {
    onFilter({ topics: selectedTopics, level: selectedLevel });
    setIsOpen(false);
  };

  const activeFilterCount =
    selectedTopics.length + (selectedLevel !== "all" ? 1 : 0);

  return (
    <div className="flex flex-col md:flex-row items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-9 px-3 lg:px-4 gap-1">
            <Filter className="h-4 w-4" />
            <span className="hidden md:inline-flex">Filters</span>
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 hidden md:block rounded-full px-1 py-0 text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
            <ChevronDown className="h-4 hidden md:block w-4 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[320px] p-4 mx-6 mt-2 rounded-xl"
          align="end"
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Topics</h4>
              <div className="grid grid-cols-2 gap-1.5">
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
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Level</h4>
              <RadioGroup
                value={selectedLevel}
                onValueChange={handleLevelChange}
                className="flex flex-col space-y-1"
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
            </div>

            <Separator />

            <div className="flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-sm h-8"
              >
                Clear
              </Button>
              <Button size="sm" onClick={applyFilters} className="text-sm h-8">
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1.5 font-main items-end justify-end">
          {selectedTopics.map((topicId) => {
            const topic = topicOptions.find((t) => t.id === topicId);
            return (
              <Badge
                key={topicId}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {topic?.label}
                <button
                  onClick={() => handleTopicChange(topicId)}
                  className="ml-1 rounded-full hover:bg-muted p-0.5"
                >
                  <X className="h-3 w-3 text-primary" />
                </button>
              </Badge>
            );
          })}

          {selectedLevel !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {levelOptions.find((l) => l.id === selectedLevel)?.label}
              <button
                onClick={() => setSelectedLevel("all")}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                <Check className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
