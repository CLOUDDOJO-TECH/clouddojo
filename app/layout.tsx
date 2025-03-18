import type React from "react";
import "../styles/globals.css";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Header from "@/components/header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "AWS Certification Prep",
  description:
    "Prepare for your AWS certification exams with interactive practice questions",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <html lang="en" className="dark:dark">
      <body className={`${inter.className} dark:bg-gray-900`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
