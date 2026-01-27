"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";

const Threads = dynamic(() => import("@/components/Threads"), { ssr: false });

export default function CallToAction() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Threads Background */}
      <div className="absolute inset-0 z-0">
        <Threads
          color={[0.23137254901960785, 1, 0.6470588235294118]}
          amplitude={2}
          distance={0}
          enableMouseInteraction
        />
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 md:py-20 lg:py-32 relative z-10">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Your AWS Certification Starts Here
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join thousands of engineers who passed their exam with CloudDojo.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/">
                <span>Start Practicing Free</span>
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline">
              <Link href="/pricing">
                <span>View Pricing</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
