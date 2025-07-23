import { ArrowRight, CheckIcon, SparkleIcon, XIcon } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

export default function FeatureCards() {
  return (
    <section className="text-white py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left column with headline */}
          <div className="lg:col-span-4">
            <h2 className="text-foreground/80 text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Tired of wasting time studying the wrong topics?
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
              Most cloud cert preps give you random questions and no real
              strategy. You keep grinding... but don't know if you're reall
              ready.
            </p>
          </div>

          {/* Right column with feature cards */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 */}
              

              {/* Card 2 */}
              <Card className="md:h-96 h-auto w-full border-red-500/20 hover:shadow-md hover:shadow-red-100 bg-white dark:bg-black/40 backdrop-blur-sm">
                <CardHeader>
                  <p className="text-xl font-bold font-mono text-red-500">
                    Without Clouddojo
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="text-foreground">
                    Common User Challenges:
                    <ul className="list-none space-y-3 mt-3 flex flex-col">
                      <Step reason="bad" title="Too much to study" />
                      <Step reason="bad" title="I don't know if I'm ready for the exams" />
                      <Step reason="bad" title="I don't have much time to study all the topics" />
                      <Step reason="bad" title="I don't know what I don't know" />
                    </ul>
                  </div>
                  <p className="text-neutral-300 mt-4 text-sm font-light">
                    Most cloud cert preps give you random questions and no real
                    strategy. You keep grinding... but don't know if you're really
                    ready.
                  </p>
                </CardContent>
              </Card>

              <Card className="md:h-96 h-auto w-full border-emerald-500/20 bg-white hover:shadow-md hover:shadow-emerald-100 dark:bg-black/40 backdrop-blur-sm">
                <CardHeader>
                  <p className="text-xl font-bold font-mono text-emerald-500">
                    With Clouddojo
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="text-foregroung">
                    We're fixing these with:
                    <ul className="list-none flex flex-col space-y-3 mt-3">
                      <Step reason="good" title="Turn 700 pages into a 20 hour roadmap" />
                      <Step reason="good" title="Know your exact % chance of passing today" />
                      <Step reason="good" title="Study in the 12-minute gaps you didn't know you had" />
                      <Step reason="good" title="Click once-get a laser-focused fix list" />
                    </ul>
                  </div>
                  <p className="text-neutral-300 mt-4 font-light">
                    Focus on what actually matters, save time, and build real
                    confidence for AWS, Azure, GCP, and more.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const Step = ({ title, reason }: { title: string, reason: "good" | "bad" }) => {
  return (
    <li className="flex gap-2 items-start">
      {reason == "good" ? (
        <CheckIcon className="text-emerald-500" />
      ): (
        <XIcon className="text-red-500" />
      )}
      <p className="text-foreground/80 font-mono">{title}</p>
    </li>
  );
};