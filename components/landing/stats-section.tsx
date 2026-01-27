"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  duration?: number;
  index: number;
}

function StatItem({
  value,
  suffix,
  label,
  duration = 2,
  index,
}: StatItemProps) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const counterObj = useRef({ val: 0 });

  useEffect(() => {
    const el = numberRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(counterObj.current, {
        val: value,
        duration,
        ease: "power4.out",
        snap: { val: 1 },
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
        onUpdate: () => {
          if (numberRef.current) {
            numberRef.current.textContent =
              Math.round(counterObj.current.val).toLocaleString() + suffix;
          }
        },
      });
    });

    return () => ctx.revert();
  }, [value, suffix, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="bg-muted rounded-(--radius) space-y-4 py-12"
    >
      <div className="text-5xl font-bold">
        <span ref={numberRef}>0{suffix}</span>
      </div>
      <p>{label}</p>
    </motion.div>
  );
}

const stats = [
  { value: 12, suffix: "", label: "AWS Certifications Covered", duration: 1.5 },
  { value: 1000, suffix: "+", label: "Practice Questions", duration: 2 },
  { value: 92, suffix: "%", label: "Pass Rate", duration: 1.8 },
];

export default function StatsSection() {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-4xl font-semibold lg:text-5xl"
          >
            CloudDojo in Numbers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            Real results from real learners — here&apos;s what CloudDojo
            delivers.
          </motion.p>
        </div>

        <div className="grid gap-0.5 *:text-center md:grid-cols-3 dark:[--color-muted:var(--color-zinc-900)]">
          {stats.map((stat, i) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              duration={stat.duration}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
