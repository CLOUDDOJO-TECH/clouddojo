"use client";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { ArrowRight, LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const isMobile = useIsMobile();


  return (
    <nav className="w-full py-4 px-6 md:px-12 bg-mint flex items-center justify-between">
      <div className="flex items-center space-x-1">
        <Link href="#" className="text-2xl font-bold">
          <img
            draggable="false"
            src="/images/dojo-logo.png"
            alt="logo"
            width={90}
            height={90}
          />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        <a href="/pricing" className="text-sm text-cstm_teal hover:text-cstm_teal/80">Pricing</a>
        <a href="#" className="text-sm text-cstm_teal hover:text-cstm_teal/80">Resources</a>
        <a href="#" className="text-sm text-cstm_teal hover:text-cstm_teal/80">Enterprise</a>
        <a href="#" className="text-sm text-cstm_teal hover:text-cstm_teal/80">Blog</a>
      </div>

      <div className="hidden md:block">
        {isSignedIn ? (
          <div className="flex space-x-3 text-black">
            <SignOutButton />
            <Link href="/dashboard">
              <Button variant="outline" className="w-full text-cstm_teal hover:text-teal-900 rounded-full">
                Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex  space-x-3 w-auto itemx-center">
            <span className="w-full items-center flex justify-center text-cstm_teal hover:text-cstm_teal/80 hover:bg-white hover:rounded-full  px-5"> 
              {!isLoaded && (
                <div>
                  <LoaderIcon />
                  <span className="text-sm">Loading...</span>
                </div>
              )}
            <SignInButton mode="modal" />

            </span>
            <Button className="w-full group bg-white rounded-full hover:bg-cstm_teal ">
              <Link href="https://calendar.notion.so/meet/glenmiracle/7fnt4l09" className="text-black group-hover:text-white" target="_blank" rel="noopener noreferrer">Contact Sales</Link>
              <ArrowRight className="ml-2 h-4 w-4 text-black group-hover:text-white" />
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-cstm_teal"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 py-4 px-6 z-50 shadow-md">
          <div className="flex flex-col space-y-4">
            <a href="#" className="text-cstm_teal hover:text-cstm_teal/80">Use Cases</a>
            <a href="#" className="text-cstm_teal hover:text-cstm_teal/80">Products</a>
            <a href="#" className="text-cstm_teal hover:text-cstm_teal/80">Pricing</a>
            <a href="#" className="text-cstm_teal hover:text-cstm_teal/80">Resources</a>
            <a href="#" className="text-cstm_teal hover:text-cstm_teal/80">Enterprise</a>
            <Button className="rounded-full bg-white text-cstm_teal hover:bg-gray-100 border border-gray-200 w-full">
              Sign in
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;