import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BookMarked } from "lucide-react";
import { StudyPlanCard } from "./StudyPlanCard";

interface StudyPlan {
  title: string;
  description: string;
  resources: string[];
  priority: "High" | "Medium" | "Low";
}

interface PersonalizedStudyPlanProps {
  studyPlan: StudyPlan[];
}

export function PersonalizedStudyPlan({ studyPlan }: PersonalizedStudyPlanProps) {
  if (!studyPlan || studyPlan.length === 0) return null;

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookMarked className="h-5 w-5 mr-2 text-emerald-600" />
          Personalized Study Plan
        </CardTitle>
        <CardDescription>Based on your performance, we recommend the following study plan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studyPlan.map((planItem, index) => (
            <StudyPlanCard
              key={index}
              title={planItem.title}
              description={planItem.description}
              resources={planItem.resources}
              priority={planItem.priority}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 