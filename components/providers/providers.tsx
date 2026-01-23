"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { PricingModalProvider } from "./pricing-modal-provider";
import { AmplitudeProvider } from "./amplitude-provider";
import { dark } from "@clerk/themes";
import { TRPCProvider } from "@/src/lib/trpc/react";
import QueryProvider from "./query-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryProvider>
          <TRPCProvider>
            <AmplitudeProvider>
              <PricingModalProvider>
                {children}
                <Toaster />
              </PricingModalProvider>
            </AmplitudeProvider>
          </TRPCProvider>
        </QueryProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default Providers;
