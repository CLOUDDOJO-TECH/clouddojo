import React from "react";
import Image, { StaticImageData } from "next/image";

// Static imports for automatic blur placeholder generation
import testsBg from "@/public/mockups/backgrounds/anime-scenery.jpg";
import testsMockup from "@/public/mockups/practice-test-light.png";
import aiFeedbackBg from "@/public/mockups/backgrounds/bart-simpson.jpg";
import aiFeedbackMockup from "@/public/mockups/ai-analysis.png";
import projectsBg from "@/public/mockups/backgrounds/cherry-blossom.jpg";
import projectsMockup from "@/public/mockups/dashboard.png";
import leaderboardBg from "@/public/mockups/backgrounds/anime-boy.jpg";
import leaderboardMockup from "@/public/mockups/leaderboard-light.png";

interface VisualMockupProps {
  type: "tests" | "ai_feedback" | "projects" | "leaderboard";
}

// Define all images with static imports for blur placeholders
const mockupConfig: Record<
  string,
  {
    background: StaticImageData;
    mockup: StaticImageData;
    alt: string;
  }
> = {
  tests: {
    background: testsBg,
    mockup: testsMockup,
    alt: "Practice tests feature mockup",
  },
  ai_feedback: {
    background: aiFeedbackBg,
    mockup: aiFeedbackMockup,
    alt: "AI Feedback feature mockup",
  },
  projects: {
    background: projectsBg,
    mockup: projectsMockup,
    alt: "Projects analysis mockup",
  },
  leaderboard: {
    background: leaderboardBg,
    mockup: leaderboardMockup,
    alt: "Leaderboard analysis mockup",
  },
};

export const VisualMockup: React.FC<VisualMockupProps> = ({ type }) => {
  const config = mockupConfig[type];

  return (
    <div className="relative w-full h-full min-h-[350px] lg:min-h-[450px] overflow-hidden shadow-2xl">
      {/* Background - unique for each type */}
      <div className="absolute inset-0">
        <Image
          src={config.background}
          alt="Background"
          fill
          className="object-cover"
          placeholder="blur"
          priority
        />
      </div>

      {/* Mockup Image - positioned bottom right with zoom effect */}
      <div className="absolute inset-0 flex items-end justify-end overflow-hidden group">
        <div className="relative w-[90%] h-[90%]">
          <Image
            src={config.mockup}
            alt={config.alt}
            fill
            className="lg:mt-0 md:absolute object-cover object-top-left lg:h-full mt-6 relative ring-1 border-2 border-white/10 -mb-8 md:-mb-0 lg:max-w-none lg:w-auto"
            placeholder="blur"
            priority
          />
        </div>
      </div>
    </div>
  );
};
