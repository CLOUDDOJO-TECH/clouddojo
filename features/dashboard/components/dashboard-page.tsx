"use client"

import { useState } from "react"
import { Bell, RefreshCcw } from "lucide-react"
import FilterComponent from "./filter-component"
import SearchBar from "./search-bar"
import { DateRangePicker } from "./date-range-picker"
import ViewToggle from "./view-toggle"
import PerformanceSection from "./performance-section"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import React from "react"

export default function DashboardPage() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(false)
  const [performanceData, setPerformanceData] = useState({
    totalAttempts: 5,
    averageScore: 78,
    highestScore: 92,
    scoreHistory: [
      { date: '2023-10-01', score: 65 },
      { date: '2023-10-10', score: 72 },
      { date: '2023-10-20', score: 78 },
      { date: '2023-10-30', score: 85 },
      { date: '2023-11-10', score: 92 },
    ]
  })

  // Define a stable function using useCallback
  const handleRefresh = React.useCallback(() => {
    setIsLoading(true);
    // Simulate data fetching
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []); // Empty dependency array since it doesn't depend on any props/state

  // Add effect to listen for refresh event
  React.useEffect(() => {
    const handleRefreshEvent = () => {
      handleRefresh();
    };
    
    window.addEventListener('performance-refresh-requested', handleRefreshEvent);
    
    return () => {
      window.removeEventListener('performance-refresh-requested', handleRefreshEvent);
    };
  }, [handleRefresh]);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                      3
                    </Badge>
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>New quiz available: AWS Lambda</DropdownMenuItem>
                  <DropdownMenuItem>Your score improved by 15%</DropdownMenuItem>
                  <DropdownMenuItem>New certification path unlocked</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh</span>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                <SearchBar onSearch={(query) => console.log("Searching for:", query)} />
                {/* <FilterComponent /> */}
              </div>
            </div>

            <TabsContent value="overview" className="mt-0">
              <div className="flex flex-col gap-6">
                {/* Performance Section with animated graph and stats */}
                <PerformanceSection 
                  hasAttempts={true}
                  stats={performanceData}
                  isLoading={isLoading}
                />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <DateRangePicker onDateRangeChange={(range) => console.log("Date range:", range)} />
                  <div className="flex justify-end md:justify-start">
                    <ViewToggle onChange={setView} />
                  </div>
                </div>

                <div
                  className={
                    view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-4"
                  }
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={`border rounded-lg p-4 ${view === "grid" ? "h-[200px]" : "h-[100px]"} 
                        flex items-center justify-center bg-card`}
                    >
                      {view === "grid" ? (
                        <div className="text-center">
                          <div className="text-lg font-medium">Quiz Module {i + 1}</div>
                          <div className="text-sm text-muted-foreground">Cloud Computing Fundamentals</div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center w-full px-4">
                          <div>
                            <div className="font-medium">Quiz Module {i + 1}</div>
                            <div className="text-sm text-muted-foreground">Cloud Computing Fundamentals</div>
                          </div>
                          <Button variant="outline" size="sm">
                            Start Quiz
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="h-[400px] flex items-center justify-center border rounded-lg">
                Analytics content would go here
              </div>
            </TabsContent>

            <TabsContent value="reports">
              <div className="h-[400px] flex items-center justify-center border rounded-lg">
                Reports content would go here
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

