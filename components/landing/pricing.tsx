import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-center text-4xl font-semibold lg:text-5xl">
            Become a Cloud expert for a fraction of the price
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose the plan that fits your AWS certification journey. Start free and upgrade as you progress.
          </p>
        </div>

        <div className="mt-8 grid gap-6 [--color-card:var(--color-muted)] *:border-none *:shadow-none md:mt-20 md:grid-cols-3 dark:[--color-muted:var(--color-zinc-900)]">
          <Card className="bg-muted flex flex-col">
            <CardHeader>
              <CardTitle className="font-medium">Free</CardTitle>
              <span className="my-3 block text-2xl font-semibold">$0</span>
              <CardDescription className="text-sm">Perfect for getting started</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "50 practice tests",
                  "Basic flashcards",
                  "Community access",
                  "Weekly newsletter",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto">
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">Get Started Free</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-muted relative">
            <span className="absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full bg-gradient-to-r from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/20">
              Most Popular
            </span>

            <div className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-medium">Pro</CardTitle>
                <span className="my-3 block text-2xl font-semibold">
                  US$8.99
                </span>
                <CardDescription className="text-sm">
                  Per month/user
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <hr className="border-dashed border-primary" />
                <p className="text-sm text-muted-foreground">For serious exam preparation</p>
                <ul className="list-outside space-y-3 text-sm">
                  {[
                    "Unlimited practice tests",
                    "AI Coach with personalized study plans",
                    "Advanced analytics & progress tracking",
                    "Downloadable PDF reports",
                    "Premium flashcards with spaced repetition",
                    "Practice test simulations (timed, exam-like)",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="size-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/dashboard">Start Pro Trial</Link>
                </Button>
              </CardFooter>
            </div>
          </Card>

          <Card className="bg-muted flex flex-col">
            <CardHeader>
              <CardTitle className="font-medium">Gold</CardTitle>
              <span className="my-3 block text-2xl font-semibold">
                US$14.99
              </span>
              <CardDescription className="text-sm">Per month/user</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />
              <p className="text-sm text-muted-foreground">For power users & teams</p>

              <ul className="list-outside space-y-3 text-sm">
                {[
                  "Everything in Pro",
                  "Live 1:1 coaching sessions (monthly)",
                  "Custom study roadmaps",
                  "Priority support",
                  "Early access to new content",
                  "Job placement assistance",
                  "Shareable certificates",
                  "Team/group features",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto">
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard">Contact Sales</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
