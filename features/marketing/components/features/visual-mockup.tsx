import React from "react";
import Image from "next/image";

interface VisualMockupProps {
  type: "documentation" | "mapping" | "friction" | "source";
}

export const VisualMockup: React.FC<VisualMockupProps> = ({ type }) => {
  return (
    <div className="relative w-full h-full min-h-[350px] lg:min-h-[450px] rounded-xl overflow-hidden shadow-2xl">
      {/* Background - the painted lake scene */}
      <div className="absolute inset-0">
        <Image
          src="/mockups/lake.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Mockup Image - positioned bottom right with zoom effect */}
      <div className="absolute inset-0 flex items-center justify-end pr-8 pb-8 overflow-hidden group">
        <div className="relative w-[80%] h-[90%]">
          <Image
            src="/mockups/practice-tests.png"
            alt="Product mockup"
            fill
            className="object-contain object-center transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
};
