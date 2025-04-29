import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FaqSection() {
  const faqs = [
    {
      question: "What is CloudPeak?",
      answer:
        "CloudPeak is a comprehensive cloud certification platform designed to help professionals prepare for and pass their AWS certification exams with confidence.",
    },
    {
      question: "What services does CloudPeak offer?",
      answer:
        "CloudPeak offers practice exams, personalized learning paths, AI-powered analysis, and expert guidance to help you prepare for your AWS certification exams.",
    },
    {
      question: "What are the main features of CloudPeak?",
      answer:
        "CloudPeak features include realistic practice exams, detailed explanations, personalized learning paths, progress tracking, and AI-powered analysis to identify your strengths and weaknesses.",
    },
    {
      question: "How can CloudPeak help my business?",
      answer:
        "CloudPeak can help your business by providing a comprehensive training platform for your team, improving certification pass rates, and enhancing your team's cloud skills and knowledge.",
    },
    {
      question: "Is CloudPeak suitable for businesses of all sizes?",
      answer:
        "Yes, CloudPeak is designed to meet the needs of individuals and businesses of all sizes, from startups to enterprise organizations.",
    },
  ]

  return (
    <section className="container py-16">
      <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center">Frequently Asked Questions</h2>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-midnight-light/20 rounded-lg bg-midnight-light/5 px-6"
            >
              <AccordionTrigger className="text-left py-4 text-base font-medium">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-gray-400 pb-4">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
