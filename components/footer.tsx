import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const resourcesLinks = [
  { href: "https://x.com/clouddojotech", label: "X / Twitter" },
  { href: "mailto:bonyuglen@gmail.com", label: "Contact" },
];

const footerLinks = [
  {
    name: "Resources",
    links: resourcesLinks,
  },
];

export default function Footer() {
  return (
    <footer className="m-1">
      <div className="mx-auto max-w-7xl space-y-16 px-5 py-16">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-8"></div>
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex-1">
            {footerLinks.map((linksGroup, index) => (
              <div key={index}>
                <span className="font-medium">{linksGroup.name}</span>
                <ul className="mt-4 flex gap-6">
                  {linksGroup.links.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="hover:text-primary text-muted-foreground text-sm duration-150"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex-shrink-0 w-full max-w-sm">
            <form className="w-full">
              <div className="space-y-2.5">
                <Label className="block text-sm font-medium" htmlFor="email">
                  Subscribe to our newsletter
                </Label>
                <div className="flex gap-2">
                  <Input
                    className="input variant-mixed sz-md flex-1"
                    placeholder="Your email"
                    type="email"
                    id="email"
                    required
                    name="email"
                  />
                  <Button type="submit" className="flex-shrink-0">
                    <span>Subscribe</span>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="bg-muted mt-16 flex items-center justify-between rounded-md p-4 px-6 py-3">
          <span className="text-xs md:text-md">
            &copy; CloudDojo {new Date().getFullYear()} - Present
          </span>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-primary text-sm"
            >
              Privacy
            </Link>
            <Link
              href="/tos"
              className="text-muted-foreground hover:text-primary text-sm"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
