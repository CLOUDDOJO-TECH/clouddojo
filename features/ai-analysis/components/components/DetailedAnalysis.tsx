import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, ChevronUp, ChevronDown } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { useState } from "react";

interface DetailedAnalysisProps {
  detailedAnalysis: string;
}

export function DetailedAnalysis({ detailedAnalysis }: DetailedAnalysisProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className="border-none shadow-lg mb-8">
      <CardHeader
        className="flex flex-row items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <LineChart className="h-5 w-5 mr-2 text-blue-600" />
          <div>
            <CardTitle>Detailed Analysis</CardTitle>
            <CardDescription>In-depth review of your performance by topic area</CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-transparent p-1">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="prose max-w-none bg-white p-6 rounded-lg border border-gray-100">
            <MarkdownRenderer content={detailedAnalysis} />
          </div>
        </CardContent>
      )}
    </Card>
  );
} 