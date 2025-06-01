"use client";

import { useEffect, useState } from "react";

// Define a type for the leaderboard data
interface LeaderboardEntry {
  userId: string;
  firstName: string;
  lastName: string;
  percentageScore: number;
  timeSpentSecs: number;
}

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch("/api/leaderboard");
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        const data = await response.json();
        setLeaderboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar components

// Define a type for the leaderboard data
interface LeaderboardEntry {
  userId: string;
  firstName: string;
  lastName: string;
  percentageScore: number;
  timeSpentSecs: number;
}

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch("/api/leaderboard");
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
      <h1 className="text-4xl font-extrabold tracking-tight text-center mb-6 sm:mb-10 text-primary">
        Leaderboard
      </h1>

      {/* Podium Section */}
      {topThree.length > 0 && (
        <div className="mb-10 sm:mb-16">
          <h2 className="text-3xl font-bold text-center mb-6 sm:mb-8 text-secondary-foreground">
            Top Performers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {topThree.map((user, index) => (
              <Card
                key={user.userId}
                className={`transform transition-all hover:scale-105 ${getPodiumCardClass(
                  index
                )} ${index === 1 ? 'lg:order-first sm:order-first' : ''} ${index === 0 ? 'lg:order-none sm:order-none' : ''} ${index === 2 ? 'lg:order-last sm:order-last' : ''}
                ${index === 0 ? 'lg:col-span-1 sm:col-span-2 lg:row-span-2 self-center' : 'lg:col-span-1 sm:col-span-1' }
                ${index === 0 ? 'min-h-[280px]' : 'min-h-[240px]'}`}
              >
                <CardHeader className="text-center pb-2 pt-4">
                  <div className="relative mx-auto mb-3">
                     <Avatar className={`w-20 h-20 border-4 ${
                       index === 0 ? "border-yellow-500" : index === 1 ? "border-slate-500" : "border-yellow-700"
                     }`}>
                       <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName} ${user.lastName}`} alt={`${user.firstName} ${user.lastName}`} />
                       <AvatarFallback className="text-2xl font-semibold">
                         {getAvatarFallback(user.firstName, user.lastName)}
                       </AvatarFallback>
                     </Avatar>
                     <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white ${
                        index === 0 ? "bg-yellow-500" : index === 1 ? "bg-slate-500" : "bg-yellow-700"
                      }`}>{index + 1}</div>
                  </div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold">
                    {user.firstName} {user.lastName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-1">
                  <p className="text-xl font-semibold text-primary">
                    Score: {user.percentageScore}%
                  </p>
                  <p className="text-md text-muted-foreground">
                    Time: {user.timeSpentSecs}s
                  </p>
                </CardContent>
              </Card>
            ))}
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
            <Card className="overflow-hidden shadow-lg">
              <Table>
                <TableCaption className="py-3 text-sm">
                  Leaderboard of all users. Search results are case-insensitive.
                </TableCaption>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[80px] sm:w-[100px] text-center font-semibold text-secondary-foreground">Rank</TableHead>
                    <TableHead className="font-semibold text-secondary-foreground">Name</TableHead>
                    <TableHead className="text-center font-semibold text-secondary-foreground hidden sm:table-cell">Score</TableHead>
                    <TableHead className="text-right font-semibold text-secondary-foreground">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRestOfTheLeaderboard.map((user) => (
                    <TableRow key={user.userId} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-center">
                        {leaderboardData.findIndex(u => u.userId === user.userId) + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName} ${user.lastName}`} alt={`${user.firstName} ${user.lastName}`} />
                            <AvatarFallback>{getAvatarFallback(user.firstName, user.lastName)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.firstName} {user.lastName}</span>
                        </div>
                        <div className="sm:hidden text-xs text-muted-foreground mt-1">Score: {user.percentageScore}%</div>
                      </TableCell>
                      <TableCell className="text-center hidden sm:table-cell">{user.percentageScore}%</TableCell>
                      <TableCell className="text-right">{user.timeSpentSecs}s</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
