"use client"
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname();
  
  // Enhanced page transitions with staggered children animations
  const variants = {
    initial: {
      opacity: 0,
      x: -20,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0], // Custom cubic-bezier curve
        when: "beforeChildren",
        staggerChildren: 0.1,
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0],
      }
    }
  };
  
  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className="w-full min-h-screen flex flex-col"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;