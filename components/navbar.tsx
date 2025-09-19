"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ArrowRight, Search, Menu, X } from "lucide-react";
import Link from "next/link";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { useIsMobile } from "@/hooks/use-mobile";
import * as FancyButton from "@/components/ui/fancy-button";
import ModeToggle from "./mode-toggle";
import MobileNavigation from "./mobile-nav";

export default function Tabnavbar() {
  const { isSignedIn } = useUser();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="">
      <div className="container mx-auto flex items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-2xl font-bold">
            <img
              draggable="false"
              src="/images/dojo-logo.png"
              alt="logo"
              width={90}
              height={90}
            />
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    href="/about"
                  >
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    href="/pricing"
                  >
                    Pricing
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    href="/blog"
                  >
                    Blog
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    href="https://calendar.notion.so/meet/glenmiracle/7fnt4l09"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        {isMobile && (
          <span className="flex items-center space-x-4">
            <ModeToggle />

            <button
              onClick={toggleMenu}
              className="p-2 text-foreground/70 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </span>
        )}

        {/* Desktop Actions */}
        {!isMobile && (
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div>
                <SignOutButton>
                  <Button className="text-black dark:text-white">
                    Sign Out
                  </Button>
                </SignOutButton>
                <Link href="/dashboard">
                  <FancyButton.Root
                    className="ml-4 dark:text-white text-black"
                    variant="primary"
                    size="small"
                  >
                    Dashboard
                  </FancyButton.Root>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <SignInButton
                  mode="modal"
                  appearance={{
                    elements: { formButtonPrimary: "bg-emerald-600" },
                  }}
                >
                  <Button
                    variant="ghost"
                    className="text-slate-800 hover:bg-primary/30 dark:text-gray-100 hover:text-gray-500"
                  >
                    Sign In
                  </Button>
                </SignInButton>

                <FancyButton.Root
                  mode="ghost"
                  variant="primary"
                  size="small"
                  className="text-slate-800 hover:bg-primary/50 bg-primary/30 dark:text-gray-100 hover:text-gray-500"
                >
                  <Link
                    href="https://calendar.notion.so/meet/glenmiracle/7fnt4l09"
                    className="dark:text-white text-slate-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact Sales
                  </Link>
                  <ArrowRight className="ml-2 h-4 w-4 dark:text-white text-black" />
                </FancyButton.Root>
              </div>
            )}
            <ModeToggle />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && <MobileNavigation />}
    </nav>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
