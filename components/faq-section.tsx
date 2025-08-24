import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlusIcon } from "lucide-react";

export default function FaqSection() {
  const faqs = [
    {
      id: "1",
      question: "Can CloudDojo help me pass my AWS certification exam?",
      answer:
        "Absolutely! CloudDojo is built to guide you step-by-step through your AWS exam prep using AI-driven quizzes, smart study tools, and up-to-date content tailored to exam objectives.",
    },
    {
      id: "2",
      question: "Is CloudDojo really free?",
      answer:
        "Yes! CloudDojo is 100% free to use. You get access to high-quality cloud certification prep tools. There are some features that are behind a paywall, but you can totally get started for free., No extra subscriptions or hidden fees.",
    },
    {
      id: "3",
      question:
        "What makes CloudDojo different from other cloud certification platforms?",
      answer:
        "Unlike other platforms, CloudDojo uses AI to personalize your learning experience, highlight your weak areas, and help you focus on what actually matters to pass your exam faster.",
    },
    {
      id: "4",
      question: "Do I need any experience to get started with CloudDojo?",
      answer:
        "Nope! Whether you're a beginner or already have some cloud knowledge, CloudDojo adapts to your level and helps you build the skills you need at your own pace.",
    },
    {
      id: "5",
      question: "What certifications can I prepare for with CloudDojo?",
      answer:
        "Right now, CloudDojo focuses on helping you prepare for AWS certifications like the Cloud Practitioner and Solutions Architect Associate, with more coming soon!",
    },
  ];

  return (
    <div className="space-y-4 w-full px-4 max-w-4xl mx-auto md:pb-20 pt-10 pb-10">
      <div className="text-center mb-16">
        <h2 className="text-foreground/80 text-4xl md:text-5xl lg:text-6xl font-bold leading-normal max-w-5xl mx-auto">
          Frequently Asked Questions
        </h2>
      </div>
      <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="3">
        {faqs.map((item) => (
          <AccordionItem value={item.id} key={item.id} className="py-2 gap-2">
            <AccordionTrigger className="py-2 font-main text-lg text-foreground leading-6 font-normal hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-lg font-main pb-2">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
