import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-end items-center p-4 gap-4 h-16">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <div className="flex flex-col items-center justify-center h-full">
        Cloud dojo dot net
        <Link href="/dashboard">
          <Button variant="outline" size="lg">
            Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
