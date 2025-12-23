import React from "react";
import { Button } from "@/components/ui/button";

const CallToAction: React.FC = () => {
  return (
    <section className="relative w-full py-12 md:py-16 lg:py-20 bg-background overflow-hidden transition-colors duration-300 font-main px-4 sm:px-6 lg:px-14">
      <div className="max-w-6xl mx-auto">
        {/*top grandient*/}
        <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-background to-transparent z-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-8 items-center">
          {/* --- Left Column: Main Content --- */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-8 z-10">
            {/* Heading */}
            <h1 className="text-balance text-3xl md:text-4xl lg:text-5xl font-semibold bg-clip-text text-transparent bg-linear-to-b from-neutral-50 to-neutral-400 bg-opacity-5 leading-tight">
              Ready to ace your cloud certification?
            </h1>

            {/* Subtext */}
            <p className="text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-2xl font-light leading-relaxed">
              Join thousands of cloud professionals who've passed their
              certifications with CloudDojo. Start practicing today.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto gap-3 md:gap-4 mt-2 md:mt-4">
              <Button className="rounded-none px-12 md:px-14 py-6 md:py-7 text-sm md:text-base w-full sm:w-auto">
                Start free trial
              </Button>

              <Button
                variant="outline"
                className="rounded-none px-12 md:px-14 py-6 md:py-7 text-sm md:text-base w-full sm:w-auto"
              >
                View pricing
              </Button>
            </div>
          </div>

          {/* --- Right Column: Glass Icon --- */}
          <div className="hidden lg:flex justify-center lg:justify-end relative pointer-events-none select-none">
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[80px] rounded-full"></div>

            {/* Glass Icon */}
            <img
              src="/3d-icons/3d-cloud-icon.png"
              alt="3D Glass Cloud Icon"
              className="relative z-10 w-full max-w-md md:max-w-lg object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
            />
          </div>
          {/*botton gradient*/}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent z-10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
