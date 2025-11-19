import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSubscription } from "@/hooks/use-subscription"

interface PracticeCardProps {
  title: string
  thumbnail?: string
  questionCount: number
  status: "not-started" | "in-progress" | "completed"
  href: string
}

  const { isPro, isPremium, planName, isLoading, isError } = useSubscription();
  
export function PracticeCard({ title, questionCount, status, thumbnail, href }: PracticeCardProps) {
  return (
    <Card className="overflow-hidden border-0 bg-transparent shadow-lg">
      <CardHeader className="relative p-0">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <div className="absolute inset-0 aws-card-bg opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-4 left-4">
            <Image src={ thumbnail ? thumbnail : "/aws-logo.png"} alt="AWS Logo" width={80} height={48} className="drop-shadow-lg" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="glass-effect rounded-b-lg p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-400">{questionCount} questions</p>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="glass-effect border-t border-border/50 p-4">
        <div className="flex w-full items-center justify-between">
          <div
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
              ${
                status === "completed"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : status === "in-progress"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-blue-500/20 text-blue-400"
              }`}
          >
            {status === "completed" ? "Completed" : status === "in-progress" ? "In Progress" : "Not Started"}
          </div>
          {
            status === "completed" ? (
              <p className="text-sm text-gray-400">Score: 85%</p>
            ) : status === "in-progress" ? (
              <p className="text-sm text-gray-400">Time Left: 30:00</p>
            ) : (
              <p className="text-sm text-gray-400">Ready to start?</p>
            )
          }
          <Link href={href}>
            <Button variant="secondary" className="ml-2 bg-white/10 text-white hover:bg-white/20">
              Start Practice
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

