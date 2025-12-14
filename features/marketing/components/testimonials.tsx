"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

type Testimonial = {
  name: string;
  role: string;
  image: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "AWS Solutions Architect",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    quote:
      "CloudDojo's practice tests are the closest thing to the real AWS exams I've seen. The AI feedback helped me understand why I got questions wrong, not just the right answer.",
  },
  {
    name: "Marcus Johnson",
    role: "DevOps Engineer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote:
      "Passed my Azure Administrator exam on the first try. The scenario-based questions here prepared me better than any other platform I tried.",
  },
  {
    name: "Priya Patel",
    role: "Cloud Engineer",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "I love the performance analytics. Being able to see exactly which topics I'm weak on saved me weeks of unfocused studying.",
  },
  {
    name: "David Okonkwo",
    role: "Solutions Architect",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    quote:
      "The hands-on projects are what set CloudDojo apart. I wasn't just memorizing answers — I was actually building things.",
  },
  {
    name: "Emma Rodriguez",
    role: "Cloud Security Specialist",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    quote:
      "Finally, a platform that covers multiple cloud providers. Being able to study for AWS, Azure, and GCP in one place is a game-changer.",
  },
  {
    name: "James Park",
    role: "Senior DevOps",
    image: "https://randomuser.me/api/portraits/men/15.jpg",
    quote:
      "The AI coach answered my questions at 3am when I was stuck on a Kubernetes concept. It's like having a mentor available 24/7.",
  },
  {
    name: "Aisha Mohammed",
    role: "Cloud Developer",
    image: "https://randomuser.me/api/portraits/women/52.jpg",
    quote:
      "I went from zero cloud knowledge to passing my first certification in 6 weeks. CloudDojo's study path kept me on track the whole time.",
  },
  {
    name: "Tom Anderson",
    role: "Infrastructure Engineer",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    quote:
      "The leaderboard feature keeps me motivated. A little healthy competition makes studying way more fun than it should be.",
  },
  {
    name: "Lisa Chang",
    role: "Cloud Consultant",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    quote:
      "Best investment I made in my career. Landed a new role with a 40% salary increase after getting my certifications through CloudDojo.",
  },
];

const chunkArray = (
  array: Testimonial[],
  chunkSize: number,
): Testimonial[][] => {
  const result: Testimonial[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

const testimonialChunks = chunkArray(
  testimonials,
  Math.ceil(testimonials.length / 3),
);

const TestimonialCard = ({ name, role, quote, image }: Testimonial) => (
  <Card className="rounded-none">
    <CardContent className="grid grid-cols-[auto_1fr] gap-3 pt-6">
      <Avatar className="size-9">
        <AvatarImage
          alt={name}
          src={image}
          loading="lazy"
          width="120"
          height="120"
        />
        <AvatarFallback>ST</AvatarFallback>
      </Avatar>

      <div>
        <h3 className="font-medium">{name}</h3>

        <span className="text-muted-foreground block text-sm tracking-wide">
          {role}
        </span>

        <blockquote className="mt-3">
          <p className="text-gray-700 dark:text-gray-300">{quote}</p>
        </blockquote>
      </div>
    </CardContent>
  </Card>
);

const MarqueeColumn = ({
  testimonials,
  duration,
  direction = "up",
}: {
  testimonials: Testimonial[];
  duration: number;
  direction?: "up" | "down";
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div
      className="relative h-[600px] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-background to-transparent z-10 pointer-events-none" />

      <motion.div
        className="space-y-3"
        animate={{
          y: direction === "up" ? [0, "-50%"] : ["-50%", 0],
        }}
        transition={{
          duration: isHovered ? duration * 3 : duration, // 3x slower on hover
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <div key={index}>
            <TestimonialCard {...testimonial} />
          </div>
        ))}
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default function WallOfLoveSection() {
  return (
    <section>
      <div className="py-16 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-balance text-3xl font-semibold md:text-5xl text-center bg-clip-text text-transparent bg-linear-to-b from-neutral-50 to-neutral-400 bg-opacity-5">
              Loved by the Community
            </h2>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
            {testimonialChunks.map((chunk, chunkIndex) => (
              <MarqueeColumn
                key={chunkIndex}
                testimonials={chunk}
                duration={chunkIndex === 1 ? 25 : 30}
                direction={chunkIndex === 1 ? "down" : "up"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
