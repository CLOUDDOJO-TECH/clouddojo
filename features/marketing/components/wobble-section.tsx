"use client";

import React from "react";
import { WobbleCard } from "../ui/wobble-card";

export function FeaturesBento() {
  return (
    <div className="w-full p-2 md:p-4 lg:p-8 mt-16">
        <h2 className="text-foreground/50 text-3xl md:text-5xl lg:text-6xl text-center font-bold leading-tight mb-4">
        There&apos;s more than just certification prep.
        </h2>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full my-8">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
        className=""
      >
        <div className="max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            In-Depth daily analysis of your performance. 
          </h2>
          <p className="mt-4 text-left text-sm font-light text-neutral-200">
            We've trained a custom AI model that provides you with a detailed analysis of your performance
            and progress, so you can see where you need to improve.
          </p>
        </div>
        <img
          src="/images/detailed-ai-analysis.png"
          width={500}
          height={500}
          alt="detailed-ai-analysis"
          className="absolute -right-14 lg:-right-[20%] grayscale filter -bottom-20 md:-bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px] h-auto">
        <h2 className="max-w-80 px-6  text-left text-balance text-3xl md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          No retaking, No waiting, No stress.
        </h2>
        <p className="mt-4 px-6 max-w-[26rem] text-left  text-xl text-neutral-200">
          Get certified as fast as you can count to 3
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-xl md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Questions to help you learn.
          </h2>
          <p className="mt-4 max-w-[26rem] text-left  text-sm text-neutral-200">
            With questions sourced from more than 1000+ real-world scenarios, you can be sure that you are getting the best possible preparation for your exam.
          </p>
        </div>
        <img
          src="/images/friendly-questions-analysis.png"
          width={500}
          height={500}
          alt="friendly-questions-analysis"
          className="absolute -right-10 md:-right-[20%] lg:-right-[10%] bottom-2 object-contain rounded-2xl"
        />
      </WobbleCard>
    </div>
    </div>
  );
}
