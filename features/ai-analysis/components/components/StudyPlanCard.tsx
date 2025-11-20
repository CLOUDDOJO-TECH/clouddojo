import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface StudyPlanCardProps {
  title: string
  description: string
  resources: string[]
  priority: "High" | "Medium" | "Low"
}

export function StudyPlanCard({ title, description, resources, priority }: StudyPlanCardProps) {
  const priorityColor =
    priority === "High"
      ? "bg-red-100 text-red-800 border-red-200"
      : priority === "Medium"
        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
        : "bg-blue-100 text-blue-800 border-blue-200"

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow h-auto">
      <div className="p-4">
        <Badge className={`mb-3 ${priorityColor}`}>{priority} Priority</Badge>
        <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 font-serif text-sm mb-4">{description}</p>
        <Separator className="my-3" />
        <h4 className="text-sm font-medium text-gray-700 mb-2">Recommended Resources:</h4>
        <ul className="space-y-2">
          {resources.map((resource: string, index: number) => (
            <li key={index} className="flex items-start">
              <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-2 mt-0.5" />
              <a href={resource} target="_blank" rel="noopener noreferrer" className="text-sm font-mono tracking-tighter text-gray-600 cursor-pointer hover:text-blue-400">
                {resource}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <Button variant="link" className="text-emerald-600 hover:text-emerald-800 p-0 h-auto text-sm">
          View detailed curriculum
        </Button>
      </div>
    </div>
  )
} 