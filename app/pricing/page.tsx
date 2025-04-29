import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground text-lg">
          Choose the plan that's right for your AWS certification journey.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <Tabs defaultValue="monthly" className="w-[250px]">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pro Plan */}
        <Card className="border shadow-sm hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="text-2xl">CloudDojo Pro</CardTitle>
            <p className="text-muted-foreground text-sm mt-2">
              Everything you need to pass your AWS exam.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div>
              <span className="text-4xl font-bold">$10</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
            <ul className="space-y-3">
              {[
                "Unlimited access to all practice tests",
                "Track your progress and identify weak areas",
                "Flashcard system to memorize key concepts",
                "Downloadable PDF reports",
                "Fast-track your certification preparation",
                "14-day money-back guarantee"
              ].map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckIcon className="text-emerald-500 w-5 h-5 mt-1" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full mt-4">Get Started</Button>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className="border-2 border-emerald-500 shadow-md hover:shadow-lg transition bg-emerald-50/30 dark:bg-emerald-900/10">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">CloudDojo Premium</CardTitle>
              <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full px-3 py-1 text-xs font-semibold">
                Recommended
              </span>
            </div>
            <p className="text-muted-foreground text-sm mt-2">
              Master AWS. Ace your exam. Land your dream role.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div>
              <span className="text-4xl font-bold">$15.99</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
            <ul className="space-y-3">
              {[
                "Everything included in the Pro Plan",
                "Advanced analytics to crush your weak points",
                "AI-powered explanations for every question",
                "Realistic mock interviews to prepare with confidence",
                "Personalized study roadmap tailored to your goals",
                "Priority support: get your questions answered fast"
              ].map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckIcon className="text-emerald-500 w-5 h-5 mt-1" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600">
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Table */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Plan Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4">Feature</th>
                <th className="p-4">Pro</th>
                <th className="p-4">Premium</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Unlimited practice tests", true, true],
                ["Progress tracking", true, true],
                ["Flashcard system", true, true],
                ["Downloadable PDF reports", true, true],
                ["Advanced analytics", false, true],
                ["AI-powered explanations", false, true],
                ["Mock interviews", false, true],
                ["Priority support", false, true]
              ].map(([feature, pro, premium], idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-4 font-medium">{feature}</td>
                  <td className="p-4">{pro ? <CheckIcon className="text-emerald-500" /> : "-"}</td>
                  <td className="p-4">{premium ? <CheckIcon className="text-emerald-500" /> : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-12 text-center text-sm text-muted-foreground">
        All plans come with a 14-day money-back guarantee. No questions asked.
      </p>
    </div>
  )
}
