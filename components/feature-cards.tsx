import { ArrowRight, CheckIcon, SparkleIcon, XIcon } from "lucide-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";

export default function FeatureCards() {
  return (
    <section className="text-white py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left column with headline */}
          <div className="lg:col-span-4">
            <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
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
              
              <CardSpotlight className="md:h-96 md:w-96 h-auto w-full" color="#34d399">
                <p className="text-xl font-bold relative font-serif z-20 mt-2 text-emerald-500">
                  With Clouddojo
                </p>
                <div className="text-neutral-200 mt-4 relative z-20">
                  You now have a clear path to success:
                  <ul className="list-none flex flex-col space-y-3  mt-3">
                    <Step reason="good" title="Real Exam Simulation" />
                    <Step reason="good" title="AI-Powered feedback report" />
                    <Step reason="good" title="Smart focus analystics" />
                    <Step reason="good" title="Modern performance dashboard" />
                  </ul>
                </div>
                <p className="text-neutral-300 mt-4 relative z-20 font-light">
                  Focus on what actually matters, save time, and build real
                  confidence for AWS, Azure, GCP, and more.
                </p>
              </CardSpotlight>

              {/* Card 2 */}
              
               <CardSpotlight className="md:h-96 md:w-96 h-auto w-full" color="#f87171">
                <p className="text-xl font-bold relative z-20 mt-2 font-serif text-red-500">
                  Without Clouddojo
                </p>
                <div className="text-neutral-200 mt-4 relative z-20">
                  You are left in the dark:
                  <ul className="list-none space-y-3 mt-3 flex flex-col">
                    <Step reason="bad" title="Keep scrolling endless pdf docs" />
                    <Step reason="bad" title="No clear path for success" />
                    <Step reason="bad" title="Studying the wrong topics" />
                    <Step reason="bad" title="Potentially re-taking the test" />
                  </ul>
                </div>
                <p className="text-neutral-300 mt-4 relative z-20 text-sm font-light">
                  Most cloud cert preps give you random questions and no real
                  strategy. You keep grinding... but don't know if you're really
                  ready.
                </p>
              </CardSpotlight>
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
      <p className="text-white">{title}</p>
    </li>
  );
};