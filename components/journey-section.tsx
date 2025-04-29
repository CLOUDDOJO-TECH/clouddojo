import { Database, BarChart3, LineChart } from "lucide-react"

export default function JourneySection() {
  return (
    <section className="container py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Our Journey and Mission</h2>
      <p className="text-center text-gray-300 max-w-2xl mx-auto mb-16">
        Building the CloudPeak platform has been an incredible journey. We're committed to helping cloud professionals
        excel.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-midnight-light/10 border border-midnight-light/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Seamless Integration</h3>
          <p className="text-gray-400 mb-6">
            Our platform integrates with your existing workflow and tools to provide a seamless experience.
          </p>

          <div className="flex items-center gap-6 mb-4">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-blue-400">200%</span>
              <span className="text-xs text-gray-500">Productivity increase</span>
            </div>

            <div className="flex gap-2">
              <div className="bg-indigo-600/30 p-2 rounded">
                <Database className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="bg-blue-600/30 p-2 rounded">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div className="bg-emerald-600/30 p-2 rounded">
                <LineChart className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Our platform is designed to enhance your workflow and boost productivity across your organization.
          </p>
        </div>

        <div className="bg-midnight-light/10 border border-midnight-light/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Scalable Infrastructure</h3>
          <p className="text-gray-400 mb-6">
            Built on a scalable infrastructure to handle your growing needs and requirements.
          </p>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-blue-400">120k+</span>
                <span className="text-xs text-gray-500 ml-1">/ year</span>
              </div>
              <span className="text-xs text-gray-500">Students trained</span>
            </div>
          </div>

          <div className="bg-midnight-light/20 rounded-lg p-3 flex items-center gap-3">
            <div className="bg-emerald-500/20 p-1.5 rounded">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-emerald-500">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-sm">24/7 Customer Support</span>
          </div>
        </div>
      </div>
    </section>
  )
}
