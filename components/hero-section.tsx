"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import RotatingText from "./rotating-text";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Headset, SendIcon } from "lucide-react";
import TrustBadge from "./landing/trust-badge";
import PreviewTabs from "./preview-tabs";
import TabsNav from "./tabs-nav";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function HeroSection() {
  const { isSignedIn } = useUser();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const { theme } = useTheme()
  const mascotSrc = theme === "light" ? "/images/extras/sensie-black.png" : "/images/extras/sensie-brown.png";

  return (
    <div className="relative mx-auto md:my-16 my-2 flex flex-col items-center justify-center w-full overflow-hidden">
      <div className="px-4 pt-10 md:pt-12 w-full flex flex-col items-center justify-center">
        <div className="max-w-7xl w-full">
          <span className="flex items-start mb-2 w-full justify-center sm:justify-start">
            <TrustBadge />
          </span>
          <h1 className="relative z-10 mx-auto max-w-3xl md:max-w-5xl text-center text-4xl font-bold text-black md:text-4xl lg:text-6xl dark:text-slate-200">
            {"Level Up. Get Certified. Become".split(" ").map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
            <RotatingText
              texts={["Hired", "Confident", "Professional", "Cloud"]}
              mainClassName="px-2 sm:px-2 md:px-3 dark:text-primary text-emerald-700 overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </h1>
          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              delay: 0.8,
            }}
            className="relative z-10 mx-auto max-w-md md:max-w-xl py-4  text-center text-md md:text-lg font-normal text-gray-500 dark:text-neutral-400"
          >
            CloudDojo helps you crush your cloud certification exams with
            smarter practice tests, perfromance analystics,and real-time ai
            feedback.
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              delay: 1,
            }}
            className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            {isSignedIn ? (
              <Link href="/dashboard">
                <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
                  <span className="absolute inset-0 overflow-hidden rounded-full">
                    <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                  </span>
                  <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-2 px-6 ring-1 ring-white/10 ">
                    <span>{`Explore Now`}</span>
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M10.75 8.75L14.25 12L10.75 15.25"
                      ></path>
                    </svg>
                  </div>
                  <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
                </button>
              </Link>
            ) : (
              <div className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                </span>
                <div className="relative flex space-x-2 items-center z-10 rounded-full bg-gradient-to-b from-emerald-600 to-emerald-700 py-3 px-6 ring-1 ring-white/10 ">
                  <SignInButton mode="modal" appearance={{ elements: { formButtonPrimary: "bg-emerald-600", }}}>
                    <div className="flex items-center">
                      <span className="text-sm flex items-center overflow-hidden relative">
                        <p className="mr-8">{`Get Started`}</p>
                        <SendIcon className="h-5 left-3 w-5 text-foreground-primary ml-[84px] absolute group-hover:translate-y-10 transition-all duration-500" />
                        <SendIcon className="h-5 w-5 left-3 text-foreground-primary ml-[84px] absolute -translate-y-10 group-hover:translate-y-0 transition-all duration-500" />
                      </span>
                    </div>
                  </SignInButton>
                </div>
                <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-orange-400/0 via-orange-400/90 to-orange-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
              </div>
            )}
            <Link
              href="https://calendar.notion.so/meet/glenmiracle/7fnt4l09"
              target="_blank"
              rel="noopener noreferrer"
              className="shadow-lg"
            >
              <button className="w-auto transform rounded-lg border-2 border-emerald-700 px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-emerald-700  dark:text-white dark:hover:bg-background">
                Support
                <Headset className="ml-2 inline-block h-4 w-4" />
              </button>
            </Link>
          </motion.div>

          <div className="preview-container relative">
            <div className="absolute z-50 h-28 w-28 md:[h-450px] md:w-[250px] md:-top-[210px] md:-right-10  -top-[110px] -right-0">
              <Image
                src={mascotSrc}
                layout="intrinsic"
                width={250}
                height={150}
                alt="mascot"
                className="mx-auto max-w-2xl"
              />
            </div>
            <PreviewTabs activeTab={activeTab} />
          </div>
        </div>
      </div>

      {/* Full-width section with divider line that positions tabs in the middle */}
      <div className="w-full border-t border-gray-200 dark:border-gray-800 mt-16 z-10 relative bg-[#FAFAF9] dark:bg-background pb-2">
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <TabsNav onTabChange={handleTabChange} activeTab={activeTab} />
        </div>
        <div className="max-w-7xl mr-12 mx-auto px-4 pt-10">
          {/* Content for the next section would go here */}
          <div>
            <Image
              src="/images/extras/features.png"
              width={300}
              height={100}
              alt="instructions"
              className="mx-auto  max-w-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
