import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ContentSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        <div className="overflow-hidden rounded-2xl bg-[hsl(260,60%,20%)] p-2 shadow-xl shadow-zinc-950/20 sm:p-3 md:p-4">
          <Image
            className="rounded-xl"
            src="/images/content-section-image.png"
            alt="CloudDojo Practice Tests — browse and launch AWS certification exams"
            width={1920}
            height={1080}
            loading="lazy"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <h2 className="text-4xl font-medium">
            Everything you need to go from studying to certified.
          </h2>
          <div className="space-y-6">
            <p>
              CloudDojo brings together practice tests, smart flashcards,
              performance analytics, and AI coaching into one platform — so you
              always know what to study, how you&apos;re improving, and when
              you&apos;re ready to sit the exam.
            </p>

            <Button
              asChild
              variant="secondary"
              size="sm"
              className="gap-1 pr-1.5"
            >
              <Link href="/dashboard">
                <span>Explore the Platform</span>
                <ChevronRight className="size-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
