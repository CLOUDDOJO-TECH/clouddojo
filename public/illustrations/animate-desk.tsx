import React from "react";
import { motion } from "motion/react";

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => {
    const delay = i * 0.5;
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
        opacity: { delay, duration: 0.01 },
      },
    };
  },
};

export default function PathDrawing() {
  return (
    <motion.svg
      width="600"
      height="600"
      viewBox="0 0 600 600"
      style={{ maxWidth: "80vw" }}
      initial="hidden"
      animate="visible"
    >
      <motion.circle
        cx="100"
        cy="100"
        r="80"
        stroke="#FF0055"
        variants={draw}
        style={{
          strokeWidth: 10,
          strokeLinecap: "round",
          fill: "transparent",
        }}
      />
      <motion.line
        x1="220"
        y1="30"
        x2="360"
        y2="170"
        stroke="#7700FF"
        variants={draw}
        style={{
          strokeWidth: 10,
          strokeLinecap: "round",
          fill: "transparent",
        }}
      />
      {/* More shapes would go here */}
    </motion.svg>
  );
}
