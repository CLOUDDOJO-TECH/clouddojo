"use client";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InfoIcon, Copy } from "lucide-react";

import { useEffect, useState } from "react";

// Define a type for the leaderboard data
interface LeaderboardEntry {
  userId: string;
  firstName: string;
  lastName: string;
  averageScore: number;        // Average of all attempts
  bestScore: number;           // Best single score
  improvementFactor: number;   // How much they've improved
  consistencyScore: number;    // How consistent their performance is
  totalQuizzes: number;        // Total number of attempts
  totalTimeSpent: number;      // Total time spent on quizzes
  overallRankingScore: number; // Combined ranking metric
  profileImageUrl?: string;    // Profile image URL from Clerk
}

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog
  const [timeRange, setTimeRange] = useState("daily"); // Default to daily

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch(`/api/leaderboard?timeRange=${timeRange}`);
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        const data = await response.json();
        setLeaderboardData(data);
      } catch (err) {
        // Use type assertion for error message
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [timeRange]);

  {/* Set default time range to daily */}
  useEffect(() => {
    setTimeRange("daily");
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error: {error}
      </div>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        No leaderboard data available.
      </div>
    );
  }

  const topThree = leaderboardData.slice(0, 3);
  const filteredRestOfTheLeaderboard = leaderboardData
    .slice(3)
    .filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getPodiumCardClass = (index: number) => {
    switch (index) {
      case 0:
        return "border-yellow-400 border-2 bg-yellow-50 dark:bg-yellow-900/30"; // Gold
      case 1:
        return "border-slate-400 border-2 bg-slate-50 dark:bg-slate-800/30"; // Silver
      case 2:
        return "border-yellow-600 border-2 bg-yellow-100/50 dark:bg-yellow-700/30"; // Bronze
      default:
        return "bg-card";
    }
  };

  const getAvatarFallback = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "U";
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6 sm:mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary">
          Leaderboard
        </h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full" aria-label="Ranking system information">
              <InfoIcon className="h-5 w-5 text-emerald-600" />
              <span className="sr-only">Ranking System Info</span>
              <p>How?</p>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                <InfoIcon className="h-5 w-5 text-emerald-600" />
                Enhanced Ranking System
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Our new comprehensive ranking system takes into account multiple factors to provide a more accurate reflection of your learning journey.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start gap-2">
                <div className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-full p-1 mt-0.5">
                  <InfoIcon className="h-3 w-3" />
                </div>
                <div className="text-xs">
                  <span className="font-medium text-foreground">Average Score (40%):</span> Your mean performance across all attempts
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-full p-1 mt-0.5">
                  <InfoIcon className="h-3 w-3" />
                </div>
                <div className="text-xs">
                  <span className="font-medium text-foreground">Best Score (20%):</span> Your highest achievement on any attempt
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-full p-1 mt-0.5">
                  <InfoIcon className="h-3 w-3" />
                </div>
                <div className="text-xs">
                  <span className="font-medium text-foreground">Improvement:</span> Your progress over time comparing recent to earlier scores
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-full p-1 mt-0.5">
                  <InfoIcon className="h-3 w-3" />
                </div>
                <div className="text-xs">
                  <span className="font-medium text-foreground">Consistency:</span> How reliable your performance is across attempts
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-full p-1 mt-0.5">
                  <InfoIcon className="h-3 w-3" />
                </div>
                <div className="text-xs">
                  <span className="font-medium text-foreground">Quiz Count:</span> Total number of quizzes completed (up to 20 points)
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-full p-1 mt-0.5">
                  <InfoIcon className="h-3 w-3" />
                </div>
                <div className="text-xs">
                  <span className="font-medium text-foreground">Time Investment:</span> Total time spent on quizzes (up to 10 points)
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Time Range Selection */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex rounded-lg border border-border overflow-hidden">
          <Button 
            variant={timeRange === "all" ? "default" : "ghost"} 
            className="rounded-none border-r border-border px-4"
            onClick={() => setTimeRange("all")}
          >
            All Time
          </Button>
          <Button 
            variant={timeRange === "daily" ? "default" : "ghost"}
            className="rounded-none border-r border-border px-4"
            onClick={() => setTimeRange("daily")}
          >
            Daily
          </Button>
          <Button 
            variant={timeRange === "weekly" ? "default" : "ghost"}
            className="rounded-none border-r border-border px-4"
            onClick={() => setTimeRange("weekly")}
          >
            Weekly
          </Button>
          <Button 
            variant={timeRange === "monthly" ? "default" : "ghost"}
            className="rounded-none px-4"
            onClick={() => setTimeRange("monthly")}
          >
            Monthly
          </Button>
        </div>
      </div>

      {/* Podium Section with 1st place in the middle and enhanced winner card */}
      {topThree.length > 0 && (
        <div className="mb-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {topThree.map((user, index) => {
              const medalEmoji = index === 0 ? "👑" : index === 1 ? "🥈" : "🥉";
              
              // Simple solid colors for each position
              const cardStyles = [
                // First place - Purple theme
                "bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700 text-purple-950 dark:text-purple-50",
                // Second place - Silver theme
                "bg-teal-100 dark:bg-teal-800 border-teal-300 dark:border-teal-600 text-teal-950 dark:text-teal-50",
                // Third place - Bronze theme
                "bg-amber-100 dark:bg-amber-900 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-50"
              ];
              
              // Order should be: 2nd (silver) | 1st (gold) | 3rd (bronze)
              // This reorders the cards for the podium view
              const orderClass = index === 0 
                ? "sm:order-2 sm:col-span-1 sm:translate-y-0 sm:scale-110 sm:z-10" // 1st place in middle
                : index === 1 
                ? "sm:order-1 sm:translate-y-4" // 2nd place on left
                : "sm:order-3 sm:translate-y-4"; // 3rd place on right
              
              return (
                <div 
                  key={user.userId}
                  className={`relative ${orderClass}`}
                >
                  <div 
                    className={`${cardStyles[index]} rounded-xl border p-5 backdrop-blur-sm transition-all hover:translate-y-[-3px] duration-300 h-full shadow-lg ${index === 0 ? 'shadow-purple-300/30 dark:shadow-purple-600/30' : ''}`}
                  >
                    {/* Special crown decoration for the winner */}
                    {index === 0 && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <div className="text-4xl">👑</div>
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* User info with Clerk profile image */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar 
                            className={`${index === 0 ? 'h-16 w-16 ring-4 ring-purple-300 dark:ring-purple-500' : 'h-14 w-14 ring-2'} ring-white/30 shadow-lg`}
                          >
                            {user.profileImageUrl ? (
                              <AvatarImage src={user.profileImageUrl} alt={`${user.firstName} ${user.lastName}`} />
                            ) : (
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName} ${user.lastName}`} />
                            )}
                            <AvatarFallback>{getAvatarFallback(user.firstName, user.lastName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className={`font-bold ${index === 0 ? 'text-xl' : 'text-lg'}`}>{user.firstName} {user.lastName}</h3>
                            <p className={`text-sm opacity-70`}>
                              {index === 0 ? "Champion" : `Rank #${index + 1}`}
                            </p>
                          </div>
                        </div>
                        <span className="text-2xl">{medalEmoji}</span>
                      </div>
                      
                      {/* More compact stats layout */}
                      <div className={`bg-white/20 dark:bg-black/20 rounded-lg p-3 backdrop-blur-sm mb-3 ${index === 0 ? 'border-2 border-purple-300/50 dark:border-purple-400/30' : ''}`}>
                        <div className="flex justify-between items-center">
                          <p className="font-medium">Ranking Score</p>
                          <p className={`font-bold ${index === 0 ? 'text-2xl' : 'text-xl'}`}>{user.overallRankingScore.toFixed(1)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/20 dark:bg-black/20 rounded-lg p-2 backdrop-blur-sm flex flex-col justify-between">
                          <p className="text-xs opacity-70">Average</p>
                          <p className="font-semibold">{user.averageScore.toFixed(1)}%</p>
                        </div>
                        
                        <div className="bg-white/20 dark:bg-black/20 rounded-lg p-2 backdrop-blur-sm flex flex-col justify-between">
                          <p className="text-xs opacity-70">Best</p>
                          <p className="font-semibold">{user.bestScore.toFixed(1)}%</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="bg-white/20 dark:bg-black/20 rounded-lg p-2 backdrop-blur-sm flex flex-col justify-between col-span-1">
                          <p className="text-xs opacity-70">Quizzes</p>
                          <p className="font-semibold">{user.totalQuizzes}</p>
                        </div>
                        
                        <div className="bg-white/20 dark:bg-black/20 rounded-lg p-2 backdrop-blur-sm flex flex-col justify-between col-span-2">
                          <p className="text-xs opacity-70">Improvement</p>
                          <p className={`font-semibold ${user.improvementFactor > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                            {user.improvementFactor > 0 ? "+" : ""}{user.improvementFactor.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      
                      {/* Special winner tag for 1st place */}
                      {index === 0 && (
                        <div className="absolute -right-2 -top-2 bg-amber-300 dark:bg-amber-500 text-amber-950 dark:text-amber-50 rounded-full px-3 py-1 text-xs font-bold transform rotate-12 shadow-lg">
                          #1 WINNER
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Leaderboard Table for the rest */}
      {leaderboardData.length > 3 && (
        <div>
          <h2 className="text-3xl font-bold text-center mb-6 sm:mb-8 text-secondary-foreground">
            Full Rankings
          </h2>
          <div className="mb-6 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-base py-2 px-4 border-border"
            />
          </div>
          {filteredRestOfTheLeaderboard.length > 0 ? (
            <Card className="overflow-hidden shadow-lg border-0 bg-black/20 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-white/10 bg-transparent hover:bg-transparent">
                      <TableHead className="w-[60px] text-center text-xs text-muted-foreground">RANK</TableHead>
                      <TableHead className="text-xs text-muted-foreground">USER</TableHead>
                      <TableHead className="text-center text-xs text-muted-foreground hidden md:table-cell">RANKING SCORE</TableHead>
                      <TableHead className="text-center text-xs text-muted-foreground hidden sm:table-cell">AVG SCORE</TableHead>
                      <TableHead className="text-center text-xs text-muted-foreground hidden lg:table-cell">BEST SCORE</TableHead>
                      <TableHead className="text-center text-xs text-muted-foreground hidden lg:table-cell">CONSISTENCY</TableHead>
                      <TableHead className="text-center text-xs text-muted-foreground hidden md:table-cell">IMPROVEMENT</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRestOfTheLeaderboard.map((user, idx) => (
                      <TableRow 
                        key={user.userId} 
                        className="border-b border-white/5 bg-transparent transition-colors hover:bg-white/5"
                      >
                        <TableCell className="text-center font-medium">
                          {leaderboardData.findIndex(u => u.userId === user.userId) + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-white/10">
                              {user.profileImageUrl ? (
                                <AvatarImage src={user.profileImageUrl} alt={`${user.firstName} ${user.lastName}`} />
                              ) : (
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName} ${user.lastName}`} />
                              )}
                              <AvatarFallback>{getAvatarFallback(user.firstName, user.lastName)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.firstName} {user.lastName}</p>
                              <p className="text-xs text-muted-foreground">Quizzes: {user.totalQuizzes}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center hidden md:table-cell">
                          <div className="text-primary font-medium">{user.overallRankingScore.toFixed(1)}</div>
                        </TableCell>
                        <TableCell className="text-center hidden sm:table-cell">
                          <div>{user.averageScore.toFixed(1)}%</div>
                        </TableCell>
                        <TableCell className="text-center hidden lg:table-cell">
                          <div>{user.bestScore.toFixed(1)}%</div>
                        </TableCell>
                        <TableCell className="text-center hidden lg:table-cell">
                          <div>{user.consistencyScore.toFixed(1)}</div>
                        </TableCell>
                        <TableCell className="text-center hidden md:table-cell">
                          <div className={user.improvementFactor > 0 ? "text-emerald-500" : "text-amber-500"}>
                            {user.improvementFactor > 0 ? "+" : ""}{user.improvementFactor.toFixed(1)}%
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          ) : (
            <div className="text-center py-10 text-lg text-muted-foreground">
              No users found matching your search.
            </div>
          )}
        </div>
      )}
       {leaderboardData.length <= 3 && leaderboardData.length > 0 && topThree.length === leaderboardData.length && (
         <div className="text-center py-10 text-lg text-muted-foreground">
           All users are on the podium!
         </div>
       )}
    </div>
  );
}
