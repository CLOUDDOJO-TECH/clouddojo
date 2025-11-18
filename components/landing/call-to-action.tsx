import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-6 py-12 md:py-20 lg:py-32">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Start Building
          </h2>
          <p className="mt-4">
            The Next Generation of Cloud / Devops Engineers Starts Here
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/">
                <span>Be Part of the Story</span>
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline">
              <Link href="/">
                <span>Contact Us</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
