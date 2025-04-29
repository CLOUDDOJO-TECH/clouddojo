import { ArrowRight, CheckIcon, SparkleIcon } from "lucide-react";

export default function FeatureCards() {
  return (
    <section className="text-white py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left column with headline */}
          <div className="lg:col-span-4">
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Tired of wasting time studying the wrong topics?
            </h2>
            <p className="text-gray-400 mb-6">
              Most cloud cert preps give you random questions and no real
              strategy. You keep grinding... but don't know if you're reall
              ready.
            </p>
          </div>

          {/* Right column with feature cards */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="bg-midnighttwo rounded-2xl p-6 border border-gray-800 flex flex-col h-full">
                <span className="flex items-center justify-start gap-4">
                  <div className="bg-[#111133] w-10 h-10 rounded-full flex items-center justify-center mb-4">
                    <ArrowRight className="h-5 w-5 text-[#4ecca3]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Real Exams simulation
                  </h3>
                </span>
                <ul className="list-disc pl-5 space-y-2">
                  <li className="text-gray-400 text-sm flex items-center gap-2">
                      <CheckIcon className="h-5 w-5 mr-2 text-emerald-500 mr-2" />
                    Targeted practice tests tailored to your cert
                  </li>
                  <li className="text-gray-400 text-sm flex items-center gap-2">
                      <CheckIcon className="h-5 w-5 mr-2 text-emerald-500 mr-2" />
                    Smart analystics that show where you're week
                  </li>
                  <li className="text-gray-400 text-sm flex items-center gap-2">
                      <CheckIcon className="h-5 w-5 mr-2 text-emerald-500 mr-2" />
                    performance dashboard that tracks your growth
                  </li>
                </ul>
              </div>

              {/* Card 2 */}
              <div className="bg-midnighttwo rounded-2xl p-6 border border-gray-800 flex flex-col h-full">
                <span className="flex items-center justify-start gap-4">
                  <div className="bg-[#111133] w-10 h-10 rounded-full flex items-center justify-center mb-4">
                    <SparkleIcon className="h-5 w-5 text-[#4ecca3]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    AI Powered Analysis
                  </h3>
                </span>
                <p className="text-gray-400 text-sm">
                  We've trained a custom AI Model to analyze your performance
                  and give you personalized feedback. It learns from your
                  mistakes and helps you focus on what matters most.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
