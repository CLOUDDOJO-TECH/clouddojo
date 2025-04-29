import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Integration() {
  return (
    <section className="container py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h3 className="text-xl font-semibold mb-3">Seamless Integration with Your Workflow</h3>
          <p className="text-gray-400 mb-4">
            CloudPeak integrates with your existing tools and workflows to provide a seamless learning experience.
          </p>

          <p className="text-gray-400 mb-6">
            Whether you're using Jira, Slack, or other tools, CloudPeak works with your existing setup.
          </p>

          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm flex items-center gap-2">
            Learn More <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="bg-midnight-light/10 border border-midnight-light/20 rounded-xl p-6 h-[300px] flex items-center justify-center">
          {/* Radar chart visualization */}
          <div className="relative w-[250px] h-[250px]">
            <div className="absolute inset-0 border border-gray-700 rounded-full"></div>
            <div className="absolute inset-[20%] border border-gray-700 rounded-full"></div>
            <div className="absolute inset-[40%] border border-gray-700 rounded-full"></div>

            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                d="M50,50 L90,50 L75,15 L50,10 L25,30 L20,70 Z"
                fill="rgba(59, 130, 246, 0.3)"
                stroke="#3b82f6"
                strokeWidth="1"
              />
              <circle cx="50" cy="50" r="2" fill="#3b82f6" />
              <circle cx="90" cy="50" r="2" fill="#3b82f6" />
              <circle cx="75" cy="15" r="2" fill="#3b82f6" />
              <circle cx="50" cy="10" r="2" fill="#3b82f6" />
              <circle cx="25" cy="30" r="2" fill="#3b82f6" />
              <circle cx="20" cy="70" r="2" fill="#3b82f6" />
            </svg>

            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-xs text-gray-400">
              Performance
            </div>
            <div className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 text-xs text-gray-400">Speed</div>
            <div className="absolute bottom-0 right-1/4 translate-y-4 text-xs text-gray-400">Reliability</div>
            <div className="absolute bottom-0 left-1/4 translate-y-4 text-xs text-gray-400">Security</div>
            <div className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 text-xs text-gray-400">
              Scalability
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="bg-midnight-light/10 border border-midnight-light/20 rounded-xl p-6 h-[300px] flex items-center justify-center order-2 md:order-1">
          {/* Line chart visualization */}
          <div className="w-full max-w-[300px]">
            <div className="h-[200px] relative">
              <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                <path
                  d="M0,40 C10,35 20,45 30,30 C40,15 50,25 60,20 C70,15 80,5 90,10 L90,50 L0,50 Z"
                  fill="rgba(59, 130, 246, 0.1)"
                  stroke="none"
                />
                <path
                  d="M0,40 C10,35 20,45 30,30 C40,15 50,25 60,20 C70,15 80,5 90,10"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="1"
                />
              </svg>
            </div>
            <div className="h-[1px] w-full bg-gray-700 mt-1 mb-2"></div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Jan</span>
              <span className="text-xs text-gray-500">Dec</span>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <h3 className="text-xl font-semibold mb-3">Expert Guidance Every Step of the Way</h3>
          <p className="text-gray-400 mb-4">
            Our team of cloud experts is here to guide you through your certification journey.
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-blue-400">120k+</span>
                <span className="text-xs text-gray-500 ml-1">/ year</span>
              </div>
              <span className="text-xs text-gray-500">Students certified</span>
            </div>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm flex items-center gap-2">
            Learn More <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
