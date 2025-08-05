import { motion } from "motion/react";
import { Safari } from "./magicui/safari";
import { GlowingEffect } from "./ui/glowing-effect";
import { useTheme } from "next-themes";

export default function SafariPreview() {
  const { theme } = useTheme();

  // Determine which image to use based on the current theme
  const imageSrc =
    theme === "light"
      ? "/images/demo-image.png"
      : "/images/good-hero.png";

  return (
    <div className="w-full p-0 rounded-3xl relative z-0 mb-[-95px]">
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
          delay: 1.2,
        }}
        className="relative rounded-3xl border p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.7)] border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
        style={{
          boxShadow:
            "0 10px 50px -12px rgba(0, 0, 0, 0.25), 0 -8px 25px -18px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="w-full overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
          <Safari
            url="clouddojo.tech"
            className="size-full"
            imageSrc={imageSrc}
          />
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
        </div>
      </motion.div>
    </div>
  );
}