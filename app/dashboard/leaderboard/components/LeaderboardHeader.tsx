"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
    InfoIcon, 
    BarChart4, 
    Trophy, 
    TrendingUp, 
    LineChart, 
    BookOpen, 
    Clock 
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

/**
 * LeaderboardHeader component displays the title and info dialog
 */
export function LeaderboardHeader() {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="flex justify-between items-center mb-6 sm:mb-10">
            <div className="flex flex-col gap-1">
                <h1 className="md:text-2xl text-lg font-extrabold tracking-tight text-primary">
                    Leaderboard
                </h1>
                <p>Welcome to the arena of winners</p>
            </div>
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
                        <RankingFactor
                            icon={BarChart4}
                            title="Average Score (40%)"
                            description="Your mean performance across all attempts"
                            bgColor="bg-blue-100 dark:bg-blue-900/20"
                            textColor="text-blue-800 dark:text-blue-300"
                        />
                        <RankingFactor
                            icon={Trophy}
                            title="Best Score (20%)"
                            description="Your highest achievement on any attempt"
                            bgColor="bg-amber-100 dark:bg-amber-900/20"
                            textColor="text-amber-800 dark:text-amber-300"
                        />
                        <RankingFactor
                            icon={TrendingUp}
                            title="Improvement"
                            description="Your progress over time comparing recent to earlier scores"
                            bgColor="bg-emerald-100 dark:bg-emerald-900/20"
                            textColor="text-emerald-800 dark:text-emerald-300"
                        />
                        <RankingFactor
                            icon={LineChart}
                            title="Consistency"
                            description="How reliable your performance is across attempts"
                            bgColor="bg-violet-100 dark:bg-violet-900/20"
                            textColor="text-violet-800 dark:text-violet-300"
                        />
                        <RankingFactor
                            icon={BookOpen}
                            title="Quiz Count"
                            description="Total number of quizzes completed (up to 20 points)"
                            bgColor="bg-rose-100 dark:bg-rose-900/20"
                            textColor="text-rose-800 dark:text-rose-300"
                        />
                        <RankingFactor
                            icon={Clock}
                            title="Time Investment"
                            description="Total time spent on quizzes (up to 10 points)"
                            bgColor="bg-orange-100 dark:bg-orange-900/20"
                            textColor="text-orange-800 dark:text-orange-300"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

/**
 * Helper component for displaying individual ranking factors in the info dialog
 */
function RankingFactor({ 
    icon: Icon, 
    title, 
    description,
    bgColor,
    textColor
}: { 
    icon: React.ElementType; 
    title: string; 
    description: string;
    bgColor: string;
    textColor: string;
}) {
    return (
        <div className="flex items-start gap-2">
            <div className={`${bgColor} ${textColor} rounded-full p-1 mt-0.5`}>
                <Icon className="h-3 w-3" />
            </div>
            <div className="text-xs">
                <span className="font-medium text-foreground">{title}:</span> {description}
            </div>
        </div>
    );
}