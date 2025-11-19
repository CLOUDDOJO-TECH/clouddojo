import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowUpRight } from "lucide-react";

interface TopMissedTopicsProps {
  topMissedTopics: Array<{
    topic: string;
    count: number;
    importance: string;
  }>;
}

export function TopMissedTopics({ topMissedTopics }: TopMissedTopicsProps) {
  return (
    <Card className="col-span-1 border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
          Top Missed Topics
        </CardTitle>
        <CardDescription>Focus on these areas to improve your score</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topMissedTopics.map((topic, index) => (
            <div key={index} className="flex items-center p-3 rounded-lg border">
              <div
                className={`w-2 h-10 rounded-full mr-3 ${
                  topic.importance === "High" ? "bg-red-500" : "bg-yellow-500"
                }`}
              ></div>
              <div className="flex-1">
                <div className="font-medium text-foreground">{topic.topic}</div>
                <div className="text-sm text-foreground/50 font-mono">Missed {topic.count} questions</div>
              </div>
              <Badge
                className={
                  topic.importance === "High" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                }
              >
                {topic.importance}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0">
          View detailed topic analysis
          <ArrowUpRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
} 