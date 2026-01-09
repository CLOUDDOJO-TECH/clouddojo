"use client";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import { LogoGradientFull } from "@/public/brand/logo-gradient-full";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { name: "Features", href: "/features", hasDropdown: true },
  { name: "Blog", href: "/blog" },
];

const featuresDropdown = {
  image: "/images/Island Night Moon Scenery 8K.jpg",
  features: [
    {
      name: "Simulated Certification Exams",
      href: "#features", // TODO: Add specific section anchor when feature page sections are ready
    },
    {
      name: "AI-Powered Progress Tracking",
      href: "#features", // TODO: Add specific section anchor when feature page sections are ready
    },
    {
      name: "AI-Driven Study Assistance",
      href: "#features", // TODO: Add specific section anchor when feature page sections are ready
    },
    {
      name: "Readiness Assessment",
      href: "#features", // TODO: Add specific section anchor when feature page sections are ready
    },
    {
      name: "Comprehensive Question Bank",
      href: "#features", // TODO: Add specific section anchor when feature page sections are ready
    },
    {
      name: "Flashcards for Quick Revision",
      href: "#features", // TODO: Add specific section anchor when feature page sections are ready
    },
    {
      name: "Performance Analytics",
      href: "#features", // TODO: Add specific section anchor when feature page sections are ready
    },
    {
      name: "Community and Support",
      href: "#features", // TODO: Add specific section anchor when feature page sections are ready
    },
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
                className="relative z-20 -mr-2 block cursor-pointer p-3 lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
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
                          className="fixed left-0 right-0 top-[72px] z-50 flex justify-center pt-4 px-4 max-h-[calc(100vh-88px)] overflow-y-auto"
                        >
                          <div className="w-full max-w-4xl bg-background/80 backdrop-blur-xl overflow-hidden border border-border/50 rounded-none shadow-lg mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                              {/* Left side - Image */}
                              <div className="relative col-span-1 overflow-hidden min-h-[180px] md:min-h-[300px]">
                                <img
                                  src={featuresDropdown.image}
                                  alt="Features overview"
                                  className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 md:p-6">
                                  <h3 className="text-xl md:text-2xl font-bold text-white">
                                    Features
                                  </h3>
                                </div>
                              </div>

                              {/* Right side - Features list in 2 columns */}
                              <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-8 gap-y-3 md:gap-y-4 p-6 md:p-8">
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

            <AnimatePresence>
              {menuState && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                    height: { duration: 0.4 },
                    opacity: { duration: 0.3 },
                  }}
                  className="fixed inset-x-0 top-[72px] z-40 lg:hidden overflow-hidden"
                >
                  <div
                    className={cn(
                      "mx-4 mt-4 overflow-hidden rounded-none shadow-lg transition-all duration-300 backdrop-blur-xl",
                      isScrolled
                        ? "bg-background/95 border border-border/50"
                        : "bg-background/90 border border-border/30",
                    )}
                    style={{
                      WebkitBackdropFilter: "blur(16px)",
                      backdropFilter: "blur(16px)",
                    }}
                  >
                    <div className="flex flex-col space-y-6 p-6 sm:p-8">
                      <div>
                        <ul className="space-y-2">
                          {menuItems.map((item, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: 0.1 + index * 0.05,
                                ease: "easeOut",
                              }}
                            >
                              <Link
                                href={item.href}
                                className="text-foreground hover:text-primary block text-lg font-medium transition-colors duration-200 py-3 min-h-[44px] flex items-center"
                                onClick={() => setMenuState(false)}
                              >
                                {item.name}
                              </Link>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.3,
                          ease: "easeOut",
                        }}
                        className="flex flex-col space-y-4 pt-6 border-t border-border/50"
                      >
                        {isSignedIn ? (
                          <div className="flex items-center gap-3">
                            <Button
                              asChild
                              size="lg"
                              className="rounded-none w-full"
                            >
                              <Link
                                href="/dashboard"
                                onClick={() => setMenuState(false)}
                              >
                                <span>Dashboardsc</span>
                              </Link>
                            </Button>
                            <SignOutButton>
                              <Button size="lg" className="rounded-none w-full">
                                <span>Logout</span>
                              </Button>
                            </SignOutButton>
                          </div>
                        ) : (
                          <>
                            <SignInButton mode="modal">
                              <Button
                                variant="outline"
                                size="lg"
                                className="rounded-none w-full"
                              >
                                <span>Login</span>
                              </Button>
                            </SignInButton>
                            <SignInButton mode="modal">
                              <Button size="lg" className="rounded-none w-full">
                                <span>Sign Up</span>
                              </Button>
                            </SignInButton>
                          </>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex lg:items-center lg:gap-6">
              {isSignedIn ? (
                <>
                  <Button
                    asChild
                    size="sm"
                    className={cn("rounded-none", isScrolled && "lg:hidden")}
                  >
                    <Link href="/dashboard">
                      <span>Dashboard</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className={cn(
                      isScrolled ? "lg:inline-flex rounded-none" : "hidden",
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
                      className={cn("rounded-none", isScrolled && "lg:hidden")}
                    >
                      <span>Login</span>
                    </Button>
                  </SignInButton>
                  <SignInButton mode="modal">
                    <Button
                      size="sm"
                      className={cn("rounded-none", isScrolled && "lg:hidden")}
                    >
                      <span>Sign Up</span>
                    </Button>
                  </SignInButton>
                  <SignInButton mode="modal">
                    <Button
                      size="sm"
                      className={cn(
                        isScrolled ? "lg:inline-flex rounded-none" : "hidden",
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
      </nav>
    </header>
  );
};
