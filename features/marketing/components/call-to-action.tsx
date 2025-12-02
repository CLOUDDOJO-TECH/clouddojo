import React from "react";
import { Button } from "@/components/ui/button";

const CallToAction: React.FC = () => {
  return (
    <section className="relative w-full py-16 md:py-24 lg:py-32 bg-background overflow-hidden transition-colors duration-300 font-main px-14">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* --- Left Column: Main Content --- */}
          <div className="flex flex-col items-start text-left space-y-8 z-10">
            {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-5xl font-semibold tracking-tight">
              Start using Inertia today
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl font-light leading-relaxed">
              Dive into our documentation or start deploying today with our
              Laravel starter kits made for Inertia.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start w-full sm:w-auto gap-4 mt-4">
              <Button className="rounded-full px-10 py-6 text-base">
                Read docs
              </Button>

              <Button
                variant="outline"
                className="rounded-full px-10 py-6 text-base"
              >
                Explore starter kits
              </Button>
            </div>
          </div>

          {/* --- Right Column: Glass Icon --- */}
          <div className="flex justify-center lg:justify-end relative pointer-events-none select-none">
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[80px] rounded-full"></div>

            {/* Glass Icon */}
            <img
              src="/3d-icons/3d-cloud-icon.png"
              alt="3D Glass Cloud Icon"
              className="relative z-10 w-full max-w-md md:max-w-lg object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
