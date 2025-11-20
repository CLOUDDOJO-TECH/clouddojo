import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Lightbulb, Layers, CheckCircle, AlertCircle, BookOpen, ArrowUpRight } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface AIInsightsTabsProps {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  performanceHistory: {
    length: number;
  };
}

export function AIInsightsTabs({ strengths, weaknesses, recommendations, performanceHistory }: AIInsightsTabsProps) {
  return (
    <Card className="border-none shadow-lg mb-8">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-emerald-600" />
          AI-Generated Insights
        </CardTitle>
        <CardDescription>Personalized analysis and recommendations based on your test performance</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="overview" className="w-full overflow-hidden">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6 p-1 bg-muted/50">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white px-4 py-2 text-sm font-medium transition-all"
            >
              <Layers className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="strengths"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white px-4 py-2 text-sm font-medium transition-all"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Strengths
            </TabsTrigger>
            <TabsTrigger
              value="weaknesses"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white px-4 py-2 text-sm font-medium transition-all"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Weaknesses
            </TabsTrigger>
            <TabsTrigger
              value="recommendations"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white px-4 py-2 text-sm font-medium transition-all"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-14 md:mt-0 space-y-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4">
                  <Lightbulb className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">AI Analysis Summary</h3>
                  <p className="text-gray-600">
                    Reviewing your performance across the last {performanceHistory.length} tests. Check other tabs for detailed insights.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="strengths" className="mt-14 md:mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {strengths.map((strength, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-emerald-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-2 mr-3 flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="text-gray-700">{strength}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="weaknesses" className="mt-14 md:mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {weaknesses.map((weakness, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-blue-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-gray-700">{weakness}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-14 md:mt-0">
            <div className="space-y-4">
              {recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-full p-2 mr-4 flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-gray-700">{recommendation}</p>
                      <Button variant="link" className="text-emerald-600 hover:text-emerald-800 p-0 mt-2 h-auto">
                        View related resources
                        <ArrowUpRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 