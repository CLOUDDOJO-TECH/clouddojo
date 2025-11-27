"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { AmplitudeProvider } from "./amplitude-provider";
import { dark } from "@clerk/themes";
import { TRPCProvider } from "@/src/lib/trpc/react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <TRPCProvider>
        <AmplitudeProvider>
          {children}
          <Toaster />
        </AmplitudeProvider>
      </TRPCProvider>
    </ClerkProvider>
  );
};

export default Providers;
