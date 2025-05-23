import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShinyBlackCard } from "../shiny-bg-cards"

export interface ThreeStepFrameworkProps {
    className?: string
    showCta?: boolean
    ctaText?: string
    ctaLink?: string
}

export function ThreeStepFramework({
    className = "",
    showCta = true,
    ctaText = "Get Started",
    ctaLink = "#",
}: ThreeStepFrameworkProps) {
    return (
        <section className={`py-16 px-4 md:px-8 lg:px-16 w-full flex items-center justify-center flex-col ${className}`}>
            {/* Hero Section */}
            <div className="mb-16 md:mb-24 max-w-4xl">
                <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                    We've elinminated the guesswork from cloud certification prep.
                </h1>
                <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
                    Having spent years in the trenches, we know what it takes to pass cloud certifications.
                    <br />
                    Step into the dojo and let us guide you through a tailored learning experience.
                </p>
            </div>

            {/* Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                {/* Card 1 */}
                <ShinyBlackCard
                    title="Creators of the most popular cloud certification prep platform"
                    description=""
                    icons={[
                        {
                            src: "/logos/aws-svgrepo-com.svg",
                            alt: "Document icon",
                        },
                        {
                            src: "/logos/google-cloud-svgrepo-com.svg",
                            alt: "Blind 75",
                        },
                    ]}
                    blobEffect={{
                        enabled: true,
                        size: 180,
                        opacity: 0.04,
                        delay: 0.1,
                    }}
                    className="h-full"
                />

                {/* Card 2 */}
                <ShinyBlackCard
                    title="We're also diving into cybersecurity certifications"
                    description=""
                    icons={[
                        {
                            src: "/logos/cisco-2.svg",
                            alt: "Document icon",
                        },
                    ]}
                    blobEffect={{
                        enabled: true,
                        size: 180,
                        opacity: 0.04,
                        delay: 0.1,
                    }}
                    className="h-full"
                />

                {/* Card 3 */}
                <ShinyBlackCard
                    title="We plan to include more certifications in the future"
                    description=""
                    icons={[
                        {
                            src: "/logos/microsoft-svgrepo-com.svg",
                            alt: "Open source icon",
                        },
                        {
                            src: "/logos/salesforce-svgrepo-com.svg",
                            alt: "Code icon",
                        },
                    ]}
                    blobEffect={{
                        enabled: true,
                        size: 180,
                        opacity: 0.07,
                        delay: 0.1,
                    }}
                    className="h-full"
                />
            </div>

            {/* CTA Section */}
            {showCta && (
                <div className="mt-16 text-center">
                    <Button asChild size="lg" className="bg-white text-black hover:bg-zinc-200 px-8 py-6 text-lg">
                        <Link href={ctaLink}>{ctaText}</Link>
                    </Button>
                </div>
            )}
        </section>
    )
}
