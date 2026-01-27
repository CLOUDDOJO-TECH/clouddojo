import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ContentSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        <img
          className="rounded-(--radius) grayscale"
          src="/images/content-image.jpg"
          alt="team image"
          height=""
          width=""
          loading="lazy"
        />

        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <h2 className="text-4xl font-medium">
            Bringing together everything you need to go from studying to
            certified to hired.
          </h2>
          <div className="space-y-6">
            <p>
              We're not just practice tests, flashcards, nor AI assistant.
              CloudDojo is an entire ecosystem of practice tests, hands-on
              projects, smart flashcards, performance analytics, AI coaching,
              and a global community all working together to get you certified
              and employed.
            </p>

            <Button
              asChild
              variant="secondary"
              size="sm"
              className="gap-1 pr-1.5"
            >
              <Link href="#">
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
