"use client";
import Link from "next/link";
import { LogoGradientFull } from "@/public/brand/logo-gradient-full";
import { SocialLinks } from "./social-links";
import { FooterColumn } from "./footer-column";
import { footerLinks } from "./footer-data";

const Footer = () => {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          {/* Logo and Social Links */}
          <div className="mb-8 md:mb-0">
            <div className="flex items-center space-x-1 mb-4">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <LogoGradientFull />
              </Link>
            </div>
            <SocialLinks />
          </div>

          {/* Footer Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerLinks.map((column) => (
              <FooterColumn
                key={column.title}
                title={column.title}
                links={column.links}
              />
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-dashed border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 CloudDojo. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/tos"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/blog"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
