import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'

const awsCertifications = [
    {
        src: "/cert-badges/aws/aws-cloud-practitioner.png",
        alt: "AWS Cloud Practitioner",
    },
    {
        src: "/cert-badges/aws/aws-solutions-architect.png", 
        alt: "AWS Solutions Architect Associate",
    },
    {
        src: "/cert-badges/aws/aws-developer associate.png",
        alt: "AWS Developer Associate",
    },
    {
        src: "/cert-badges/aws/aws-solutions-architect-proffessional.png",
        alt: "AWS Solutions Architect Professional", 
    },
    {
        src: "/cert-badges/aws/aws-devops-engineer.png",
        alt: "AWS DevOps Engineer Professional",
    },
    {
        src: "/cert-badges/aws/aws-security-specialty.png",
        alt: "AWS Security Specialty",
    },
    {
        src: "/cert-badges/aws/aws-machine-learning-specialty.png",
        alt: "AWS Machine Learning Specialty",
    },
    {
        src: "/cert-badges/aws/aws-data-eng-associate.png",
        alt: "AWS Data Engineer Associate",
    },
    {
        src: "/cert-badges/aws/aws-advanced-networking.png",
        alt: "AWS Advanced Networking Specialty",
    },
    {
        src: "/cert-badges/aws/aws-ai-practitioner.png",
        alt: "AWS AI Practitioner",
    },
    {
        src: "/cert-badges/aws/aws-machine-learning-associate.png",
        alt: "AWS Machine Learning Associate",
    }
];

export default function LogoCloud() {
    return (
        <section className="bg-background overflow-hidden py-16">
            <div className="group relative m-auto max-w-7xl px-6">
                <div className="flex flex-col items-center md:flex-row">
                    <div className="md:max-w-44 md:border-r md:pr-6">
                        <p className="text-end text-sm">AWS Certifications We Cover</p>
                    </div>
                    <div className="relative py-6 md:w-[calc(100%-11rem)]">
                        <InfiniteSlider
                            speedOnHover={20}
                            speed={40}
                            gap={80}>
                            {awsCertifications.map((cert, index) => (
                                <div key={index} className="flex">
                                    <img
                                        className="mx-auto h-14 w-14 lg:h-16 lg:w-16 object-contain"
                                        src={cert.src}
                                        alt={cert.alt}
                                        height="48"
                                        width="48"
                                    />
                                </div>
                            ))}
                        </InfiniteSlider>

                        <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                        <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                        <ProgressiveBlur
                            className="pointer-events-none absolute left-0 top-0 h-full w-20"
                            direction="left"
                            blurIntensity={1}
                        />
                        <ProgressiveBlur
                            className="pointer-events-none absolute right-0 top-0 h-full w-20"
                            direction="right"
                            blurIntensity={1}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
