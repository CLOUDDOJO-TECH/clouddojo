import Link from "next/link"
import { ChevronDown, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { NavbarLogo } from "@/components/resizable-nav";

export default function Footer() {
  return (
    <footer className="text-white relative overflow-hidden py-2">
      {/* Blue glow effect */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-500/20 blur-[100px] rounded-full"></div>
      <div className="absolute top-0 left-0 w-1/3 h-full bg-blue-500/10 blur-[100px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top section */}
        <div className="py-8 border-b border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Logo and tagline */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center gap-2">
              <NavbarLogo  />
            </div>
            <div className="hidden md:block h-6 w-px bg-gray-700 mx-2"></div>
            <p className="text-gray-400 text-sm max-w-xs">
              Pass your certification exams with ease
            </p>
          </div>

          {/* Navigation */}
          <nav>
            <ul className="flex flex-wrap gap-6 items-center font-light text-sm">
              <li>
                <Link href="#" className="flex items-center gap-1 hover:text-emerald-500 transition-colors">
                  All Pages <ChevronDown className="h-4 w-4" />
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-500 transition-colors">
                  Integration
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-500 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-500 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom section */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400">Copyright © 2024 Forge. All Rights Reserved</div>

          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms of Use
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
