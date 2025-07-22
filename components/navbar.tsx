"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ArrowRight, Search, Menu, X } from "lucide-react"
import Link from "next/link"
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs"
import { useIsMobile } from "@/hooks/use-mobile"
import * as  FancyButton from "@/components/ui/fancy-button"
import ModeToggle from "./mode-toggle"

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
                {/* <NavigationMenuItem className="bg-none text-black">
                  <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="#"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Featured Product
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Check out our latest and greatest offering
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="#" title="Product 1">
                        User Progress Analytics
                      </ListItem>
                      <ListItem href="#" title="Product 2">
                        Tailored Practice Tests
                      </ListItem>
                      <ListItem href="#" title="Product 3">
                        AI-Powered Reports and Study Assistant 
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem> */}
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/about">
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/pricing">
                    Pricing
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/blog">
                    Blog
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="https://calendar.notion.so/meet/glenmiracle/7fnt4l09" target="_blank" rel="noopener noreferrer">
                    Contact
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        {isMobile && (
          <button
            onClick={toggleMenu}
            className="p-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        )}

        {/* Desktop Actions */}
        {!isMobile && (
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <div>
                <SignOutButton> <Button className="text-black dark:text-white">Sign Out</Button></SignOutButton>
                <Link href="/dashboard">
                  <FancyButton.Root className="ml-4 dark:text-white text-black" variant="primary" size="small">
                    Dashboard
                  </FancyButton.Root>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">

                <SignInButton mode="modal" appearance={{ elements: { formButtonPrimary: "bg-emerald-600", }}} >
                  <Button variant='ghost' className="text-slate-800 hover:bg-primary/30 dark:text-gray-100 hover:text-gray-500">Sign In</Button>
                </SignInButton>

                <FancyButton.Root mode="ghost" variant="primary" size="small" className="text-slate-800 hover:bg-primary/30 dark:text-gray-100 hover:text-gray-500" >
                  <Link href="https://calendar.notion.so/meet/glenmiracle/7fnt4l09" className="dark:text-white text-slate-800" target="_blank" rel="noopener noreferrer">Contact Sales</Link>
                  <ArrowRight className="ml-2 h-4 w-4 dark:text-white text-black" />
                </FancyButton.Root>
              </div>
            )}
            <ModeToggle />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="absolute z-50 inset-x-0 backdrop-blur-md bg-white/20 dark:bg-gray-900/70 shadow-lg p-4 border border-gray-200/20 dark:border-gray-700/20 rounded-b-lg">
          <div className="container mx-auto flex flex-col space-y-4">
            <Link href="#" className="block py-2 px-4 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md hover:text-black">
              About
            </Link>
            <Link href="/pricing" className="block py-2 px-4 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md hover:text-black">
              Pricing
            </Link>
            <Link href="#" className="block py-2 px-4 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md hover:text-black">
              Blog
            </Link>
            <Link href="https://calendar.notion.so/meet/glenmiracle/7fnt4l09" className="block py-2 px-4 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md hover:text-black" target="_blank" rel="noopener noreferrer">
              Contact
            </Link>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              {isSignedIn ? (
                <div className="flex flex-col space-y-3 text-black">
                  <SignOutButton />
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full text-black hover:text-black">
                      Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <SignInButton mode="modal" />
                  <Button className="w-full bg-white hover:bg-gray-200">
                    <Link href="https://calendar.notion.so/meet/glenmiracle/7fnt4l09" className="text-black" target="_blank" rel="noopener noreferrer">Contact Sales</Link>
                    <ArrowRight className="ml-2 h-4 w-4 text-black" />
                  </Button>
                </div>
              )}
              <ModeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
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
            className
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
  )
})
ListItem.displayName = "ListItem"