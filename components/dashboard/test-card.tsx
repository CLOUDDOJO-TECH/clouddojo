"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DifficultyLevel, Quiz } from "@prisma/client"
import { BookmarkCheck, Clock, FileQuestion, ShieldBan, Zap } from "lucide-react"
import UpgradeButton from "../ui/upgrade-button"

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
  return (
    <Card className="overflow-hidden transition-all hover:shadow-xl group rounded-3xl relative h-[460px] border">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={test.thumbnail ? test.thumbnail : "/placeholder.svg?height=400&width=600"}
          alt={test.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
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
      <div className="absolute inset-0 flex flex-col justify-end p-5 z-10">
        {/* Level Badge */}
        <div className="mb-3">
          <Badge
            variant="outline"
            className={`${getLevelColor(test.level!)} backdrop-blur-sm bg-white/90 border-white/20`}
          >
            {test.level!.charAt(0).toUpperCase() + test.level!.slice(1).toLowerCase()}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-bold text-xl text-white mb-2 line-clamp-2 leading-tight">{test.title}</h3>

        {/* Description */}
        <p className="text-white/80 text-sm line-clamp-2 mb-4 font-mono leading-relaxed">{test.description}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-white/70 mb-4">
          <div className="flex items-center gap-1">
            <FileQuestion className="h-4 w-4 text-brand-beige-900" />
            <span className="font-serif">{questionsCount} questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-brand-beige-900" />
            <span className="font-serif">{test.duration} min</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          {test.free ? (
            <Button
              onClick={onStartTest}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-105"
            >
              Start Test
            </Button>
          ) : (
            <UpgradeButton className="mt-2" size="sm" variant="primary">Upgrade plan</UpgradeButton>
          )}
        </div>
      </div>
    </Card>
  )
}
