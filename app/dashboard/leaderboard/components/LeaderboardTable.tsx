"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { LeaderboardEntry } from "../types";

interface LeaderboardTableProps {
  leaderboardData: LeaderboardEntry[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  getAvatarFallback: (firstName?: string, lastName?: string) => string;
}

/**
 * Component for displaying the full leaderboard table with search
 */
export function LeaderboardTable({ 
  leaderboardData, 
  searchTerm, 
  setSearchTerm,
  getAvatarFallback
}: LeaderboardTableProps) {
  // Exclude top 3 users for the table
  const filteredData = leaderboardData
    .slice(3)
    .filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
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
      {filteredData.length > 0 ? (
        <Card className="overflow-hidden shadow-lg border-0 bg-black/20 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/10 bg-transparent hover:bg-transparent">
                  <TableHead className="w-[60px] text-center text-xs text-muted-foreground">RANK</TableHead>
                  <TableHead className="text-xs text-muted-foreground">USER</TableHead>
                  <TableColumnHeader title="RANKING SCORE" tooltip="Overall ranking score combines average score (40%), best score (20%), improvement trend, consistency, quiz count, and time invested." className="hidden md:table-cell" />
                  <TableColumnHeader title="AVG SCORE" tooltip="Average score across all quiz attempts" className="hidden sm:table-cell" />
                  <TableColumnHeader title="BEST SCORE" tooltip="Highest score achieved on any quiz attempt" className="hidden lg:table-cell" />
                  <TableColumnHeader title="CONSISTENCY" tooltip="Measures how consistent performance is across attempts. Higher is better (less variation)." className="hidden lg:table-cell" />
                  <TableColumnHeader title="IMPROVEMENT" tooltip="How much scores are improving over time. Positive numbers indicate progress." className="hidden md:table-cell" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((user) => (
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
  );
}

/**
 * Enhanced table column header with tooltip
 */
function TableColumnHeader({ 
  title, 
  tooltip,
  className = ""
}: { 
  title: string; 
  tooltip: string;
  className?: string;
}) {
  return (
    <TableHead className={`text-center text-xs text-muted-foreground ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="flex items-center justify-center gap-1 w-full">
            {title} <InfoIcon className="h-3.5 w-3.5" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableHead>
  );
}