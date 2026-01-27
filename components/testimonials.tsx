"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

type Testimonial = {
  name: string;
  role: string;
  image: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Srinivas Dachepally",
    role: "Cloud Engineer, Bangalore",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote:
      "I tried three different platforms before CloudDojo. None of them told me if I was actually improving or just wasting time. The performance analytics here changed that completely — I could finally see my progress.",
  },
  {
    name: "Amara Okafor",
    role: "AWS Solutions Architect, Lagos",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "Look, I'm not going to lie — I almost gave up. The PDFs were boring, the courses were expensive, and I had no idea if I was ready. CloudDojo made it simple. Passed my exam two weeks ago. Still can't believe it.",
  },
  {
    name: "Miguel Santos",
    role: "DevOps Engineer, São Paulo",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    quote:
      "The projects are what sold me. I wasn't just clicking through multiple choice questions — I was deploying actual infrastructure. That hands-on experience is what got me my current job.",
  },
  {
    name: "Priya Sharma",
    role: "Junior Developer, Mumbai",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    quote:
      "Honestly? I was terrified of cloud. It felt too big, too complicated. CloudDojo breaks everything down so clearly that I actually started enjoying studying. Weird, I know.",
  },
  {
    name: "James Kipchoge",
    role: "Cloud Architect, Nairobi",
    image: "https://randomuser.me/api/portraits/men/15.jpg",
    quote:
      "Finally, a platform that doesn't treat African developers like an afterthought. Affordable pricing, works offline, and the community actually feels like home.",
  },
  {
    name: "Sarah Chen",
    role: "Solutions Engineer, Singapore",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    quote:
      "The AI coach is scary good. I asked it to explain VPC peering at 2am and got a better answer than I found in any documentation. Worth it for that alone.",
  },
  {
    name: "Emmanuel Kwame",
    role: "Software Engineer, Accra",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    quote:
      "I love the leaderboard. Sounds silly, but seeing my name climb up every week keeps me going. Competition works.",
  },
  {
    name: "Rachel Kimani",
    role: "IT Consultant, Kigali",
    image: "https://randomuser.me/api/portraits/women/52.jpg",
    quote:
      "Three weeks. That's how long it took me to go from zero to passing AWS Cloud Practitioner. CloudDojo's study plan is no joke — it actually works if you follow it.",
  },
  {
    name: "David Osei",
    role: "Full-Stack Developer, Remote",
    image: "https://randomuser.me/api/portraits/men/8.jpg",
    quote:
      "Clean UI, fast performance, no BS. Just good content and smart features. This is how all learning platforms should work.",
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

function TestimonialCard({ name, role, quote, image }: Testimonial) {
  return (
    <Card className="shrink-0">
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
            <p className="text-sm text-gray-700 dark:text-gray-300">{quote}</p>
          </blockquote>
        </div>
      </CardContent>
    </Card>
  );
}

function MarqueeColumn({
  items,
  direction = "up",
  duration = 25,
}: {
  items: Testimonial[];
  direction?: "up" | "down";
  duration?: number;
}) {
  const doubled = [...items, ...items];

  const animationName = direction === "up" ? "marquee-up" : "marquee-down";

  return (
    <div className="relative h-[600px] overflow-hidden">
      <div
        className="marquee-track flex flex-col gap-3"
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationName,
            animationDuration: "var(--marquee-duration)",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          } as React.CSSProperties
        }
      >
        {doubled.map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.name}-${index}`}
            {...testimonial}
          />
        ))}
      </div>
    </div>
  );
}

export default function WallOfLoveSection() {
  return (
    <section>
      <style>{`
        @keyframes marquee-up {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
        @keyframes marquee-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0%); }
        }
        .testimonials-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      <div className="py-16 md:py-32">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="text-center">
            <h2 className="text-4xl font-semibold lg:text-5xl">
              Loved by the Community
            </h2>
            <p className="text-muted-foreground mt-6">
              Real stories from real learners who passed their AWS exams with
              CloudDojo.
            </p>
          </div>

          <div className="testimonials-wrapper relative mt-8 md:mt-12">
            {/* Top fade gradient */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-background to-transparent" />

            {/* Bottom fade gradient */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-background to-transparent" />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {testimonialChunks.map((chunk, chunkIndex) => (
                <MarqueeColumn
                  key={chunkIndex}
                  items={chunk}
                  direction={chunkIndex % 2 === 0 ? "up" : "down"}
                  duration={chunkIndex === 1 ? 30 : 25}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
