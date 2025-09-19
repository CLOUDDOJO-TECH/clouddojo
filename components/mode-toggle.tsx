"use client"

import { useState, useEffect } from "react"
import { MoonIcon, SunIcon } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"
import { useTheme } from "next-themes"

export default function ModeToggle() {
  const [mounted, setMounted] = useState(false)
  const { setTheme, theme } = useTheme()

  // Prevent hydration mismatch by waiting for client mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="size-9 rounded-xl border border-foreground/50 dark:border-none" />
    )
  }

  const isDark = theme === "dark"
  
  return (
    <div>
      <Toggle
        variant="outline"
        className="group data-[state=on]:hover:bg-muted size-9 data-[state=on]:bg-transparent rounded-xl border-foreground/50 dark:border-none"
        pressed={isDark}
        onPressedChange={() =>
          setTheme(isDark ? "light" : "dark")
        }
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        {/* Note: After dark mode implementation, rely on dark: prefix rather than group-data-[state=on]: */}
        <MoonIcon
          size={16}
          className="shrink-0 scale-0 opacity-0 transition-all text-black dark:text-gray-50 group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
          aria-hidden="true"
        />
        <SunIcon
          size={16}
          className="absolute shrink-0 scale-100 opacity-100 transition-all text-black dark:text-gray-50 group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
          aria-hidden="true"
        />
      </Toggle>
    </div>
  )
}
