import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HowItWorks() {
  return (
    <section className="container py-16">
      <h2 className="text-3xl font-bold text-center mb-4">How CloudPeak Works</h2>
      <p className="text-center text-gray-300 max-w-2xl mx-auto mb-16">
        Discover how CloudPeak helps you prepare for your cloud certification exams with our comprehensive platform.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="bg-midnight-light/10 border border-midnight-light/20 rounded-xl p-6 h-[300px] flex items-center justify-center">
          <div className="w-full max-w-[300px]">
            {/* Bar chart visualization */}
            <div className="flex items-end justify-between h-[180px] gap-3">
              {[65, 45, 80, 55, 70, 90, 60].map((height, i) => (
                <div key={i} className="w-full">
                  <div
                    className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm"
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="h-[1px] w-full bg-gray-700 mt-1 mb-2"></div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Mon</span>
              <span className="text-xs text-gray-500">Sun</span>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Effortless Onboarding Process with CloudPeak</h3>
            <p className="text-gray-400 mb-4">
              Getting started with CloudPeak is simple. Create an account, select your certification path, and start
              learning.
            </p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-blue-400">25%</span>
                  <span className="text-xs text-blue-400 ml-1">↑ 5%</span>
                </div>
                <span className="text-xs text-gray-500">Pass rate increase</span>
              </div>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm flex items-center gap-2">
              Learn More <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
