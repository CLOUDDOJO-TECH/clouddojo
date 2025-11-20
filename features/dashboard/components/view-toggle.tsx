"use client"

import { useState } from "react"
import { LayoutGrid, List } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ViewToggle({ onChange }: { onChange?: (view: "grid" | "list") => void }) {
  const [view, setView] = useState<"grid" | "list">("grid")

  const handleViewChange = (value: string) => {
    if (value === "grid" || value === "list") {
      setView(value)
      if (onChange) onChange(value)
    }
  }

  return (
    <ToggleGroup type="single" value={view} onValueChange={handleViewChange}>
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

