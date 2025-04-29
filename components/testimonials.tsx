import Image from "next/image"

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Tanner",
      role: "Cloud Architect",
      company: "TechSolutions Inc.",
      quote:
        "CloudPeak helped me prepare for my AWS certification exams with confidence. The practice questions and AI-powered analysis were invaluable.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Craig Hansen",
      role: "DevOps Engineer",
      company: "InnovateTech",
      quote:
        "I've tried several certification platforms, but CloudPeak stands out with its comprehensive content and intuitive interface.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "John Drake",
      role: "Solutions Architect",
      company: "CloudNative Systems",
      quote:
        "The personalized learning path and detailed explanations helped me understand complex concepts and pass my exams on the first try.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Steven Rogers",
      role: "Cloud Engineer",
      company: "DataFlow Solutions",
      quote:
        "CloudPeak's practice exams closely mimic the actual AWS exams, which helped me feel prepared and confident on exam day.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Mary Logan",
      role: "IT Manager",
      company: "Global Systems Inc.",
      quote:
        "Our team has seen a significant improvement in certification pass rates since we started using CloudPeak for our training needs.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "David Chen",
      role: "Cloud Consultant",
      company: "NextGen Cloud",
      quote:
        "The depth of content and quality of practice questions on CloudPeak is unmatched. It's been essential for my professional growth.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <section className="container py-16">
      <h2 className="text-3xl font-bold text-center mb-4">Client Success Stories</h2>
      <p className="text-center text-gray-300 max-w-2xl mx-auto mb-16">
        Hear from our clients who have successfully achieved their cloud certification goals with CloudPeak.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-midnight-light/10 border border-midnight-light/20 rounded-xl p-6">
            <p className="text-gray-300 mb-6 text-sm">"{testimonial.quote}"</p>
            <div className="flex items-center gap-3">
              <div className="rounded-full overflow-hidden w-10 h-10 bg-midnight-light/30">
                <Image
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium text-sm">{testimonial.name}</h4>
                <p className="text-gray-400 text-xs">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
