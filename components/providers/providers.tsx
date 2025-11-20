"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { PricingModalProvider } from "./pricing-modal-provider";
import { AmplitudeProvider } from "./amplitude-provider";
import { dark } from "@clerk/themes";
import { TRPCProvider } from "@/src/lib/trpc/react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <TRPCProvider>
        <AmplitudeProvider>
          <PricingModalProvider>
            {children}
            <Toaster />
          </PricingModalProvider>
        </AmplitudeProvider>
      </TRPCProvider>
    </ClerkProvider>
  );
};

export default Providers;
