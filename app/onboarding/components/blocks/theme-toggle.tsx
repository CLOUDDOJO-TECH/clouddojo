"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-8 right-8 z-50 p-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 border border-gray-300 dark:border-white/20 rounded-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:scale-110"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="18px"
          height="18px"
          viewBox="0 0 18 18"
        >
          <path
            d="M9,12V6c-1.657,0-3,1.343-3,3s1.343,3,3,3Z"
            className="fill-[#1c1f21] dark:fill-white"
            data-color="color-2"
          ></path>
          <path
            d="M9,6c1.657,0,3,1.343,3,3s-1.343,3-3,3v4.25c4.004,0,7.25-3.246,7.25-7.25S13.004,1.75,9,1.75V6Z"
            className="fill-[#1c1f21] dark:fill-white"
            data-color="color-2"
          ></path>
          <path
            d="M9,1c4.411,0,8,3.589,8,8s-3.589,8-8,8S1,13.411,1,9,4.589,1,9,1Zm0,14.5c3.584,0,6.5-2.916,6.5-6.5s-2.916-6.5-6.5-6.5S2.5,5.416,2.5,9s2.916,6.5,6.5,6.5Z"
            className="fill-[#1c1f21] dark:fill-white"
          ></path>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="18px"
          height="18px"
          viewBox="0 0 18 18"
        >
          <path
            d="M9,6v6c1.657,0,3-1.343,3-3s-1.343-3-3-3Z"
            className="fill-[#1c1f21] dark:fill-white"
            data-color="color-2"
            data-stroke="none"
          ></path>
          <path
            d="M9,12c-1.657,0-3-1.343-3-3s1.343-3,3-3V1.75C4.996,1.75,1.75,4.996,1.75,9s3.246,7.25,7.25,7.25v-4.25Z"
            className="fill-[#1c1f21] dark:fill-white"
            data-color="color-2"
            data-stroke="none"
          ></path>
          <circle
            cx="9"
            cy="9"
            r="7.25"
            fill="none"
            className="stroke-[#1c1f21] dark:stroke-white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          ></circle>
        </svg>
      )}
    </button>
  );
}
