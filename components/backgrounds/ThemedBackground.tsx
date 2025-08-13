"use client";
import { useTheme } from "next-themes";
import React from "react";
import DotGrid from "./DotGrid";
import Silk from "./Silk";

const ThemedBackground: React.FC = () => {
  const { resolvedTheme } = useTheme();

  return (
    <>
      {/* Show DotGrid in light mode with the specified configuration from the image */}
      {resolvedTheme === "light" && (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <DotGrid
            dotSize={10}
            gap={15}
            baseColor="#ecfdf5"
            activeColor="#34d399"
            proximity={190}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        // </div>
      )}

      {/* Show Silk in dark mode with the specified configuration */}
      {resolvedTheme === "dark" && (
        <Silk
          speed={3.3}
          scale={0.4}
          noiseIntensity={4}
          rotation={0}
          color="#6ee7b7"
        />
      )}
    </>
  );
};

export default ThemedBackground;
