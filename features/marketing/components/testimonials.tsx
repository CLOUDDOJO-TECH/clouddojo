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
      "Three weeks. That's how long it took me to go from zero to passing Azure Fundamentals. CloudDojo's study plan is no joke — it actually works if you follow it.",
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
              <div key={chunkIndex} className="space-y-3">
                {chunk.map(({ name, role, quote, image }, index) => (
                  <Card key={index}>
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
                          <p className="text-gray-700 dark:text-gray-300">
                            {quote}
                          </p>
                        </blockquote>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
