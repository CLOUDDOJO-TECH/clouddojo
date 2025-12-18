"use client";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import { LogoGradientFull } from "@/public/brand/logo-gradient-full";
import { SignInButton, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { name: "Features", href: "/features", hasDropdown: true },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
];

const featuresDropdown = {
  image: "/images/Island Night Moon Scenery 8K.jpg",
  features: [
    {
      name: "Simulated Certification Exams",
      href: "/features#simulated-exams",
    },
    {
      name: "AI-Powered Progress Tracking",
      href: "/features#progress-tracking",
    },
    { name: "AI-Driven Study Assistance", href: "/features#study-assistance" },
    { name: "Readiness Assessment", href: "/features#readiness-assessment" },
    { name: "Comprehensive Question Bank", href: "/features#question-bank" },
    { name: "Flashcards for Quick Revision", href: "/features#flashcards" },
    { name: "Performance Analytics", href: "/features#analytics" },
    { name: "Community and Support", href: "/features#community" },
  ],
};

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [featuresOpen, setFeaturesOpen] = React.useState(false);
  const { isSignedIn } = useUser();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed z-20 w-full px-2"
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
              "bg-background/50 max-w-4xl  border backdrop-blur-lg lg:px-5",
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <LogoGradientFull />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li
                    key={index}
                    className="relative"
                    onMouseEnter={() =>
                      item.hasDropdown && setFeaturesOpen(true)
                    }
                    onMouseLeave={() =>
                      item.hasDropdown && setFeaturesOpen(false)
                    }
                  >
                    {item.hasDropdown ? (
                      <button
                        className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors duration-200"
                        aria-expanded={featuresOpen}
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform duration-200",
                            featuresOpen && "rotate-180",
                          )}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-foreground block transition-colors duration-200"
                      >
                        <span>{item.name}</span>
                      </Link>
                    )}

                    {/* Features Mega Menu Dropdown */}
                    <AnimatePresence>
                      {item.hasDropdown && featuresOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="fixed left-0 right-0 top-[72px] z-50 flex justify-center pt-4 px-4"
                        >
                          <div className="w-full max-w-4xl bg-background/80 backdrop-blur-xl overflow-hidden border border-border/50 rounded-none shadow-lg">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
                              {/* Left side - Image */}
                              <div className="relative col-span-1 overflow-hidden min-h-[200px] sm:min-h-[300px]">
                                <img
                                  src={featuresDropdown.image}
                                  alt="Features overview"
                                  className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-6">
                                  <h3 className="text-2xl font-bold text-white">
                                    Features
                                  </h3>
                                </div>
                              </div>

                              {/* Right side - Features list in 2 columns */}
                              <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 p-8">
                                {featuresDropdown.features.map(
                                  (feature, idx) => (
                                    <motion.div
                                      key={idx}
                                      initial={{
                                        opacity: 0,
                                        y: 12,
                                        scale: 0.95,
                                      }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      transition={{
                                        duration: 0.3,
                                        delay: 0.1 + idx * 0.05,
                                        ease: [0.25, 0.46, 0.45, 0.94],
                                      }}
                                    >
                                      <Link
                                        href={feature.href}
                                        className="text-muted-foreground hover:text-foreground group block text-sm transition-colors duration-200"
                                      >
                                        <span className="group-hover:underline">
                                          {feature.name}
                                        </span>
                                      </Link>
                                    </motion.div>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8  border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-foreground block transition-colors duration-200"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                {isSignedIn ? (
                  <>
                    <Button
                      asChild
                      size="sm"
                      className={cn(
                        "rounded-none",
                        isScrolled && "lg:hidden rounded-none",
                      )}
                    >
                      <Link href="/dashboard">
                        <span>Dashboard</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className={cn(
                        isScrolled
                          ? "lg:inline-flex rounded-none"
                          : "hidden rounded-none",
                      )}
                    >
                      <Link href="/dashboard">
                        <span>Dashboard</span>
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "rounded-none",
                          isScrolled && "lg:hidden rounded-none",
                        )}
                      >
                        <span>Login</span>
                      </Button>
                    </SignInButton>
                    <SignInButton mode="modal">
                      <Button
                        size="sm"
                        className={cn(
                          "rounded-none",
                          isScrolled && "lg:hidden rounded-none",
                        )}
                      >
                        <span>Sign Up</span>
                      </Button>
                    </SignInButton>
                    <SignInButton mode="modal">
                      <Button
                        size="sm"
                        className={cn(
                          isScrolled
                            ? "lg:inline-flex rounded-none"
                            : "hidden rounded-none",
                        )}
                      >
                        <span>Get Started</span>
                      </Button>
                    </SignInButton>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
