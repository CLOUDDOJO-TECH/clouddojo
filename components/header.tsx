"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";

const menuItems = [
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "https://cal.com/glenmiracle/30min" },
];

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { isSignedIn, isLoaded } = useUser();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav className="fixed z-20 w-full px-2">
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
              "bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5",
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <Image
                  src="/assets/cldj_logo.svg"
                  alt="logo"
                  width={120}
                  height={120}
                />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                {menuState ? (
                  <X className="size-6" />
                ) : (
                  <Menu className="size-6" />
                )}
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-emerald-400/80 block duration-150"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desktop auth buttons */}
            <div className="hidden lg:flex lg:w-fit lg:gap-3 lg:items-center">
              {isLoaded && isSignedIn ? (
                <Button asChild size="sm">
                  <Link href="/dashboard">
                    <span>Dashboard</span>
                  </Link>
                </Button>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button variant="outline" size="sm">
                      <span>Login</span>
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button size="sm">
                      <span>Sign Up</span>
                    </Button>
                  </SignUpButton>
                </>
              )}
            </div>

            {/* Mobile menu */}
            {menuState && (
              <>
                <div
                  className="fixed inset-0 z-10 bg-black/40 backdrop-blur-sm lg:hidden"
                  onClick={() => setMenuState(false)}
                />
              </>
            )}
            {menuState && (
              <div className="relative z-20 lg:hidden w-full rounded-2xl border bg-background p-6 shadow-lg">
                <ul className="space-y-4 text-base mb-6">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuState(false)}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col space-y-3">
                  {isLoaded && isSignedIn ? (
                    <Button asChild size="sm" onClick={() => setMenuState(false)}>
                      <Link href="/dashboard">
                        <span>Dashboard</span>
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <SignInButton mode="modal">
                        <Button variant="outline" size="sm" className="w-full">
                          <span>Login</span>
                        </Button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <Button size="sm" className="w-full">
                          <span>Sign Up</span>
                        </Button>
                      </SignUpButton>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
