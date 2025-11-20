import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, User, Settings, LogOut, Calendar } from "lucide-react"
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";




export default function MobileNavigation() {
      const { isSignedIn } = useUser();
    
  const navigationLinks = [
    { href: "#", label: "About", icon: null },
    { href: "/pricing", label: "Pricing", icon: null },
    { href: "#", label: "Blog", icon: null },
    {
      href: "https://calendar.notion.so/meet/glenmiracle/7fnt4l09",
      label: "Contact",
      icon: Calendar,
      external: true,
    },
  ]

  return (
    <div className="absolute z-50 inset-x-0 top-20">
      <div className="mx-4 mt-2 backdrop-blur-xl bg-white/10 border border-border/50 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6">
          {/* Navigation Links */}
          <nav className="space-y-1 mb-6">
            {navigationLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-all duration-200 group"
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
              >
                {link.icon && (
                  <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
                )}
                <span className="flex-1">{link.label}</span>
                {link.external && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground group-hover:translate-x-1 transition-all duration-200" />
                )}
              </Link>
            ))}
          </nav>

          <Separator className="my-6" />

          {/* Authentication Section */}
          <div className="space-y-3">
            {isSignedIn ? (
              <>
                <Link href="/dashboard" className="block">
                  <Button
                    className="w-full justify-start gap-3 h-12 text-left font-medium bg-transparent"
                  >
                    <Settings className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>

                <SignOutButton>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12 text-left font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </SignOutButton>
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button
                    className="w-full justify-start gap-3 h-12 text-left font-medium bg-transparent"
                  >
                    <User className="h-4 w-4" />
                    Sign In
                  </Button>
                </SignInButton>

                <Link
                  href="https://calendar.notion.so/meet/glenmiracle/7fnt4l09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant='outline' className="w-full justify-between gap-3 h-12 text-left font-medium border-primary border text-primary">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4" />
                      Contact Sales
                    </div>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Bottom gradient accent */}
      </div>
    </div>
  )
}
