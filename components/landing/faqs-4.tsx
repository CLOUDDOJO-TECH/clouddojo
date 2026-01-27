"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export default function FAQsFour() {
  const faqItems = [
    {
      id: "item-3",
      question: "How does the AI Study Assistant work?",
      answer:
        "Our AI assistant analyzes your practice test performance and provides personalized explanations, study recommendations, and instant answers to your cloud questions. Think of it as having a senior cloud engineer available 24/7 to help you understand concepts better.",
    },
    {
      id: "item-4",
      question: "Do I need cloud experience to start?",
      answer:
        "Not at all! CloudDojo is designed for everyone from complete beginners to experienced engineers preparing for advanced certifications. Our practice tests adapt to your level, and the AI assistant explains concepts in ways that make sense for where you are.",
    },
    {
      id: "item-8",
      question: "Are the practice tests like real certification exams?",
      answer:
        "Yes. Our practice tests mirror actual exam formats, difficulty levels, and question styles. They're timed, cover all exam domains, and include scenario-based questions just like the real thing. Many users say our tests are actually harder than the actual exams.",
    },
    {
      id: "item-1",
      question: "Is CloudDojo free?",
      answer:
        "Yes! Our free plan gives you access to limited practice tests, basic analytics, and community features. It's enough to get started and see if CloudDojo works for you. Premium unlocks unlimited tests, AI coaching, and advanced analytics.",
    },
    {
      id: "item-10",
      question: "Do you offer team or enterprise plans?",
      answer:
        "Not yet, It's in beta. We plan to work with bootcamps, universities, and companies training their teams. Team plans will include bulk licenses, progress tracking dashboards, custom learning paths, and dedicated support. Email support@clouddojo.tech for enterprise pricing.",
    },
    {
      id: "item-11",
      question: "How often is content updated?",
      answer:
        "We add new practice questions, projects, and flashcards weekly. When cloud providers update their certification exams, we update our content within days. You'll always be preparing with current, relevant material.",
    },
    {
      id: "item-13",
      question: "Which AWS certifications do you cover?",
      answer:
        "We cover all 12 AWS certifications — from foundational (Cloud Practitioner) to professional (Solutions Architect Professional, DevOps Engineer Professional) and every specialty in between. Each certification has its own question bank, study plan, and readiness score.",
    },
    {
      id: "item-12",
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes. Cancel anytime from your account settings. No long-term contracts, no cancellation fees. If you cancel, you'll keep Premium access until the end of your billing period, and your progress stays saved if you ever come back.",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-4 text-balance">
            Discover quick and comprehensive answers to common questions about
            our platform, services, and features.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <Accordion
            type="single"
            collapsible
            className="bg-muted dark:bg-muted/50 w-full rounded-2xl p-1"
          >
            {faqItems.map((item) => (
              <div className="group" key={item.id}>
                <AccordionItem
                  value={item.id}
                  className="data-[state=open]:bg-card dark:data-[state=open]:bg-muted peer rounded-xl border-none px-7 py-1 data-[state=open]:border-none data-[state=open]:shadow-sm"
                >
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
                <hr className="mx-7 border-dashed group-last:hidden peer-data-[state=open]:opacity-0" />
              </div>
            ))}
          </Accordion>

          <p className="text-muted-foreground mt-6 px-8">
            Can't find what you're looking for? Contact our{" "}
            <Link href="#" className="text-primary font-medium hover:underline">
              customer support team
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
