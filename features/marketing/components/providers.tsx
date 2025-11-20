import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import {
  MicrosoftAzure,
  AmazonWebServices,
  Docker,
  GoogleCloud,
  Kubernetes,
  Oracle,
} from "@/components/logos";

export default function ProvidersSection() {
  return (
    <section>
      <div className="py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-balance text-3xl font-semibold md:text-4xl">
              One platform. Every cloud. Unlimited career opportunities.
            </h2>
            <p className="text-muted-foreground mt-6">
              Don't limit yourself to one cloud provider. CloudDojo helps you
              build expertise across AWS, Azure, GCP, Oracle, and Docker — so
              you can go wherever the opportunities are.
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ProviderCard
              title="Amazon Web Services"
              description="From Cloud Practitioner to Solutions Architect — prepare for every AWS certification with real-world practice tests and hands-on projects."
            >
              <AmazonWebServices />
            </ProviderCard>

            <ProviderCard
              title="Azure"
              description="Azure certifications unlock enterprise opportunities. CloudDojo helps you master them with targeted practice tests and performance analytics."
            >
              <MicrosoftAzure />
            </ProviderCard>

            <ProviderCard
              title="Google Cloud Platform"
              description="Master GCP certifications with practice tests built to mirror actual Google Cloud exams — from Associate to Professional level."
            >
              <GoogleCloud />
            </ProviderCard>

            <ProviderCard
              title="Oracle Cloud "
              description="Oracle Cloud is growing fast. Get ahead with OCI certification prep — practice tests, analytics, and study resources all in one place"
            >
              <Oracle />
            </ProviderCard>

            <ProviderCard
              title="Docker"
              description="Learn Docker by doing. Build containerized apps, write Dockerfiles, and master the containerization skills that every cloud role requires."
            >
              <Docker />
            </ProviderCard>

            <ProviderCard
              title="Kubernetes"
              description="Master Kubernetes through real projects. Deploy apps, configure clusters, and build the container orchestration skills every cloud engineer needs."
            >
              <Kubernetes />
            </ProviderCard>
          </div>
        </div>
      </div>
    </section>
  );
}

const ProviderCard = ({
  title,
  description,
  children,
  link = "#",
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  link?: string;
}) => {
  const truncateDescription = (text: string, maxWords: number = 10) => {
    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
  };

  return (
    <Card className="p-6">
      <div className="relative">
        <div className="*:size-10">{children}</div>

        <div className="space-y-2 py-6">
          <h3 className="text-base font-medium">{title}</h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {truncateDescription(description)}
          </p>
        </div>

        <div className="flex gap-3 border-t border-dashed pt-6">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="gap-1 pr-1.5"
          >
            <Link href={link}>
              Learn More
              <ChevronRight className="ml-0 !size-3.5 opacity-50" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};
