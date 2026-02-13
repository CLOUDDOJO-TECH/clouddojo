"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DifficultyLevel, Quiz } from "@prisma/client"
import { BookmarkCheck, Clock, FileQuestion, ShieldBan, Zap } from "lucide-react"
import IconLockFillDuo18 from "../icons/lock-fill-duo"
import { useSubscription } from "@/hooks/use-subscription"

interface QuizWithCategory {
    id: string;
    title: string;
    description?: string | null;
    thumbnail?: string | null;
    level?: DifficultyLevel | null;
    duration?: number | null;
    free?: boolean | null;
    isNew?: boolean | null;
    _count?: {
        questions: number;
    };
    category?: {
        id: string;
        name: string;
    } | null;
}

interface PracticeTestCardProps  {
    test: QuizWithCategory
    onStartTest: () => void;
    questionsCount: number;
}


const onStartTest = () => console.log("Starting test...")
const getLevelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case "beginner":
      return "border-green-500 text-green-700 bg-green-50"
    case "intermediate":
      return "border-yellow-500 text-yellow-700 bg-yellow-50"
    case "advanced":
      return "border-red-500 text-red-700 bg-red-50"
    default:
      return "border-gray-500 text-gray-700 bg-gray-50"
  }
}



export default function PracticeTestCard({questionsCount, test, onStartTest, }: PracticeTestCardProps) {
  const { isSubscribed } = useSubscription()
  return (
    <Card className="overflow-hidden transition-all hover:shadow-xl group rounded-2xl relative h-[340px] border">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={test.thumbnail ? test.thumbnail : "/placeholder.svg?height=400&width=600"}
          alt={test.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-background dark:via-background/80 dark:to-transparent" />
      </div>

      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start ">
        {test.free && (
          <Badge className="bg-yellow-400/90 text-yellow-900 border-0 backdrop-blur-sm">
            <BookmarkCheck className="mr-1 h-3 w-3" />
            New
          </Badge>
        )}
        {/* <div className="ml-auto">
          {hasAccess ? (
            <Badge className="bg-emerald-500/90 text-white border-0 backdrop-blur-sm">Free</Badge>
          ) : (
            <Badge className="bg-gradient-to-r from-purple-500/90 to-purple-600/90 text-white border-0 backdrop-blur-sm">
              <Zap className="w-3 h-3 mr-1" />
              Upgrade
            </Badge>
          )}
        </div> */}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 ">
        {/* Level Badge */}
        <div className="mb-2">
          <Badge
            variant="outline"
            className={`${getLevelColor(test.level!)} backdrop-blur-sm bg-white/90 border-white/20`}
          >
            {test.level!.charAt(0).toUpperCase() + test.level!.slice(1).toLowerCase()}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-foreground dark:text-white mb-1 line-clamp-2 leading-tight">{test.title}</h3>

        {/* Description */}
        <p className="text-muted-foreground dark:text-white/80 text-xs line-clamp-2 mb-3 font-mono leading-relaxed">{test.description}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground dark:text-white/70 mb-3">
          <div className="flex items-center gap-1">
            <FileQuestion className="h-3.5 w-3.5 text-muted-foreground dark:text-brand-beige-900" />
            <span className="font-serif">{questionsCount} questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-muted-foreground dark:text-brand-beige-900" />
            <span className="font-serif">{test.duration} min</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          {test.free || isSubscribed ?  (
            <Button onClick={onStartTest} size="sm">
              Start Test
            </Button>
          ) : (
            <Button onClick={() => window.location.href = "/dashboard/billing"} size="sm" className="bg-gradient-to-t from-amber-600 to-amber-500 hover:brightness-110 text-white border-amber-700/40 shadow-md shadow-amber-900/20">
              <IconLockFillDuo18 size="14px" />
              Upgrade plan
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
