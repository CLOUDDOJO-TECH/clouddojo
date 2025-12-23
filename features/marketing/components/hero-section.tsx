"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HeroHeader } from "@/components/layout/header";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { TextEffect } from "@/components/ui/text-effect";
import GameOfLife from "../HeroBackground";
import LogoCloud from "../logo-cloud";
import { CloudIcon } from "./icons/cloud-icon";
import { RocketIcon } from "./icons/rocket-icon";
import { SignInButton, useUser } from "@clerk/nextjs";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HeroSection() {
  const { isSignedIn } = useUser();

  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden ">
        {/* Game of Life background */}
        <div className="absolute inset-0">
          <GameOfLife />
        </div>
        {/*light flare from top left*/}
        <div
          aria-hidden
          className="absolute inset-0 isolate opacity-65 contain-strict lg:block"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section className="relative">
          <div className="relative pt-24 md:pt-36">
            {/* Radial gradient vignette */}
            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full opacity-50 [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
            />

            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="#link"
                    className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-none border p-1 pl-4 shadow-md shadow-emerald-400/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-emerald-400/20"
                  >
                    <span className="text-foreground text-sm">
                      288+ learners enrolled
                    </span>
                    <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                    <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-none duration-500">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedGroup>

                <h1 className="mx-auto mt-8 max-w-5xl text-balance text-center text-5xl tex-bold max-md:font-bold md:text-7xl lg:mt-16 xl:text-[4.25rem] animate-fade-in-blur">
                  <span className="bg-linear-to-b from-neutral-50 to-neutral-400 bg-clip-text text-transparent bg-opacity-5">
                    Pass Your Cl
                  </span>
                  <CloudIcon className="inline w-[0.8em] h-[0.8em] mx-1 relative -top-[0.1em] animate-[fade-in-blur_0.8s_ease-out_0.6s_both,color-cycle_4s_ease-in-out_1s_infinite]" />
                  <span className="bg-linear-to-b from-neutral-50 to-neutral-400 bg-clip-text text-transparent bg-opacity-5">
                    ud Certification in Weeks
                  </span>
                </h1>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="mx-auto mt-8 max-w-2xl text-balance text-lg text-neutral-400/80"
                >
                  Pass your AWS, Azure, or GCP certification by building real
                  infrastructure—not watching endless videos.
                </TextEffect>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                >
                  <div
                    key={1}
                    className="bg-foreground/10 rounded-none border p-0.5"
                  >
                    {isSignedIn ? (
                      <Button
                        asChild
                        size="lg"
                        className="rounded-none px-5 text-base"
                      >
                        <Link href="/dashboard">
                          <span className="text-nowrap">Start Building</span>
                        </Link>
                      </Button>
                    ) : (
                      <SignInButton mode="modal">
                        <Button
                          size="lg"
                          className="rounded-none px-5 text-base"
                        >
                          <span className="text-nowrap">Start Building</span>
                        </Button>
                      </SignInButton>
                    )}
                  </div>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-10.5 rounded-none px-5 bg-accent hover:bg-accent/80 hover:text-white text-black"
                  >
                    <Link href="mailto:support@clouddojo.tech" target="_blank">
                      <span className="text-nowrap">Contact Support</span>
                    </Link>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
            >
              <div className="relative mt-8 overflow-visible px-4 sm:px-2 sm:mt-12 md:mt-20">
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl sm:max-w-5xl md:max-w-6xl overflow-hidden rounded-none border p-2 sm:p-4 shadow-lg shadow-zinc-950/15 ring-1">
                  <Image
                    className="bg-background aspect-15/8 relative hidden rounded-none dark:block object-cover"
                    src="/previews/landing-preview.png"
                    alt="app screen"
                    width="2700"
                    height="1440"
                  />
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -bottom-32 z-10 h-64 [background:linear-gradient(to_bottom,transparent_0%,rgb(250_250_249/0.7)_100%)] dark:[background:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.7)_100%)]"
                />
              </div>
            </AnimatedGroup>
          </div>
        </section>
        <LogoCloud />
      </main>
    </>
  );
}
