import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FaqSection() {

  const faqs = [
    {
      question: "Can CloudDojo help me pass my AWS certification exam?",
      answer:
        "Absolutely! CloudDojo is built to guide you step-by-step through your AWS exam prep using AI-driven quizzes, smart study tools, and up-to-date content tailored to exam objectives.",
    },
    {
      question: "Is CloudDojo really free?",
      answer:
        "Yes! CloudDojo is 100% free to use. You get access to high-quality cloud certification prep tools. There are some features that are behind a paywall, but you can totally get started for free., No extra subscriptions or hidden fees.",
    },
    {
      question: "What makes CloudDojo different from other cloud certification platforms?",
      answer:
        "Unlike other platforms, CloudDojo uses AI to personalize your learning experience, highlight your weak areas, and help you focus on what actually matters to pass your exam faster.",
    },
    {
      question: "Do I need any experience to get started with CloudDojo?",
      answer:
        "Nope! Whether you're a beginner or already have some cloud knowledge, CloudDojo adapts to your level and helps you build the skills you need at your own pace.",
    },
    {
      question: "What certifications can I prepare for with CloudDojo?",
      answer:
        "Right now, CloudDojo focuses on helping you prepare for AWS certifications like the Cloud Practitioner and Solutions Architect Associate, with more coming soon!",
    }
  ]



  return (
    <section className="py-16">
      <h2 className="text-3xl md:text-5xl font-bold mb-12 text-foreground/60 text-center flex items-center justify-center">Frequently Asked Questions?</h2>

      <div className="max-w-3xl px-3 mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-midnight-light/20 rounded-lg dark:bg-black/70 bg-foreground/70 px-6"
            >
              <AccordionTrigger className="text-left py-4 text-base font-medium">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-gray-200 font-mono font-light pb-4">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
